import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskParameter extends Document {
  name: string; // "Night Time Safety"
  slug: string; // "night_safety"
  
  // Logic
  min_score: number;
  max_score: number;
  
  // Mapped Capabilities
  required_capabilities: string[]; // ["night_vision", "infrared"]
  recommended_products_category?: string[]; // ["IR Camera"]
  
  is_active: boolean;
}

const RiskParameterSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  
  min_score: Number,
  max_score: Number,
  
  required_capabilities: [String],
  recommended_products_category: [String],
  
  is_active: { type: Boolean, default: true }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<IRiskParameter>('RiskParameter', RiskParameterSchema);
