"""
Security middleware — adds security headers and input sanitization.
"""

import re
import html
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityMiddleware(BaseHTTPMiddleware):
    """Add security headers and input sanitization to all HTTP responses."""

    # Patterns for detecting potentially malicious input
    # SQL injection patterns - only match when followed by SQL-specific syntax
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\s+\w+)",
        r"(--|;\s*--|';\s*(?:DROP|DELETE|UPDATE|INSERT))",
        r"(\b(OR|AND)\b\s+\d+\s*=\s*\d+)",
        r"(\b(OR|AND)\b\s+['\"].*?['\"]\s*=\s*['\"].*?['\"])",
    ]

    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe[^>]*>",
        r"<object[^>]*>",
        r"<embed[^>]*>",
    ]

    def __init__(self, app, enable_input_validation: bool = True):
        super().__init__(app)
        self.enable_input_validation = enable_input_validation
        self._sql_compiled = [re.compile(p, re.IGNORECASE) for p in self.SQL_INJECTION_PATTERNS]
        self._xss_compiled = [re.compile(p, re.IGNORECASE) for p in self.XSS_PATTERNS]

    async def dispatch(self, request: Request, call_next) -> Response:
        # Validate request if enabled
        if self.enable_input_validation:
            validation_error = await self._validate_request(request)
            if validation_error:
                from starlette.responses import JSONResponse
                return JSONResponse(
                    status_code=400,
                    content={"detail": f"Invalid input: {validation_error}"}
                )

        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' ws: wss:; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )

        # Remove server header
        if "server" in response.headers:
            del response.headers["server"]

        # Remove potentially leaking headers
        for header in ["x-powered-by", "x-aspnet-version", "x-aspnetmvc-version"]:
            if header in response.headers:
                del response.headers[header]

        return response

    async def _validate_request(self, request: Request) -> str | None:
        """Validate request for common attack patterns."""
        # Check URL path
        path = str(request.url.path)
        if self._contains_malicious_pattern(path):
            return "Potentially malicious URL pattern detected"

        # Check query parameters
        query = str(request.url.query)
        if query and self._contains_malicious_pattern(query):
            return "Potentially malicious query parameter detected"

        # Check request body for POST/PUT/PATCH (only JSON)
        if request.method in ("POST", "PUT", "PATCH"):
            content_type = request.headers.get("content-type", "")
            if "application/json" in content_type:
                try:
                    body = await request.body()
                    if body and len(body) < 1_000_000:  # Only check < 1MB bodies
                        import json
                        body_text = body.decode("utf-8", errors="ignore")
                        if self._contains_malicious_pattern(body_text):
                            return "Potentially malicious request body detected"
                except Exception:
                    pass

        return None

    def _contains_malicious_pattern(self, text: str) -> bool:
        """Check if text contains SQL injection or XSS patterns."""
        # Decode URL-encoded characters
        import urllib.parse
        decoded = urllib.parse.unquote(text)

        # Check SQL injection
        for pattern in self._sql_compiled:
            if pattern.search(decoded):
                return True

        # Check XSS
        for pattern in self._xss_compiled:
            if pattern.search(decoded):
                return True

        return False

    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitize user input to prevent XSS."""
        if not isinstance(text, str):
            return text
        # HTML escape
        text = html.escape(text)
        # Remove null bytes
        text = text.replace('\x00', '')
        return text

    @staticmethod
    def sanitize_dict(data: dict) -> dict:
        """Sanitize all string values in a dictionary."""
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                sanitized[key] = SecurityMiddleware.sanitize_input(value)
            elif isinstance(value, dict):
                sanitized[key] = SecurityMiddleware.sanitize_dict(value)
            elif isinstance(value, list):
                sanitized[key] = [
                    SecurityMiddleware.sanitize_input(v) if isinstance(v, str) else v
                    for v in value
                ]
            else:
                sanitized[key] = value
        return sanitized
