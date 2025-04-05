import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Hand, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { startCamera, stopCamera, getSignPrediction } from '../services/api';

const SignLanguage = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<string[]>([]);

  useEffect(() => {
    let predictionInterval: NodeJS.Timeout;

    if (isCameraActive) {
      predictionInterval = setInterval(async () => {
        try {
          const result = await getSignPrediction();
          if (result.prediction && result.prediction !== currentPrediction) {
            setCurrentPrediction(result.prediction);
            setPredictionHistory(prev => [result.prediction, ...prev].slice(0, 3));
          }
        } catch (error) {
          console.error('Error getting prediction:', error);
          setError('Failed to get sign prediction');
        }
      }, 1000);
    }

    return () => {
      if (predictionInterval) {
        clearInterval(predictionInterval);
      }
    };
  }, [isCameraActive, currentPrediction]);

  const handleCameraToggle = async () => {
    try {
      if (isCameraActive) {
        await stopCamera();
        setIsCameraActive(false);
        setCurrentPrediction('');
      } else {
        await startCamera();
        setIsCameraActive(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      setError('Failed to toggle camera. Please check your permissions.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign Language Predictor</h1>
        <Button
          variant={isCameraActive ? 'danger' : 'primary'}
          icon={<Camera className="w-5 h-5" />}
          onClick={handleCameraToggle}
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Camera Feed</h2>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {isCameraActive ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-indigo-600">Processing...</div>
              </div>
            ) : (
              <Camera className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Prediction</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Hand className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {currentPrediction || 'No sign detected'}
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: currentPrediction ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictionHistory.map((prediction, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Hand className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">{prediction}</span>
              </div>
              <span className="text-sm text-gray-500">
                {Math.floor(index * 0.5)}m ago
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SignLanguage;