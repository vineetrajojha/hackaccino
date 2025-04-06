from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from main import process_audio_file, record_and_process
from modules.sign_language import SignLanguageProcessor
import os
import tempfile
import asyncio
from datetime import datetime
import traceback

app = FastAPI()

# Configure CORS - more permissive for development
app.add_middleware(
    CORSMiddleware,
   allow_origins=["http://localhost:5175"]
 # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Initialize processors
sign_processor = SignLanguageProcessor()

# Global variable to track recording state
is_recording = False
recording_start_time = None

@app.post("/start-recording")
async def start_recording():
    global is_recording, recording_start_time
    if not is_recording:
        is_recording = True
        recording_start_time = datetime.now()
        return {"status": "recording_started"}
    return {"status": "already_recording"}

@app.post("/stop-recording")
async def stop_recording():
    global is_recording, recording_start_time
    if is_recording:
        is_recording = False
        recording_start_time = None
        return {"status": "recording_stopped"}
    return {"status": "not_recording"}

@app.get("/recording-status")
async def get_recording_status():
    global is_recording, recording_start_time
    if is_recording:
        elapsed = (datetime.now() - recording_start_time).total_seconds()
        return {
            "is_recording": True,
            "elapsed_time": elapsed,
            "remaining_time": max(0, 20 - elapsed)
        }
    return {"is_recording": False}

@app.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Get file extension from content type
    content_type = file.content_type
    if content_type == "audio/webm":
        extension = ".webm"
    elif content_type == "audio/ogg":
        extension = ".ogg"
    elif content_type == "audio/mp4":
        extension = ".mp4"
    else:
        extension = ".wav"  # Default to wav

    temp_file_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            content = await file.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty audio file")
            temp_file.write(content)
            temp_file_path = temp_file.name

        # Process the audio file
        try:
            (confidence_level, confidence_score, suggestions, 
             pitch_mean, pitch_std, energy_mean, energy_std, 
             pause_count, filler_count), y, sr = process_audio_file(temp_file_path)
        except Exception as e:
            print(f"Error in process_audio_file: {str(e)}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
        
        return {
            "confidence_level": confidence_level,
            "confidence_score": confidence_score,
            "suggestions": suggestions,
            "pitch_mean": pitch_mean,
            "pitch_std": pitch_std,
            "energy_mean": energy_mean,
            "energy_std": energy_std,
            "pause_count": pause_count,
            "filler_count": filler_count,
            "volume": int(energy_mean * 100),  # Convert to percentage
            "clarity": int(100 - (filler_count * 10)),  # Convert to percentage
            "pace": int(100 - (pause_count * 15))  # Convert to percentage
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass

@app.post("/analyze-sign-language")
async def analyze_sign_language(video: UploadFile = File(...)):
    """
    Analyze sign language video and return detected gestures
    """
    if not video:
        raise HTTPException(status_code=400, detail="No video file uploaded")
        
    # Accept common video formats
    allowed_types = ['video/mp4', 'video/mpeg', 'video/x-msvideo', 'video/quicktime', 'application/octet-stream']
    if video.content_type not in allowed_types:
        print(f"Content type: {video.content_type}")
        # Try to determine if it's a video by the file extension
        if not video.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mpeg', '.mpg')):
            raise HTTPException(status_code=400, detail="File must be a video")
        
    try:
        result = await sign_processor.process_video(video)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        print(f"Error processing sign language video: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 