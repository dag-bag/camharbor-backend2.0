import React, { useState, useMemo } from 'react';
import { X, Code, FileText, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { brandApi } from '../api/brandApi';
import type { Brand } from '../types/brand.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddBrandModalProps {
  onClose: () => void;
  onSuccess: () => void;
  brandToEdit?: Brand | null;
}

const AddBrandModal: React.FC<AddBrandModalProps> = ({ onClose, onSuccess, brandToEdit }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>(brandToEdit ? 'form' : 'json');
  const [jsonInput, setJsonInput] = useState(brandToEdit ? JSON.stringify(brandToEdit, null, 2) : '');
  const [success, setSuccess] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Initial State for Form
  const [formData, setFormData] = useState<Partial<Brand>>({
    name: brandToEdit?.name || '',
    slug: brandToEdit?.slug || '',
    tagline: brandToEdit?.tagline || '',
    description: brandToEdit?.description || '',
    cover_image: brandToEdit?.cover_image || '',
    logo: {
      light: brandToEdit?.logo?.light || '',
      dark: brandToEdit?.logo?.dark || ''
    },
    status: {
      is_active: brandToEdit?.status?.is_active ?? true,
      is_authorized_dealer: brandToEdit?.status?.is_authorized_dealer ?? false,
      partner_tier: brandToEdit?.status?.partner_tier || '',
      authorization_certificate: brandToEdit?.status?.authorization_certificate || ''
    },
    support: {
      india_service_url: brandToEdit?.support?.india_service_url || '',
      india_contact_number: brandToEdit?.support?.india_contact_number || '',
      india_support_email: brandToEdit?.support?.india_support_email || '',
      whatsapp_support: brandToEdit?.support?.whatsapp_support || '',
      warranty_info: {
        policy_url: brandToEdit?.support?.warranty_info?.policy_url || '',
        text_summary: brandToEdit?.support?.warranty_info?.text_summary || '',
        is_international_valid: brandToEdit?.support?.warranty_info?.is_international_valid ?? false
      }
    },
    product_series: brandToEdit?.product_series || [],
    mount_systems: brandToEdit?.mount_systems || [],
    seo: {
      meta_title: brandToEdit?.seo?.meta_title || '',
      meta_description: brandToEdit?.seo?.meta_description || '',
      keywords: brandToEdit?.seo?.keywords || []
    },
    sort_order: brandToEdit?.sort_order || 0,
    featured: brandToEdit?.featured ?? false
  });

  // SimpleMDE options
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: "# Brand description here\n\nWrite in **Markdown** format...",
    status: ['lines', 'words'],
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"],
    autofocus: false,
    hideIcons: [],
  }), []);

  const mutation = useMutation({
    mutationFn: async (vars: { type: 'json' | 'form', data: any }) => {
      let payload = vars.data;
      if (vars.type === 'json') {
        payload = JSON.parse(vars.data);
      }

      if (brandToEdit) {
        const response = await brandApi.updateBrand(brandToEdit.slug, payload);
        if (!response.success) throw new Error(response.error || 'Update failed');
      } else {
        const response = await brandApi.createBrand(payload);
        if (!response.success) throw new Error(response.error || 'Creation failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
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
    mutation.mutate({ type: 'form', data: formData });
  };

  const error = mutation.error
    ? (mutation.error instanceof SyntaxError
      ? 'Invalid JSON format'
      : (mutation.error as Error).message)
    : null;

  const isSubmitting = mutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative glass-card rounded-[2rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_100px_-20px_rgba(79,70,229,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-700/50">

        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="text-left space-y-1 relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
              <Sparkles className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
              {brandToEdit ? 'Edit Brand' : 'Create Brand'}
            </h2>
            <p className="text-slate-400 text-sm font-bold tracking-widest font-mono uppercase opacity-70 pl-1">
              Brand Registry v1.0
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all transform hover:rotate-90 duration-300 relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-black/20 gap-2 mx-8 mt-8 rounded-2xl border border-white/5">
          <button onClick={() => setActiveTab('json')} className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${activeTab === 'json' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
            <Code className="w-4 h-4" /> JSON Editor
          </button>
          <button onClick={() => setActiveTab('form')} className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${activeTab === 'form' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
            <FileText className="w-4 h-4" /> Form Editor
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
                <h3 className="text-4xl font-black text-white tracking-tight">Success!</h3>
                <p className="text-slate-400 font-medium text-lg">Brand {brandToEdit ? 'updated' : 'created'} successfully.</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'json' ? (
                <div className="space-y-6 h-full flex flex-col text-left">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-mono leading-relaxed flex gap-3">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-400 font-black uppercase block mb-1 tracking-widest">JSON Import</span>
                      Paste brand data as JSON. Supports massive bulk imports.
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    <textarea
                      placeholder={`{ "name": "Sony", "slug": "sony", "status": { "is_active": true } }`}
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full h-full min-h-[400px] bg-black/60 border border-slate-700/50 rounded-[2rem] p-8 font-mono text-sm text-cyan-400 placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute right-8 top-8 text-slate-800 pointer-events-none group-focus-within:text-indigo-500/20 transition-colors">
                      <Code className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  
                  {/* Basic Info */}
                  <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Brand Name *</label>
                     <input type="text" required value={formData.name} 
                            onChange={e => {
                              const val = e.target.value;
                              setFormData({...formData, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')});
                            }}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold" />
                  </div>
                  
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Slug *</label>
                     <input type="text" required value={formData.slug} 
                            onChange={e => setFormData({...formData, slug: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white font-mono" />
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Tagline</label>
                     <input type="text" value={formData.tagline} 
                            onChange={e => setFormData({...formData, tagline: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white" />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Description (Markdown)</label>
                    <div className="markdown-editor-wrapper">
                      <SimpleMDE
                        value={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                        options={editorOptions}
                      />
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="md:col-span-2 p-6 glass-card rounded-3xl border border-white/10 space-y-4">
                     <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Authorization & Status</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                           <span className="text-sm font-bold text-slate-300">Active Status</span>
                           <input type="checkbox" checked={formData.status?.is_active} 
                                  onChange={e => setFormData({...formData, status: {...formData.status!, is_active: e.target.checked}})}
                                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-500 accent-indigo-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                           <span className="text-sm font-bold text-slate-300">Authorized Dealer</span>
                           <input type="checkbox" checked={formData.status?.is_authorized_dealer} 
                                  onChange={e => setFormData({...formData, status: {...formData.status!, is_authorized_dealer: e.target.checked}})}
                                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-emerald-500 accent-emerald-500" />
                        </div>
                        <div className="md:col-span-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Partner Tier</label>
                           <input type="text" placeholder="e.g. Platinum Partner" value={formData.status?.partner_tier} 
                                  onChange={e => setFormData({...formData, status: {...formData.status!, partner_tier: e.target.value}})}
                                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Support Section */}
                  <div className="md:col-span-2 p-6 glass-card rounded-3xl border border-white/10 space-y-4">
                     <h3 className="text-orange-400 font-bold uppercase tracking-widest text-xs">Support Hub</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Service URL</label>
                           <input type="url" value={formData.support?.india_service_url} 
                                  onChange={e => setFormData({...formData, support: {...formData.support!, india_service_url: e.target.value}})}
                                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Number</label>
                           <input type="text" value={formData.support?.india_contact_number} 
                                  onChange={e => setFormData({...formData, support: {...formData.support!, india_contact_number: e.target.value}})}
                                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-sm" />
                        </div>
                     </div>
                  </div>

                  {/* Images */}
                  <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Cover Image URL</label>
                     <input type="url" value={formData.cover_image} 
                            onChange={e => setFormData({...formData, cover_image: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm font-mono" />
                  </div>

                </form>
              )}

              {error && (
                <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-sm font-bold flex items-start gap-4 animate-in shake duration-500 shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <button onClick={onClose} disabled={isSubmitting} className="px-6 py-3 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors">Cancel</button>
            <button onClick={(e) => activeTab === 'json' ? handleSubmitJson() : handleSubmitForm(e as any)} disabled={isSubmitting} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-3 group disabled:opacity-50">
               {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> {brandToEdit ? 'Update' : 'Create'} Brand</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBrandModal;
