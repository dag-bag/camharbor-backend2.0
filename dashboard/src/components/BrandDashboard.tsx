import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Search, 
  Plus, 
  Loader2, 
  AlertCircle, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Filter,
  BadgeCheck,
  Star,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { brandApi } from '../api/brandApi';
import type { Brand } from '../types/brand.types';
import { format } from 'date-fns';

interface BrandDashboardProps {
  onAddBrand: () => void;
  onEditBrand: (brand: Brand) => void;
}

const BrandDashboard: React.FC<BrandDashboardProps> = ({ onAddBrand, onEditBrand }) => {
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['brands', search, filterActive],
    queryFn: () => brandApi.listBrands({
      search,
      is_active: filterActive === 'all' ? undefined : filterActive === 'active'
    })
  });

  const deleteMutation = useMutation({
    mutationFn: brandApi.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: brandApi.deleteBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setSelectedBrands([]);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: brandApi.toggleBrandStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBrands.length} brands?`)) {
      bulkDeleteMutation.mutate(selectedBrands);
    }
  };

  const toggleSelect = (slug: string) => {
    if (selectedBrands.includes(slug)) {
      setSelectedBrands(selectedBrands.filter(id => id !== slug));
    } else {
      setSelectedBrands([...selectedBrands, slug]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBrands.length === (data?.data?.length || 0)) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(data?.data?.map((b: Brand) => b.slug) || []);
    }
  };

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center h-96">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl flex items-center gap-4 max-w-md">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Failed to load brands</h3>
            <p className="text-sm opacity-80 mt-1">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-24 h-24 transform translate-x-4 -translate-y-4" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Brands</p>
          <h3 className="text-4xl font-black text-white mt-2">{data?.pagination?.total || 0}</h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-1 rounded-lg">
            <Plus className="w-3 h-3" /> 12% vs last month
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BadgeCheck className="w-24 h-24 transform translate-x-4 -translate-y-4 text-emerald-500" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authorized Partners</p>
          <h3 className="text-4xl font-black text-white mt-2">
            {data?.data?.filter((b: Brand) => b.status.is_authorized_dealer).length || 0}
          </h3>
        </div>

        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-24 h-24 transform translate-x-4 -translate-y-4 text-indigo-500" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Active Brands</p>
          <h3 className="text-4xl font-black text-white mt-2">
            {data?.data?.filter((b: Brand) => b.status.is_active).length || 0}
          </h3>
        </div>

        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="w-24 h-24 transform translate-x-4 -translate-y-4 text-amber-500" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Featured</p>
          <h3 className="text-4xl font-black text-white mt-2">
            {data?.data?.filter((b: Brand) => b.featured).length || 0}
          </h3>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
            />
          </div>
          
          <div className="flex bg-black/20 rounded-2xl p-1 border border-white/10">
            <button 
              onClick={() => setFilterActive('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterActive === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterActive('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterActive === 'active' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterActive === 'inactive' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedBrands.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all animate-in fade-in slide-in-from-right-4"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedBrands.length})
            </button>
          )}
          <button 
            onClick={onAddBrand}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 relative min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 w-16 text-center">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll}
                      checked={data?.data?.length > 0 && selectedBrands.length === data?.data?.length}
                      className="rounded-lg border-white/20 bg-white/5 text-indigo-500 focus:ring-offset-0 focus:ring-0 w-5 h-5 cursor-pointer"
                    />
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Brand Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tier</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Updated</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <Building2 className="w-16 h-16 text-slate-600 mb-4" />
                        <p className="text-lg font-bold text-slate-400">No brands found</p>
                        <p className="text-sm text-slate-600 mt-2">Try adjusting your filters or add a new brand</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((brand: Brand) => (
                    <tr 
                      key={brand._id} 
                      className={`group hover:bg-white/[0.02] transition-colors ${selectedBrands.includes(brand.slug) ? 'bg-indigo-500/[0.03]' : ''}`}
                    >
                      <td className="p-6 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand.slug)}
                          onChange={() => toggleSelect(brand.slug)}
                          className="rounded-lg border-white/20 bg-white/5 text-indigo-500 focus:ring-offset-0 focus:ring-0 w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0">
                            {brand.logo?.dark ? (
                              <img src={brand.logo.dark} alt={brand.name} className="w-full h-full object-contain p-2" />
                            ) : (
                              <Building2 className="w-6 h-6 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-base">{brand.name}</h4>
                              {brand.featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                            </div>
                            <p className="text-xs font-mono text-slate-500 mt-0.5">{brand.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <button 
                          onClick={() => toggleStatusMutation.mutate(brand.slug)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            brand.status.is_active
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20'
                          }`}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {brand.status.is_active ? (
                            <><CheckCircle2 className="w-3 h-3" /> Active</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="p-6">
                        {brand.status.is_authorized_dealer ? (
                          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{brand.status.partner_tier || 'Authorized'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs font-medium">Standard</span>
                        )}
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-medium text-slate-400">
                          {brand.updated_at ? format(new Date(brand.updated_at), 'MMM d, yyyy') : '-'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => onEditBrand(brand)}
                            className="p-2 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-xl transition-colors"
                            title="Edit Brand"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('Delete brand?')) deleteMutation.mutate(brand.slug);
                            }}
                            className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDashboard;
