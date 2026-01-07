import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRiskProfile extends Document {
  // Scope
  city_id: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;

  // Derived Metrics
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_score: number; // 1-100
  
  dominant_crimes: string[]; // ["theft", "burglary"]
  
  // Specific Risks
  night_risk: number; // 1-10
  outdoor_risk: number; // 1-10
  commercial_risk: number; // 1-10

  last_calculated_at: Date;
}

const RiskProfileSchema: Schema = new Schema({
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  risk_level: { 
    type: String, 
    enum: ['low', 'moderate', 'high', 'critical'], 
    default: 'moderate' 
  },
  risk_score: { type: Number, required: true },
  
  dominant_crimes: [String],

  night_risk: Number,
  outdoor_risk: Number,
  commercial_risk: Number,

  last_calculated_at: { type: Date, default: Date.now }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Ensure one profile per location scope
RiskProfileSchema.index({ city_id: 1, zone_id: 1, locality_id: 1 }, { unique: true });

export default mongoose.model<IRiskProfile>('RiskProfile', RiskProfileSchema);
