import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, MapPin, Building2, Wrench, BarChart3, Globe, Type, ArrowRight, Code, BookOpen, AlertCircle } from 'lucide-react';
import { zoneApi } from '../../api/zoneApi';
import { cityApi } from '../../api/cityApi';
import type { Zone } from '../../types/zone.types';
import type { City } from '../../types/city.types';

export default function ZoneForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // This might be slug or ID
  const isEditMode = Boolean(id);

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  // Selection State
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Zone>>({
    name: '',
    slug: '',
    type: 'mixed',
    is_active: true,
    is_serviceable: true,
    geo: {
      pincodes: [],
      latitude: 0,
      longitude: 0,
      localities: [],
      landmark_boundary: ''
    },
    operations: {
        hub_center: '',
        distance_from_hub_km: 0,
        primary_technician_team: '',
        visit_charge: 0,
        min_order_value: 0,
        requires_society_permission: false,
        night_work_allowed: false
    },
    market: {
        spending_capacity: 'medium',
        crime_rate: 'moderate',
        popular_product_type: 'wifi_camera',
        competition_density: 'medium'
    },
    content: {
        page_title: '',
        hero_image: '',
        description_short: '',
        description_long: '',
        faqs: [],
        zone_specific_testimonials: []
    },
    seo: {
        meta_title: '',
        meta_description: '',
        keywords: []
    }
  });

  const [activeTab, setActiveTab] = useState<'identity' | 'geo' | 'operations' | 'market' | 'content' | 'json'>('identity');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Load Cities on Mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Load Zone Data if Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchZoneData(id);
    }
  }, [id, isEditMode]);

  const fetchCities = async () => {
    try {
      const response = await cityApi.getActiveCities();
      setCities(response.data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchZoneData = async (zoneIdentifier: string) => {
    try {
      setInitialLoading(true);
      const response = await zoneApi.getZoneBySlug(zoneIdentifier);
      setFormData(response.data);
      setSelectedCityId(response.data.city_id); // Lock city for edit
    } catch (error) {
      console.error('Failed to fetch zone:', error);
      // fallback if it was an ID not slug? usually slug is used in url
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = cities.find(c => c._id === cityId);
    if (city) {
      setFormData(prev => ({
        ...prev,
        city_id: city._id,
        city_name: city.name,
        geo: {
            ...prev.geo!,
            // Pre-fill with city coords as a starting point
            latitude: city.geo?.coordinates?.lat || 0,
            longitude: city.geo?.coordinates?.lng || 0
        }
      }));
    }
  };

  // Sync JSON when switching TO json tab
  useEffect(() => {
    if (activeTab === 'json') {
      setJsonInput(JSON.stringify(formData, null, 2));
      setJsonError(null);
    }
  }, [activeTab, formData]);

  const handleTabChange = (newTab: typeof activeTab) => {
    // If leaving JSON tab, try to parse and save to formData
    if (activeTab === 'json' && newTab !== 'json') {
      try {
        const parsed = JSON.parse(jsonInput);
        // CRITICAL: Enforce City relationships
        if (selectedCityId) {
             const city = cities.find(c => c._id === selectedCityId);
             if (city) {
                 parsed.city_id = city._id;
                 parsed.city_name = city.name;
             }
        }
        setFormData(parsed);
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON. Please fix errors before switching tabs.');
        return; // Block switching
      }
    }
    setActiveTab(newTab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalData = formData;

    // If currently in JSON mode, parse first
    if (activeTab === 'json') {
        try {
            finalData = JSON.parse(jsonInput);
        } catch (e) {
            setJsonError('Invalid JSON');
            setLoading(false);
            return;
        }
    }

    // CRITICAL: Force City Relation (Strong Relation)
    if (selectedCityId) {
        const city = cities.find(c => c._id === selectedCityId);
        if (city) {
            if (Array.isArray(finalData)) {
                // Handle Array Injection
                finalData = finalData.map((item: any) => ({
                    ...item,
                    city_id: city._id,
                    city_name: city.name
                }));
            } else {
                // Handle Single Object Injection
                finalData.city_id = city._id;
                finalData.city_name = city.name;
            }
        }
    }

    try {
      if (isEditMode && finalData._id && !Array.isArray(finalData)) {
        await zoneApi.updateZone(finalData._id, finalData);
      } else {
        await zoneApi.createZone(finalData);
      }
      navigate('/zone');
    } catch (error) {
      console.error('Failed to save zone:', error);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  // Helper for simple input changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper for nested changes
  const handleNestedChange = (section: keyof Zone, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [field]: value
      }
    }));
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1: CITY SELECTION (Create Mode Only)
  // ─────────────────────────────────────────────────────────────
  if (!isEditMode && !selectedCityId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
         <div className="w-full max-w-lg bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-4">
                    <Building2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-white">Select a City</h1>
                <p className="text-slate-400 mt-2">Which city does this new zone belong to?</p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cities.length === 0 ? (
                     <div className="text-center py-4 text-slate-500">Loading cities...</div>
                ) : (
                    cities.map(city => (
                        <button
                            key={city._id}
                            onClick={() => handleCitySelect(city._id!)} // Assuming _id is present
                            className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-indigo-600 hover:text-white border border-white/5 rounded-xl transition-all group"
                        >
                            <span className="font-bold">{city.name}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))
                )}
            </div>
             <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <button onClick={() => navigate('/zone')} className="text-sm text-slate-500 hover:text-white transition-colors">
                    Cancel
                </button>
            </div>
         </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 2: FULL FORM
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/zone')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isEditMode ? `Edit Zone` : 'New Zone'}
            </h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
               <Building2 className="w-3 h-3 text-indigo-400" />
               {formData.city_name}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {[
            { id: 'identity', label: 'Identity', icon: Type },
            { id: 'geo', label: 'Geography', icon: MapPin },
            { id: 'operations', label: 'Operations', icon: Wrench },
            { id: 'market', label: 'Market Profile', icon: BarChart3 },
            { id: 'content', label: 'Web Content', icon: Globe },
            { id: 'json', label: 'Raw JSON', icon: Code },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* IDENTITY TAB */}
          {activeTab === 'identity' && (
            <div className="space-y-6 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Zone Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Slug</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.slug || ''}
                            onChange={(e) => handleChange('slug', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Type</label>
                        <select 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="mixed">Mixed</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Status</label>
                        <div className="flex gap-4 pt-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                                />
                                <span className="text-sm font-bold text-slate-300">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_serviceable}
                                    onChange={(e) => handleChange('is_serviceable', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                                />
                                <span className="text-sm font-bold text-slate-300">Serviceable</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* GEOGRAPHY TAB */}
          {activeTab === 'geo' && (
             <div className="space-y-6 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pincodes (Comma separated)</label>
                    <textarea 
                        className="w-full h-24 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={formData.geo?.pincodes?.join(', ') || ''}
                        onChange={(e) => handleNestedChange('geo', 'pincodes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="110001, 110002..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Latitude</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.geo?.latitude || 0}
                            onChange={(e) => handleNestedChange('geo', 'latitude', parseFloat(e.target.value))}
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Longitude</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.geo?.longitude || 0}
                            onChange={(e) => handleNestedChange('geo', 'longitude', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Localities (Comma separated)</label>
                    <textarea 
                        className="w-full h-24 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={formData.geo?.localities?.join(', ') || ''}
                        onChange={(e) => handleNestedChange('geo', 'localities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Saket, Hauz Khas..."
                    />
                </div>
             </div>
          )}
          
          {/* OPERATIONS TAB (Simplified for brevity, can expand) */}
          {activeTab === 'operations' && (
              <div className="space-y-6 bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Hub Center</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.operations?.hub_center || ''}
                            onChange={(e) => handleNestedChange('operations', 'hub_center', e.target.value)}
                        />
                      </div>
                       <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Distance from Hub (Km)</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={formData.operations?.distance_from_hub_km || 0}
                            onChange={(e) => handleNestedChange('operations', 'distance_from_hub_km', parseFloat(e.target.value))}
                        />
                      </div>
                  </div>
              </div>
          )}

           {/* MARKET & CONTENT Placeholders */}
           {(activeTab === 'market' || activeTab === 'content') && (
              <div className="p-12 bg-slate-900/50 rounded-3xl border border-white/5 text-center">
                  <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-300">Advanced Editing</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                      For complex nested objects like Market or Content, please use the 
                      <button onClick={() => handleTabChange('json')} className="text-indigo-400 hover:text-indigo-300 font-bold ml-1">
                          Raw JSON Editor
                      </button>.
                  </p>
              </div>
           )}

           {/* RAW JSON TAB */}
           {activeTab === 'json' && (
             <div className="space-y-4 h-full flex flex-col">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-mono leading-relaxed flex gap-3">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <span className="text-indigo-400 font-black uppercase block mb-1 tracking-widest">JSON Mode</span>
                        You can paste full zone objects here. <span className="text-white font-bold">Note:</span> The <code>city_id</code> will be automatically forced to the selected city on save.
                    </div>
                </div>
                
                {jsonError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in fade-in">
                        <AlertCircle className="w-5 h-5" />
                        {jsonError}
                    </div>
                )}

                <div className="flex-1 relative group min-h-[500px]">
                    <textarea
                        value={jsonInput}
                        onChange={(e) => {
                            setJsonInput(e.target.value);
                            setJsonError(null);
                        }}
                        className="w-full h-full bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm text-cyan-400 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none custom-scrollbar leading-relaxed"
                        spellCheck={false}
                    />
                    <div className="absolute right-6 top-6 text-slate-800 pointer-events-none">
                        <Code className="w-6 h-6" />
                    </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
