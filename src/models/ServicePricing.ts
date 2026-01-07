import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IServicePricing extends Document {
  service_id: Types.ObjectId;
  
  // Scope
  city_id?: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  // Pricing Logic
  base_price_override?: number; // If set, ignores master base_price
  multiplier: number; // e.g. 1.2 for premium areas
  
  valid_from?: Date;
  valid_to?: Date;
  reason?: string; // "Holiday surcharge", "High demand zone"
}

const ServicePricingSchema: Schema = new Schema({
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  base_price_override: { type: Number },
  multiplier: { type: Number, default: 1.0 },
  
  valid_from: Date,
  valid_to: Date,
  reason: String

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<IServicePricing>('ServicePricing', ServicePricingSchema);
