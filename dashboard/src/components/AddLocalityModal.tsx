import React, { useState, useEffect } from 'react';
import { X, Map, MapPin, Home, CheckCircle2, Loader2, AlertCircle, Save, Code, Database, Server } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocality, updateLocality } from '../services/localityApi';
import type { Locality } from '../types/locality.types';

interface AddLocalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  locality?: Locality;
}

export function AddLocalityModal({ isOpen, onClose, locality }: AddLocalityModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    display_name: '',
    city_id: '',
    primary_pincode: '',
    pincodes: [] as string[],
    is_active: true,
    is_serviceable: true,
    priority: 0,
    geo: {
      coordinates: { lat: 0, lng: 0 },
      bounds: { north: 0, south: 0, east: 0, west: 0 }
    },
    demographics: {
      population_density: '',
      avg_income_level: '',
      housing_type: ''
    },
    infrastructure: {
      power_stability: 'Good' as 'Excellent' | 'Good' | 'Poor',
      internet_quality: 'Fiber' as 'Fiber' | 'DSL' | 'Mobile Only',
      road_width: ''
    }
  });

  useEffect(() => {
    if (locality) {
      setFormData({
        name: locality.name || '',
        slug: locality.slug || '',
        display_name: locality.display_name || '',
        city_id: locality.city_id || '',
        primary_pincode: locality.primary_pincode || '',
        pincodes: locality.pincodes || [],
        is_active: locality.is_active ?? true,
        is_serviceable: locality.is_serviceable ?? true,
        priority: locality.priority || 0,
        geo: locality.geo || {
          coordinates: { lat: 0, lng: 0 },
          bounds: { north: 0, south: 0, east: 0, west: 0 }
        },
        demographics: locality.demographics || {
          population_density: '',
          avg_income_level: '',
          housing_type: ''
        },
        infrastructure: locality.infrastructure || {
          power_stability: 'Good',
          internet_quality: 'Fiber',
          road_width: ''
        }
      });
      setJsonInput(JSON.stringify(locality, null, 2));
    } else {
      setFormData({
        name: '',
        slug: '',
        display_name: '',
        city_id: '',
        primary_pincode: '',
        pincodes: [],
        is_active: true,
        is_serviceable: true,
        priority: 0,
        geo: {
          coordinates: { lat: 0, lng: 0 },
          bounds: { north: 0, south: 0, east: 0, west: 0 }
        },
        demographics: {
          population_density: '',
          avg_income_level: '',
          housing_type: ''
        },
        infrastructure: {
          power_stability: 'Good',
          internet_quality: 'Fiber',
          road_width: ''
        }
      });
      setJsonInput('');
    }
    setError(null);
  }, [locality, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => locality ? updateLocality(locality._id, data) : createLocality(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localities'] });
      onClose();
    },
    onError: (err: any) => setError(err.message || 'Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'form') {
      mutation.mutate(formData);
    } else {
      try {
        const parsedData = JSON.parse(jsonInput);
        mutation.mutate(parsedData);
      } catch (err) {
        setError('Invalid JSON format');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  const handlePincodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincodes = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, pincodes }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-modal-zoom">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg animate-float">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {locality ? 'Edit Locality' : 'Add New Locality'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Manage locality information and boundaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-4 bg-slate-900/50 border-b border-amber-500/10">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <Database className="w-4 h-4" />
            Form Input
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'json'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
            }`}
          >
            <Code className="w-4 h-4" />
            JSON Input
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'form' ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl p-6 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Locality Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="Enter locality name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="locality-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        name="display_name"
                        value={formData.display_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="Display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">City ID</label>
                      <input
                        type="text"
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="Enter city ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Primary Pincode</label>
                      <input
                        type="text"
                        name="primary_pincode"
                        value={formData.primary_pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="400001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pincodes (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.pincodes.join(', ')}
                        onChange={handlePincodesChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                        placeholder="400001, 400002"
                      />
                    </div>
                  </div>
                </div>

                {/* Demographics */}
                <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-xl p-6 border border-orange-500/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">Demographics & Infrastructure</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Population Density</label>
                      <input
                        type="text"
                        value={formData.demographics?.population_density || ''}
                        onChange={(e) => handleNestedChange('demographics', 'population_density', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        placeholder="High, Medium, Low"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Avg Income Level</label>
                      <input
                        type="text"
                        value={formData.demographics?.avg_income_level || ''}
                        onChange={(e) => handleNestedChange('demographics', 'avg_income_level', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                        placeholder="High, Medium, Low"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Power Stability</label>
                      <select
                        value={formData.infrastructure?.power_stability || 'Good'}
                        onChange={(e) => handleNestedChange('infrastructure', 'power_stability', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Internet Quality</label>
                      <select
                        value={formData.infrastructure?.internet_quality || 'Fiber'}
                        onChange={(e) => handleNestedChange('infrastructure', 'internet_quality', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                      >
                        <option value="Fiber">Fiber</option>
                        <option value="DSL">DSL</option>
                        <option value="Mobile Only">Mobile Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-amber-500/10">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-amber-500/30 text-amber-500 focus:ring-2 focus:ring-amber-500/50"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Locality is active
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-amber-500/10">
                    <input
                      type="checkbox"
                      id="is_serviceable"
                      name="is_serviceable"
                      checked={formData.is_serviceable}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-amber-500/30 text-amber-500 focus:ring-2 focus:ring-amber-500/50"
                    />
                    <label htmlFor="is_serviceable" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Locality is serviceable
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-semibold text-white">JSON Payload</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Enter a single locality object or an array of localities for bulk creation
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 px-4 py-3 bg-slate-950/50 border border-amber-500/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
                    placeholder={`{\n  "name": "Andheri West",\n  "slug": "andheri-west",\n  "city_id": "...",\n  "primary_pincode": "400053",\n  "is_active": true,\n  "is_serviceable": true\n}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-amber-500/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {locality ? 'Update Locality' : 'Create Locality'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
