import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { localityApi } from '../../api/localityApi';
import { cityApi } from '../../api/cityApi';
import { zoneApi } from '../../api/zoneApi';
import type { ILocality } from '../../types/locality.types';

const LocalityForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState<Partial<ILocality>>({
        name: '', slug: '', city_id: '', primary_pincode: '', is_active: true,
        geo: { coordinates: { lat: 0, lng: 0 }, bounds: { north: 0, south: 0, east: 0, west: 0 } },
        pincodes: []
    });
    
    // Dropdown Data
    const [cities, setCities] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);

    useEffect(() => {
        loadDropdowns();
        if (isEdit && id) {
            loadLocality(id);
        }
    }, [id]);

    const loadDropdowns = async () => {
        const c = await cityApi.listCities();
        setCities(c.data);
        const z = await zoneApi.getAllZones();
        setZones(z.data);
    };

    const loadLocality = async (id: string) => {
        const res = await localityApi.getById(id);
        // Ensure nested objects
        const data = res.data;
        // Fix for populated fields if editing
        if(typeof data.city_id === 'object') data.city_id = (data.city_id as any)._id;
        if(typeof data.zone_id === 'object') data.zone_id = (data.zone_id as any)._id;
        setFormData(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit && id) {
                await localityApi.update(id, formData);
            } else {
                await localityApi.create(formData);
            }
            navigate('/locality');
        } catch (err) {
            alert('Error saving locality');
            console.error(err);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGeoChange = (field: 'lat' | 'lng', value: string) => {
        setFormData(prev => ({
            ...prev,
            geo: {
                ...prev.geo!,
                coordinates: {
                    ...prev.geo!.coordinates,
                    [field]: parseFloat(value) || 0
                }
            }
        }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button onClick={() => navigate('/locality')} className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
            </button>

            <h1 className="text-3xl font-black text-white mb-8">{isEdit ? 'Edit Locality' : 'New Locality'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info Card */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Name</label>
                            <input 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.name} onChange={e => handleChange('name', e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Slug</label>
                            <input 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.slug} onChange={e => handleChange('slug', e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">City</label>
                            <select 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.city_id as string} onChange={e => handleChange('city_id', e.target.value)} required
                            >
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Zone (Optional)</label>
                            <select 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.zone_id as string || ''} onChange={e => handleChange('zone_id', e.target.value)}
                            >
                                <option value="">Select Zone</option>
                                {zones.filter(z => !formData.city_id || z.city_id === formData.city_id).map(z => (
                                    <option key={z._id} value={z._id}>{z.name}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Primary Pincode</label>
                            <input 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.primary_pincode} onChange={e => handleChange('primary_pincode', e.target.value)} required 
                            />
                        </div>
                    </div>
                </div>

                {/* Geo Info Card */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Geography</h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Latitude</label>
                            <input 
                                type="number" step="any"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.geo?.coordinates.lat} onChange={e => handleGeoChange('lat', e.target.value)} required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Longitude</label>
                            <input 
                                type="number" step="any"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                                value={formData.geo?.coordinates.lng} onChange={e => handleGeoChange('lng', e.target.value)} required 
                            />
                        </div>
                     </div>
                </div>

                {/* Demographics Card */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Demographics & Infrastructure</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="label">Population Density</label>
                            <select className="input" value={formData.demographics?.population_density} onChange={e => handleChange('demographics', { ...formData.demographics, population_density: e.target.value })}>
                                <option value="">Select</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                             <label className="label">Avg Income Level</label>
                             <select className="input" value={formData.demographics?.avg_income_level} onChange={e => handleChange('demographics', { ...formData.demographics, avg_income_level: e.target.value })}>
                                <option value="">Select</option>
                                <option value="High">High</option>
                                <option value="Middle">Middle</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                             <label className="label">Power Stability</label>
                             <select className="input" value={formData.infrastructure?.power_stability} onChange={e => handleChange('infrastructure', { ...formData.infrastructure, power_stability: e.target.value })}>
                                <option value="Good">Good</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div>
                             <label className="label">Internet Quality</label>
                             <select className="input" value={formData.infrastructure?.internet_quality} onChange={e => handleChange('infrastructure', { ...formData.infrastructure, internet_quality: e.target.value })}>
                                <option value="Fiber">Fiber</option>
                                <option value="DSL">DSL</option>
                                <option value="Mobile Only">Mobile Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95">
                        <Save className="w-6 h-6" />
                        Save Locality
                    </button>
                </div>

            </form>
             <style>{`
                .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; }
                .input { width: 100%; background-color: #020617; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; outline: none; }
                .input:focus { border-color: #6366f1; }
            `}</style>
        </div>
    );
};

export default LocalityForm;
