"""
Tests for Behavioral Profiling Module.
"""

import pytest
import numpy as np
from datetime import datetime, timedelta
from app.behavioral_profiling import BehavioralProfiler


class TestBehavioralProfiler:
    """Tests for BehavioralProfiler class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.profiler = BehavioralProfiler(alpha=0.1)
        self.base_time = datetime(2024, 1, 15, 10, 0, 0)
    
    def test_initialization(self):
        """Test profiler initializes correctly."""
        assert self.profiler.alpha == 0.1
        assert len(self.profiler.profiles) == 0
    
    def test_create_profile(self):
        """Test profile creation."""
        profile = self.profiler.get_or_create_profile('user_001')
        
        assert profile is not None
        assert profile['total_events'] == 0
        assert profile['feature_counts'] == 0
        assert 'user_001' in self.profiler.profiles
    
    def test_get_existing_profile(self):
        """Test getting existing profile."""
        profile1 = self.profiler.get_or_create_profile('user_001')
        profile2 = self.profiler.get_or_create_profile('user_001')
        
        assert profile1 is profile2
    
    def test_update_profile(self):
        """Test profile update with event."""
        user_id = 'user_001'
        event = {
            'user_id': user_id,
            'action': 'read',
            'resource': 'dashboard',
            'ip_address': '192.168.1.100',
            'success': True
        }
        features = np.random.randn(15).astype(np.float32)
        
        profile = self.profiler.update_profile(user_id, event, features, self.base_time)
        
        assert profile['total_events'] == 1
        assert profile['last_seen'] == self.base_time
        assert '192.168.1.100' in profile['known_ips']
    
    def test_update_multiple_events(self):
        """Test profile update with multiple events."""
        user_id = 'user_001'
        
        for i in range(10):
            event = {
                'user_id': user_id,
                'action': 'read' if i < 7 else 'write',
                'resource': f'resource_{i % 3}',
                'ip_address': '192.168.1.100',
                'success': True
            }
            features = np.random.randn(15).astype(np.float32)
            time = self.base_time + timedelta(hours=i)
            
            self.profiler.update_profile(user_id, event, features, time)
        
        profile = self.profiler.profiles[user_id]
        
        assert profile['total_events'] == 10
        assert profile['feature_counts'] == 10
    
    def test_calculate_deviation(self):
        """Test deviation calculation."""
        user_id = 'user_001'
        
        # Build baseline with normal events
        for i in range(20):
            event = {
                'user_id': user_id,
                'action': 'read',
                'resource': 'dashboard',
                'ip_address': '192.168.1.100',
                'success': True
            }
            features = np.random.randn(15).astype(np.float32) * 0.1  # Low variance
            time = self.base_time + timedelta(hours=i)
            self.profiler.update_profile(user_id, event, features, time)
        
        # Normal event should have low deviation
        normal_features = np.random.randn(15).astype(np.float32) * 0.1
        normal_deviation = self.profiler.calculate_deviation(user_id, normal_features)
        
        # Anomalous event should have high deviation
        anomalous_features = np.random.randn(15).astype(np.float32) * 3
        anomalous_deviation = self.profiler.calculate_deviation(user_id, anomalous_features)
        
        assert anomalous_deviation > normal_deviation
    
    def test_get_typical_hour(self):
        """Test getting typical hour."""
        user_id = 'user_001'
        
        # Add events mostly at 10 AM
        for i in range(20):
            event = {'user_id': user_id, 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
            features = np.random.randn(15).astype(np.float32)
            hour = 10 if i < 15 else 14
            time = self.base_time.replace(hour=hour)
            self.profiler.update_profile(user_id, event, features, time)
        
        typical_hour = self.profiler.get_typical_hour(user_id)
        assert typical_hour == 10
    
    def test_get_top_resources(self):
        """Test getting top resources."""
        user_id = 'user_001'
        
        # Add events with different resources
        resources = ['dashboard', 'dashboard', 'dashboard', 'settings', 'profile']
        for i, resource in enumerate(resources):
            event = {'user_id': user_id, 'action': 'read', 'resource': resource, 'ip_address': '192.168.1.100', 'success': True}
            features = np.random.randn(15).astype(np.float32)
            time = self.base_time + timedelta(hours=i)
            self.profiler.update_profile(user_id, event, features, time)
        
        top_resources = self.profiler.get_top_resources(user_id, n=3)
        
        assert 'dashboard' in top_resources
        assert len(top_resources) == 3
    
    def test_is_known_ip(self):
        """Test IP check."""
        user_id = 'user_001'
        
        # Add event with known IP
        event = {'user_id': user_id, 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        features = np.random.randn(15).astype(np.float32)
        self.profiler.update_profile(user_id, event, features, self.base_time)
        
        assert self.profiler.is_known_ip(user_id, '192.168.1.100') == True
        assert self.profiler.is_known_ip(user_id, '10.0.0.1') == False
    
    def test_save_and_load(self):
        """Test profile save and load."""
        import tempfile
        import os
        
        user_id = 'user_001'
        event = {'user_id': user_id, 'action': 'read', 'resource': 'dashboard', 'ip_address': '192.168.1.100', 'success': True}
        features = np.random.randn(15).astype(np.float32)
        self.profiler.update_profile(user_id, event, features, self.base_time)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            save_path = os.path.join(tmpdir, 'profiles.json')
            self.profiler.save(save_path)
            
            new_profiler = BehavioralProfiler()
            new_profiler.load(save_path)
            
            assert user_id in new_profiler.profiles
            assert new_profiler.profiles[user_id]['total_events'] == 1
