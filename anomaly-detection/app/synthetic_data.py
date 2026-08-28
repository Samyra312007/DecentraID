"""
Synthetic Data Generator for Anomaly Detection.

Generates realistic access event data with known anomalies
for training and evaluating the detection models.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Tuple


class SyntheticDataGenerator:
    """
    Generates synthetic access events for training.
    
    Creates realistic patterns:
    - Normal user behavior (9-5 weekday access)
    - Typical resources and actions
    - Known IP addresses
    
    Also injects anomalies:
    - Off-hours access
    - Unusual resource access
    - New IP addresses
    - High-frequency events
    """
    
    def __init__(self, seed: int = 42):
        self.rng = np.random.RandomState(seed)
        
        # Normal behavior parameters
        self.normal_hours = list(range(9, 18))  # 9 AM to 5 PM
        self.normal_days = list(range(5))  # Monday to Friday
        self.normal_resources = [
            'dashboard', 'profile', 'documents', 'settings', 'reports',
            'api/keys', 'team', 'calendar', 'email', 'storage'
        ]
        self.normal_actions = [
            'read', 'write', 'update', 'list', 'export', 'share'
        ]
        self.normal_ips = [
            '192.168.1.100', '192.168.1.101', '10.0.0.50',
            '172.16.0.10', '192.168.2.200'
        ]
    
    def generate_normal_event(
        self,
        user_id: str,
        base_time: datetime
    ) -> Dict:
        """Generate a single normal event."""
        # Random hour within normal working hours
        hour = self.rng.choice(self.normal_hours)
        minute = self.rng.randint(0, 60)
        
        timestamp = base_time.replace(hour=hour, minute=minute)
        
        # Random resource and action
        resource = self.rng.choice(self.normal_resources)
        action = self.rng.choice(self.normal_actions)
        
        # Random IP from known IPs
        ip = self.rng.choice(self.normal_ips)
        
        # 95% success rate
        success = self.rng.random() > 0.05
        
        return {
            'user_id': user_id,
            'action': action,
            'resource': resource,
            'ip_address': ip,
            'success': success,
            'timestamp': timestamp,
            'session_id': f'session_{self.rng.randint(1000, 9999)}'
        }
    
    def generate_anomaly_event(
        self,
        user_id: str,
        base_time: datetime,
        anomaly_type: str = 'random'
    ) -> Dict:
        """Generate an anomalous event."""
        if anomaly_type == 'random':
            anomaly_type = self.rng.choice([
                'off_hours', 'new_ip', 'high_frequency',
                'unusual_resource', 'failed_attempts'
            ])
        
        if anomaly_type == 'off_hours':
            # Access at unusual hours (2-5 AM)
            hour = self.rng.choice([2, 3, 4, 5])
            minute = self.rng.randint(0, 60)
            timestamp = base_time.replace(hour=hour, minute=minute)
            ip = self.rng.choice(self.normal_ips)
            resource = self.rng.choice(self.normal_resources)
            action = self.rng.choice(self.normal_actions)
            success = True
            
        elif anomaly_type == 'new_ip':
            # Access from new IP
            hour = self.rng.choice(self.normal_hours)
            minute = self.rng.randint(0, 60)
            timestamp = base_time.replace(hour=hour, minute=minute)
            ip = f'10.{self.rng.randint(1, 255)}.{self.rng.randint(1, 255)}.{self.rng.randint(1, 255)}'
            resource = self.rng.choice(self.normal_resources)
            action = self.rng.choice(self.normal_actions)
            success = True
            
        elif anomaly_type == 'high_frequency':
            # Rapid sequence of events
            hour = self.rng.choice(self.normal_hours)
            minute = self.rng.randint(0, 60)
            second = self.rng.randint(0, 59)
            timestamp = base_time.replace(hour=hour, minute=minute, second=second)
            ip = self.rng.choice(self.normal_ips)
            resource = self.rng.choice(self.normal_resources)
            action = self.rng.choice(self.normal_actions)
            success = True
            
        elif anomaly_type == 'unusual_resource':
            # Access unusual resource
            hour = self.rng.choice(self.normal_hours)
            minute = self.rng.randint(0, 60)
            timestamp = base_time.replace(hour=hour, minute=minute)
            ip = self.rng.choice(self.normal_ips)
            unusual_resources = ['admin', 'config', 'secrets', 'debug', 'test-db']
            resource = self.rng.choice(unusual_resources)
            action = self.rng.choice(['read', 'write', 'delete'])
            success = True
            
        elif anomaly_type == 'failed_attempts':
            # Multiple failed attempts
            hour = self.rng.choice(self.normal_hours)
            minute = self.rng.randint(0, 60)
            timestamp = base_time.replace(hour=hour, minute=minute)
            ip = self.rng.choice(self.normal_ips)
            resource = self.rng.choice(['auth', 'api/keys', 'admin'])
            action = 'authenticate'
            success = False
        
        else:
            # Default: off-hours
            timestamp = base_time.replace(hour=3)
            ip = '10.99.99.99'
            resource = 'admin'
            action = 'delete'
            success = False
        
        return {
            'user_id': user_id,
            'action': action,
            'resource': resource,
            'ip_address': ip,
            'success': success,
            'timestamp': timestamp,
            'session_id': f'session_{self.rng.randint(1000, 9999)}',
            'is_anomaly': True,
            'anomaly_type': anomaly_type
        }
    
    def generate_dataset(
        self,
        n_users: int = 100,
        events_per_user: int = 100,
        anomaly_ratio: float = 0.1,
        days: int = 30
    ) -> Tuple[List[Dict], np.ndarray]:
        """
        Generate a complete dataset.
        
        Args:
            n_users: Number of users
            events_per_user: Events per user
            anomaly_ratio: Fraction of anomalous events
            days: Number of days to span
            
        Returns:
            Tuple of (events, feature_matrix)
        """
        from .feature_extraction import FeatureExtractor
        
        extractor = FeatureExtractor()
        events = []
        features_list = []
        
        base_time = datetime.utcnow() - timedelta(days=days)
        
        for user_idx in range(n_users):
            user_id = f'user_{user_idx:04d}'
            
            for event_idx in range(events_per_user):
                # Random day
                day_offset = self.rng.randint(0, days)
                day_time = base_time + timedelta(days=day_offset)
                
                # Determine if this is an anomaly
                is_anomaly = self.rng.random() < anomaly_ratio
                
                if is_anomaly:
                    event = self.generate_anomaly_event(user_id, day_time)
                else:
                    event = self.generate_normal_event(user_id, day_time)
                
                events.append(event)
                
                # Extract features
                features = extractor.extract_features(
                    event, user_id, event['timestamp']
                )
                features_list.append(features)
        
        feature_matrix = np.array(features_list)
        
        return events, feature_matrix
    
    def generate_training_data(
        self,
        n_samples: int = 10000,
        anomaly_ratio: float = 0.1
    ) -> np.ndarray:
        """
        Generate feature matrix for training.
        
        Args:
            n_samples: Total number of samples
            anomaly_ratio: Fraction of anomalies
            
        Returns:
            Feature matrix of shape (n_samples, 15)
        """
        events, feature_matrix = self.generate_dataset(
            n_users=n_samples // 100,
            events_per_user=100,
            anomaly_ratio=anomaly_ratio
        )
        
        return feature_matrix[:n_samples]
    
    def generate_normal_only_data(
        self,
        n_samples: int = 10000
    ) -> np.ndarray:
        """
        Generate only normal data for autoencoder training.
        
        Args:
            n_samples: Number of samples
            
        Returns:
            Feature matrix of shape (n_samples, 15)
        """
        events, feature_matrix = self.generate_dataset(
            n_users=n_samples // 100,
            events_per_user=100,
            anomaly_ratio=0.0  # No anomalies
        )
        
        return feature_matrix[:n_samples]
