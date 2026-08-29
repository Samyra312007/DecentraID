"""
Rate limiting middleware — tracks request counts per IP.
Uses in-memory sliding window counter.
"""

import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class RateLimiter:
    """Simple in-memory rate limiter."""

    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        """Check if request is within rate limit."""
        now = time.time()
        window_start = now - 60  # 1 minute window

        # Remove old requests outside the window
        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip] if ts > window_start
        ]

        if len(self.requests[client_ip]) >= self.requests_per_minute:
            return False

        self.requests[client_ip].append(now)
        return True


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware that enforces rate limits per client IP."""

    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.limiter = RateLimiter(requests_per_minute)

    async def dispatch(self, request: Request, call_next):
        # Use X-Forwarded-For when behind a trusted reverse proxy (Nginx).
        # The rightmost untrusted IP is the true client.
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            # Take the leftmost address (original client before proxy chain)
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        if not self.limiter.is_allowed(client_ip):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Try again in 1 minute."},
            )

        response = await call_next(request)
        return response
