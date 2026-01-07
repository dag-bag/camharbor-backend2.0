import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  // Master Info
  name: string;
  slug: string;
  type: 'installation' | 'repair' | 'amc' | 'rental' | 'consultation';
  base_price: number;
  
  // Display
  icon?: string;
  thumbnail?: string;
  
  // Status
  is_active: boolean;
  priority: number;

  // Metadata
  category?: string; // e.g., "CCTV", "Biometric", "Video Door Phone"

  // Operational Details
  warranty_months?: number;
  installation_time_minutes?: number; // estimated
  required_technician_level?: 'L1' | 'L2' | 'L3';
  included_materials?: string[];
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  type: { 
    type: String, 
    enum: ['installation', 'repair', 'amc', 'rental', 'consultation'], 
    required: true,
    index: true 
  },
  base_price: { type: Number, required: true },
  
  icon: { type: String },
  thumbnail: { type: String },
  
  is_active: { type: Boolean, default: true, index: true },
  priority: { type: Number, default: 0 },

  category: { type: String, index: true }, // e.g., "CCTV", "Access Control"
  
  // Operational Details
  warranty_months: { type: Number, default: 0 },
  installation_time_minutes: { type: Number, default: 60 },
  required_technician_level: { type: String, enum: ['L1', 'L2', 'L3'], default: 'L1' },
  included_materials: [String]

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<IService>('Service', ServiceSchema);
