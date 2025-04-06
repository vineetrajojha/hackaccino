import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Mic, Activity, Brain, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { HoverEffect } from '../components/ui/card-hover-effect';

const SignLanguage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stats = [
    { icon: Activity, label: 'Gesture Recognition', value: '92%', color: 'text-green-600' },
    { icon: Brain, label: 'Translation Accuracy', value: '88%', color: 'text-blue-600' },
    { icon: Award, label: 'Response Time', value: '0.3s', color: 'text-purple-600' },
  ];

  const features = [
    {
      title: 'Real-time Translation',
      description: 'Instantly convert sign language to text and speech.',
      link: '/sign-language/translation',
    },
    {
      title: 'Gesture Analysis',
      description: 'Advanced AI analyzes hand movements and facial expressions.',
      link: '/sign-language/analysis',
    },
    {
      title: 'Learning Mode',
      description: 'Practice and improve your sign language skills with feedback.',
      link: '/sign-language/learning',
    },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const analyzeSigns = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated response
      setAnalysisResult("Hello! How are you today?");
      setConfidence(0.92);
    } catch (err) {
      setError('Failed to analyze signs. Please try again.');
      console.error('Error analyzing signs:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Sign Language Translation
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Break communication barriers with our AI-powered sign language translation system.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={stat.label} className='bg-black'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-200">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-400">{stat.value}</p>
                </div>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Feed Section */}
            <Card className="bg-black p-6">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                {!isRecording ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex gap-4">
                {!isRecording ? (
                  <Button
                    size="lg"
                    icon={<Video className="w-5 h-5" />}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600"
                    onClick={startRecording}
                  >
                    Start Recording
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      icon={<Activity className="w-5 h-5" />}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600"
                      onClick={analyzeSigns}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Signs'}
                    </Button>
                    <Button
                      size="lg"
                      color="secondary"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Analysis Results Section */}
            <Card className="bg-black p-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                Translation Results
              </h2>
              {error ? (
                <div className="text-red-500 mb-4">{error}</div>
              ) : analysisResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-200">{analysisResult}</p>
                  </div>
                  {confidence && (
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">
                        {Math.round(confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">
                  Start recording and analyzing to see translation results.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our sign language translation system can help you communicate better.
            </p>
          </div>

          <HoverEffect items={features.map(feature => ({
            ...feature,
            icon: <Mic className="w-6 h-6" />,
          }))} />
        </div>
      </div>
    </div>
  );
};

export default SignLanguage;