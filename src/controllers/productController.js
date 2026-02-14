const Product = require('../models/Product');
const { fetchFromExternalAPI } = require('../services/productLookupService');

exports.lookupProduct = async (req, res) => {
    try {
        const { barcode } = req.body;

        if (!barcode) {
            return res.status(400).json({ message: 'Barcode is required' });
        }

        // 1. Check local DB first
        // let product = await Product.findOne({ barcode });

        // if (product) {
        //     return res.status(200).json({
        //         success: true,
        //         data: product,
        //         source: 'database'
        //     });
        // }

        // 2. Search External API
        const externalData = await fetchFromExternalAPI(barcode);

        if (externalData) {
            // WE DO NOT SAVE YET. 
            // We return this to the frontend so the user can add the PRICE.
            return res.status(200).json({
                success: true,
                data: externalData,
                source: 'external'
            });
        }

        res.status(404).json({
            success: false,
            message: 'Product not found in global database. Please enter details manually.'
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};