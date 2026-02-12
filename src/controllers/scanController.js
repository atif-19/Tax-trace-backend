const Scan = require('../models/Scan');
const Product = require('../models/Product');
const { calculateGst } = require('../utils/gstCalculator');


exports.createScan = async (req, res) => {
    try {
        const { barcode, name, image, category, pricePaid, quantity, gstRate } = req.body;

        // 1. Find or Create Product
        let product = await Product.findOne({ barcode });

        if (!product) {
            // New product in our ecosystem
            product = new Product({
                barcode,
                name,
                image,
                category,
                avgPrice: pricePaid,
                priceCount: 1,
                gstRate: gstRate || 18 // Default if not provided
            });
        } else {
            // Update existing product's average price (Crowdsourcing Logic)
            const totalPreviousValue = product.avgPrice * product.priceCount;
            product.priceCount += 1;
            product.avgPrice = (totalPreviousValue + pricePaid) / product.priceCount;
        }
        
        await product.save();

        // 2. Calculate GST
        const gstDetails = calculateGst(pricePaid, product.gstRate, quantity);

        // 3. Save the Scan
        const scan = await Scan.create({
            user: req.user._id, // Available thanks to authMiddleware
            product: product._id,
            pricePaid,
            quantity,
            gstRate: product.gstRate,
            gstAmount: gstDetails.gstPerUnit,
            totalGstAmount: gstDetails.totalGstAmount
        });

        res.status(201).json({
            success: true,
            data: scan,
            updatedProduct: product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};