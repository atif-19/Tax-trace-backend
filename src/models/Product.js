const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
        index: true // Makes searching by barcode lightning fast
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'General'
    },
    avgPrice: {
        type: Number,
        default: 0
    },
    priceCount: {
        type: Number,
        default: 0
    },
    gstRate: {
        type: Number,
        default: 18 // Default slab, can be updated later
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);