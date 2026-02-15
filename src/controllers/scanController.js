const Scan = require('../models/Scan');
const Product = require('../models/Product');
const { calculateGst } = require('../utils/gstCalculator');
const { getRateByCategory } = require('../utils/gstRates'); // Import the utility

exports.createScan = async (req, res) => {
    try {
        const { barcode, name, image, category, pricePaid, quantity, gstRate } = req.body;

        // 1. Find or Create Product
        let product = await Product.findOne({ barcode });

       if (!product) {
            // Determine the correct GST rate automatically
            const autoGstRate = getRateByCategory(category);

            product = new Product({
                barcode,
                name,
                image,
                category: category || 'General',
                avgPrice: pricePaid,
                priceCount: 1,
                gstRate: autoGstRate // Set automatically!
            });
        } else {
            // Update existing product's average price (Crowdsourcing Logic)
            const totalPreviousValue = product.avgPrice * product.priceCount;
            product.priceCount += 1;
            product.avgPrice = (totalPreviousValue + pricePaid) / product.priceCount;

            // B) FIX: If the stored product has no image, but we just got one, SAVE IT
            if (!product.image && image) {
                product.image = image;
            }

            // C) Optional: Update category if it was "General" before but now we have specific data
            if (product.category === 'General' && category) {
                product.category = category;
                product.gstRate = getRateByCategory(category);
            }
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

// @desc    Get user scan history
// @route   GET /api/scans/history
exports.getScanHistory = async (req, res) => {
    try {
        const history = await Scan.find({ user: req.user._id })
            .sort({ date: -1 }) // Newest scans first
            .populate('product', 'name image category'); // Pull name & image from Product model

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};