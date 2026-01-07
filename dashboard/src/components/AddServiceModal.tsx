import React, { useState, useEffect } from 'react';
import { X, Wrench, DollarSign, Settings, CheckCircle2, Loader2, Sparkles, AlertCircle, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../api/serviceApi';
import type { IService } from '../types/service.types';

interface AddServiceModalProps {
  onClose: () => void;
  serviceToEdit?: IService | null;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, serviceToEdit }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'operational'>('basic');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<IService>>({
    name: '', slug: '', type: 'installation', base_price: 0, is_active: true, priority: 0, category: '',
    warranty_months: 0, installation_time_minutes: 60, required_technician_level: 'L1', included_materials: []
  });

  useEffect(() => {
    if (serviceToEdit) setFormData(serviceToEdit);
  }, [serviceToEdit]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<IService>) => {
      if (serviceToEdit) {
        await serviceApi.master.update(serviceToEdit._id, data);
      } else {
        await serviceApi.master.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    },
    onError: (err: any) => setError(err.message || 'Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const updateField = (key: keyof IService, val: any) => {
    setFormData(prev => {
        const newData = { ...prev, [key]: val };
        if (key === 'name' && !serviceToEdit) {
             newData.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return newData;
    });
  };

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
              {serviceToEdit ? 'Configure Service' : 'New Service Protocol'}
            </h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Catalog Management v2.0</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 mt-6 gap-4">
            {[
                { id: 'basic', label: 'Identity', icon: Wrench },
                { id: 'pricing', label: 'Commercials', icon: DollarSign },
                { id: 'operational', label: 'Operations', icon: Settings }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.id ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 relative bg-slate-950/30">
            {success ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in zoom-in">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-black text-white">Service Configured</p>
                </div>
            ) : (
                <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'basic' && (
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
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category Tag</label>
                                <input className="input-premium" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="e.g. Surveillance" />
                             </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl md:col-span-2">
                                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-4">Base Commercial Value (INR)</label>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-white">₹</span>
                                    <input type="number" required className="bg-transparent text-4xl font-black text-white w-full outline-none placeholder:text-slate-700" 
                                        value={formData.base_price} onChange={e => updateField('base_price', Number(e.target.value))} />
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'operational' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Warranty Period (Months)</label>
                                <input type="number" className="input-premium" value={formData.warranty_months} onChange={e => updateField('warranty_months', Number(e.target.value))} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Duration (Mins)</label>
                                <input type="number" className="input-premium" value={formData.installation_time_minutes} onChange={e => updateField('installation_time_minutes', Number(e.target.value))} />
                             </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Tech Level</label>
                                <select className="input-premium" value={formData.required_technician_level} onChange={e => updateField('required_technician_level', e.target.value)}>
                                    <option value="L1">L1 - Basic Technician</option>
                                    <option value="L2">L2 - Advanced Engineer</option>
                                    <option value="L3">L3 - Specialist</option>
                                </select>
                             </div>
                        </div>
                    )}
                </form>
            )}
            
            {error && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-bold animate-in slide-in-from-bottom-2">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}
        </div>

        {/* Footer */}
        {!success && (
            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Status:</span>
                   <button onClick={() => updateField('is_active', !formData.is_active)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${formData.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                       {formData.is_active ? 'Active' : 'Draft'}
                   </button>
                </div>
                <button form="service-form" type="submit" disabled={mutation.isPending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Protocol
                </button>
            </div>
        )}

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
};

export default AddServiceModal;
