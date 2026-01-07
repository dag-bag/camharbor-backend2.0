import React, { useEffect, useState } from 'react';
import { Plus, Box, Package, Edit2, Trash2 } from 'lucide-react';
import { productApi } from '../../api/productApi';
import type { IProduct } from '../../types/product.types';
import AddProductModal from '../../components/AddProductModal';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = () => {
        productApi.master.getAll().then(res => setProducts(res.data));
    };

    const handleEdit = (p: IProduct) => {
        setEditingProduct(p);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm('Remove asset?')) {
             await productApi.master.delete(id);
             loadData();
        }
    };

    return (
        <div className="min-h-screen bg-grid p-8 md:p-12 overflow-x-hidden">
             <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 animate-fade-in-up">
                     <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                           <Package className="w-3 h-3" /> Supply Chain
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Inventory<span className="text-cyan-500">.</span></h1>
                    </div>
                    <button onClick={handleCreate} className="btn-premium bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30">
                        <Plus className="w-5 h-5" /> Add Asset
                    </button>
                </div>
            
             <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-700/50 animate-fade-in-up delay-100">
                {products.map(p => (
                    <div key={p._id} className="p-6 border-b border-white/5 flex justify-between items-center hover:bg-cyan-500/5 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/5 shadow-inner">
                                <Box className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {p.brand} • <span className="text-slate-400">{p.product_model}</span>
                                </div>
                            </div>
                        </div>
                         <div className="flex items-center gap-8">
                             <div className="text-right">
                                 <div className="text-2xl font-black text-white">₹{p.base_price.toLocaleString()}</div>
                                 <div className={`text-[10px] font-bold uppercase tracking-widest ${p.stock_status === 'in_stock' ? 'text-emerald-400' : 'text-amber-400'}`}>{p.stock_status?.replace(/_/g, ' ')}</div>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => handleEdit(p)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"><Edit2 className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(p._id)} className="p-3 bg-white/5 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
            </div>

            {isModalOpen && <AddProductModal onClose={() => { setIsModalOpen(false); loadData(); }} productToEdit={editingProduct} />}
            
            <style>{`.btn-premium { padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; transition: all 0.2s; box-shadow: 0 0 40px -10px currentColor; display: flex; align-items: center; gap: 0.75rem; } .btn-premium:active { transform: scale(0.95); box-shadow: none; }`}</style>
        </div>
    );
};
export default ProductList;
