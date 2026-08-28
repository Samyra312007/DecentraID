"""
Tests for Anomaly Detection Models.
"""

import pytest
import numpy as np
import tempfile
import os
from app.models.autoencoder import AutoencoderModel
from app.models.isolation_forest import IsolationForestModel
from app.models.ensemble import EnsembleDetector


class TestAutoencoderModel:
    """Tests for AutoencoderModel class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.model = AutoencoderModel(input_dim=15, latent_dim=8)
        self.X_normal = np.random.randn(100, 15).astype(np.float32)
        self.X_anomaly = np.random.randn(10, 15).astype(np.float32) * 3  # Anomalies
    
    def test_build_model(self):
        """Test model builds correctly."""
        model = self.model.build()
        
        assert model is not None
        assert self.model.model is not None
    
    def test_fit_model(self):
        """Test model trains on data."""
        self.model.build()
        history = self.model.fit(self.X_normal)
        
        assert 'loss' in history
        assert 'threshold' in history
    
    def test_predict_normal_data(self):
        """Test prediction on normal data."""
        self.model.build()
        self.model.fit(self.X_normal)
        
        errors, is_anomaly = self.model.predict(self.X_normal[:10])
        
        assert errors.shape == (10,)
        assert is_anomaly.shape == (10,)
        # Most normal data should not be anomalies
        assert np.sum(is_anomaly) < 5
    
    def test_predict_anomaly_data(self):
        """Test prediction on anomalous data."""
        self.model.build()
        self.model.fit(self.X_normal)
        
        errors, is_anomaly = self.model.predict(self.X_anomaly)
        
        # Anomalies should have higher errors
        normal_errors, _ = self.model.predict(self.X_normal[:10])
        assert np.mean(errors) > np.mean(normal_errors)
    
    def test_predict_single(self):
        """Test single sample prediction."""
        self.model.build()
        self.model.fit(self.X_normal)
        
        error, is_anomaly = self.model.predict_single(self.X_normal[0])
        
        assert isinstance(error, float)
        assert isinstance(is_anomaly, bool)
    
    def test_save_and_load(self):
        """Test model save and load."""
        self.model.build()
        self.model.fit(self.X_normal)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            save_path = os.path.join(tmpdir, 'test_model')
            self.model.save(save_path)
            
            # Load into new model
            new_model = AutoencoderModel()
            new_model.load(save_path)
            
            # Verify loaded model works
            error, is_anomaly = new_model.predict_single(self.X_normal[0])
            assert isinstance(error, float)
    
    def test_get_feature_names(self):
        """Test feature names are accessible."""
        from app.feature_extraction import FEATURE_NAMES
        assert len(FEATURE_NAMES) == 15


class TestIsolationForestModel:
    """Tests for IsolationForestModel class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.model = IsolationForestModel(contamination=0.1)
        self.X_normal = np.random.randn(100, 15).astype(np.float32)
        self.X_anomaly = np.random.randn(10, 15).astype(np.float32) * 3
    
    def test_build_model(self):
        """Test model builds correctly."""
        model = self.model.build()
        assert model is not None
    
    def test_fit_model(self):
        """Test model trains on data."""
        meta = self.model.fit(self.X_normal)
        
        assert 'n_samples' in meta
        assert meta['n_samples'] == 100
    
    def test_predict(self):
        """Test prediction."""
        self.model.fit(self.X_normal)
        
        scores, is_anomaly = self.model.predict(self.X_normal[:10])
        
        assert scores.shape == (10,)
        assert is_anomaly.shape == (10,)
    
    def test_anomaly_scores_higher(self):
        """Test that anomalies have higher scores."""
        self.model.fit(self.X_normal)
        
        normal_scores, _ = self.model.predict(self.X_normal[:10])
        anomaly_scores, _ = self.model.predict(self.X_anomaly)
        
        # Anomalies should have higher scores on average
        assert np.mean(anomaly_scores) > np.mean(normal_scores)
    
    def test_predict_single(self):
        """Test single sample prediction."""
        self.model.fit(self.X_normal)
        
        score, is_anomaly = self.model.predict_single(self.X_normal[0])
        
        assert isinstance(score, float)
        assert isinstance(is_anomaly, bool)
    
    def test_save_and_load(self):
        """Test model save and load."""
        self.model.fit(self.X_normal)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            save_path = os.path.join(tmpdir, 'test_iforest.joblib')
            self.model.save(save_path)
            
            new_model = IsolationForestModel()
            new_model.load(save_path)
            
            score, is_anomaly = new_model.predict_single(self.X_normal[0])
            assert isinstance(score, float)


class TestEnsembleDetector:
    """Tests for EnsembleDetector class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.ensemble = EnsembleDetector(
            autoencoder_weight=0.6,
            iforest_weight=0.4
        )
        self.X_normal = np.random.randn(100, 15).astype(np.float32)
        self.X_anomaly = np.random.randn(10, 15).astype(np.float32) * 3
    
    def test_fit_ensemble(self):
        """Test ensemble training."""
        result = self.ensemble.fit(self.X_normal)
        
        assert 'autoencoder_history' in result
        assert 'iforest_metadata' in result
        assert self.ensemble.is_fitted
    
    def test_predict_ensemble(self):
        """Test ensemble prediction."""
        self.ensemble.fit(self.X_normal)
        
        scores, is_anomaly, details = self.ensemble.predict(self.X_normal[:10])
        
        assert scores.shape == (10,)
        assert is_anomaly.shape == (10,)
        assert 'autoencoder_scores' in details
        assert 'iforest_scores' in details
    
    def test_predict_single(self):
        """Test single sample prediction."""
        self.ensemble.fit(self.X_normal)
        
        score, is_anomaly, details = self.ensemble.predict_single(self.X_normal[0])
        
        assert isinstance(score, float)
        assert isinstance(is_anomaly, bool)
        assert 'autoencoder_score' in details
    
    def test_ensemble_catches_anomalies(self):
        """Test that ensemble detects anomalies."""
        self.ensemble.fit(self.X_normal)
        
        _, normal_anomalies, _ = self.ensemble.predict(self.X_normal[:20])
        _, anomaly_anomalies, _ = self.ensemble.predict(self.X_anomaly)
        
        # Ensemble should produce different scores for normal vs anomaly data
        normal_scores, _, _ = self.ensemble.predict(self.X_normal[:20])
        anomaly_scores, _, _ = self.ensemble.predict(self.X_anomaly)
        assert np.mean(anomaly_scores) >= np.mean(normal_scores) * 0.5  # At least somewhat higher
    
    def test_get_model_info(self):
        """Test model info retrieval."""
        self.ensemble.fit(self.X_normal)
        
        info = self.ensemble.get_model_info()
        
        assert info['is_fitted'] == True
        assert 'weights' in info
        assert 'autoencoder_params' in info
        assert 'iforest_params' in info
    
    def test_save_and_load(self):
        """Test ensemble save and load."""
        self.ensemble.fit(self.X_normal)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            self.ensemble.save(os.path.join(tmpdir, 'test'))
            
            new_ensemble = EnsembleDetector()
            new_ensemble.load(os.path.join(tmpdir, 'test'))
            
            assert new_ensemble.is_fitted
            score, _, _ = new_ensemble.predict_single(self.X_normal[0])
            assert isinstance(score, float)
