import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  ShieldAlert, 
  Activity, 
  FileText,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Data', icon: Upload },
  { id: 'analysis', label: 'Bias Analysis', icon: Search },
  { id: 'mitigation', label: 'Mitigation', icon: ShieldAlert },
  { id: 'monitor', label: 'Live Monitor', icon: Activity },
  { id: 'reports', label: 'Compliance', icon: FileText },
];

interface AppLayoutProps {
  currentView: string;
  onViewChange: (id: string) => void;
  children: React.ReactNode;
}

export default function AppLayout({ currentView, onViewChange, children }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden selection:bg-primary/30 selection:text-white">
      {/* Sidebar */}
      <aside 
        className={cn(
          "m-4 mr-0 glass-card transition-all duration-500 flex flex-col z-20 overflow-hidden",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-white/60"
            >
              FairLens AI
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                currentView === item.id 
                  ? "bg-white/10 text-white shadow-inner shadow-white/5" 
                  : "text-text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              {currentView === item.id && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", currentView === item.id ? "text-primary" : "")} />
              {isOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-white/5 transition-all duration-300"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {isOpen && <span className="font-medium text-sm">Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden perspective-1000">
        <header className="h-20 flex items-center px-8 bg-transparent sticky top-0 z-10 justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold capitalize tracking-tight">{currentView.replace('-', ' ')}</h2>
            <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-widest font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              System Online • v1.0.4
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-white">Enterprise Tier</span>
              <span className="text-[10px] text-primary uppercase font-black tracking-tighter">Compliance Officer</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-primary/30 to-indigo-500/30 border border-white/10 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <span className="text-primary font-black text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <motion.div 
            layout
            className="max-w-7xl mx-auto space-y-8 pb-12"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
