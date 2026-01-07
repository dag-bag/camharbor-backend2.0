import React, { useState, useEffect } from 'react';
import { X, Box, Truck, CheckCircle2, Loader2, AlertCircle, Save, Package, Code, Database, Server } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct } from '../services/productApi';
import type { Product } from '../types/product.types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export function AddProductModal({ isOpen, onClose, product }: AddProductModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: '',
    brand: '',
    product_model: '',
    price: 0,
    capabilities: [] as string[],
    stock_status: 'in_stock' as 'in_stock' | 'out_of_stock' | 'backorder',
    supplier_name: '',
    supplier_lead_time_days: 0,
    minimum_order_quantity: 1,
    is_active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        type: product.type || '',
        brand: product.brand || '',
        product_model: product.product_model || '',
        price: product.price || 0,
        capabilities: product.capabilities || [],
        stock_status: product.stock_status || 'in_stock',
        supplier_name: product.supplier_name || '',
        supplier_lead_time_days: product.supplier_lead_time_days || 0,
        minimum_order_quantity: product.minimum_order_quantity || 1,
        is_active: product.is_active ?? true,
      });
      setJsonInput(JSON.stringify(product, null, 2));
    } else {
      // Reset form when modal opens for new product
      setFormData({
        name: '',
        slug: '',
        type: '',
        brand: '',
        product_model: '',
        price: 0,
        capabilities: [],
        stock_status: 'in_stock',
        supplier_name: '',
        supplier_lead_time_days: 0,
        minimum_order_quantity: 1,
        is_active: true,
      });
      setJsonInput('');
    }
    setError(null);
  }, [product, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: any) => product ? updateProduct(product._id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
        
        // Handle both single object and array of objects
        if (Array.isArray(parsedData)) {
          // For bulk creation, send the array directly
          mutation.mutate(parsedData);
        } else {
          mutation.mutate(parsedData);
        }
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

  const handleCapabilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capabilities = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, capabilities }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-modal-zoom">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg animate-float">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Manage product inventory and specifications</p>
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
        <div className="flex gap-2 p-4 bg-slate-900/50 border-b border-cyan-500/10">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
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
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
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
                <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl p-6 border border-cyan-500/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Box className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter product name"
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
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="product-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Camera, DVR, NVR, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                      <input
                        type="text"
                        name="product_model"
                        value={formData.product_model}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter model number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Capabilities (comma-separated)</label>
                      <input
                        type="text"
                        name="capabilities"
                        value={formData.capabilities.join(', ')}
                        onChange={handleCapabilitiesChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Night Vision, Motion Detection, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory & Supply */}
                <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl p-6 border border-blue-500/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Inventory & Supply</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Stock Status</label>
                      <select
                        name="stock_status"
                        value={formData.stock_status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="backorder">Backorder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Supplier Name</label>
                      <input
                        type="text"
                        name="supplier_name"
                        value={formData.supplier_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Lead Time (days)</label>
                      <input
                        type="number"
                        name="supplier_lead_time_days"
                        value={formData.supplier_lead_time_days}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Order Qty</label>
                      <input
                        type="number"
                        name="minimum_order_quantity"
                        value={formData.minimum_order_quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-cyan-500/10">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-cyan-500/30 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Product is active and visible
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-cyan-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">JSON Payload</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Enter a single product object or an array of products for bulk creation
                  </p>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full h-96 px-4 py-3 bg-slate-950/50 border border-cyan-500/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                    placeholder={`{\n  "name": "4K Security Camera",\n  "slug": "4k-security-camera",\n  "type": "Camera",\n  "brand": "Hikvision",\n  "product_model": "DS-2CD2385G1",\n  "price": 12500,\n  "capabilities": ["Night Vision", "Motion Detection"],\n  "stock_status": "in_stock",\n  "supplier_name": "Tech Supplies Ltd",\n  "supplier_lead_time_days": 7,\n  "minimum_order_quantity": 1,\n  "is_active": true\n}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-cyan-500/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
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
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
