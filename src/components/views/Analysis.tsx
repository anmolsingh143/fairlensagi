import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  MoreVertical,
  Dna,
  ShieldAlert
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { DataPoint, FairnessMetrics, SensitiveAttributeStats } from '../../types';
import { calculateFairnessMetrics } from '../../services/biasService';
import { explainBias } from '../../services/geminiService';

interface AnalysisProps {
  data: DataPoint[];
  datasetName: string;
  onAnalysisComplete: (metrics: FairnessMetrics, report: string) => void;
}

export default function Analysis({ data, datasetName, onAnalysisComplete }: AnalysisProps) {
  const [sensitiveAttr, setSensitiveAttr] = useState<string>('');
  const [targetAttr, setTargetAttr] = useState<string>('');
  const [privilegedValue, setPrivilegedValue] = useState<string>('');
  const [results, setResults] = useState<{ metrics: FairnessMetrics; stats: SensitiveAttributeStats } | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Auto-detect attributes
  useEffect(() => {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      
      // Look for common sensitive attributes
      const potentialSensitive = keys.find(k => 
        ['gender', 'race', 'age', 'sex', 'ethnicity'].includes(k.toLowerCase())
      );
      if (potentialSensitive) setSensitiveAttr(potentialSensitive);

      // Look for target/outcome attributes
      const potentialTarget = keys.find(k => 
        ['selected', 'hired', 'approved', 'outcome', 'prediction'].includes(k.toLowerCase())
      );
      if (potentialTarget) setTargetAttr(potentialTarget);

      // Simple heuristic for privileged value (default to first seen Male if gender)
      if (potentialSensitive) {
        const values = Array.from(new Set(data.map(d => String(d[potentialSensitive]))));
        const defaultPriv = values.find(v => ['male', 'white', 'caucasian', 'young'].includes(v.toLowerCase())) || values[0];
        setPrivilegedValue(defaultPriv);
      }
    }
  }, [data]);

  const runAnalysis = async () => {
    if (!sensitiveAttr || !targetAttr || !privilegedValue) return;

    setAnalyzing(true);
    // Add a small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 800));

    const res = calculateFairnessMetrics(data, sensitiveAttr, targetAttr, privilegedValue);
    setResults(res);
    setAnalyzing(false);
    
    setLoadingAi(true);
    const report = await explainBias(res.metrics, res.stats, datasetName);
    setAiReport(report);
    setLoadingAi(false);
    
    // Sync back to parent
    onAnalysisComplete(res.metrics, report);
  };

  const totalCount = data.length;

  const chartData = results ? Object.entries(results.stats.groups).map(([name, s]) => {
    const group = s as { selectionRate: number; count: number };
    return {
      name,
      rate: parseFloat((group.selectionRate * 100).toFixed(1)),
      count: group.count,
      percentageOfTotal: parseFloat(((group.count / totalCount) * 100).toFixed(1))
    };
  }) : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-4 rounded-lg shadow-xl space-y-2">
          <p className="font-bold text-white border-b border-border pb-1 mb-2">{label}</p>
          <div className="flex justify-between gap-8">
            <span className="text-text-muted text-sm">Selection Rate:</span>
            <span className="text-primary font-bold">{data.rate}%</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-text-muted text-sm">Raw Count:</span>
            <span className="text-white font-medium">{data.count}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-text-muted text-sm">% of Total Data:</span>
            <span className="text-white font-medium">{data.percentageOfTotal}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const pieData = results ? [
    { name: 'Bias', value: results.metrics.biasScore, color: '#EF4444' },
    { name: 'Fairness', value: 100 - results.metrics.biasScore, color: '#6366F1' },
  ] : [];

  return (
    <div className="space-y-12 pb-20">
      {/* Configuration Section */}
      <section className="glass-card p-10 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-end gap-10 relative z-10">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                <Dna className="w-3 h-3" /> Sensitive Attribute
              </label>
              <select 
                value={sensitiveAttr}
                onChange={(e) => setSensitiveAttr(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-bold text-white focus:border-primary/50 transition-all outline-hidden appearance-none"
              >
                <option value="">Select Attribute</option>
                {Object.keys(data[0] || {}).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Target Column
              </label>
              <select 
                value={targetAttr}
                onChange={(e) => setTargetAttr(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-bold text-white focus:border-primary/50 transition-all outline-hidden appearance-none"
              >
                <option value="">Select Target</option>
                {Object.keys(data[0] || {}).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> Privileged Value
              </label>
              <input 
                type="text"
                value={privilegedValue}
                onChange={(e) => setPrivilegedValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 font-bold text-white focus:border-primary/50 transition-all outline-hidden"
                placeholder="e.g. Male"
              />
            </div>
          </div>
          <button 
            onClick={runAnalysis}
            disabled={analyzing || loadingAi}
            className="btn-primary flex items-center gap-3 whitespace-nowrap min-w-[200px] justify-center py-4 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/40"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Computing Matrix...
              </>
            ) : loadingAi ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Auditor active...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Initialize Scan
              </>
            )}
          </button>
        </div>
      </section>

      {results && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Bias Score', value: `${results.metrics.biasScore}%`, desc: 'Lower is better', color: 'text-primary', icon: AlertTriangle },
              { label: 'Disparate Impact', value: results.metrics.disparateImpact.toFixed(2), desc: 'Ideal: 0.8 - 1.25', color: 'text-success', icon: RefreshCw },
              { label: 'Demo. Parity', value: (results.metrics.demographicParity * 100).toFixed(1) + '%', desc: 'Acceptable < 20%', color: 'text-primary', icon: Sparkles },
              { label: 'Data Points', value: data.length.toLocaleString(), desc: 'Population size', color: 'text-white', icon: Info }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, rotateX: 2 }}
                className="glass-card p-8 border-white/5 flex flex-col justify-between h-48"
              >
                <div className="flex justify-between items-start">
                   <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">{stat.label}</p>
                   <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                   <p className="text-[10px] uppercase font-bold text-text-muted/60 mt-1">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-10 border-white/5">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    Selection Distribution
                  </h3>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#9CA3AF" unit="%" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Bar dataKey="rate" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === privilegedValue ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'} strokeWidth={0} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {aiReport && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-10 border-primary/20 bg-linear-to-br from-primary/10 to-transparent"
                >
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <Sparkles className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black tracking-tight leading-none italic">AI Bias Audit Report</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Audit Protocol v1.2</p>
                     </div>
                  </div>
                  <div className="prose prose-invert max-w-none prose-sm font-medium leading-relaxed text-slate-300">
                    <ReactMarkdown>{aiReport}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-8 h-full">
              <div className="glass-card p-10 border-white/5 flex flex-col items-center text-center">
                 <h3 className="text-lg font-black uppercase tracking-widest text-text-muted mb-8">Risk Landscape</h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-4 w-full mt-6">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{item.name} Factor</span>
                        <span className="font-black text-white">{item.value}%</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card p-8 border-white/5 bg-linear-to-b from-transparent to-white/5">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-danger" /> Integrity Constraints
                 </h4>
                 <div className="space-y-4">
                    {[
                      'Privileged Group Disparity',
                      'Dataset Skew Factor',
                      'Compliance Thresholds',
                      'Validation Protocols',
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 grow">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <span className="text-xs font-bold text-text-muted">{text}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
