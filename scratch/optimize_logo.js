import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = readFileSync(join(__dirname, '../public/app_logo.png'));
console.log('Original size:', data.length, 'bytes');

// Write just the size info - we'll use the favicon instead for login
const favicon32 = readFileSync(join(__dirname, '../public/android-chrome-192x192.png'));
console.log('android-chrome-192x192.png size:', favicon32.length, 'bytes');
const b64 = favicon32.toString('base64');
writeFileSync(join(__dirname, 'logo_b64.txt'), 'data:image/png;base64,' + b64);
console.log('Written base64 of 192x192 icon to scratch/logo_b64.txt');
