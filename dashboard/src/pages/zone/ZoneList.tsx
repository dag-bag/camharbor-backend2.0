import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { zoneApi } from '../../api/zoneApi';
import { cityApi } from '../../api/cityApi'; // Need this for city filter
import type { Zone } from '../../types/zone.types';
import type { City } from '../../types/city.types';

export default function ZoneList() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
    fetchZones();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await cityApi.listCities(1, 100);
      setCities(response.data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await zoneApi.listZones();
      setZones(response.data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          zone.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity ? zone.city_id === selectedCity : true;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Zones</h1>
          <p className="text-slate-400 mt-1">Manage service zones and their configurations</p>
        </div>
        <Link
          to="/zone/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Create Zone
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city._id || city.slug} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredZones.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
          <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No zones found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {searchQuery || selectedCity 
              ? "Try adjusting your filters to see results." 
              : "Get started by creating your first service zone."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredZones.map(zone => (
            <Link
              key={zone._id}
              to={`/zone/${zone.slug}`} // Assuming slug is unique and usable for URL, otherwise use _id
              className="group bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  {zone.name.charAt(0)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  zone.is_active 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-slate-700/30 text-slate-500 border border-slate-700/50'
                }`}>
                  {zone.type}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {zone.name}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <MapPin className="w-3 h-3" />
                <span>{zone.city_name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>{zone.geo?.pincodes?.length || 0} Pincodes</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Installations</span>
                  <span className="text-sm font-bold text-slate-300">
                    {zone.stats?.total_installations || 0}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
