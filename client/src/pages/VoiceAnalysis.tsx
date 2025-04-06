import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Download, AlertCircle, MicOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

interface VoiceMetrics {
  volume: number;
  pitch: number;
  clarity: number;
  pace: number;
}

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    volume: 0,
    pitch: 0,
    clarity: 0,
    pace: 0
  });
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(20);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check microphone permission status on component mount
    checkMicrophonePermission();
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, [isRecording]);

  const checkMicrophonePermission = async () => {
    try {
      // First check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support audio recording. Please try a different browser.');
        return;
      }

      // Try to get a media stream to check permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasMicrophonePermission(true);
      setError(null);
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setHasMicrophonePermission(false);
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setHasMicrophonePermission(true);
      setError(null);
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setHasMicrophonePermission(false);
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  const checkRecordingStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recording-status`);
      if (response.data.is_recording) {
        setRemainingTime(Math.floor(response.data.remaining_time));
        if (response.data.remaining_time <= 0) {
          handleStopRecording();
        }
      }
    } catch (error) {
      console.error('Error checking recording status:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      console.log('Starting recording process...');
      
      // First check permissions again
      await checkMicrophonePermission();
      if (!hasMicrophonePermission) {
        console.log('No microphone permission');
        return;
      }

      console.log('Starting backend recording...');
      // Start recording on the backend
      const backendResponse = await axios.post(`${API_BASE_URL}/start-recording`);
      console.log('Backend recording started:', backendResponse.data);
      
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 22050  // Match the backend sample rate
        } 
      });
      console.log('Microphone access granted, creating MediaRecorder...');
      
      // Check supported MIME types
      const mimeTypes = ['audio/webm', 'audio/ogg', 'audio/mp4'];
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio MIME type found. Please try a different browser.');
      }
      
      console.log('Using MIME type:', selectedMimeType);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          console.log('Recording stopped, processing audio...');
          const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
          const formData = new FormData();
          formData.append('file', audioBlob);

          console.log('Sending audio for analysis...');
          const response = await axios.post(`${API_BASE_URL}/analyze-voice`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Analysis complete:', response.data);

          setAnalysisResult(response.data.confidence_level);
          setMetrics({
            volume: response.data.volume,
            pitch: response.data.pitch_mean,
            clarity: response.data.clarity,
            pace: response.data.pace
          });
        } catch (error) {
          console.error('Error analyzing voice:', error);
          if (axios.isAxiosError(error)) {
            if (error.response) {
              setError(`Failed to analyze voice: ${error.response.data.detail || error.message}`);
            } else if (error.request) {
              setError('Failed to reach the server. Please check your internet connection.');
            } else {
              setError('Failed to analyze voice: ' + error.message);
            }
          } else {
            setError('Failed to analyze voice: ' + (error as Error).message);
          }
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Error during recording: ' + event.error.message);
      };

      console.log('Starting MediaRecorder...');
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(null);
      setRemainingTime(20);
      
      // Start checking recording status every second
      statusCheckInterval.current = setInterval(checkRecordingStatus, 1000);
    } catch (error) {
      console.error('Error in handleStartRecording:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`Failed to start recording: ${error.response.data.detail || error.message}`);
        } else if (error.request) {
          setError('Failed to reach the server. Please check your internet connection.');
        } else {
          setError('Failed to start recording: ' + error.message);
        }
      } else {
        setError('Failed to start recording: ' + (error as Error).message);
      }
      setHasMicrophonePermission(false);
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRemainingTime(20);
      
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }

      try {
        await axios.post(`${API_BASE_URL}/stop-recording`);
      } catch (error) {
        console.error('Error stopping recording:', error);
        setError('Failed to stop recording');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Voice Analysis</h1>
        <div className="flex gap-4">
          {hasMicrophonePermission === false && (
            <Button
              variant="primary"
              icon={<MicOff className="w-5 h-5" />}
              onClick={requestMicrophonePermission}
            >
              Allow Microphone Access
            </Button>
          )}
          {hasMicrophonePermission !== false && (
            <Button
              variant={isRecording ? 'danger' : 'primary'}
              icon={<Mic className="w-5 h-5" />}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={!hasMicrophonePermission}
            >
              {isRecording ? `Stop Recording (${remainingTime}s)` : 'Start Recording'}
            </Button>
          )}
          {analysisResult && (
            <Button
              variant="secondary"
              icon={<Download className="w-5 h-5" />}
              onClick={() => window.print()}
            >
              Download Report
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {hasMicrophonePermission === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">Microphone Access Required</h3>
          <p className="text-yellow-700">
            To use the voice analysis feature, please allow microphone access in your browser.
            Click the "Allow Microphone Access" button above and grant permission when prompted.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Volume</h3>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${metrics.volume}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{metrics.volume}%</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pitch</h3>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${metrics.pitch}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{metrics.pitch}%</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Clarity</h3>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${metrics.clarity}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{metrics.clarity}%</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pace</h3>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${metrics.pace}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{metrics.pace}%</p>
        </Card>
      </div>

      {analysisResult && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600">{analysisResult}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceAnalysis;