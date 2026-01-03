import fs from 'fs';
import path from 'path';

const SOURCE_PATH = path.join(__dirname, '../models/City.ts');
const DEST_PATH = path.join(__dirname, '../../dashboard/src/types/city.types.ts');

const syncTypes = () => {
  console.log('🔄 Syncing City types from Backend to Dashboard...');

  try {
    const content = fs.readFileSync(SOURCE_PATH, 'utf-8');

    // 1. Extract interfaces
    // We want to capture everything from "export interface" down to the closing brace
    // simpler approach: split by lines and process
    const lines = content.split('\n');
    let outputLines: string[] = [];
    let isCaptureMode = false;

    outputLines.push('/**');
    outputLines.push(' * 🔴 DO NOT EDIT MANUALLY');
    outputLines.push(' * This file is auto-generated from src/models/City.ts');
    outputLines.push(' * Run `npm run sync:types` in backend to update.');
    outputLines.push(' */');
    outputLines.push('');

    // Add necessary helper types if they aren't in the model interfaces
    // e.g. Coordinates, Bounds might be inline in model but explicit in types file?
    // In the model file provided, they seem to be inline in ICity or not explicitly exported as interfaces at the top.
    // Let's check the model file again.
    // The model file has `export interface ICityMedia` and `export interface ICity`.
    // Nested objects in `ICity` are defined inline (e.g. `geo: { ... }`).
    // This script might be too simple if we want granular interfaces (like `Geo`, `Environment`) for the frontend.
    // However, for now, let's extract what IS exported.
    
    // Better approach for now: 
    // The previous manual `city.types.ts` had many granular interfaces.
    // The `City.ts` mostly has inline types.
    // To make this robust, we should probably refactor `City.ts` to use named interfaces if we want named interfaces in frontend.
    // BUT, the user wants "automatic reflect". 
    // If I just dump `ICity` as `City` with inline types, TypeScript is happy, but it might be less readable or reusable.
    // Let's try to extract `ICity` and `ICityMedia`.
    
    // We also need to strip `extends Document` and `import ...`.

    for (const line of lines) {
        if (line.includes('const CitySchema')) {
            isCaptureMode = false;
            break;
        }

        if (line.includes('export interface')) {
            isCaptureMode = true;
            let cleanedLine = line.replace('extends Document', '').replace('export interface ICity', 'export interface City');
            
            // Allow ICityMedia to stay or rename? Let's keep it but maybe rename to Media if we want consistency?
            // The frontend previous type led was `Media`. `City.ts` has `ICityMedia`.
            cleanedLine = cleanedLine.replace('ICityMedia', 'Media');
            
            outputLines.push(cleanedLine);
        } else if (isCaptureMode) {
            if (line.trim().startsWith('//')) {
                 outputLines.push(line); // Keep comments!
            } else if (line.includes('import ')) {
                // skip imports inside interfaces? unlikely but safety check
            } else {
                 // Check for ICityMedia usage inside ICity
                 let cleanedLine = line.replace('ICityMedia', 'Media');
                 
                 // Remove mongoose specific fields if any (like _id is usually on Document, but we removed extends Document)
                 outputLines.push(cleanedLine);
            }
        }
        
        // Basic logic to stop capturing? 
        // Acutally `City.ts` has the schema at the bottom. 
        // We stop when we hit `// ============== SCHEMA ==============` or `const CitySchema`
        if (line.includes('const CitySchema')) {
            isCaptureMode = false;
            break;
        }
    }
    
    // We need to handle the closing braces correctly. 
    // The simple lineReader might push extra stuff.
    // Since `City.ts` has interfaces at the top and Schema at bottom, 
    // we can just read until the Schema definition starts.
    
    // Refined approach:
    // Read generated text.
    
    const fileContent = outputLines.join('\n');
    
    // Add ApiResponse wrapper which is needed by frontend
    const apiResponseWrapper = `
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
`;

    fs.writeFileSync(DEST_PATH, fileContent + apiResponseWrapper);
    console.log('✅ Types synced successfully!');

  } catch (err) {
    console.error('❌ Error syncing types:', err);
    process.exit(1);
  }
};

syncTypes();
