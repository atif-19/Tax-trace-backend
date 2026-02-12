const axios = require('axios');

exports.fetchFromExternalAPI = async (barcode) => {
    try {
        // OpenFoodFacts is a free, open database
        const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        const response = await axios.get(url);

        if (response.data.status === 1) {
            const { product } = response.data;
            return {
                name: product.product_name || 'Unknown Product',
                image: product.image_url || '',
                category: product.categories?.split(',')[0] || 'General',
                source: 'external'
            };
        }
        
        return null; // Product not found externally either
    } catch (error) {
        console.error('External API Error:', error.message);
        return null;
    }
};