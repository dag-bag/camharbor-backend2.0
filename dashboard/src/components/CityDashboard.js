"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const react_query_1 = require("@tanstack/react-query");
const cityApi_1 = require("../api/cityApi");
const CityDashboard = ({ onAddCity, onEditCity }) => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedSlugs, setSelectedSlugs] = (0, react_1.useState)([]);
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: cities = [], isLoading: loading, error, isRefetching } = (0, react_query_1.useQuery)({
        queryKey: ['cities'],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield cityApi_1.cityApi.listCities(1, 100);
            return response.data;
        }),
        // Keep data fresh for 5 minutes, but re-fetch on window focus is default
        staleTime: 5 * 60 * 1000,
    });
    const toggleStatusMutation = (0, react_query_1.useMutation)({
        mutationFn: (slug) => cityApi_1.cityApi.toggleCityStatus(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
        },
        onError: (err) => {
            var _a, _b, _c;
            alert('Error toggling status: ' + (((_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || err.message));
        }
    });
    const deleteCityMutation = (0, react_query_1.useMutation)({
        mutationFn: (slug) => cityApi_1.cityApi.deleteCity(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
        },
        onError: (err) => {
            var _a, _b, _c;
            alert('Error deleting city: ' + (((_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || err.message));
        }
    });
    const deleteCitiesMutation = (0, react_query_1.useMutation)({
        mutationFn: (slugs) => cityApi_1.cityApi.deleteCities(slugs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
            setSelectedSlugs([]);
        },
        onError: (err) => {
            var _a, _b, _c;
            alert('Error deleting cities: ' + (((_c = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || err.message));
        }
    });
    const handleToggleStatus = (slug) => {
        toggleStatusMutation.mutate(slug);
    };
    const handleDeleteCity = (slug) => {
        if (!window.confirm(`Are you sure you want to delete ${slug}?`))
            return;
        deleteCityMutation.mutate(slug);
    };
    const handleBulkDelete = () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedSlugs.length} cities?`))
            return;
        deleteCitiesMutation.mutate(selectedSlugs);
    };
    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedSlugs(filteredCities.map(c => c.slug));
        }
        else {
            setSelectedSlugs([]);
        }
    };
    const toggleSelect = (slug) => {
        setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
    };
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['cities'] });
    };
    const filteredCities = cities.filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="min-h-screen w-full bg-grid premium-gradient p-4 md:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]">
              <lucide_react_1.Activity className="w-3 h-3 animate-pulse"/>
              Live Network
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
              City <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hub</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed text-left font-medium">
              Operational dashboard for managing CamHarbor's urban security infrastructure.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {selectedSlugs.length > 0 && (<button onClick={handleBulkDelete} className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl font-bold transition-all border border-rose-500/20 flex items-center gap-3 animate-in fade-in zoom-in">
                <lucide_react_1.Trash2 className="w-5 h-5"/>
                Delete Selected ({selectedSlugs.length})
              </button>)}
            <button onClick={handleRefresh} disabled={loading || isRefetching} className="p-4 glass-card hover:bg-slate-800 transition-all group disabled:opacity-50 rounded-2xl border border-slate-700/50">
              <lucide_react_1.RefreshCw className={`w-6 h-6 text-slate-400 group-hover:text-white ${isRefetching ? 'animate-spin' : ''}`}/>
            </button>
            <button onClick={onAddCity} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-3 group border border-indigo-400/20">
              <lucide_react_1.Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"/>
              Expand Network
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          <div className="glass-card p-8 rounded-[2rem] group hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.2)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Cities</p>
                <p className="text-5xl font-black text-white mt-2 tracking-tight">{cities.length}</p>
              </div>
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                <lucide_react_1.Globe className="w-8 h-8"/>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 py-2 px-3 rounded-lg w-fit">
              <lucide_react_1.TrendingUp className="w-4 h-4"/>
              +12% Growth
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] group hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Active Nodes</p>
                <p className="text-5xl font-black text-emerald-400 mt-2 tracking-tight">{cities.filter(c => c.is_active).length}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <lucide_react_1.Shield className="w-8 h-8"/>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400">
              System health: <span className="text-emerald-400 font-black">OPTIMAL</span>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] group hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Pending</p>
                <p className="text-5xl font-black text-amber-400 mt-2 tracking-tight">{cities.filter(c => !c.is_active).length}</p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
                <lucide_react_1.AlertCircle className="w-8 h-8"/>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-500/80">
              Requires configuration
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200 border border-slate-700/50">
          <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-[28rem]">
              <lucide_react_1.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"/>
              <input type="text" placeholder="Search urban identifiers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 py-4 pl-14 pr-6 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium text-lg shadow-inner"/>
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-950/30 py-2 px-4 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Live Database Connection
            </div>
          </div>

          {loading ? (<div className="py-40 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <lucide_react_1.Activity className="w-8 h-8 text-indigo-400 animate-pulse"/>
                </div>
              </div>
              <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">Syncing with Central Data...</p>
            </div>) : error ? (<div className="py-40 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]">
                <lucide_react_1.AlertCircle className="w-12 h-12"/>
              </div>
              <p className="text-rose-400 font-black text-2xl tracking-tight">{(error === null || error === void 0 ? void 0 : error.message) || 'Sync Error'}</p>
              <button onClick={() => handleRefresh()} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all uppercase tracking-wider text-sm border border-slate-600">
                Retry Synchronization
              </button>
            </div>) : filteredCities.length === 0 ? (<div className="py-40 flex flex-col items-center justify-center gap-6 opacity-60">
              <lucide_react_1.MapPin className="w-24 h-24 text-slate-800"/>
              <p className="text-slate-600 font-black text-2xl tracking-tight">No Geographic Matches Found</p>
            </div>) : (<div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="px-10 py-6 text-center w-16">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" onChange={(e) => toggleSelectAll(e.target.checked)} checked={filteredCities.length > 0 && selectedSlugs.length === filteredCities.length}/>
                    </th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">City Profile</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Jurisdiction</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredCities.map((city) => (<tr key={city.slug} className={`hover:bg-indigo-500/[0.03] transition-all group ${selectedSlugs.includes(city.slug) ? 'bg-indigo-500/[0.05]' : ''}`}>
                      <td className="px-10 py-6 text-center">
                         <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" checked={selectedSlugs.includes(city.slug)} onChange={() => toggleSelect(city.slug)}/>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl font-black shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20">
                            {city.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white text-xl font-bold group-hover:text-indigo-400 transition-colors tracking-tight">{city.display_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-slate-600 font-mono text-xs tracking-tight uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{city.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${city.is_active
                    ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800/50 text-slate-500 border-slate-700'}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${city.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                          {city.is_active ? 'Operational' : 'Decommissioned'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-slate-400 font-bold tracking-wide">
                          <lucide_react_1.MapPin className="w-4 h-4 text-slate-600"/>
                          {city.state}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <button onClick={() => onEditCity(city)} className="p-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all border border-indigo-500/20" title="Configure Node">
                             <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">✎</div> 
                          </button>
                          <button onClick={() => handleToggleStatus(city.slug)} className={`p-3 rounded-xl transition-all border ${city.is_active
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20'}`} title={city.is_active ? "Deactivate Network" : "Activate Network"}>
                            <lucide_react_1.Power className={toggleStatusMutation.isPending && toggleStatusMutation.variables === city.slug ? "w-5 h-5 animate-spin" : "w-5 h-5"}/>
                          </button>
                          <button onClick={() => handleDeleteCity(city.slug)} className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20" title="Delete Node">
                            <lucide_react_1.Trash2 className={deleteCityMutation.isPending && deleteCityMutation.variables === city.slug ? "w-5 h-5 animate-spin" : "w-5 h-5"}/>
                          </button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.default = CityDashboard;
