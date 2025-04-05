import { useState, ChangeEvent } from 'react';
import Button  from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Input from './input';

interface VoiceReport {
  level: string;
  score: number;
  suggestions: string[];
  pitch_mean: number;
  pitch_std: number;
  energy_mean: number;
  energy_std: number;
  pause_count: number;
  filler_count: number;
  spectrogram_url?: string;
}

const VoiceAnalysisApp = () => {
  const [report, setReport] = useState<VoiceReport | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data: VoiceReport = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎤 VocalEdge AI - Voice Analysis</h1>

      <Card>
        <div className="space-y-4 pt-4">
          <Input type="file" accept="audio/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? 'Analyzing...' : 'Upload and Analyze'}
          </Button>
        </div>
      </Card>

      {report && (
        <Card>
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">🧠 Voice Health Report</h2>
            <p><strong>Confidence Level:</strong> {report.level} ({report.score}%)</p>
            <ProgressBar value={report.score} />
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

            {report.spectrogram_url && (
              <div className="mt-4">
                <h3 className="font-semibold">📊 Spectrogram</h3>
                <img src={report.spectrogram_url} alt="Spectrogram" className="rounded shadow-lg" />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceAnalysisApp;
