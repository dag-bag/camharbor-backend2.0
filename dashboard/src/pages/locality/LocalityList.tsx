import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, MapPin, Map, Sparkles } from 'lucide-react';
import { localityApi } from '../../api/localityApi';
import type { ILocality } from '../../types/locality.types';
import AddLocalityModal from '../../components/AddLocalityModal';

const LocalityList: React.FC = () => {
  const [localities, setLocalities] = useState<ILocality[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocality, setEditingLocality] = useState<ILocality | null>(null);

  useEffect(() => {
    fetchLocalities();
  }, []);

  const fetchLocalities = async () => {
    try {
      setLoading(true);
      const res = await localityApi.getAll();
      setLocalities(res.data);
    } catch (error) {
      console.error('Failed to fetch localities', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (locality: ILocality) => {
    setEditingLocality(locality);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingLocality(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this locality?')) {
      await localityApi.delete(id);
      fetchLocalities();
    }
  };

  return (
    <div className="min-h-screen bg-grid p-8 md:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Map className="w-3 h-3" /> Geographic Intelligence
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Localities<span className="text-amber-500">.</span></h1>
            <p className="text-slate-400 mt-4 max-w-lg text-lg">Define regional boundaries and demographic intelligence for targeted operations.</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Map Region
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          {loading ? (
            <div className="col-span-full p-20 text-center text-slate-500">Loading...</div>
          ) : localities.length === 0 ? (
            <div className="col-span-full p-20 text-center text-slate-500">No localities found.</div>
          ) : (
            localities.map((loc) => (
              <div key={loc._id} className="glass-card border border-white/5 p-8 rounded-[2rem] hover:border-amber-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors mb-1">{loc.name}</h3>
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">{loc.slug}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      loc.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {loc.is_active ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-400 font-medium">{(loc.city_id as any)?.name || 'Unknown City'}</span>
                    </div>
                    <div className="bg-slate-900/50 px-3 py-2 rounded-lg">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Primary Pincode</span>
                      <span className="text-slate-200 font-mono font-bold">{loc.primary_pincode}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button onClick={() => handleEdit(loc)} className="flex-1 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-sm font-bold text-slate-300 transition-colors">
                      <Edit2 className="w-4 h-4 inline mr-1" /> Configure
                    </button>
                    <button onClick={() => handleDelete(loc._id)} className="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddLocalityModal 
          onClose={() => { setIsModalOpen(false); fetchLocalities(); }} 
          localityToEdit={editingLocality} 
        />
      )}
    </div>
  );
};

export default LocalityList;
