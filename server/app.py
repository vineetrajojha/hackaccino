from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import librosa
import soundfile as sf
import os
import tempfile
import json
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5175"}})  # Enable CORS for specific origin

# Global variables for recording state
recording_start_time = None
MAX_RECORDING_DURATION = 20  # seconds

@app.route('/start-recording', methods=['POST'])
def start_recording():
    global recording_start_time
    recording_start_time = datetime.now()
    return jsonify({"status": "recording started"})

@app.route('/recording-status', methods=['GET'])
def recording_status():
    if recording_start_time is None:
        return jsonify({"is_recording": False, "remaining_time": 0})
    
    elapsed = (datetime.now() - recording_start_time).total_seconds()
    remaining = max(0, MAX_RECORDING_DURATION - elapsed)
    return jsonify({
        "is_recording": True,
        "remaining_time": remaining
    })

@app.route('/analyze-voice', methods=['POST'])
def analyze_voice():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        audio_file = request.files['file']
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio_file.save(temp_file.name)
            
            # Load the audio file
            y, sr = librosa.load(temp_file.name, sr=22050)
            
            # Calculate metrics
            volume = np.mean(np.abs(y))
            pitch_mean = np.mean(librosa.pitch_tuning(y))
            clarity = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
            pace = len(y) / sr  # Duration in seconds
            
            # Clean up the temporary file
            os.unlink(temp_file.name)
            
            return jsonify({
                "confidence_level": "Good",
                "volume": float(volume),
                "pitch_mean": float(pitch_mean),
                "clarity": float(clarity),
                "pace": float(pace)
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000) 