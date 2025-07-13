from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv
from typing import Optional
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Spotify Clone API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify OAuth configuration
def get_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("REDIRECT_URI"),
        scope="user-read-playback-state user-modify-playback-state user-read-private streaming user-read-currently-playing user-library-read playlist-read-private"
    )

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Spotify Clone API is running"}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Authentication endpoints
@app.get("/api/auth/login")
async def spotify_login():
    try:
        sp_oauth = get_spotify_oauth()
        auth_url = sp_oauth.get_authorize_url()
        logger.info(f"Generated auth URL: {auth_url}")
        return {"auth_url": auth_url}
    except Exception as e:
        logger.error(f"Error generating auth URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating auth URL: {str(e)}")

@app.get("/api/auth/callback")
async def spotify_callback(code: str):
    try:
        sp_oauth = get_spotify_oauth()
        token_info = sp_oauth.get_access_token(code)
        
        if not token_info:
            raise HTTPException(status_code=400, detail="Failed to get access token")
            
        logger.info("Successfully obtained access token")
        return {
            "access_token": token_info["access_token"], 
            "refresh_token": token_info["refresh_token"],
            "expires_in": token_info.get("expires_in", 3600)
        }
    except Exception as e:
        logger.error(f"Error in auth callback: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error in auth callback: {str(e)}")

@app.post("/api/auth/refresh")
async def refresh_token(request: Request):
    try:
        body = await request.json()
        refresh_token = body.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Refresh token is required")
            
        sp_oauth = get_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(refresh_token)
        
        return {
            "access_token": token_info["access_token"],
            "expires_in": token_info.get("expires_in", 3600)
        }
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error refreshing token: {str(e)}")

# User profile endpoint
@app.get("/api/user/profile")
async def get_user_profile(authorization: str = Depends(lambda request: request.headers.get("Authorization"))):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        sp = spotipy.Spotify(auth=access_token)
        
        profile = sp.me()
        return {
            "id": profile["id"],
            "display_name": profile.get("display_name", "User"),
            "email": profile.get("email", ""),
            "product": profile.get("product", "free"),
            "is_premium": profile.get("product") == "premium",
            "images": profile.get("images", []),
            "followers": profile.get("followers", {}).get("total", 0)
        }
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting user profile: {str(e)}")

# Search endpoint
@app.get("/api/search")
async def search_tracks(
    q: str, 
    type: str = "track",
    limit: int = 20,
    authorization: str = Depends(lambda request: request.headers.get("Authorization"))
):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        sp = spotipy.Spotify(auth=access_token)
        
        results = sp.search(q, limit=limit, type=type)
        return results
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error in search: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spotify API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error in search: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in search: {str(e)}")

# Playback control endpoints
@app.post("/api/play")
async def start_playback(
    request: Request,
    authorization: str = Depends(lambda request: request.headers.get("Authorization"))
):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        body = await request.json()
        
        track_uri = body.get("track_uri")
        position_ms = body.get("position_ms", 0)
        device_id = body.get("device_id")
        
        if not track_uri:
            raise HTTPException(status_code=400, detail="track_uri is required")
            
        sp = spotipy.Spotify(auth=access_token)
        
        play_kwargs = {
            "uris": [track_uri],
            "position_ms": position_ms
        }
        
        if device_id:
            play_kwargs["device_id"] = device_id
            
        sp.start_playback(**play_kwargs)
        
        return {
            "status": "playing", 
            "position_ms": position_ms,
            "track_uri": track_uri
        }
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error in play: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spotify API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error starting playback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error starting playback: {str(e)}")

@app.post("/api/pause")
async def pause_playback(
    request: Request,
    authorization: str = Depends(lambda request: request.headers.get("Authorization"))
):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        body = await request.json()
        device_id = body.get("device_id")
        
        sp = spotipy.Spotify(auth=access_token)
        
        if device_id:
            sp.pause_playback(device_id=device_id)
        else:
            sp.pause_playback()
            
        return {"status": "paused"}
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error in pause: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spotify API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error pausing playback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error pausing playback: {str(e)}")

@app.get("/api/playback/state")
async def get_playback_state(authorization: str = Depends(lambda request: request.headers.get("Authorization"))):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        sp = spotipy.Spotify(auth=access_token)
        
        state = sp.current_playback()
        return state
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error getting playback state: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spotify API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error getting playback state: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting playback state: {str(e)}")

# Get user's devices
@app.get("/api/devices")
async def get_devices(authorization: str = Depends(lambda request: request.headers.get("Authorization"))):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
            
        access_token = authorization.replace("Bearer ", "")
        sp = spotipy.Spotify(auth=access_token)
        
        devices = sp.devices()
        return devices
    except spotipy.exceptions.SpotifyException as e:
        logger.error(f"Spotify API error getting devices: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spotify API error: {str(e)}")
    except Exception as e:
        logger.error(f"Error getting devices: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting devices: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )