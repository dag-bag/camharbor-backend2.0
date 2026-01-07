import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  // Master Identity
  name: string;
  slug: string;
  category: string; // "Camera", "DVR", "Cable", "Accessory"
  brand: string;    // "Hikvision", "CP Plus"
  product_model: string; // Renamed from 'model' to avoid conflict with Mongoose Document.model
  
  // Details
  specs: Record<string, any>; 
  base_price: number;
  capabilities: string[]; 

  // Inventory & Supply

  // Inventory & Supply
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplier?: {
    name: string;
    lead_time_days: number;
  };
  min_order_quantity?: number;

  // Status
  is_active: boolean;
  priority: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  product_model: { type: String, required: true },

  specs: { type: Map, of: Schema.Types.Mixed }, 
  base_price: { type: Number, required: true },
  capabilities: [String],

  // Inventory & Supply
  stock_status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
  supplier: {
    name: String,
    lead_time_days: Number
  },
  min_order_quantity: { type: Number, default: 1 },

  is_active: { type: Boolean, default: true, index: true },
  priority: { type: Number, default: 0 }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

ProductSchema.index({ brand: 1, category: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
