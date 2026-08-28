"""
Anomaly Detection FastAPI Service.

Provides REST API for real-time anomaly detection on access events.
Runs on port 8001.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.detection_pipeline import AnomalyDetectionPipeline
from app.feature_extraction import FEATURE_NAMES


# Initialize FastAPI app
app = FastAPI(
    title="DecentraID Anomaly Detection Service",
    description="AI-powered anomaly detection for decentralized identity access patterns",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
pipeline = AnomalyDetectionPipeline()


# Pydantic models
class EventRequest(BaseModel):
    """Request model for single event detection."""
    user_id: str = Field(..., description="User identifier")
    action: str = Field(..., description="Action performed")
    resource: str = Field(..., description="Resource accessed")
    ip_address: str = Field(..., description="Source IP address")
    success: bool = Field(True, description="Whether action succeeded")
    timestamp: Optional[str] = Field(None, description="ISO timestamp")


class BatchEventRequest(BaseModel):
    """Request model for batch event detection."""
    events: List[EventRequest] = Field(..., description="List of events")


class DetectionResponse(BaseModel):
    """Response model for detection results."""
    is_anomaly: bool
    risk_score: float
    severity: str
    details: Dict
    reasons: List[str]
    recommendations: List[str]
    user_id: str
    timestamp: str


class BatchDetectionResponse(BaseModel):
    """Response model for batch detection."""
    results: List[DetectionResponse]
    summary: Dict


class UserProfileResponse(BaseModel):
    """Response model for user profile."""
    user_id: str
    total_events: int
    typical_hour: int
    typical_day: int
    top_resources: List[str]
    top_actions: List[str]
    known_ips: int
    first_seen: Optional[str]
    last_seen: Optional[str]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str
    models_initialized: bool
    events_processed: int


# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        service="anomaly-detection",
        version="1.0.0",
        models_initialized=pipeline.is_initialized,
        events_processed=pipeline.event_count
    )


@app.post("/detect", response_model=DetectionResponse)
async def detect_anomaly(event: EventRequest):
    """
    Detect anomalies in a single event.
    
    Analyzes the event for:
    - Temporal anomalies (unusual times)
    - Geographic anomalies (new IPs)
    - Behavioral anomalies (unusual patterns)
    - Frequency anomalies (high volume)
    """
    try:
        # Convert timestamp
        timestamp = None
        if event.timestamp:
            timestamp = datetime.fromisoformat(event.timestamp)
        
        # Create event dict
        event_dict = {
            'user_id': event.user_id,
            'action': event.action,
            'resource': event.resource,
            'ip_address': event.ip_address,
            'success': event.success,
            'timestamp': timestamp or datetime.utcnow()
        }
        
        # Run detection
        result = pipeline.detect(event_dict)
        
        return DetectionResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect/batch", response_model=BatchDetectionResponse)
async def detect_batch(request: BatchEventRequest):
    """
    Detect anomalies in a batch of events.
    
    Returns individual results plus summary statistics.
    """
    try:
        results = []
        anomaly_count = 0
        severity_counts = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
        
        for event in request.events:
            # Convert timestamp
            timestamp = None
            if event.timestamp:
                timestamp = datetime.fromisoformat(event.timestamp)
            
            # Create event dict
            event_dict = {
                'user_id': event.user_id,
                'action': event.action,
                'resource': event.resource,
                'ip_address': event.ip_address,
                'success': event.success,
                'timestamp': timestamp or datetime.utcnow()
            }
            
            # Run detection
            result = pipeline.detect(event_dict)
            results.append(DetectionResponse(**result))
            
            if result['is_anomaly']:
                anomaly_count += 1
            severity_counts[result['severity']] += 1
        
        summary = {
            'total_events': len(request.events),
            'anomalies_detected': anomaly_count,
            'anomaly_rate': anomaly_count / max(len(request.events), 1),
            'severity_distribution': severity_counts
        }
        
        return BatchDetectionResponse(results=results, summary=summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/profile/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(user_id: str):
    """
    Get behavioral profile for a user.
    
    Returns the user's typical patterns and baseline statistics.
    """
    try:
        summary = pipeline.get_user_summary(user_id)
        return UserProfileResponse(**summary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/features")
async def get_feature_info():
    """
    Get information about the 15 feature dimensions.
    
    Returns feature names and descriptions.
    """
    feature_descriptions = {
        'hour_of_day': 'Hour of day (0-23, normalized)',
        'day_of_week': 'Day of week (0-6, normalized)',
        'is_weekend': 'Whether access is on weekend',
        'time_since_last_event': 'Minutes since last event (log-normalized)',
        'events_last_hour': 'Count of events in last hour',
        'events_last_24h': 'Count of events in last 24 hours',
        'unique_resources_24h': 'Distinct resources accessed in 24h',
        'unique_actions_24h': 'Distinct actions in 24h',
        'unique_ips_24h': 'Distinct IP addresses in 24h',
        'new_ip_ratio': 'Ratio of new IPs to total',
        'geo_distance_from_home': 'Distance from typical location (km)',
        'action_diversity': 'Shannon entropy of action distribution',
        'resource_access_pattern': 'Deviation from typical access pattern',
        'avg_session_duration': 'Average session length in minutes',
        'failed_attempt_ratio': 'Ratio of failed to total attempts'
    }
    
    return {
        'dimensions': 15,
        'features': [
            {'name': name, 'description': feature_descriptions.get(name, '')}
            for name in FEATURE_NAMES
        ]
    }


@app.post("/initialize")
async def initialize_models(training_data: Optional[List[List[float]]] = None):
    """
    Initialize or retrain models.
    
    Optionally provide training data to retrain models.
    """
    try:
        import numpy as np
        
        if training_data:
            X_train = np.array(training_data)
            result = pipeline.initialize(X_train)
        else:
            result = pipeline.initialize()
        
        return {
            'status': 'success',
            'message': 'Models initialized',
            'details': result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/stats")
async def get_statistics():
    """Get pipeline statistics."""
    return {
        'events_processed': pipeline.event_count,
        'models_initialized': pipeline.is_initialized,
        'ensemble_info': pipeline.ensemble.get_model_info() if pipeline.is_initialized else None,
        'users_profiled': len(pipeline.profiler.profiles)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
