import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProductAvailability extends Document {
  product_id: Types.ObjectId;
  
  // Scope
  city_id?: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  is_available: boolean;
  reason?: string; // "Out of stock in this region", "Not suitable for coastal areas"
}

const ProductAvailabilitySchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  is_available: { type: Boolean, required: true },
  reason: String

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Find specific overrides quickly
ProductAvailabilitySchema.index({ product_id: 1, city_id: 1, zone_id: 1, locality_id: 1 });

export default mongoose.model<IProductAvailability>('ProductAvailability', ProductAvailabilitySchema);
