import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import type { IService } from '../../types/service.types';

const ServiceForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [formData, setFormData] = useState<Partial<IService>>({
        name: '', slug: '', type: 'installation', base_price: 0, is_active: true, priority: 0, category: ''
    });

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (id: string) => {
        const res = await serviceApi.master.getById(id);
        setFormData(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) await serviceApi.master.update(id, formData);
            else await serviceApi.master.create(formData);
            navigate('/service');
        } catch (err) { alert('Error saving service'); }
    };

    const handleChange = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }));

    return (
        <div className="p-8 max-w-4xl mx-auto">
             <button onClick={() => navigate('/service')} className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
            </button>
            <h1 className="text-3xl font-black text-white mb-8">{isEdit ? 'Edit Service' : 'New Service'}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="label">Service Name</label>
                        <input className="input" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
                    </div>
                     <div>
                        <label className="label">Slug</label>
                        <input className="input" value={formData.slug} onChange={e => handleChange('slug', e.target.value)} required />
                    </div>
                    <div>
                        <label className="label">Type</label>
                        <select className="input" value={formData.type} onChange={e => handleChange('type', e.target.value)}>
                            <option value="installation">Installation</option>
                            <option value="repair">Repair</option>
                            <option value="amc">AMC</option>
                            <option value="rental">Rental</option>
                            <option value="consultation">Consultation</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Base Price (₹)</label>
                        <input type="number" className="input" value={formData.base_price} onChange={e => handleChange('base_price', Number(e.target.value))} required />
                    </div>
                     <div>
                        <label className="label">Category</label>
                        <input className="input" value={formData.category} onChange={e => handleChange('category', e.target.value)} />
                    </div>
                </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Operational Config</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                             <label className="label">Warranty (Months)</label>
                             <input type="number" className="input" value={formData.warranty_months} onChange={e => handleChange('warranty_months', Number(e.target.value))} />
                        </div>
                         <div>
                             <label className="label">Est. Time (Minutes)</label>
                             <input type="number" className="input" value={formData.installation_time_minutes} onChange={e => handleChange('installation_time_minutes', Number(e.target.value))} />
                        </div>
                        <div>
                             <label className="label">Tech Level Required</label>
                             <select className="input" value={formData.required_technician_level} onChange={e => handleChange('required_technician_level', e.target.value)}>
                                <option value="L1">L1 (Basic)</option>
                                <option value="L2">L2 (Advanced)</option>
                                <option value="L3">L3 (Expert)</option>
                            </select>
                        </div>
                    </div>
                </div>

                 <div className="flex justify-end pt-6">
                    <button type="submit" className="btn-primary">
                        <Save className="w-6 h-6 mr-2" /> Save Service
                    </button>
                </div>
            </form>
            
            <style>{`
                .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; }
                .input { width: 100%; background-color: #020617; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; outline: none; }
                .input:focus { border-color: #6366f1; }
                .btn-primary { display: flex; align-items: center; background-color: #4f46e5; color: white; padding: 1rem 2rem; border-radius: 0.75rem; font-weight: 700; transition: all; }
                .btn-primary:hover { background-color: #4338ca; transform: scale(1.02); }
            `}</style>
        </div>
    );
};
export default ServiceForm;
