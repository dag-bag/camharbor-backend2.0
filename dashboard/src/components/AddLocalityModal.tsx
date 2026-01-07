import React, { useState, useEffect } from 'react';
import { X, Map, Database, Signal, CheckCircle2, Loader2, Sparkles, AlertCircle, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { localityApi } from '../api/localityApi';
import { cityApi } from '../api/cityApi';
import type { ILocality } from '../types/locality.types';

interface AddLocalityModalProps {
  onClose: () => void;
  localityToEdit?: ILocality | null;
}

const AddLocalityModal: React.FC<AddLocalityModalProps> = ({ onClose, localityToEdit }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'basic' | 'infra' | 'geo'>('basic');
  const [cities, setCities] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ILocality>>({
    name: '', slug: '', city_id: '', primary_pincode: '', is_active: true,
    geo: { coordinates: { lat: 19.0760, lng: 72.8777 }, bounds: {} as any }, // Default Mumbai lat/lng
    demographics: { population_density: '', avg_income_level: '', housing_type: '' },
    infrastructure: { power_stability: 'Good', internet_quality: 'Fiber', road_width: '' }
  });

  useEffect(() => {
    cityApi.getActiveCities().then(res => setCities(res.data));
    if (localityToEdit) {
        const editData = { ...localityToEdit };
        // Flatten city object if populated
        if (typeof editData.city_id === 'object' && editData.city_id !== null) {
            editData.city_id = (editData.city_id as any)._id;
        }
        setFormData(editData);
    }
  }, [localityToEdit]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<ILocality>) => {
      if (localityToEdit) await localityApi.update(localityToEdit._id, data);
      else await localityApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localities'] });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    },
    onError: (err: any) => setError(err.message || 'Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const updateField = (key: string, val: any) => {
    setFormData(prev => {
        const newData = { ...prev };
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            (newData as any)[parent] = { ...(newData as any)[parent], [child]: val };
        } else {
            (newData as any)[key] = val;
             if (key === 'name' && !localityToEdit) {
                 (newData as any).slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
             }
        }
        return newData;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative glass-card rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-500/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-700/50">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
              <Map className="w-6 h-6 text-amber-400" />
              {localityToEdit ? 'Edit Zone Data' : 'Map New Locality'}
            </h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Geographic Intelligence v2.0</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 mt-6 gap-4">
            {[
                { id: 'basic', label: 'Identity', icon: Database },
                { id: 'geo', label: 'Coordinates', icon: Map },
                { id: 'infra', label: 'Infrastructure', icon: Signal },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.id ? 'border-amber-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
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
                    <p className="text-2xl font-black text-white">Locality Mapped</p>
                </div>
            ) : (
                <form id="locality-form" onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'basic' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Locality Name</label>
                                <input required className="input-premium" value={formData.name} onChange={e => updateField('name', e.target.value)} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Parent City</label>
                                <select required className="input-premium" value={formData.city_id as string} onChange={e => updateField('city_id', e.target.value)}>
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug (URL Safe)</label>
                                <input required className="input-premium font-mono" value={formData.slug} onChange={e => updateField('slug', e.target.value)} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Pincode</label>
                                <input required className="input-premium font-mono" value={formData.primary_pincode} onChange={e => updateField('primary_pincode', e.target.value)} />
                             </div>
                        </div>
                    )}

                    {activeTab === 'infra' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl md:col-span-2">
                                <h3 className="text-amber-400 text-sm font-bold mb-4 uppercase tracking-wider">Demographic Profile</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <select className="input-premium" value={formData.demographics?.population_density} onChange={e => updateField('demographics.population_density', e.target.value)}>
                                        <option value="">Population Density</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <select className="input-premium" value={formData.demographics?.avg_income_level} onChange={e => updateField('demographics.avg_income_level', e.target.value)}>
                                        <option value="">Income Level</option>
                                        <option value="High">High</option>
                                        <option value="Middle">Middle</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <input className="input-premium" placeholder="Housing Type (e.g. Villas)" value={formData.demographics?.housing_type} onChange={e => updateField('demographics.housing_type', e.target.value)} />
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Power Stability</label>
                                <select className="input-premium" value={formData.infrastructure?.power_stability} onChange={e => updateField('infrastructure.power_stability', e.target.value)}>
                                    <option value="Good">Good</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Poor">Poor</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internet Quality</label>
                                <select className="input-premium" value={formData.infrastructure?.internet_quality} onChange={e => updateField('infrastructure.internet_quality', e.target.value)}>
                                    <option value="Fiber">Fiber</option>
                                    <option value="DSL">DSL</option>
                                    <option value="Mobile Only">Mobile Only</option>
                                </select>
                             </div>
                        </div>
                    )}

                    {activeTab === 'geo' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl md:col-span-2 flex items-center justify-center min-h-[150px] text-amber-500/50 font-black uppercase text-xl animate-pulse">
                                Interactive Map Placeholder
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latitude</label>
                                <input type="number" step="any" className="input-premium font-mono" value={formData.geo?.coordinates.lat} 
                                    onChange={e => updateField('geo.coordinates.lat', Number(e.target.value))} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Longitude</label>
                                <input type="number" step="any" className="input-premium font-mono" value={formData.geo?.coordinates.lng} 
                                    onChange={e => updateField('geo.coordinates.lng', Number(e.target.value))} />
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
                   <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Region Status:</span>
                   <button onClick={() => updateField('is_active', !formData.is_active)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${formData.is_active ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                       {formData.is_active ? 'Live' : 'Hidden'}
                   </button>
                </div>
                <button form="locality-form" type="submit" disabled={mutation.isPending} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50">
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Coordinates
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
            border-color: rgba(245, 158, 11, 0.5);
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AddLocalityModal;
