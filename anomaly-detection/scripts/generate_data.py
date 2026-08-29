"""
Generate Synthetic Training Data for Anomaly Detection.

Generates two CSV files:
1. synthetic_access_data.csv - Mixed normal + anomalous events
2. normal_behavior_data.csv - Normal behavior only (for autoencoder training)
"""

import sys
import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


def generate_normal_event(user_id: str, base_time: datetime, rng: np.random.RandomState) -> dict:
    """Generate a single normal access event."""
    normal_hours = list(range(9, 18))
    normal_resources = [
        'dashboard', 'profile', 'documents', 'settings', 'reports',
        'api/keys', 'team', 'calendar', 'email', 'storage'
    ]
    normal_actions = ['read', 'write', 'update', 'list', 'export', 'share']
    normal_ips = [
        '192.168.1.100', '192.168.1.101', '10.0.0.50',
        '172.16.0.10', '192.168.2.200'
    ]

    hour = rng.choice(normal_hours)
    minute = rng.randint(0, 60)
    timestamp = base_time.replace(hour=hour, minute=minute)

    return {
        'user_id': user_id,
        'action': rng.choice(normal_actions),
        'resource': rng.choice(normal_resources),
        'ip_address': rng.choice(normal_ips),
        'success': rng.random() > 0.05,
        'timestamp': timestamp,
        'session_id': f'session_{rng.randint(1000, 9999)}'
    }


def generate_anomalous_event(user_id: str, base_time: datetime, rng: np.random.RandomState) -> dict:
    """Generate an anomalous access event."""
    anomaly_type = rng.choice([
        'off_hours', 'new_ip', 'high_frequency',
        'unusual_resource', 'failed_attempts'
    ])

    normal_hours = list(range(9, 18))
    normal_resources = [
        'dashboard', 'profile', 'documents', 'settings', 'reports',
        'api/keys', 'team', 'calendar', 'email', 'storage'
    ]
    normal_actions = ['read', 'write', 'update', 'list', 'export', 'share']
    normal_ips = [
        '192.168.1.100', '192.168.1.101', '10.0.0.50',
        '172.16.0.10', '192.168.2.200'
    ]

    if anomaly_type == 'off_hours':
        hour = rng.choice([2, 3, 4, 5])
        minute = rng.randint(0, 60)
        timestamp = base_time.replace(hour=hour, minute=minute)
        ip = rng.choice(normal_ips)
        resource = rng.choice(normal_resources)
        action = rng.choice(normal_actions)
        success = True

    elif anomaly_type == 'new_ip':
        hour = rng.choice(normal_hours)
        minute = rng.randint(0, 60)
        timestamp = base_time.replace(hour=hour, minute=minute)
        ip = f'10.{rng.randint(1, 255)}.{rng.randint(1, 255)}.{rng.randint(1, 255)}'
        resource = rng.choice(normal_resources)
        action = rng.choice(normal_actions)
        success = True

    elif anomaly_type == 'high_frequency':
        hour = rng.choice(normal_hours)
        minute = rng.randint(0, 60)
        second = rng.randint(0, 59)
        timestamp = base_time.replace(hour=hour, minute=minute, second=second)
        ip = rng.choice(normal_ips)
        resource = rng.choice(normal_resources)
        action = rng.choice(normal_actions)
        success = True

    elif anomaly_type == 'unusual_resource':
        hour = rng.choice(normal_hours)
        minute = rng.randint(0, 60)
        timestamp = base_time.replace(hour=hour, minute=minute)
        ip = rng.choice(normal_ips)
        unusual_resources = ['admin', 'config', 'secrets', 'debug', 'test-db']
        resource = rng.choice(unusual_resources)
        action = rng.choice(['read', 'write', 'delete'])
        success = True

    else:  # failed_attempts
        hour = rng.choice(normal_hours)
        minute = rng.randint(0, 60)
        timestamp = base_time.replace(hour=hour, minute=minute)
        ip = rng.choice(normal_ips)
        resource = rng.choice(['auth', 'api/keys', 'admin'])
        action = 'authenticate'
        success = False

    return {
        'user_id': user_id,
        'action': action,
        'resource': resource,
        'ip_address': ip,
        'success': success,
        'timestamp': timestamp,
        'session_id': f'session_{rng.randint(1000, 9999)}',
        'is_anomaly': True,
        'anomaly_type': anomaly_type
    }


def generate_csv_files(
    n_users: int = 200,
    events_per_user: int = 100,
    anomaly_ratio: float = 0.1,
    days: int = 30,
    output_dir: str = '../data'
):
    """Generate synthetic data CSV files."""
    rng = np.random.RandomState(42)
    base_time = datetime.utcnow() - timedelta(days=days)

    os.makedirs(output_dir, exist_ok=True)

    # Generate normal behavior data
    print("Generating normal behavior data...")
    normal_events = []
    for user_idx in range(n_users):
        user_id = f'user_{user_idx:04d}'
        for _ in range(events_per_user):
            day_offset = rng.randint(0, days)
            day_time = base_time + timedelta(days=day_offset)
            event = generate_normal_event(user_id, day_time, rng)
            normal_events.append(event)

    normal_df = pd.DataFrame(normal_events)
    normal_path = os.path.join(output_dir, 'normal_behavior_data.csv')
    normal_df.to_csv(normal_path, index=False)
    print(f"  Saved {len(normal_df)} normal events to {normal_path}")

    # Generate mixed data (normal + anomalous)
    print("Generating synthetic access data with anomalies...")
    mixed_events = []
    for user_idx in range(n_users):
        user_id = f'user_{user_idx:04d}'
        for _ in range(events_per_user):
            day_offset = rng.randint(0, days)
            day_time = base_time + timedelta(days=day_offset)
            is_anomaly = rng.random() < anomaly_ratio

            if is_anomaly:
                event = generate_anomalous_event(user_id, day_time, rng)
            else:
                event = generate_normal_event(user_id, day_time, rng)

            mixed_events.append(event)

    mixed_df = pd.DataFrame(mixed_events)
    mixed_path = os.path.join(output_dir, 'synthetic_access_data.csv')
    mixed_df.to_csv(mixed_path, index=False)
    print(f"  Saved {len(mixed_df)} events (with {anomaly_ratio:.0%} anomalies) to {mixed_path}")

    # Print summary
    anomaly_count = mixed_df['is_anomaly'].sum() if 'is_anomaly' in mixed_df.columns else 0
    print(f"\nSummary:")
    print(f"  Users: {n_users}")
    print(f"  Events per user: {events_per_user}")
    print(f"  Total events: {len(mixed_df)}")
    print(f"  Anomalous events: {anomaly_count}")
    print(f"  Anomaly ratio: {anomaly_count / len(mixed_df):.2%}")
    print(f"  Unique users: {mixed_df['user_id'].nunique()}")
    print(f"  Date range: {mixed_df['timestamp'].min()} to {mixed_df['timestamp'].max()}")

    return normal_df, mixed_df


if __name__ == '__main__':
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    generate_csv_files(output_dir=output_dir)
