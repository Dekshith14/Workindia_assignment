import pdf from 'pdf-parse';
console.log('Type of pdf from import:', typeof pdf);
if (pdf && typeof pdf === 'object') {
    console.log('Keys:', Object.keys(pdf));
}
