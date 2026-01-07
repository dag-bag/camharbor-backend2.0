import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IServiceContent extends Document {
  service_id: Types.ObjectId;
  
  // Scope
  city_id: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  // Content
  title: string; // "CCTV Installation in Karol Bagh"
  description: string;
  meta_title?: string;
  meta_description?: string;
  
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const ServiceContentSchema: Schema = new Schema({
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
  
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone' },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality' },

  title: { type: String, required: true },
  description: { type: String, required: true },
  meta_title: String,
  meta_description: String,
  
  faqs: [{
    question: String,
    answer: String
  }]

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Unique content per location scope for a service
ServiceContentSchema.index({ service_id: 1, city_id: 1, zone_id: 1, locality_id: 1 }, { unique: true });

export default mongoose.model<IServiceContent>('ServiceContent', ServiceContentSchema);
