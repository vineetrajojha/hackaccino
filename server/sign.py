# Sign Language to Text and Voice Translator (Basic Prototype)

import cv2
import mediapipe as mp
import numpy as np
import pyttsx3
import kagglehub
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time

app = Flask(__name__)
CORS(app)

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)

# Load pre-trained sign language model (for static hand signs A-Z)
try:
    model = tf.keras.models.load_model("asl_model.h5")
except:
    print("Warning: No trained model found. Using placeholder predictions.")
    model = None

classes = [chr(i) for i in range(65, 91)]  # A-Z

# MediaPipe hands setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(static_image_mode=False,
                        max_num_hands=1,
                        min_detection_confidence=0.7,
                        min_tracking_confidence=0.7)

# Global variables for camera
camera_active = False
cap = None
current_prediction = ""

def process_frame(frame):
    global current_prediction
    
    # Convert the BGR image to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process the frame with MediaPipe Hands
    results = hands.process(rgb_frame)
    
    # Draw hand landmarks
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            
            # Extract hand landmarks
            landmarks = []
            for landmark in hand_landmarks.landmark:
                landmarks.extend([landmark.x, landmark.y, landmark.z])
            
            # Make prediction if model is available
            if model is not None:
                landmarks = np.array(landmarks).reshape(1, -1)
                prediction = model.predict(landmarks)
                current_prediction = chr(65 + np.argmax(prediction))  # Convert to letter (A-Z)
            else:
                # Placeholder prediction
                current_prediction = "A"
    
    return frame

def camera_thread():
    global camera_active, cap, current_prediction
    
    cap = cv2.VideoCapture(0)
    while camera_active:
        ret, frame = cap.read()
        if ret:
            frame = process_frame(frame)
            # You can add code here to save or stream the frame
        else:
            break
        time.sleep(0.1)  # Control frame rate
    
    cap.release()
    current_prediction = ""

@app.route('/api/start-camera', methods=['POST'])
def start_camera():
    global camera_active
    if not camera_active:
        camera_active = True
        thread = threading.Thread(target=camera_thread)
        thread.start()
        return jsonify({'status': 'camera_started'})
    return jsonify({'status': 'camera_already_running'})

@app.route('/api/stop-camera', methods=['POST'])
def stop_camera():
    global camera_active
    if camera_active:
        camera_active = False
        return jsonify({'status': 'camera_stopped'})
    return jsonify({'status': 'camera_not_running'})

@app.route('/api/get-prediction', methods=['GET'])
def get_prediction():
    return jsonify({'prediction': current_prediction})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Different port from main.py