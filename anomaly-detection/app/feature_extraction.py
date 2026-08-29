"""
Feature Extraction Engine for Anomaly Detection.

Extracts 15-dimensional feature vectors from access events.
Features capture temporal, frequency, and behavioral patterns.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict


# Feature names for interpretability
FEATURE_NAMES = [
    # Temporal features (4)
    "hour_of_day",           # 0-23, normalized to 0-1
    "day_of_week",           # 0-6, normalized to 0-1
    "is_weekend",            # 0 or 1
    "time_since_last_event", # Minutes since last event, log-normalized
    
    # Frequency features (4)
    "events_last_hour",      # Count of events in last hour
    "events_last_24h",       # Count of events in last 24 hours
    "unique_resources_24h",  # Distinct resources accessed in 24h
    "unique_actions_24h",    # Distinct actions in 24h
    
    # Geographic/Network features (3)
    "unique_ips_24h",        # Distinct IP addresses in 24h
    "new_ip_ratio",          # Ratio of new IPs to total
    "geo_distance_from_home",# Distance from typical location (km), log-normalized
    
    # Behavioral features (4)
    "action_diversity",      # Shannon entropy of action distribution
    "resource_access_pattern",# Deviation from typical access pattern
    "avg_session_duration",  # Average session length in minutes
    "failed_attempt_ratio",  # Ratio of failed to total attempts
]


class FeatureExtractor:
    """
    Extracts 15-dimensional feature vectors from access events.
    
    Features are designed to capture:
    - Temporal patterns (time-based anomalies)
    - Frequency patterns (volume-based anomalies)
    - Geographic patterns (location-based anomalies)
    - Behavioral patterns (usage-based anomalies)
    """
    
    def __init__(self, window_hours: int = 24):
        self.window_hours = window_hours
        self.event_history: Dict[str, List[Dict]] = defaultdict(list)
        self.user_profiles: Dict[str, Dict] = {}
    
    def extract_features(
        self,
        event: Dict,
        user_id: str,
        timestamp: Optional[datetime] = None
    ) -> np.ndarray:
        """
        Extract 15-dimensional feature vector from a single event.
        
        Args:
            event: Event dictionary with keys like 'action', 'resource', 'ip', etc.
            user_id: Unique identifier for the user
            timestamp: Event timestamp (defaults to current time)
            
        Returns:
            numpy array of shape (15,) with normalized features
        """
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        # Add event to history
        event['_timestamp'] = timestamp
        self.event_history[user_id].append(event)
        
        # Clean old events outside window
        cutoff = timestamp - timedelta(hours=self.window_hours)
        self.event_history[user_id] = [
            e for e in self.event_history[user_id]
            if e['_timestamp'] > cutoff
        ]
        
        # Extract all feature groups
        temporal = self._extract_temporal_features(event, timestamp)
        frequency = self._extract_frequency_features(user_id, timestamp)
        geographic = self._extract_geographic_features(event, user_id, timestamp)
        behavioral = self._extract_behavioral_features(user_id, timestamp)
        
        # Combine all features
        features = np.array(temporal + frequency + geographic + behavioral, dtype=np.float32)
        
        return np.nan_to_num(features, nan=0.0, posinf=1.0, neginf=0.0)
    
    def _extract_temporal_features(
        self, event: Dict, timestamp: datetime
    ) -> List[float]:
        """Extract 4 temporal features."""
        hour = timestamp.hour / 23.0  # Normalize to 0-1
        day = timestamp.weekday() / 6.0  # Normalize to 0-1
        is_weekend = 1.0 if timestamp.weekday() >= 5 else 0.0
        
        # Time since last event
        user_events = self.event_history.get(event.get('user_id', ''), [])
        if len(user_events) > 1:
            last_event_time = user_events[-2].get('_timestamp', timestamp)
            time_diff = (timestamp - last_event_time).total_seconds() / 60.0
<<<<<<< HEAD
            time_since_last = np.log1p(max(time_diff, 0)) / 10.0  # Log-normalize
        else:
            time_since_last = 1.0  # Max value for first event
        
        return [hour, day, is_weekend, min(time_since_last, 1.0)]
    
    def _extract_frequency_features(
        self, user_id: str, timestamp: datetime
    ) -> List[float]:
        """Extract 4 frequency features."""
        events = self.event_history.get(user_id, [])
        
        # Events in last hour
        one_hour_ago = timestamp - timedelta(hours=1)
        events_last_hour = sum(
            1 for e in events if e['_timestamp'] > one_hour_ago
        )
        
        # Events in last 24 hours
        events_last_24h = len(events)
        
        # Unique resources in 24h
        unique_resources = len(set(
            e.get('resource', '') for e in events
        ))
        
        # Unique actions in 24h
        unique_actions = len(set(
            e.get('action', '') for e in events
        ))
        
        # Normalize features
        return [
            min(events_last_hour / 50.0, 1.0),  # Cap at 50 events/hour
            min(events_last_24h / 500.0, 1.0),   # Cap at 500 events/day
            min(unique_resources / 20.0, 1.0),    # Cap at 20 resources
            min(unique_actions / 10.0, 1.0),      # Cap at 10 actions
        ]
    
    def _extract_geographic_features(
        self, event: Dict, user_id: str, timestamp: datetime
    ) -> List[float]:
        """Extract 3 geographic/network features."""
        events = self.event_history.get(user_id, [])
        
        # Unique IPs in 24h
        unique_ips = len(set(
            e.get('ip_address', 'unknown') for e in events
        ))
        
        # New IP ratio
        known_ips = self.user_profiles.get(user_id, {}).get('known_ips', set())
        current_ip = event.get('ip_address', 'unknown')
        new_ips = sum(
            1 for e in events
            if e.get('ip_address', 'unknown') not in known_ips
        )
        new_ip_ratio = new_ips / max(len(events), 1)
        
        # Geographic distance (simplified - would use real geo data in production)
        # For now, use IP diversity as a proxy
        geo_distance = min(unique_ips / 10.0, 1.0)
        
        return [
            min(unique_ips / 10.0, 1.0),
            min(new_ip_ratio, 1.0),
            geo_distance
        ]
    
    def _extract_behavioral_features(
        self, user_id: str, timestamp: datetime
    ) -> List[float]:
        """Extract 4 behavioral features."""
        events = self.event_history.get(user_id, [])
        
        if not events:
            return [0.0, 0.0, 0.0, 0.0]
        
        # Action diversity (Shannon entropy)
        action_counts = defaultdict(int)
        for e in events:
            action_counts[e.get('action', 'unknown')] += 1
        
        total = sum(action_counts.values())
        entropy = 0.0
        for count in action_counts.values():
            p = count / total
            if p > 0:
                entropy -= p * np.log2(p)
        
        # Normalize entropy (max entropy = log2(num_actions))
        max_entropy = np.log2(max(len(action_counts), 1))
        action_diversity = entropy / max(max_entropy, 1.0)
        
        # Resource access pattern deviation
        profile = self.user_profiles.get(user_id, {})
        typical_resources = profile.get('typical_resources', set())
        current_resources = set(e.get('resource', '') for e in events[-10:])
        if typical_resources:
            overlap = len(current_resources & typical_resources)
            pattern_deviation = 1.0 - (overlap / max(len(current_resources), 1))
        else:
            pattern_deviation = 0.5  # Neutral if no profile
        
        # Average session duration
        if len(events) > 1:
            durations = []
            session_start = events[0]['_timestamp']
            for i in range(1, len(events)):
                time_diff = (events[i]['_timestamp'] - events[i-1]['_timestamp']).total_seconds()
                if time_diff > 1800:  # 30 min gap = new session
                    durations.append((events[i-1]['_timestamp'] - session_start).total_seconds() / 60.0)
                    session_start = events[i]['_timestamp']
            avg_duration = np.mean(durations) if durations else 0.0
        else:
            avg_duration = 0.0
        
        # Failed attempt ratio
        failed_count = sum(1 for e in events if e.get('success') == False)
        failed_ratio = failed_count / max(len(events), 1)
        
        return [
            action_diversity,
            min(pattern_deviation, 1.0),
            min(avg_duration / 60.0, 1.0),  # Normalize to hours
            failed_ratio
        ]
    
    def update_user_profile(self, user_id: str) -> None:
        """Update user profile based on accumulated event history."""
        events = self.event_history.get(user_id, [])
        
        if not events:
            return
        
        # Update known IPs
        known_ips = self.user_profiles.get(user_id, {}).get('known_ips', set())
        new_ips = set(e.get('ip_address', 'unknown') for e in events)
        known_ips.update(new_ips)
        
        # Update typical resources
        resource_counts = defaultdict(int)
        for e in events:
            resource_counts[e.get('resource', '')] += 1
        
        typical_resources = set(
            r for r, c in resource_counts.items()
            if c >= 3  # Resources accessed 3+ times
        )
        
        # Update typical hours
        hour_counts = defaultdict(int)
        for e in events:
            hour_counts[e['_timestamp'].hour] += 1
        
        typical_hours = set(
            h for h, c in hour_counts.items()
            if c >= 2  # Hours with 2+ events
        )
        
        self.user_profiles[user_id] = {
            'known_ips': known_ips,
            'typical_resources': typical_resources,
            'typical_hours': typical_hours,
            'total_events': len(events),
            'last_updated': datetime.utcnow()
        }
    
    def get_feature_names(self) -> List[str]:
        """Return list of feature names for interpretability."""
        return FEATURE_NAMES.copy()
