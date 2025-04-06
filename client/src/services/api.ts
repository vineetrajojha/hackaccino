import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const SIGN_LANGUAGE_API_URL = 'http://localhost:5001/api';

export interface VoiceAnalysisResult {
  confidence_level: string;
  confidence_score: number;
  suggestions: string[];
  pitch_mean: number;
  pitch_std: number;
  energy_mean: number;
  energy_std: number;
  pause_count: number;
  filler_count: number;
  report_pdf: string;
}

export interface SignLanguageResult {
  prediction: string;
}

// Voice Analysis API
export const analyzeVoice = async (audioFile: File): Promise<VoiceAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-voice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing voice:', error);
    throw error;
  }
};

export const startVoiceRecording = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/start-recording`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to start recording');
  }
};

export const stopVoiceRecording = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/stop-recording`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to stop recording');
  }
};

export const downloadReport = (pdfBase64: string, filename: string) => {
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,${pdfBase64}`;
  link.download = filename;
  link.click();
};

// Sign Language API
export const startCamera = async (): Promise<void> => {
  const response = await fetch(`${SIGN_LANGUAGE_API_URL}/start-camera`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to start camera');
  }
};

export const stopCamera = async (): Promise<void> => {
  const response = await fetch(`${SIGN_LANGUAGE_API_URL}/stop-camera`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to stop camera');
  }
};

export const getSignPrediction = async (): Promise<SignLanguageResult> => {
  const response = await fetch(`${SIGN_LANGUAGE_API_URL}/get-prediction`);

  if (!response.ok) {
    throw new Error('Failed to get sign prediction');
  }

  return response.json();
}; 