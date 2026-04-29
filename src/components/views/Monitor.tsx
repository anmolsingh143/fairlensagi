import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Monitor() {
  const driftData = [
    { time: 'Jan', fairness: 94, accuracy: 92 },
    { time: 'Feb', fairness: 93, accuracy: 92 },
    { time: 'Mar', fairness: 88, accuracy: 91 },
    { time: 'Apr', fairness: 82, accuracy: 89 },
    { time: 'May', fairness: 85, accuracy: 90 },
    { time: 'Jun', fairness: 81, accuracy: 88 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Live Model Monitoring</h2>
          <p className="text-text-muted">Tracking fairness drift and disparate impact in production</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" /> Alerts
           </button>
           <button className="btn-primary">Connect Live SDK</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold">Fairness vs. Accuracy Drift</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-primary" />
                       <span className="text-xs text-text-muted">Fairness</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-success" />
                       <span className="text-xs text-text-muted">Accuracy</span>
                    </div>
                 </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={driftData}>
                    <defs>
                      <linearGradient id="colorFairness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121826', border: '1px solid #1F2937' }}
                      itemStyle={{ color: '#F9FAFB' }}
                    />
                    <Area type="monotone" dataKey="fairness" stroke="#6366F1" fillOpacity={1} fill="url(#colorFairness)" strokeWidth={3} />
                    <Area type="monotone" dataKey="accuracy" stroke="#22C55E" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={1} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-6">Environment Pulse</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: 'Latency', value: '42ms', status: 'Optimal' },
                   { label: 'Throughput', value: '1.2k/s', status: 'Stable' },
                   { label: 'Error Rate', value: '0.01%', status: 'Minimal' },
                   { label: 'Retries', value: '0', status: 'None' },
                 ].map((p, i) => (
                   <div key={i} className="p-4 bg-black/20 rounded-xl border border-border">
                      <p className="text-xs text-text-muted font-medium mb-1">{p.label}</p>
                      <p className="text-lg font-bold">{p.value}</p>
                      <p className="text-[10px] text-success font-semibold flex items-center gap-1">
                        <CheckCircle className="w-2 h-2" /> {p.status}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 border-danger/30 bg-danger/5">
              <div className="flex items-center gap-3 mb-4">
                 <AlertTriangle className="text-danger w-6 h-6" />
                 <h4 className="font-bold">Active drift alert</h4>
              </div>
              <p className="text-sm text-text-muted mb-6">
                Fairness score for "Group: Age 50+" decreased by 12% in the last 24 hours. Demographic parity difference is above threshold.
              </p>
              <button className="w-full py-2 bg-danger text-white rounded-lg font-bold hover:bg-danger/90 transition-colors">
                 Investigate Issue
              </button>
           </div>

           <div className="glass-card p-6">
              <h4 className="font-bold mb-4">Model Health List</h4>
              <div className="space-y-4">
                 {[
                   { name: 'Predictor_Alpha', heath: 98 },
                   { name: 'Risk_Scanner_v4', heath: 82 },
                   { name: 'Retention_Bot', heath: 99 },
                 ].map((m, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-xs">
                          <span className="font-medium">{m.name}</span>
                          <span className={cn(m.heath < 85 ? "text-danger" : "text-success")}>{m.heath}%</span>
                       </div>
                       <div className="w-full bg-border h-1.5 rounded-full">
                          <div 
                            className={cn("h-full rounded-full", m.heath < 85 ? "bg-danger" : "bg-success")}
                            style={{ width: `${m.heath}%` }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
              <Activity className="w-10 h-10 text-primary opacity-50" />
              <div>
                 <h4 className="font-bold">Automated Retraining</h4>
                 <p className="text-xs text-text-muted">Next scheduled optimization: 24h 12m</p>
              </div>
              <button className="w-full py-2 border border-border rounded-lg text-sm hover:bg-white/5 transition-colors">
                 Schedule Now
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
