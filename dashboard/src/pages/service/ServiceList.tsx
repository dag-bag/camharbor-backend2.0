import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, Sparkles } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import type { IService } from '../../types/service.types';
import { AddServiceModal } from '../../components/AddServiceModal';

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<IService | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await serviceApi.master.getAll();
            setServices(res.data);
        } catch(e) { console.error(e); } 
        finally { setLoading(false); }
    };

    const handleEdit = (service: IService) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

     const handleDelete = async (id: string) => {
        if (window.confirm('Delete service?')) {
            await serviceApi.master.delete(id);
            loadData();
        }
    };

    return (
        <div className="min-h-screen bg-grid p-8 md:p-12 overflow-x-hidden">
             <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 animate-fade-in-up">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                           <Sparkles className="w-3 h-3" /> Service Catalog
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Services<span className="text-indigo-500">.</span></h1>
                        <p className="text-slate-400 mt-4 max-w-lg text-lg">Define and manage your service protocols and commercial offerings.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        New Protocol
                    </button>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
                    {services.map(s => (
                        <div key={s._id} className="glass-card border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">{s.type}</span>
                                <h3 className="text-2xl font-black text-white mt-4 tracking-tight group-hover:text-indigo-300 transition-colors mb-1">{s.name}</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{s.category}</p>
                                
                                <div className="mt-8 flex justify-between items-end border-t border-white/5 pt-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Rate</span>
                                        <span className="text-3xl font-black text-white">₹{s.base_price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(s)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-colors border border-white/5"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(s._id)} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            {isModalOpen && (
                <AddServiceModal 
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); loadData(); }} 
                    service={editingService} 
                />
            )}
        </div>
    );
};
export default ServiceList;
