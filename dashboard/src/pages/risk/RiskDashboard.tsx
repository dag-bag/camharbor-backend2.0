import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { riskApi } from '../../api/riskApi';

const RiskDashboard: React.FC = () => {
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        riskApi.profiles.getAll().then(res => setStats(res.data));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
             <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Risk Intelligence</h1>
                <p className="text-slate-400">Security profiles and crime statistics.</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                 <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4 text-emerald-400">
                        <Shield className="w-8 h-8" />
                        <span className="text-xl font-bold">Safe Zones</span>
                    </div>
                    <div className="text-4xl font-black text-white">--</div>
                 </div>
                 <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4 text-amber-400">
                        <AlertTriangle className="w-8 h-8" />
                        <span className="text-xl font-bold">High Risk</span>
                    </div>
                    <div className="text-4xl font-black text-white">--</div>
                 </div>
                 <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4 text-indigo-400">
                        <Activity className="w-8 h-8" />
                        <span className="text-xl font-bold">Incidents</span>
                    </div>
                    <div className="text-4xl font-black text-white">--</div>
                 </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-white mb-4">Risk Profiles</h3>
                {stats.length === 0 ? <p className="text-slate-500">No risk profiles generated yet.</p> : (
                    <ul>{stats.map(s => <li key={s._id}>{s.risk_level}</li>)}</ul>
                )}
            </div>
        </div>
    );
};
export default RiskDashboard;
