"""
Tests for security middleware.
"""

import pytest
from app.middleware.security import SecurityMiddleware


class TestSecurityMiddleware:
    """Tests for SecurityMiddleware."""

    def test_sanitize_input(self):
        """Test input sanitization."""
        # Test XSS prevention
        malicious = '<script>alert("xss")</script>'
        sanitized = SecurityMiddleware.sanitize_input(malicious)
        assert '<script>' not in sanitized
        assert '&lt;script&gt;' in sanitized

    def test_sanitize_input_normal(self):
        """Test normal input passes through."""
        normal = "Hello, World!"
        sanitized = SecurityMiddleware.sanitize_input(normal)
        assert sanitized == normal

    def test_sanitize_dict(self):
        """Test dictionary sanitization."""
        data = {
            "name": '<script>alert("xss")</script>',
            "description": "Normal text",
            "nested": {
                "key": '<img onerror="alert(1)">'
            }
        }
        sanitized = SecurityMiddleware.sanitize_dict(data)
        assert '<script>' not in sanitized["name"]
        assert '<img' not in sanitized["nested"]["key"]

    def test_sql_injection_detection(self):
        """Test SQL injection pattern detection."""
        middleware = SecurityMiddleware(None)

        # Should detect SQL injection
        assert middleware._contains_malicious_pattern("'; DROP TABLE users; --")
        assert middleware._contains_malicious_pattern("UNION SELECT * FROM users")
        assert middleware._contains_malicious_pattern("DELETE FROM users WHERE 1=1")

    def test_xss_detection(self):
        """Test XSS pattern detection."""
        middleware = SecurityMiddleware(None)

        # Should detect XSS
        assert middleware._contains_malicious_pattern('<script>alert("xss")</script>')
        assert middleware._contains_malicious_pattern('javascript:alert(1)')
        assert middleware._contains_malicious_pattern('<iframe src="evil.com">')

    def test_normal_input_not_flagged(self):
        """Test normal input is not flagged as malicious."""
        middleware = SecurityMiddleware(None)

        # Should not flag normal input
        assert not middleware._contains_malicious_pattern("user@example.com")
        assert not middleware._contains_malicious_pattern("Hello World")


class TestRateLimiter:
    """Tests for rate limiter."""

    def test_rate_limiter_allows_requests(self):
        """Test rate limiter allows normal request rate."""
        from app.middleware.rate_limiter import RateLimiter

        limiter = RateLimiter(requests_per_minute=60)

        # Should allow requests under limit
        for _ in range(10):
            assert limiter.is_allowed("192.168.1.1")

    def test_rate_limiter_blocks_excess(self):
        """Test rate limiter blocks excess requests."""
        from app.middleware.rate_limiter import RateLimiter

        limiter = RateLimiter(requests_per_minute=5)

        # Exhaust limit
        for _ in range(5):
            limiter.is_allowed("192.168.1.1")

        # Next request should be blocked
        assert not limiter.is_allowed("192.168.1.1")

    def test_rate_limiter_different_ips(self):
        """Test rate limiter tracks IPs separately."""
        from app.middleware.rate_limiter import RateLimiter

        limiter = RateLimiter(requests_per_minute=2)

        # Exhaust limit for IP 1
        limiter.is_allowed("192.168.1.1")
        limiter.is_allowed("192.168.1.1")

        # IP 2 should still be allowed
        assert limiter.is_allowed("192.168.1.2")
