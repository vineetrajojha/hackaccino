import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Download, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { startVoiceRecording, stopVoiceRecording, analyzeVoice, downloadReport } from '../services/api';

const VoiceAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    volume: 0,
    pitch: 0,
    clarity: 0,
    pace: 0
  });
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          await startVoiceRecording();
          const result = await analyzeVoice(audioBlob);
          setAnalysisResult(result);
          setMetrics({
            volume: result.volume || 0,
            pitch: result.pitch || 0,
            clarity: result.clarity || 0,
            pace: result.pace || 0
          });
        } catch (error) {
          console.error('Error analyzing voice:', error);
          setError('Failed to analyze voice recording');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please check your permissions.');
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      try {
        await stopVoiceRecording();
      } catch (error) {
        console.error('Error stopping recording:', error);
        setError('Failed to stop recording');
      }
    }
  };

  const handleDownloadReport = async () => {
    try {
      const reportBlob = await downloadReport();
      const url = window.URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voice-analysis-report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Voice Analysis</h1>
        <div className="flex gap-4">
          <Button
            variant={isRecording ? 'danger' : 'primary'}
            icon={<Mic className="w-5 h-5" />}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {analysisResult && (
            <Button
              variant="secondary"
              icon={<Download className="w-5 h-5" />}
              onClick={handleDownloadReport}
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