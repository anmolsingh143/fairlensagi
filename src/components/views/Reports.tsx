import React from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Globe,
  Award
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '../../lib/utils';
import { FairnessMetrics } from '../../types';

interface ReportsProps {
  metrics: FairnessMetrics | null;
  datasetName: string;
  aiReport: string;
}

export default function Reports({ metrics, datasetName, aiReport }: ReportsProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("FairLens AI - Compliance Audit Report", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Dataset: ${datasetName}`, 20, 35);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 42);
    
    doc.line(20, 50, 190, 50);
    
    doc.setFontSize(16);
    doc.text("Executive Summary", 20, 65);
    
    doc.setFontSize(12);
    if (metrics) {
      doc.text(`Overall Bias Score: ${metrics.biasScore}%`, 20, 80);
      doc.text(`Fairness Health: ${100 - metrics.biasScore}%`, 20, 87);
      doc.text(`Disparate Impact Ratio: ${metrics.disparateImpact}`, 20, 94);
      doc.text(`Demographic Parity Difference: ${metrics.demographicParity}`, 20, 101);
    }
    
    doc.text("AI-Generated Audit Findings:", 20, 115);
    const splitText = doc.splitTextToSize(aiReport.replace(/[\*\#]/g, ''), 170);
    doc.text(splitText, 20, 125);
    
    doc.save(`FairLens_Audit_${datasetName.replace('.csv', '')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Compliance & Export</h2>
          <p className="text-text-muted">Generate certified fairness reports for regulatory stakeholders</p>
        </div>
        <button 
          disabled={!metrics}
          onClick={exportPDF}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export certified PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-6">
           <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Regulatory Readiness</h3>
           </div>
           
           <div className="space-y-4">
              {[
                { name: 'EU AI Act Compliance', status: 'Requirements Met', color: 'text-success' },
                { name: 'GDPR Article 22 (Automated decisions)', status: 'Requires Documentation', color: 'text-primary' },
                { name: 'NYC Law 144 (Hiring Audit)', status: 'Certified', color: 'text-success' },
                { name: 'Canadian AI & Data Act (AIDA)', status: 'Pending Review', color: 'text-text-muted' },
              ].map((reg, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-border">
                   <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-text-muted" />
                      <span className="font-medium">{reg.name}</span>
                   </div>
                   <span className={cn("text-xs font-bold px-2 py-1 bg-white/5 rounded-md", reg.color)}>
                     {reg.status}
                   </span>
                </div>
              ))}
           </div>

           <div className="p-4 bg-primary/10 rounded-xl flex items-center gap-4">
              <Award className="w-8 h-8 text-primary shrink-0" />
              <p className="text-sm">
                FairLens AI reports are designed to meet the rigorous technical documentation standards of the **EU AI Act**.
              </p>
           </div>
        </div>

        <div className="glass-card p-8">
           <h3 className="text-xl font-bold mb-6">Report Preview</h3>
           <div className="aspect-[3/4] bg-white text-black p-10 rounded shadow-inner overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <button onClick={exportPDF} className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
                    <Download className="w-5 h-5" /> Download Full PDF
                 </button>
              </div>
              <div className="space-y-6 opacity-30 select-none">
                 <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div className="w-12 h-4 bg-primary/20 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                 </div>
                 <div className="w-full h-8 bg-black/10 rounded" />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-100 rounded" />
                    <div className="h-20 bg-gray-100 rounded" />
                 </div>
                 <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                 </div>
                 <div className="h-40 bg-gray-100 rounded" />
              </div>
           </div>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
               <Globe className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold">Third-Party Verification</h4>
               <p className="text-sm text-text-muted">Share a read-only secure link with external auditors</p>
            </div>
         </div>
         <button className="px-6 py-3 border border-border rounded-xl font-semibold hover:bg-white/5 flex items-center gap-2 transition-colors">
            Generate Public Link <ExternalLink className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
}
