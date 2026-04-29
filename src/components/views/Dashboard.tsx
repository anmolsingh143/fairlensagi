import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { FairnessMetrics } from '../../types';

interface DashboardProps {
  metrics: FairnessMetrics | null;
  onNavigate: (view: string) => void;
}

export default function Dashboard({ metrics, onNavigate }: DashboardProps) {
  const stats = [
    { 
      label: 'Overall Fairness', 
      value: metrics ? `${100 - metrics.biasScore}%` : '--', 
      change: '+12%', 
      icon: ShieldCheck,
      color: 'text-success'
    },
    { 
      label: 'Bias Risk Score', 
      value: metrics ? `${metrics.biasScore}%` : '--', 
      change: '-5%', 
      icon: AlertTriangle,
      color: 'text-danger'
    },
    { 
      label: 'Analyzed Records', 
      value: '142,502', 
      change: '+1.2k', 
      icon: Users,
      color: 'text-primary'
    },
    { 
      label: 'Compliance Health', 
      value: '94%', 
      change: '+2%', 
      icon: TrendingUp,
      color: 'text-success'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative group perspective-1000">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card p-10 md:p-12 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-12 border-white/10"
        >
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
              <Sparkles className="w-3 h-3" />
              Intelligence Engine Active
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.9]">
              Trust starts with <br/>
              <span className="text-primary italic">Transparency.</span>
            </h1>
            <p className="text-text-muted text-lg font-medium leading-relaxed max-w-lg">
              The world's first AI-powered bias detection suite built for the modern compliance ecosystem. Scan, mitigate, and report in minutes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => onNavigate('upload')}
                className="btn-primary flex items-center gap-3 py-4 px-8 text-lg group"
              >
                Start Bias Audit <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={() => onNavigate('reports')}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                Vault Reports
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 h-80 relative flex items-center justify-center shrink-0">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
             <motion.div 
                animate={{ rotateY: [0, 15, 0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative glass-card w-56 h-56 flex flex-col items-center justify-center text-center p-6 border-white/20 shadow-primary/20"
             >
                <div className="relative">
                  <span className="text-6xl font-black text-primary tracking-tighter">{metrics ? 100 - metrics.biasScore : '--'}</span>
                  <div className="absolute -top-2 -right-4 w-3 h-3 bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                <span className="text-[10px] text-text-muted mt-2 uppercase tracking-[0.2em] font-black">Fairness Quotient</span>
                <div className="mt-6 w-full bg-white/5 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: metrics ? `${100 - metrics.biasScore}%` : '0%' }}
                    className="h-full bg-linear-to-r from-primary to-indigo-500 rounded-full"
                  />
                </div>
             </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, rotateX: 5 }}
            className="glass-card p-7 flex flex-col justify-between group cursor-default h-48 border-white/5"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-6", "bg-black/40", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Live Audits
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View History</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Hiring Model v2.4', date: '2 hours ago', status: 'Bias Detected', risk: 'High', color: 'danger' },
              { name: 'Credit Score App', date: 'Yesterday', status: 'Compliant', risk: 'Low', color: 'success' },
              { name: 'Customer Retention', date: '3 days ago', status: 'Under Review', risk: 'Medium', color: 'primary' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center justify-between p-5 glass-card group border-white/5 hover:border-white/10"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:rotate-6">
                    <div className={cn("w-2 h-2 rounded-full", `bg-${item.color}`)} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-none mb-1.5">{item.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className={cn("text-xs font-black uppercase tracking-[0.1em]", `text-${item.color}`)}>
                      {item.status}
                    </p>
                    <p className="text-[10px] text-text-muted font-bold">Level: {item.risk}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 bg-linear-to-br from-primary/10 to-indigo-500/5 border-primary/20 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-black tracking-tight">Regulatory Matrix</h3>
            </div>
            
            <div className="space-y-6 flex-1">
               {[
                 { label: 'GDPR Article 22 Compliance', done: true },
                 { label: 'EU AI Act High-Risk Tier', done: true },
                 { label: 'Algorithmic Fairness Shield', done: false },
                 { label: 'Bias Remediation Pipeline', done: false },
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      item.done ? "bg-success shadow-lg shadow-success/20 text-white" : "bg-white/5 border border-white/10"
                    )}>
                      {item.done && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-sm font-bold", item.done ? "text-white" : "text-text-muted")}>
                        {item.label}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-text-muted/60">
                        {item.done ? 'Verified' : 'In Progress'}
                      </span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:invert transition-all active:scale-95 shadow-2xl shadow-white/10">
              Run Comprehensive Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using Lucide components locally for simplicity in this snippet
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
