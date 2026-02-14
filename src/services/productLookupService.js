const axios = require('axios');

exports.fetchFromExternalAPI = async (barcode) => {
    try {
        // 1. Clean the barcode (remove any spaces)
        const cleanBarcode = barcode.trim();

        // 2. OpenFoodFacts URL
        const url = `https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`;
        
        const response = await axios.get(url, {
            headers: {
                // MANDATORY: Identify your app to OFF
                'User-Agent': 'TaxTraceApp/1.0 (contact: your-email@example.com)'
            },
            timeout: 5000 // 5 second timeout
        });

        // status 1 means product found
        if (response.data && response.data.status === 1) {
            const { product } = response.data;
            
            return {
                barcode: cleanBarcode,
                // Try multiple fields as names vary by region
                name: product.product_name || product.product_name_en || product.generic_name || 'Unknown Product',
                image: product.image_url || product.image_front_url || '',
                // Categories can be a messy string, we take the first part
                category: product.categories ? product.categories.split(',')[0] : 'General',
                source: 'external'
            };
        }
        
        return null; 
    } catch (error) {
        console.error('Lookup Error for barcode', barcode, ':', error.message);
        return null;
    }
};