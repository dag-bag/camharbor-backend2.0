
import mongoose from 'mongoose';
import Locality from '../models/Locality';
import Service from '../models/Service';
import ServiceCoverage from '../models/ServiceCoverage';
import ServiceContent from '../models/ServiceContent';
import ServicePricing from '../models/ServicePricing';
import Product from '../models/Product';
import ProductAvailability from '../models/ProductAvailability';
import ProductRecommendation from '../models/ProductRecommendation';
import CrimeStat from '../models/CrimeStat';
import RiskProfile from '../models/RiskProfile';
import RiskParameter from '../models/RiskParameter';

async function verify() {
  try {
    console.log('Verifying Schemas...');
    
    console.log('1. Locality:', Locality.modelName);
    console.log('2. Service:', Service.modelName);
    console.log('3. ServiceCoverage:', ServiceCoverage.modelName);
    console.log('4. ServiceContent:', ServiceContent.modelName);
    console.log('5. ServicePricing:', ServicePricing.modelName);
    console.log('6. Product:', Product.modelName);
    console.log('7. ProductAvailability:', ProductAvailability.modelName);
    console.log('8. ProductRecommendation:', ProductRecommendation.modelName);
    console.log('9. CrimeStat:', CrimeStat.modelName);
    console.log('10. RiskProfile:', RiskProfile.modelName);
    console.log('11. RiskParameter:', RiskParameter.modelName);

    console.log('✅ All schemas loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error loading schemas:', error);
    process.exit(1);
  }
}

verify();
