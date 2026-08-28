"""
Tests for Synthetic Data Generator.
"""

import pytest
import numpy as np
from app.synthetic_data import SyntheticDataGenerator


class TestSyntheticDataGenerator:
    """Tests for SyntheticDataGenerator class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.generator = SyntheticDataGenerator(seed=42)
    
    def test_initialization(self):
        """Test generator initializes correctly."""
        assert self.generator.rng is not None
        assert len(self.generator.normal_resources) > 0
        assert len(self.generator.normal_actions) > 0
    
    def test_generate_normal_event(self):
        """Test normal event generation."""
        from datetime import datetime
        base_time = datetime(2024, 1, 15, 10, 0, 0)
        event = self.generator.generate_normal_event('user_001', base_time)
        
        assert event['user_id'] == 'user_001'
        assert event['action'] in self.generator.normal_actions
        assert event['resource'] in self.generator.normal_resources
        assert event['ip_address'] in self.generator.normal_ips
        assert event['success'] in [True, False]
    
    def test_generate_anomaly_event(self):
        """Test anomaly event generation."""
        from datetime import datetime
        base_time = datetime(2024, 1, 15, 10, 0, 0)
        event = self.generator.generate_anomaly_event('user_001', base_time)
        
        assert event['user_id'] == 'user_001'
        assert event.get('is_anomaly') == True
        assert 'anomaly_type' in event
    
    def test_generate_anomaly_types(self):
        """Test different anomaly types."""
        from datetime import datetime
        base_time = datetime(2024, 1, 15, 10, 0, 0)
        anomaly_types = ['off_hours', 'new_ip', 'high_frequency', 'unusual_resource', 'failed_attempts']
        
        for anomaly_type in anomaly_types:
            event = self.generator.generate_anomaly_event('user_001', base_time, anomaly_type=anomaly_type)
            assert event['anomaly_type'] == anomaly_type
    
    def test_generate_dataset(self):
        """Test dataset generation."""
        events, features = self.generator.generate_dataset(
            n_users=5,
            events_per_user=10,
            anomaly_ratio=0.1
        )
        
        assert len(events) == 50
        assert features.shape == (50, 15)
    
    def test_generate_training_data(self):
        """Test training data generation."""
        X = self.generator.generate_training_data(n_samples=100)
        
        assert X.shape == (100, 15)
        assert X.dtype == np.float32
    
    def test_generate_normal_only_data(self):
        """Test normal-only data generation."""
        X = self.generator.generate_normal_only_data(n_samples=100)
        
        assert X.shape == (100, 15)
        assert X.dtype == np.float32
    
    def test_anomaly_ratio(self):
        """Test that anomaly ratio is approximately correct."""
        events, _ = self.generator.generate_dataset(
            n_users=10,
            events_per_user=100,
            anomaly_ratio=0.1
        )
        
        anomaly_count = sum(1 for e in events if e.get('is_anomaly'))
        anomaly_ratio = anomaly_count / len(events)
        
        # Should be approximately 10% (with some tolerance)
        assert 0.05 < anomaly_ratio < 0.2
    
    def test_deterministic_with_seed(self):
        """Test that same seed produces same data."""
        gen1 = SyntheticDataGenerator(seed=123)
        gen2 = SyntheticDataGenerator(seed=123)
        
        events1, _ = gen1.generate_dataset(n_users=2, events_per_user=5)
        events2, _ = gen2.generate_dataset(n_users=2, events_per_user=5)
        
        # Same seed should produce same events
        assert events1[0]['action'] == events2[0]['action']
        assert events1[0]['resource'] == events2[0]['resource']
