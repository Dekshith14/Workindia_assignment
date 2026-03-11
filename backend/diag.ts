import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('Keys of pdf:', Object.keys(pdf));
if (pdf.default) {
    console.log('Type of pdf.default:', typeof pdf.default);
}
try {
    const result = pdf(Buffer.from([]));
    console.log('pdf() called successfully (likely failed parse but is function)');
} catch (e) {
    console.log('pdf() failed:', e.message);
}
if (pdf.default) {
    try {
        const result = pdf.default(Buffer.from([]));
        console.log('pdf.default() called successfully');
    } catch (e) {
        console.log('pdf.default() failed:', e.message);
    }
}
