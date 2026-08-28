"""
Tests for Feature Extraction Engine.
"""

import pytest
import numpy as np
from datetime import datetime, timedelta
from app.feature_extraction import FeatureExtractor, FEATURE_NAMES


class TestFeatureExtractor:
    """Tests for FeatureExtractor class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.extractor = FeatureExtractor()
        self.base_time = datetime(2024, 1, 15, 10, 30, 0)  # Monday 10:30 AM
    
    def test_initialization(self):
        """Test extractor initializes correctly."""
        assert self.extractor.window_hours == 24
        assert len(self.extractor.event_history) == 0
        assert len(self.extractor.user_profiles) == 0
    
    def test_extract_features_returns_15_dimensions(self):
        """Test that features have 15 dimensions."""
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True
        }
        
        features = self.extractor.extract_features(event, 'user_001', self.base_time)
        
        assert features.shape == (15,)
        assert features.dtype == np.float32
    
    def test_features_are_normalized(self):
        """Test that all features are in 0-1 range."""
        event = {
            'user_id': 'user_001',
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True
        }
        
        features = self.extractor.extract_features(event, 'user_001', self.base_time)
        
        # All features should be between 0 and 1
        assert np.all(features >= 0)
        assert np.all(features <= 1)
    
    def test_temporal_features(self):
        """Test temporal feature extraction."""
        # Test morning event
        morning_time = self.base_time.replace(hour=10)
        event = {'user_id': 'user_001', 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        
        features = self.extractor.extract_features(event, 'user_001', morning_time)
        
        # hour_of_day should be ~0.43 (10/23)
        assert 0.4 < features[0] < 0.5
        
        # day_of_week should be ~0 (Monday)
        assert features[1] < 0.1
        
        # is_weekend should be 0 (Monday)
        assert features[2] == 0.0
    
    def test_weekend_detection(self):
        """Test weekend detection."""
        weekend_time = datetime(2024, 1, 13, 10, 0, 0)  # Saturday
        event = {'user_id': 'user_001', 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        
        features = self.extractor.extract_features(event, 'user_001', weekend_time)
        
        # is_weekend should be 1
        assert features[2] == 1.0
    
    def test_frequency_features_increase(self):
        """Test that frequency features increase with more events."""
        user_id = 'user_001'
        event = {'user_id': user_id, 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        
        # First event
        features1 = self.extractor.extract_features(event, user_id, self.base_time)
        
        # Add more events
        for i in range(5):
            time = self.base_time + timedelta(minutes=i*5)
            self.extractor.extract_features(event, user_id, time)
        
        # Last event should have higher frequency
        features2 = self.extractor.extract_features(event, user_id, self.base_time + timedelta(minutes=30))
        
        assert features2[4] >= features1[4]  # events_last_hour
    
    def test_action_diversity(self):
        """Test action diversity calculation."""
        user_id = 'user_001'
        
        # Add events with same action
        for i in range(10):
            event = {'user_id': user_id, 'action': 'read', 'resource': f'resource_{i}', 'ip_address': '192.168.1.100', 'success': True}
            self.extractor.extract_features(event, user_id, self.base_time + timedelta(minutes=i))
        
        # Get current features
        event = {'user_id': user_id, 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        features = self.extractor.extract_features(event, user_id, self.base_time + timedelta(minutes=100))
        
        # Low diversity (all same action)
        assert features[11] < 0.5
    
    def test_get_feature_names(self):
        """Test feature names are returned correctly."""
        names = self.extractor.get_feature_names()
        
        assert len(names) == 15
        assert names == FEATURE_NAMES
    
    def test_user_profile_update(self):
        """Test user profile is updated correctly."""
        user_id = 'user_001'
        
        # Add several events
        for i in range(5):
            event = {
                'user_id': user_id,
                'action': 'read' if i < 3 else 'write',
                'resource': f'resource_{i % 3}',
                'ip_address': '192.168.1.100' if i < 4 else '10.0.0.1',
                'success': True
            }
            self.extractor.extract_features(event, user_id, self.base_time + timedelta(minutes=i*10))
        
        # Update profile
        self.extractor.update_user_profile(user_id)
        
        # Check profile exists
        assert user_id in self.extractor.user_profiles
        profile = self.extractor.user_profiles[user_id]
        
        assert profile['total_events'] == 5
        assert len(profile['known_ips']) == 2
