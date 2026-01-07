import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICrimeStat extends Document {
  // Scope
  city_id: Types.ObjectId;
  zone_id?: Types.ObjectId;
  locality_id?: Types.ObjectId;
  
  // Timeframe
  year: number;
  month?: number; // 1-12, optional for annual stats

  // Data
  total_crimes: number;
  breakdown: {
    theft?: number;
    burglary?: number;
    vandalism?: number;
    assault?: number;
    other?: number;
  };
  
  source?: string; // "NCRB", "Local Police"
  confidence_score?: number; // 0-1
}

const CrimeStatSchema: Schema = new Schema({
  city_id: { type: Schema.Types.ObjectId, ref: 'City', required: true, index: true },
  zone_id: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  locality_id: { type: Schema.Types.ObjectId, ref: 'Locality', index: true },

  year: { type: Number, required: true },
  month: Number,

  total_crimes: { type: Number, required: true },
  breakdown: {
    theft: Number,
    burglary: Number,
    vandalism: Number,
    assault: Number,
    other: Number
  },

  source: String,
  confidence_score: Number

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Efficient lookups for stats by location and time
CrimeStatSchema.index({ city_id: 1, zone_id: 1, locality_id: 1, year: 1, month: 1 });

export default mongoose.model<ICrimeStat>('CrimeStat', CrimeStatSchema);
