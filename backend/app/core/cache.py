"""
Caching utilities for performance optimization.
Provides in-memory cache with TTL support.
"""

import time
from typing import Any, Optional, Callable
from functools import wraps
import hashlib
import json


class MemoryCache:
    """Simple in-memory cache with TTL support."""

    def __init__(self, default_ttl: int = 300):
        """
        Initialize cache.

        Args:
            default_ttl: Default time-to-live in seconds (5 minutes)
        """
        self._cache: dict[str, dict] = {}
        self.default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if key in self._cache:
            entry = self._cache[key]
            if time.time() < entry["expires_at"]:
                return entry["value"]
            else:
                # Expired, remove it
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache."""
        ttl = ttl or self.default_ttl
        self._cache[key] = {
            "value": value,
            "expires_at": time.time() + ttl,
            "created_at": time.time()
        }

    def delete(self, key: str) -> None:
        """Delete value from cache."""
        if key in self._cache:
            del self._cache[key]

    def clear(self) -> None:
        """Clear all cached values."""
        self._cache.clear()

    def cleanup(self) -> int:
        """Remove expired entries. Returns number of entries removed."""
        now = time.time()
        expired = [
            key for key, entry in self._cache.items()
            if now >= entry["expires_at"]
        ]
        for key in expired:
            del self._cache[key]
        return len(expired)

    def size(self) -> int:
        """Get number of cached entries."""
        return len(self._cache)


# Global cache instance
cache = MemoryCache(default_ttl=300)


def cached(ttl: int = 300, key_prefix: str = ""):
    """
    Decorator for caching function results.

    Args:
        ttl: Time-to-live in seconds
        key_prefix: Prefix for cache key
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            key_data = {
                "func": func.__name__,
                "args": str(args),
                "kwargs": str(sorted(kwargs.items()))
            }
            cache_key = key_prefix + hashlib.md5(
                json.dumps(key_data, default=str).encode()
            ).hexdigest()

            # Check cache
            result = cache.get(cache_key)
            if result is not None:
                return result

            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result

        # Add cache management methods
        wrapper.cache_clear = lambda: cache.clear()
        wrapper.cache_size = lambda: cache.size()

        return wrapper
    return decorator


def invalidate_cache(pattern: str) -> int:
    """
    Invalidate cache entries matching pattern.

    Args:
        pattern: Pattern to match (simple substring)

    Returns:
        Number of entries invalidated
    """
    keys_to_delete = [
        key for key in cache._cache.keys()
        if pattern in key
    ]
    for key in keys_to_delete:
        cache.delete(key)
    return len(keys_to_delete)
