import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, Check, AlertCircle, X, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { DataPoint } from '../../types';

interface UploadProps {
  onDataLoaded: (data: DataPoint[], fileName: string) => void;
}

export default function Upload({ onDataLoaded }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = () => {
    if (!file) return;
    setParsing(true);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setParsing(false);
        onDataLoaded(results.data as DataPoint[], file.name);
      },
      error: (error) => {
        setParsing(false);
        console.error("Error parsing CSV:", error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted"
        >
          <FileText className="w-3 h-3" />
          Secure Data Ingestion
        </motion.div>
        <h2 className="text-4xl font-black tracking-tight leading-none">Upload Your Dataset</h2>
        <p className="text-text-muted font-medium max-w-lg mx-auto">Import your model predictions or raw data in CSV format to trigger the FairLens AI analysis engine.</p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "relative glass-card p-12 transition-all duration-500 flex flex-col items-center justify-center text-center gap-6 min-h-[450px] border-white/5 group perspective-1000",
          dragActive ? "border-primary/50 bg-primary/5 scale-[1.02]" : "hover:border-white/20",
          file ? "bg-primary/5 border-primary/20" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept=".csv"
          onChange={handleChange}
        />

        {!file ? (
          <>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-linear-to-br from-primary/20 to-indigo-600/20 rounded-3xl flex items-center justify-center mb-4 border border-white/10 shadow-2xl shadow-primary/20"
            >
              <UploadIcon className="w-10 h-10 text-primary" />
            </motion.div>
            <div className="space-y-2 relative z-10">
              <p className="text-2xl font-black tracking-tight">Drag and drop your CSV here</p>
              <p className="text-text-muted font-medium">or <button onClick={() => inputRef.current?.click()} className="text-primary hover:underline font-bold transition-all">browse intelligence vault</button></p>
            </div>
            <div className="flex gap-8 mt-8 opacity-40">
               <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-tighter">Max Size</span>
                  <span className="text-xs font-bold text-white">50MB</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-tighter">Format</span>
                  <span className="text-xs font-bold text-white">CSV / XLSX</span>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-tighter">Encryption</span>
                  <span className="text-xs font-bold text-white">AES-256</span>
               </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full max-w-sm relative z-10">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-success/20 rounded-3xl flex items-center justify-center border border-success/30 shadow-2xl shadow-success/20"
            >
              <FileText className="w-10 h-10 text-success" />
            </motion.div>
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-left">
                   <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Target File</p>
                   <p className="font-bold text-lg truncate max-w-[200px]">{file.name}</p>
                </div>
                <button onClick={() => setFile(null)} className="p-2 bg-white/5 rounded-xl text-text-muted hover:text-danger border border-white/5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-full bg-success rounded-full" 
                />
              </div>
            </div>
            <button 
              onClick={processFile}
              disabled={parsing}
              className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 active:scale-95 transition-all"
            >
              {parsing ? (
                <span className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Decrypting & Parsing...
                </span>
              ) : "Initialize Analysis"}
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            icon: Check, 
            title: "Local Execution", 
            desc: "Data never leaves your browser. All bias computations are executed on your local CPU via FairLens Edge.",
            color: "primary"
          },
          { 
            icon: AlertCircle, 
            title: "Auto-Discovery", 
            desc: "Our neural engine automatically maps sensitive attributes and model outcomes from your schema.",
            color: "danger"
          }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 flex gap-6 border-white/5"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg", `bg-${feat.color}/10`, `text-${feat.color}`)}>
               <feat.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tight mb-2">{feat.title}</h4>
              <p className="text-sm text-text-muted font-medium leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
