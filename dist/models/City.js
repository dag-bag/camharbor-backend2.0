"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CitySchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    display_name: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    tags: [String],
    geo: {
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        bounds: {
            north: Number,
            south: Number,
            east: Number,
            west: Number
        },
        timezone: String,
        area_km2: Number,
        population: Number,
        density_per_km2: Number,
        elevation_m: Number
    },
    environment: {
        climate: {
            type: { type: String },
            summer_temp_c: String,
            winter_temp_c: String,
            monsoon_months: [String],
            annual_rainfall_mm: Number
        },
        air_quality: {
            avg_aqi: Number,
            classification: String,
            worst_months: [String],
            best_months: [String]
        },
        water: {
            source: [String],
            supply_hours_per_day: Number,
            quality_rating: String,
            availability: String
        },
        green_cover_percent: Number,
        noise_pollution: String
    },
    infrastructure: {
        power: {
            provider: [String],
            avg_daily_cuts: Number,
            avg_cut_duration_mins: Number,
            reliability_score: Number,
            industrial_connectivity: String
        },
        internet: {
            fiber_providers: [String],
            avg_speed_mbps: Number,
            reliability_score: Number,
            '4g_coverage': String,
            '5g_available': Boolean
        },
        housing: {
            avg_rent_1bhk: Number,
            avg_rent_2bhk: Number,
            avg_rent_3bhk: Number,
            avg_property_price_per_sqft: Number,
            availability: String
        },
        public_transport: [String],
        road_quality: String,
        metro_connectivity: Boolean,
        airport_distance_km: Number,
        railway_stations: Number
    },
    security: {
        threat_profile: {
            crime_rate: String,
            common_crimes: [String],
            safe_score: Number,
            safe_areas: [String],
            areas_to_avoid: [String]
        },
        police: {
            stations_count: Number,
            response_time_mins: Number,
            emergency_number: String,
            dedicated_cyber_cell: Boolean
        },
        cctv_coverage: String,
        women_safety_rating: String
    },
    zones: [{
            id: String,
            name: String,
            slug: String,
            description: String,
            type: { type: String },
            key_localities: [String],
            suitable_for: [String],
            avg_security_rating: Number,
            cctv_demand: String,
            popular_camera_types: [String]
        }],
    seo: {
        meta_title: String,
        meta_description: String,
        keywords: [String],
        og_image: String,
        canonical_url: String
    },
    operations: {
        office: {
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            },
            contact_phone: String,
            contact_email: String,
            working_days: [String]
        },
        hours: {
            monday_friday: String,
            saturday: String,
            sunday: String,
            holidays: String
        },
        service_areas: [String],
        coverage_radius_km: Number,
        avg_response_time_hrs: Number
    },
    reviews: {
        total_count: Number,
        avg_rating: Number,
        rating_distribution: {
            '1': Number,
            '2': Number,
            '3': Number,
            '4': Number,
            '5': Number
        },
        featured: [{
                id: String,
                author: String,
                rating: Number,
                date: String,
                text: String,
                project_type: String,
                location: String,
                verified: Boolean
            }]
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.default = mongoose_1.default.model('City', CitySchema);
