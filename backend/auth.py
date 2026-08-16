import os
import logging
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

logger = logging.getLogger(__name__)

ALGORITHM = "HS256"
TOKEN_HOURS = 12
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15

bearer_scheme = HTTPBearer(auto_error=False)
_db = None

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginInput(BaseModel):
    email: str
    password: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8")[:72], bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8")[:72], hashed.encode("utf-8"))


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=ALGORITHM)


async def init_auth(db):
    global _db
    _db = db
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.admins.find_one({"email": email})
    if existing is None:
        await db.admins.insert_one({
            "email": email,
            "password_hash": hash_password(password),
            "name": "Ayser",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded: %s", email)
    elif not existing.get("password_changed") and not verify_password(password, existing["password_hash"]):
        await db.admins.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password synced from env")
    await db.admins.create_index("email", unique=True)


async def require_admin(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, os.environ["JWT_SECRET"], algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    admin = await _db.admins.find_one({"email": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


async def _check_lock(identifier: str):
    doc = await _db.login_attempts.find_one({"identifier": identifier})
    if not doc:
        return
    if doc.get("count", 0) >= MAX_ATTEMPTS:
        last = datetime.fromisoformat(doc["last_at"])
        unlock_at = last + timedelta(minutes=LOCK_MINUTES)
        if datetime.now(timezone.utc) < unlock_at:
            mins = max(1, int((unlock_at - datetime.now(timezone.utc)).total_seconds() // 60) + 1)
            raise HTTPException(status_code=429, detail=f"Too many attempts. Try again in {mins} minutes.")
        await _db.login_attempts.delete_one({"identifier": identifier})


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@auth_router.post("/login")
async def login(data: LoginInput, request: Request):
    email = data.email.strip().lower()
    client_ip = _get_client_ip(request)
    identifier = f"{client_ip}:{email}"
    await _check_lock(identifier)
    admin = await _db.admins.find_one({"email": email})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        await _db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await _db.login_attempts.delete_one({"identifier": identifier})
    return {
        "token": create_access_token(email),
        "admin": {"email": email, "name": admin.get("name", "Admin")},
    }


@auth_router.get("/me")
async def me(admin: dict = Depends(require_admin)):
    return admin


@auth_router.post("/change-password")
async def change_password(data: PasswordChange, admin: dict = Depends(require_admin)):
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    doc = await _db.admins.find_one({"email": admin["email"]})
    if not verify_password(data.current_password, doc["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await _db.admins.update_one(
        {"email": admin["email"]},
        {"$set": {"password_hash": hash_password(data.new_password), "password_changed": True}},
    )
    return {"ok": True}
