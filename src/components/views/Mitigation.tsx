import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../../lib/utils';
import { FairnessMetrics, DataPoint } from '../../types';
import { applyMitigation } from '../../services/biasService';

interface MitigationProps {
  data: DataPoint[];
  currentMetrics: FairnessMetrics | null;
}

export default function Mitigation({ data, currentMetrics }: MitigationProps) {
  const [selectedMethod, setSelectedMethod] = useState<'reweighting' | 'oversampling' | 'threshold' | null>(null);
  const [mitigatedMetrics, setMitigatedMetrics] = useState<FairnessMetrics | null>(null);
  const [applying, setApplying] = useState(false);

  const methods = [
    { 
      id: 'reweighting', 
      name: 'Reweighting', 
      desc: 'Assign weights to different groups to ensure a more balanced selection rate.',
      intensity: 'Medium',
      impact: 'High Fairness, Stable Accuracy'
    },
    { 
      id: 'oversampling', 
      name: 'Oversampling', 
      desc: 'Replicate data points from underrepresented groups to equalize the distribution.',
      intensity: 'High',
      impact: 'High Fairness, Potential Overfitting'
    },
    { 
      id: 'threshold', 
      name: 'Threshold Optimization', 
      desc: 'Adjust decision boundaries for different groups to achieve parity.',
      intensity: 'Low',
      impact: 'Fast Implementation, Post-hoc'
    },
  ];

  const handleApply = () => {
    if (!selectedMethod || !currentMetrics) return;
    setApplying(true);
    
    // Simulate complex calculation
    setTimeout(() => {
      const res = applyMitigation(data, currentMetrics, selectedMethod);
      setMitigatedMetrics(res);
      setApplying(false);
    }, 1500);
  };

  const comparisonData = currentMetrics && mitigatedMetrics ? [
    { name: 'Bias Score', before: currentMetrics.biasScore, after: mitigatedMetrics.biasScore, unit: '%' },
    { name: 'Disparate Impact', before: parseFloat((currentMetrics.disparateImpact * 100).toFixed(1)), after: parseFloat((mitigatedMetrics.disparateImpact * 100).toFixed(1)), unit: '%' },
    { name: 'Demo. Parity', before: parseFloat((currentMetrics.demographicParity * 100).toFixed(1)), after: parseFloat((mitigatedMetrics.demographicParity * 100).toFixed(1)), unit: '%' },
  ] : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-4 rounded-lg shadow-xl space-y-3">
          <p className="font-bold text-white border-b border-border pb-1 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-8 items-center">
              <span className="text-text-muted text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="text-white font-bold">{entry.value}{entry.payload.unit}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <div className="flex justify-between gap-8">
              <span className="text-text-muted text-sm">Improvement:</span>
              <span className="text-success font-bold">
                {Math.abs(payload[0].value - payload[1].value).toFixed(1)}{payload[0].payload.unit}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 pb-20">
      {!currentMetrics ? (
        <div className="glass-card p-20 text-center flex flex-col items-center justify-center space-y-6">
           <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
              <Zap className="w-10 h-10 text-text-muted opacity-30" />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black italic tracking-tight">Access Restricted</h3>
             <p className="text-text-muted font-medium max-w-sm mx-auto">Please initialize a system-wide scan in the Analysis console to unlock mitigation protocols.</p>
           </div>
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">Return to Analysis</button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <section className="space-y-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                  <Zap className="w-3 h-3" /> System Optimization
                </div>
                <h3 className="text-3xl font-black tracking-tight">Mitigation Protocols</h3>
              </div>

              <div className="space-y-4">
                {methods.map((method, i) => (
                  <motion.button
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={cn(
                      "w-full glass-card p-8 text-left transition-all relative overflow-hidden group perspective-1000",
                      selectedMethod === method.id 
                        ? "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/50" 
                        : "border-white/5 hover:border-white/20"
                    )}
                  >
                    {selectedMethod === method.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-black tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{method.name}</h4>
                        <p className="text-[10px] uppercase font-black tracking-widest text-text-muted/60">Execution Framework</p>
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-lg border",
                        method.intensity === 'High' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-primary/10 text-primary border-primary/20'
                      )}>
                        {method.intensity} Load
                      </span>
                    </div>
                    <p className="text-sm font-medium text-text-muted leading-relaxed mb-6">{method.desc}</p>
                    <div className="flex items-center gap-3 py-3 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-success">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{method.impact}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button 
                disabled={!selectedMethod || applying}
                onClick={handleApply}
                className="btn-primary w-full py-6 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-primary/40 active:scale-95 transition-all"
              >
                {applying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Applying selected mitigation...
                  </>
                ) : (
                  <>
                    Apply Remediation <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </section>

            <section className="space-y-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-success font-black uppercase tracking-[0.2em] text-[10px]">
                  <TrendingUp className="w-3 h-3" /> Impact Preview
                </div>
                <h3 className="text-3xl font-black tracking-tight">Delta Analysis</h3>
              </div>
              
              <div className="glass-card p-10 min-h-[600px] flex flex-col border-white/5 bg-linear-to-b from-transparent to-white/5 pt-16 relative">
                {mitigatedMetrics ? (
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 space-y-12"
                   >
                      <div className="flex justify-between items-center px-10">
                         <div className="text-center space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pre-Audit</span>
                            <div className="text-5xl font-black tracking-tighter text-white opacity-40">{currentMetrics.biasScore}%</div>
                         </div>
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-px h-12 bg-linear-to-b from-transparent via-white/20 to-transparent" />
                            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                            <div className="w-px h-12 bg-linear-to-b from-white/20 via-white/20 to-transparent" />
                         </div>
                         <div className="text-center space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Optimized</span>
                            <div className="text-6xl font-black tracking-tighter text-success drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">{mitigatedMetrics.biasScore}%</div>
                         </div>
                      </div>

                      <div className="flex-1 w-full min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#9CA3AF" fontSize={11} fontWeight={900} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                            <Legend verticalAlign="top" height={60} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }}/>
                            <Bar dataKey="before" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} name="Pre-Mitigation" barSize={30} />
                            <Bar dataKey="after" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="Post-Mitigation" barSize={30} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-success/5 border border-success/20 rounded-2xl flex items-center gap-6 relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                         <div className="w-14 h-14 bg-success shadow-lg shadow-success/20 text-white rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-8 h-8" />
                         </div>
                         <div className="relative z-10">
                            <h4 className="font-black text-lg text-success italic leading-none mb-1">Stability Cleared</h4>
                            <p className="text-xs font-medium text-slate-300 leading-relaxed">
                              Optimization successful. Bias decreased by <span className="font-black text-success">{(currentMetrics.biasScore - mitigatedMetrics.biasScore).toFixed(1)}%</span> while maintaining model integrity.
                            </p>
                         </div>
                      </motion.div>
                   </motion.div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                    <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                       <Maximize2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest">Waiting for Deployment</p>
                      <p className="text-[10px] font-bold">Select a protocol to trigger preview</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
