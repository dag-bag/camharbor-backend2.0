import React, { useState, useEffect } from 'react';
import { X, Wrench, DollarSign, Settings, CheckCircle2, Loader2, Sparkles, AlertCircle, Save, Code, Database, Server } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService, updateService } from '../services/serviceApi';
import type { Service } from '../types/service.types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service;
}

export function AddServiceModal({ isOpen, onClose, service }: AddServiceModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'json' | 'form'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    name: '', slug: '', type: 'installation', base_price: 0, is_active: true, priority: 0, category: ''
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
      setJsonInput(JSON.stringify(service, null, 2));
    } else {
      setFormData({ name: '', slug: '', type: 'installation', base_price: 0, is_active: true, priority: 0, category: '' });
      setJsonInput('');
    }
    setError(null);
  }, [service, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => service ? updateService(service._id, data) : createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onClose();
    },
    onError: (err: any) => setError(err.message || 'Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'form') {
      mutation.mutate(formData);
    } else {
      try {
        const parsedData = JSON.parse(jsonInput);
        mutation.mutate(parsedData);
      } catch (err) {
        setError('Invalid JSON format');
      }
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative glass-card rounded-[2rem] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-500/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-700/50">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Catalog Management v2.0</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-black/20 gap-2 mx-8 mt-8 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('json')} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${
              activeTab === 'json' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Code className="w-4 h-4" /> 
            JSON Payload
          </button>
          <button 
            onClick={() => setActiveTab('form')} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${
              activeTab === 'form' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" /> 
            Form Entry
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-8 relative bg-slate-950/30">
            {activeTab === 'json' ? (
                <div className="space-y-6 h-full flex flex-col text-left">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-mono leading-relaxed flex gap-3">
                    <Server className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-400 font-black uppercase block mb-1 tracking-widest">Protocol Instruction</span>
                      Submit service configuration as JSON. Supports bulk import via arrays.
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    <textarea
                      placeholder={`{
  "name": "CCTV Installation",
  "slug": "cctv-install",
  "type": "installation",
  "base_price": 5000,
  ...
}`}
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full min-h-[350px] bg-black/60 border border-slate-700/50 rounded-[2rem] p-8 font-mono text-sm text-cyan-400 placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute right-8 top-8 text-slate-800 pointer-events-none group-focus-within:text-indigo-500/20 transition-colors">
                      <Code className="w-8 h-8" />
                    </div>
                  </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeTab === 'form' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Name</label>
                                <input required className="input-premium" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. CCTV Installation" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug Identifier</label>
                                <input required className="input-premium font-mono text-xs" value={formData.slug} onChange={e => updateField('slug', e.target.value)} placeholder="cctv-installation" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Type</label>
                                <select className="input-premium" value={formData.type} onChange={e => updateField('type', e.target.value)}>
                                    {['installation', 'repair', 'amc', 'rental', 'consultation'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Price (₹)</label>
                                <input type="number" required className="input-premium" value={formData.base_price} onChange={e => updateField('base_price', Number(e.target.value))} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category Tag</label>
                                <input className="input-premium" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="e.g. Surveillance" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warranty (Months)</label>
                                <input type="number" className="input-premium" value={formData.warranty_months} onChange={e => updateField('warranty_months', Number(e.target.value))} />
                             </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-bold animate-in slide-in-from-bottom-2">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                 <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Status:</span>
                 <button type="button" onClick={() => updateField('is_active', !formData.is_active)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${formData.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                     {formData.is_active ? 'Active' : 'Draft'}
                 </button>
              </div>
              <button 
                type="submit"
                disabled={mutation.isPending} 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {service ? 'Update Service' : 'Create Service'}
              </button>
          </div>
        </form>

      </div>

      <style>{`
        .input-premium {
            width: 100%;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 1rem;
            padding: 1rem;
            color: white;
            font-weight: 500;
            outline: none;
            transition: all 0.2s;
        }
        .input-premium:focus {
            background: rgba(255,255,255,0.05);
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </div>
  );
}
