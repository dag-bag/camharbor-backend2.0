import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { productApi } from '../../api/productApi';
import type { IProduct } from '../../types/product.types';

const ProductForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [formData, setFormData] = useState<Partial<IProduct>>({
        name: '', slug: '', category: '', brand: '', product_model: '', base_price: 0, is_active: true,
        stock_status: 'in_stock', min_order_quantity: 1, supplier: { name: '', lead_time_days: 0 }
    });

    useEffect(() => { id && productApi.master.getAll({ _id: id }).then(res => setFormData(res.data[0])) }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) await productApi.master.update(id, formData);
            else await productApi.master.create(formData);
            navigate('/product');
        } catch (err) { alert('Error saving product'); }
    };

    const handleChange = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }));

    return (
        <div className="p-8 max-w-4xl mx-auto">
             <button onClick={() => navigate('/product')} className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
            </button>
            <h1 className="text-3xl font-black text-white mb-8">{isEdit ? 'Edit Product' : 'New Product'}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-6">
                    <h3 className="col-span-2 text-xl font-bold text-indigo-400">Master Data</h3>
                    <div className="col-span-2">
                        <label className="label">Product Name</label>
                        <input className="input" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
                    </div>
                     <div>
                        <label className="label">Brand</label>
                        <input className="input" value={formData.brand} onChange={e => handleChange('brand', e.target.value)} required />
                    </div>
                     <div>
                        <label className="label">Model</label>
                        <input className="input" value={formData.product_model} onChange={e => handleChange('product_model', e.target.value)} required />
                    </div>
                     <div>
                        <label className="label">Base Price (₹)</label>
                        <input type="number" className="input" value={formData.base_price} onChange={e => handleChange('base_price', Number(e.target.value))} required />
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-6">
                    <h3 className="col-span-2 text-xl font-bold text-emerald-400">Inventory & Supply</h3>
                     <div>
                        <label className="label">Stock Status</label>
                         <select className="input" value={formData.stock_status} onChange={e => handleChange('stock_status', e.target.value)}>
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Min Order Qty</label>
                        <input type="number" className="input" value={formData.min_order_quantity} onChange={e => handleChange('min_order_quantity', Number(e.target.value))} />
                    </div>
                     <div>
                        <label className="label">Supplier Name</label>
                        <input className="input" value={formData.supplier?.name} onChange={e => handleChange('supplier', { ...formData.supplier, name: e.target.value })} />
                    </div>
                     <div>
                        <label className="label">Lead Time (Days)</label>
                        <input type="number" className="input" value={formData.supplier?.lead_time_days} onChange={e => handleChange('supplier', { ...formData.supplier, lead_time_days: Number(e.target.value) })} />
                    </div>
                </div>

                 <div className="flex justify-end pt-6">
                    <button type="submit" className="btn-primary">
                        <Save className="w-6 h-6 mr-2" /> Save Product
                    </button>
                </div>
            </form>
            <style>{`
                .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; }
                .input { width: 100%; background-color: #020617; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; outline: none; }
                .input:focus { border-color: #6366f1; }
                .btn-primary { display: flex; align-items: center; background-color: #4f46e5; color: white; padding: 1rem 2rem; border-radius: 0.75rem; font-weight: 700; transition: all; }
            `}</style>
        </div>
    );
};
export default ProductForm;
