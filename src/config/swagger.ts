import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CamHarbor API',
      version: '1.0.0',
      description: 'API Documentation for CamHarbor Backend',
      contact: {
        name: 'CamHarbor Support',
        url: 'https://camharbor.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        City: {
          type: 'object',
          required: ['slug', 'name', 'display_name', 'state', 'country', 'geo'],
          properties: {
            slug: { type: 'string' },
            name: { type: 'string' },
            display_name: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' },
            is_active: { type: 'boolean', default: true },
            priority: { type: 'number', default: 0 },
            tags: { 
              type: 'array',
              items: { type: 'string' }
            },
            geo: {
              type: 'object',
              properties: {
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' }
                  }
                },
                bounds: {
                  type: 'object',
                  properties: {
                    north: { type: 'number' },
                    south: { type: 'number' },
                    east: { type: 'number' },
                    west: { type: 'number' }
                  }
                },
                timezone: { type: 'string' },
                area_km2: { type: 'number' },
                population: { type: 'number' },
                density_per_km2: { type: 'number' },
                elevation_m: { type: 'number' }
              }
            },
            environment: {
              type: 'object',
              properties: {
                climate: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    summer_temp_c: { type: 'string' },
                    winter_temp_c: { type: 'string' },
                    monsoon_months: { type: 'array', items: { type: 'string' } },
                    annual_rainfall_mm: { type: 'number' }
                  }
                },
                air_quality: {
                  type: 'object',
                  properties: {
                    avg_aqi: { type: 'number' },
                    classification: { type: 'string' },
                    worst_months: { type: 'array', items: { type: 'string' } },
                    best_months: { type: 'array', items: { type: 'string' } }
                  }
                },
                water: {
                  type: 'object',
                  properties: {
                    source: { type: 'array', items: { type: 'string' } },
                    supply_hours_per_day: { type: 'number' },
                    quality_rating: { type: 'string' },
                    availability: { type: 'string' }
                  }
                },
                green_cover_percent: { type: 'number' },
                noise_pollution: { type: 'string' }
              }
            },
            infrastructure: {
              type: 'object',
              properties: {
                power: {
                  type: 'object',
                  properties: {
                    provider: { type: 'array', items: { type: 'string' } },
                    avg_daily_cuts: { type: 'number' },
                    avg_cut_duration_mins: { type: 'number' },
                    reliability_score: { type: 'number' },
                    industrial_connectivity: { type: 'string' }
                  }
                },
                internet: {
                  type: 'object',
                  properties: {
                    fiber_providers: { type: 'array', items: { type: 'string' } },
                    avg_speed_mbps: { type: 'number' },
                    reliability_score: { type: 'number' },
                    '4g_coverage': { type: 'string' },
                    '5g_available': { type: 'boolean' }
                  }
                },
                housing: {
                  type: 'object',
                  properties: {
                    avg_rent_1bhk: { type: 'number' },
                    avg_rent_2bhk: { type: 'number' },
                    avg_rent_3bhk: { type: 'number' },
                    avg_property_price_per_sqft: { type: 'number' },
                    availability: { type: 'string' }
                  }
                },
                public_transport: { type: 'array', items: { type: 'string' } },
                road_quality: { type: 'string' },
                metro_connectivity: { type: 'boolean' },
                airport_distance_km: { type: 'number' },
                railway_stations: { type: 'number' }
              }
            },
            security: {
              type: 'object',
              properties: {
                threat_profile: {
                  type: 'object',
                  properties: {
                    crime_rate: { type: 'string' },
                    common_crimes: { type: 'array', items: { type: 'string' } },
                    safe_score: { type: 'number' },
                    safe_areas: { type: 'array', items: { type: 'string' } },
                    areas_to_avoid: { type: 'array', items: { type: 'string' } }
                  }
                },
                police: {
                  type: 'object',
                  properties: {
                    stations_count: { type: 'number' },
                    response_time_mins: { type: 'number' },
                    emergency_number: { type: 'string' },
                    dedicated_cyber_cell: { type: 'boolean' }
                  }
                },
                cctv_coverage: { type: 'string' },
                women_safety_rating: { type: 'string' }
              }
            },
            zones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  key_localities: { type: 'array', items: { type: 'string' } },
                  suitable_for: { type: 'array', items: { type: 'string' } },
                  avg_security_rating: { type: 'number' },
                  cctv_demand: { type: 'string' },
                  popular_camera_types: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            seo: {
              type: 'object',
              properties: {
                meta_title: { type: 'string' },
                meta_description: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } },
                og_image: { type: 'string' },
                canonical_url: { type: 'string' }
              }
            },
            operations: {
              type: 'object',
              properties: {
                office: {
                  type: 'object',
                  properties: {
                    address: { type: 'string' },
                    coordinates: {
                      type: 'object',
                      properties: {
                        lat: { type: 'number' },
                        lng: { type: 'number' }
                      }
                    },
                    contact_phone: { type: 'string' },
                    contact_email: { type: 'string' },
                    working_days: { type: 'array', items: { type: 'string' } }
                  }
                },
                hours: {
                  type: 'object',
                  properties: {
                    monday_friday: { type: 'string' },
                    saturday: { type: 'string' },
                    sunday: { type: 'string' },
                    holidays: { type: 'string' }
                  }
                },
                service_areas: { type: 'array', items: { type: 'string' } },
                coverage_radius_km: { type: 'number' },
                avg_response_time_hrs: { type: 'number' }
              }
            },
            reviews: {
              type: 'object',
              properties: {
                total_count: { type: 'number' },
                avg_rating: { type: 'number' },
                rating_distribution: {
                  type: 'object',
                  additionalProperties: { type: 'number' }
                },
                featured: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      author: { type: 'string' },
                      rating: { type: 'number' },
                      date: { type: 'string' },
                      text: { type: 'string' },
                      project_type: { type: 'string' },
                      location: { type: 'string' },
                      verified: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          },
          example: {
            slug: "delhi",
            name: "Delhi",
            display_name: "Delhi NCR",
            state: "Delhi",
            country: "India",
            is_active: true,
            priority: 100,
            tags: ["metro", "tier-1"],
            geo: {
              coordinates: { lat: 28.7041, lng: 77.1025 },
              bounds: { north: 28.883, south: 28.404, east: 77.348, west: 76.837 },
              timezone: "Asia/Kolkata",
              area_km2: 1484,
              population: 32941000,
              density_per_km2: 11312,
              elevation_m: 216
            },
            environment: {
              climate: {
                type: "Semiarid",
                summer_temp_c: "25-45",
                winter_temp_c: "5-25",
                monsoon_months: ["July", "August", "September"],
                annual_rainfall_mm: 800
              },
              air_quality: {
                avg_aqi: 200,
                classification: "Poor",
                worst_months: ["November", "December"],
                best_months: ["July", "August"]
              },
              water: {
                source: ["Yamuna River", "Groundwater"],
                supply_hours_per_day: 4,
                quality_rating: "Moderate",
                availability: "Stressed"
              },
              green_cover_percent: 23,
              noise_pollution: "High"
            },
            infrastructure: {
              power: {
                provider: ["BSES", "Tata Power"],
                avg_daily_cuts: 1,
                avg_cut_duration_mins: 30,
                reliability_score: 8,
                industrial_connectivity: "High"
              },
              internet: {
                fiber_providers: ["Airtel", "Jio", "ACT"],
                avg_speed_mbps: 100,
                reliability_score: 9,
                "4g_coverage": "Excellent",
                "5g_available": true
              },
              housing: {
                avg_rent_1bhk: 15000,
                avg_rent_2bhk: 25000,
                avg_rent_3bhk: 40000,
                avg_property_price_per_sqft: 10000,
                availability: "High"
              },
              public_transport: ["Metro", "Bus", "Auto"],
              road_quality: "Good",
              metro_connectivity: true,
              airport_distance_km: 15,
              railway_stations: 4
            },
            security: {
              threat_profile: {
                crime_rate: "Moderate",
                common_crimes: ["Theft", "Snatching"],
                safe_score: 7,
                safe_areas: ["South Delhi", "Central Delhi"],
                areas_to_avoid: ["Outer Delhi fringes at night"]
              },
              police: {
                stations_count: 180,
                response_time_mins: 10,
                emergency_number: "112",
                dedicated_cyber_cell: true
              },
              cctv_coverage: "High",
              women_safety_rating: "Moderate"
            },
            zones: [],
            seo: {
              meta_title: "Delhi City Profile - CamHarbor",
              meta_description: "Comprehensive data and analytics for Delhi.",
              keywords: ["Delhi", "NCR", "India"],
              og_image: "https://example.com/delhi.jpg",
              canonical_url: "https://camharbor.in/cities/delhi"
            },
            operations: {
              office: {
                address: "Connaught Place, New Delhi",
                coordinates: { lat: 28.6304, lng: 77.2177 },
                contact_phone: "+91-11-12345678",
                contact_email: "delhi@camharbor.in",
                working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
              },
              hours: {
                monday_friday: "09:00 - 18:00",
                saturday: "10:00 - 14:00",
                sunday: "Closed",
                holidays: "Closed"
              },
              service_areas: ["All Delhi NCR"],
              coverage_radius_km: 50,
              avg_response_time_hrs: 24
            },
            reviews: {
              total_count: 1500,
              avg_rating: 4.5,
              rating_distribution: { "1": 10, "2": 20, "3": 100, "4": 400, "5": 970 },
              featured: []
            }
          }
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
