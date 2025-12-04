import jwt
import datetime
from flask import request, jsonify, current_app
from functools import wraps


def generate_token(agency_id: int) -> str:
    payload = {
        "agency_id": agency_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
    return token


def decode_token(token: str):
    try:
        decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        return decoded.get("agency_id")
    except Exception:
        return None


def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization") or request.headers.get("authorization")
        if not header:
            return jsonify({"error": "Missing authorization"}), 401

        token = header.replace("Bearer ", "").strip()
        if not token:
            return jsonify({"error": "Missing token"}), 401

        agency_id = decode_token(token)
        if not agency_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(agency_id, *args, **kwargs)

    return wrapper
