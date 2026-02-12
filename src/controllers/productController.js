const Product = require('../models/Product');
const { fetchFromExternalAPI } = require('../services/productLookupService');

exports.lookupProduct = async (req, res) => {
    try {
        const { barcode } = req.body;

        if (!barcode) {
            return res.status(400).json({ message: 'Barcode is required' });
        }

        // 1. Search in local database
        let product = await Product.findOne({ barcode });

        if (product) {
            return res.status(200).json({
                success: true,
                data: product,
                source: 'database'
            });
        }

        // 2. Search in External API
        const externalData = await fetchFromExternalAPI(barcode);

        if (externalData) {
            
            await Product.insertOne();

            return res.status(200).json({
                success: true,
                data: externalData,
                source: 'external'
            });
        }

        // 3. Not found anywhere
        res.status(404).json({
            success: false,
            message: 'Product not found. You can add it manually.'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};