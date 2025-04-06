import { useState, ChangeEvent } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Input from './input';
import { analyzeVoice, VoiceAnalysisResult } from '../services/api';

const VoiceAnalysisApp = () => {
  const [report, setReport] = useState<VoiceAnalysisResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an audio file first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeVoice(file);
      setReport(result);
    } catch (err) {
      console.error('Error analyzing voice:', err);
      setError('Failed to analyze voice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎤 VocalEdge AI - Voice Analysis</h1>

      <Card>
        <div className="space-y-4 pt-4">
          <Input 
            type="file" 
            accept="audio/*" 
            onChange={handleFileChange}
            className="w-full"
          />
          <Button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Upload and Analyze'}
          </Button>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </Card>

      {report && (
        <Card>
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">🧠 Voice Health Report</h2>
            <p><strong>Confidence Level:</strong> {report.confidence_level} ({report.confidence_score.toFixed(1)}%)</p>
            <ProgressBar value={report.confidence_score} />
            <p><strong>Pitch:</strong> Mean = {report.pitch_mean.toFixed(1)} Hz, STD = {report.pitch_std.toFixed(2)}</p>
            <p><strong>Energy:</strong> Mean = {report.energy_mean.toFixed(5)}, STD = {report.energy_std.toFixed(5)}</p>
            <p><strong>Pauses Detected:</strong> {report.pause_count}</p>
            <p><strong>Filler Count:</strong> {report.filler_count}</p>

            <h3 className="font-semibold">🛠️ Suggestions:</h3>
            {report.suggestions.length > 0 ? (
              <ul className="list-disc pl-6">
                {report.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            ) : (
              <p>✅ Your voice sounds confident and fluent!</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceAnalysisApp;
