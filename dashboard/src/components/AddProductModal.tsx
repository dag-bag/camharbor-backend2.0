import React, { useState, useEffect } from 'react';
import { X, Box, Tag, Truck, CheckCircle2, Loader2, Sparkles, AlertCircle, Save, Package } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import type { IProduct } from '../types/product.types';

interface AddProductModalProps {
  onClose: () => void;
  productToEdit?: IProduct | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, productToEdit }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'info' | 'inventory'>('info');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: '', slug: '', category: '', brand: '', product_model: '', base_price: 0, is_active: true,
    stock_status: 'in_stock', min_order_quantity: 1, supplier: { name: '', lead_time_days: 0 },
    specs: {}
  });

  useEffect(() => {
    if (productToEdit) setFormData(productToEdit);
  }, [productToEdit]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<IProduct>) => {
      if (productToEdit) await productApi.master.update(productToEdit._id, data);
      else await productApi.master.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    },
    onError: (err: any) => setError(err.message || 'Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const updateField = (key: keyof IProduct, val: any) => {
    setFormData(prev => {
        const newData = { ...prev, [key]: val };
        if (key === 'name' && !productToEdit) {
             newData.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
              <Package className="w-6 h-6 text-cyan-400" />
              {productToEdit ? 'Modify Asset' : 'Register Inventory'}
            </h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Supply Chain Control v2.0</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 mt-6 gap-4">
            {[
                { id: 'info', label: 'Asset Specifics', icon: Box },
                { id: 'inventory', label: 'Supply Chain', icon: Truck },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.id ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
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
                    <p className="text-2xl font-black text-white">Asset Registered</p>
                </div>
            ) : (
                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Name</label>
                                <input required className="input-premium" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Hikvision 2MP Dome" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                                <input required className="input-premium" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="Surveillance Camera" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing (INR)</label>
                                <input required type="number" className="input-premium font-mono" value={formData.base_price} onChange={e => updateField('base_price', Number(e.target.value))} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand</label>
                                <input required className="input-premium" value={formData.brand} onChange={e => updateField('brand', e.target.value)} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Number</label>
                                <input required className="input-premium text-indigo-300 font-mono" value={formData.product_model} onChange={e => updateField('product_model', e.target.value)} />
                             </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl md:col-span-2 flex items-center justify-between">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Current Stock Status</label>
                                    <div className="flex gap-2">
                                        {['in_stock', 'low_stock', 'out_of_stock'].map(s => (
                                            <button type="button" key={s} onClick={() => updateField('stock_status', s)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                                    formData.stock_status === s 
                                                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 scale-105' 
                                                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                                }`}
                                            >
                                                {s.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Min Order Qty</label>
                                    <input type="number" className="w-24 bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-center font-black" 
                                        value={formData.min_order_quantity} onChange={e => updateField('min_order_quantity', Number(e.target.value))} />
                                </div>
                             </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supplier Name</label>
                                <input className="input-premium" value={formData.supplier?.name} 
                                    onChange={e => updateField('supplier', { ...formData.supplier, name: e.target.value })} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Lead Time (Days)</label>
                                <input type="number" className="input-premium" value={formData.supplier?.lead_time_days} 
                                    onChange={e => updateField('supplier', { ...formData.supplier, lead_time_days: Number(e.target.value) })} />
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
                   <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Visibility:</span>
                   <button onClick={() => updateField('is_active', !formData.is_active)} className={`w-12 h-6 rounded-full border transition-all relative ${formData.is_active ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-slate-800 border-slate-700'}`}>
                       <div className={`absolute top-1 bottom-1 w-4 rounded-full transition-all ${formData.is_active ? 'right-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'left-1 bg-slate-500'}`} />
                   </button>
                </div>
                <button form="product-form" type="submit" disabled={mutation.isPending} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50">
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Confirm Asset
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
            border-color: rgba(34, 211, 238, 0.5);
            box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AddProductModal;
