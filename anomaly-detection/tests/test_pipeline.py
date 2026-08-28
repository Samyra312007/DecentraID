"""
Tests for Anomaly Detection Pipeline.
"""

import pytest
import numpy as np
from datetime import datetime
from app.detection_pipeline import AnomalyDetectionPipeline


class TestAnomalyDetectionPipeline:
    """Tests for AnomalyDetectionPipeline class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.pipeline = AnomalyDetectionPipeline()
        self.base_time = datetime(2024, 1, 15, 10, 30, 0)
    
    def test_initialization(self):
        """Test pipeline initializes correctly."""
        assert self.pipeline.is_initialized == False
        assert self.pipeline.event_count == 0
    
    def test_initialize_with_data(self):
        """Test pipeline initialization with training data."""
        X_train = np.random.randn(200, 15).astype(np.float32)
        
        result = self.pipeline.initialize(X_train)
        
        assert self.pipeline.is_initialized == True
        assert result['status'] == 'trained'
    
    def test_initialize_without_data(self):
        """Test pipeline initialization without training data."""
        result = self.pipeline.initialize()
        
        assert self.pipeline.is_initialized == True
        assert result['status'] == 'initialized'
    
    def test_detect_normal_event(self):
        """Test detection of normal event."""
        self.pipeline.initialize()
        
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True,
            'timestamp': self.base_time
        }
        
        result = self.pipeline.detect(event)
        
        assert 'is_anomaly' in result
        assert 'risk_score' in result
        assert 'severity' in result
        assert 'reasons' in result
        assert 'recommendations' in result
        assert result['user_id'] == 'user_001'
        assert self.pipeline.event_count == 1
    
    def test_detect_multiple_events(self):
        """Test detection of multiple events."""
        self.pipeline.initialize()
        
        for i in range(10):
            event = {
                'user_id': 'user_001',
                'action': 'read',
                'resource': 'dashboard',
                'ip_address': '192.168.1.100',
                'success': True,
                'timestamp': self.base_time
            }
            self.pipeline.detect(event)
        
        assert self.pipeline.event_count == 10
    
    def test_severity_levels(self):
        """Test different severity levels."""
        self.pipeline.initialize()
        
        # Normal event
        normal_event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True,
            'timestamp': self.base_time
        }
        result = self.pipeline.detect(normal_event)
        assert result['severity'] in ['low', 'medium', 'high', 'critical']
    
    def test_user_summary(self):
        """Test user summary generation."""
        self.pipeline.initialize()
        
        # Add some events
        for i in range(5):
            event = {
                'user_id': 'user_001',
                'action': 'read' if i < 3 else 'write',
                'resource': f'resource_{i}',
                'ip_address': '192.168.1.100',
                'success': True,
                'timestamp': self.base_time
            }
            self.pipeline.detect(event)
        
        summary = self.pipeline.get_user_summary('user_001')
        
        assert summary['user_id'] == 'user_001'
        assert summary['total_events'] == 5
        assert 'top_resources' in summary
        assert 'top_actions' in summary
    
    def test_recommendations_generated(self):
        """Test that recommendations are generated."""
        self.pipeline.initialize()
        
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True,
            'timestamp': self.base_time
        }
        
        result = self.pipeline.detect(event)
        
        assert len(result['recommendations']) > 0
        assert all(isinstance(r, str) for r in result['recommendations'])
    
    def test_reasons_generated(self):
        """Test that reasons are generated."""
        self.pipeline.initialize()
        
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True,
            'timestamp': self.base_time
        }
        
        result = self.pipeline.detect(event)
        
        assert len(result['reasons']) > 0
        assert all(isinstance(r, str) for r in result['reasons'])
