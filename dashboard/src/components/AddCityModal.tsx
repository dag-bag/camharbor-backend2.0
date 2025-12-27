import React, { useState } from 'react';
import { X, Code, Database, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, Server } from 'lucide-react';
import { cityApi } from '../api/cityApi';
import type { City } from '../types/city.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddCityModalProps {
  onClose: () => void;
  onSuccess: () => void;
  cityToEdit?: City | null;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ onClose, onSuccess, cityToEdit }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>(cityToEdit ? 'form' : 'json');
  const [jsonInput, setJsonInput] = useState(cityToEdit ? JSON.stringify(cityToEdit, null, 2) : '');
  const [success, setSuccess] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: cityToEdit?.name || '',
    slug: cityToEdit?.slug || '',
    display_name: cityToEdit?.display_name || '',
    state: cityToEdit?.state || '',
    country: cityToEdit?.country || 'India',
    priority: cityToEdit?.priority || 0,
    is_active: cityToEdit?.is_active ?? true
  });

  const mutation = useMutation({
    mutationFn: async (vars: { type: 'json' | 'form', data: any }) => {
      let payload = vars.data;
      if (vars.type === 'json') {
          payload = JSON.parse(vars.data);
      }
      
      if (cityToEdit) {
        // Edit Mode - Update existing
        // For JSON update, we assume single object update if valid
        const response = await cityApi.updateCity(cityToEdit.slug, payload);
         if (!response.success) throw new Error(response.error?.message || 'Update failed');
      } else {
        // Create Mode - Create new (bulk or single)
        const response = await cityApi.createCity(payload);
        if (!response.success) throw new Error(response.error?.message || 'Creation failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    }
  });

  const handleSubmitJson = async () => {
    try {
      JSON.parse(jsonInput); 
      mutation.mutate({ type: 'json', data: jsonInput });
    } catch (err) {
       mutation.mutate({ type: 'json', data: jsonInput });
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCityData: Partial<City> = {
        ...formData,
        // Preserve existing deeply nested fields if editing, else use defaults
        // For simplicity in this edit form we just merge with defaults if not present
        // In a real app we'd fetch the full object to edit deeper fields
        geo: cityToEdit?.geo || { coordinates: { lat: 0, lng: 0 }, bounds: { north: 0, south: 0, east: 0, west: 0 }, timezone: "Asia/Kolkata", area_km2: 0, population: 0, density_per_km2: 0, elevation_m: 0 },
        // ... (other defaults kept simple for brevity, ideally we merge deeply)
        tags: cityToEdit?.tags || ["managed-deployment"]
    };
    mutation.mutate({ type: 'form', data: fullCityData });
  };

  const error = mutation.error 
    ? (mutation.error instanceof SyntaxError 
        ? 'Critical: Syntax error in configuration package' 
        : (mutation.error as Error).message)
    : null;
    
  const isSubmitting = mutation.isPending;


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative glass-card rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_100px_-20px_rgba(79,70,229,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-700/50">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="text-left space-y-1 relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
              <Sparkles className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
              Node Deployment
            </h2>
            <p className="text-slate-400 text-sm font-bold tracking-widest font-mono uppercase opacity-70 pl-1">Infrastructure Expansion Interface v2.0</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all transform hover:rotate-90 duration-300 relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-black/20 gap-2 mx-8 mt-8 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('json')} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${
              activeTab === 'json' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Code className="w-4 h-4" /> 
            Source Payload
          </button>
          <button 
            onClick={() => setActiveTab('form')} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${
              activeTab === 'form' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" /> 
            Assisted Entry
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {success ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-2xl -z-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white tracking-tight">Injection Successful</h3>
                <p className="text-slate-400 font-medium text-lg">Urban identifiers have been committed to the secure ledger.</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'json' ? (
                <div className="space-y-6 h-full flex flex-col text-left">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-mono leading-relaxed flex gap-3">
                    <Server className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-400 font-black uppercase block mb-1 tracking-widest">Protocol Instruction</span>
                      Commit a high-integrity asset package. Supports bulk instantiation via JSON arrays.
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    <textarea
                      placeholder='{
  "slug": "mumbai-metropolis",
  "name": "Mumbai",
  "display_name": "MMR Region",
  ...
}'
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
                <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {[
                    { label: 'City Name', key: 'name', placeholder: 'e.g. Hyderabad' },
                    { label: 'Slug Identifier', key: 'slug', placeholder: 'e.g. hyderabad-south' },
                    { label: 'Common Interface Name', key: 'display_name', placeholder: 'e.g. Pearl City' },
                    { label: 'State Jurisdiction', key: 'state', placeholder: 'e.g. Telangana' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-3 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">{field.label}</label>
                      <input 
                        type="text" 
                        required 
                        placeholder={field.placeholder}
                        value={(formData as any)[field.key]} 
                        onChange={e => {
                          const val = e.target.value;
                          const updates: any = { [field.key]: val };
                          if (field.key === 'name') updates.slug = val.toLowerCase().replace(/ /g, '-');
                          setFormData({ ...formData, ...updates });
                        }} 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold tracking-tight" 
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2 p-6 glass-card rounded-3xl border-dashed border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setFormData({...formData, is_active: !formData.is_active})}>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Auto-Initialize Deployment</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Set node to active status upon successful commit</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                      <input 
                        type="checkbox" 
                        checked={formData.is_active} 
                        readOnly
                        className="sr-only peer" 
                      />
                      <div className="w-14 h-8 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                    </label>
                  </div>
                </form>
              )}

              {error && (
                <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-sm font-bold flex items-start gap-4 animate-in shake duration-500 text-left shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Footer */}
        {!success && (
          <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <button 
              onClick={onClose} 
              disabled={isSubmitting} 
              className="px-6 py-3 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors"
            >
              Abort Mission
            </button>
            <button
              onClick={(e) => {
                if (activeTab === 'json') {
                  handleSubmitJson();
                } else {
                   // Since button is outside form, trigger manual submit or form submission
                   // However, for 'form' tab, we relied on form onSubmit? 
                   // But button is outside. Let's just call the handler directly.
                   handleSubmitForm(e as any);
                }
              }}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Payloads...</>
              ) : (
                <><Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Initiate Commit</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCityModal;
