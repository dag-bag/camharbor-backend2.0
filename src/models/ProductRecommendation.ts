import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProductRecommendation extends Document {
  // Context: Recommended for which service?
  service_id?: Types.ObjectId;
  
  // Target Product
  product_id: Types.ObjectId;

  // Region Scope
  city_id?: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  // Logic
  priority: number; // Higher is better recommendation
  reason: string; // "Best for low light conditions in this area"
}

const ProductRecommendationSchema: Schema = new Schema({
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', index: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  priority: { type: Number, default: 0 },
  reason: String

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<IProductRecommendation>('ProductRecommendation', ProductRecommendationSchema);
