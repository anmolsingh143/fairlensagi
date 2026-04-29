import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './components/views/Dashboard';
import Upload from './components/views/Upload';
import Analysis from './components/views/Analysis';
import Mitigation from './components/views/Mitigation';
import Monitor from './components/views/Monitor';
import Reports from './components/views/Reports';
import { DataPoint, FairnessMetrics } from './types';
import { SAMPLE_DATA, calculateFairnessMetrics } from './services/biasService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState<DataPoint[]>([]);
  const [fileName, setFileName] = useState('');
  const [metrics, setMetrics] = useState<FairnessMetrics | null>(null);
  const [aiReport, setAiReport] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Load sample data initially but keep it clean for user flow
  useEffect(() => {
    const timer = setTimeout(() => {
      // Just showing we have sample data available internally
      // But we let the user "Upload" it for a better flow
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDataLoaded = (uploadedData: DataPoint[], name: string) => {
    setData(uploadedData);
    setFileName(name);
    // Reset metrics on new data
    setMetrics(null);
    setAiReport('');
    setView('analysis');
  };

  const loadSample = () => {
    setData(SAMPLE_DATA);
    setFileName('hiring_snapshot_biased.csv');
    setMetrics(null);
    setAiReport('');
    setView('analysis');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard metrics={metrics} onNavigate={setView} />;
      case 'upload':
        return (
          <div className="space-y-12">
            <Upload onDataLoaded={handleDataLoaded} />
            <div className="text-center pt-8 border-t border-border">
              <p className="text-text-muted mb-4">Don't have a dataset? Start with our pre-biased snapshot.</p>
              <button 
                onClick={loadSample}
                className="px-6 py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/5 font-medium transition-colors"
              >
                Load Sample Hiring Data
              </button>
            </div>
          </div>
        );
      case 'analysis':
        return data.length > 0 ? (
          <Analysis 
            data={data} 
            datasetName={fileName} 
            onAnalysisComplete={(m, r) => {
              setMetrics(m);
              setAiReport(r);
            }} 
          />
        ) : (
          <div className="text-center py-20 bg-card/30 rounded-2xl border border-dashed border-border">
            <p className="text-text-muted mb-4 text-lg">No dataset loaded for analysis.</p>
            <button onClick={() => setView('upload')} className="btn-primary">Go to Upload</button>
          </div>
        );
      case 'mitigation':
        // For Mitigation, we can pass metrics if they exist or calculate them if not yet analyzed
        return <Mitigation data={data} currentMetrics={metrics} />;
      case 'monitor':
        return <Monitor />;
      case 'reports':
        return <Reports metrics={metrics} datasetName={fileName} aiReport={aiReport} />;
      default:
        return <Dashboard metrics={metrics} onNavigate={setView} />;
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 bg-primary rounded-2xl rotate-12 flex items-center justify-center animate-bounce shadow-2xl shadow-primary/20">
          <div className="w-8 h-8 rounded-full border-4 border-white border-t-transparent animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tighter">FairLens AI</h1>
          <p className="text-text-muted animate-pulse">Initializing trust engine...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout currentView={view} onViewChange={setView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
