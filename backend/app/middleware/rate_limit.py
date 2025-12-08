from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, Tuple
import time


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware
    Limits requests per IP address
    """
    
    def __init__(self, app, calls: int = 10, period: int = 60):
        super().__init__(app)
        self.calls = calls  # Number of calls allowed
        self.period = period  # Time period in seconds
        self.clients: Dict[str, list] = defaultdict(list)
    
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = self.get_client_ip(request)
        
        # Check rate limit
        if not self.is_allowed(client_ip):
            return Response(
                content="Rate limit exceeded. Please try again later.",
                status_code=429,
                headers={"Retry-After": str(self.period)}
            )
        
        # Record request
        self.record_request(client_ip)
        
        # Process request
        response = await call_next(request)
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def is_allowed(self, client_ip: str) -> bool:
        """Check if client is within rate limit"""
        now = datetime.utcnow()
        cutoff = now - timedelta(seconds=self.period)
        
        # Clean old entries
        if client_ip in self.clients:
            self.clients[client_ip] = [
                timestamp for timestamp in self.clients[client_ip]
                if timestamp > cutoff
            ]
        
        # Check if limit exceeded
        return len(self.clients.get(client_ip, [])) < self.calls
    
    def record_request(self, client_ip: str):
        """Record a request"""
        self.clients[client_ip].append(datetime.utcnow())

