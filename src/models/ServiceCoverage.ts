import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IServiceCoverage extends Document {
  service_id: Types.ObjectId;
  
  // Geo Scope - Logic: "If locality is set, applies to it. Else if zone, applies to it. Else city."
  city_id: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  is_available: boolean;
  reason?: string; // e.g., "High crime risk area - service suspended"
}

const ServiceCoverageSchema: Schema = new Schema({
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  is_available: { type: Boolean, required: true },
  reason: { type: String }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Composite index for finding coverage efficiently
ServiceCoverageSchema.index({ service_id: 1, city_id: 1, zone_id: 1, locality_id: 1 });

export default mongoose.model<IServiceCoverage>('ServiceCoverage', ServiceCoverageSchema);
