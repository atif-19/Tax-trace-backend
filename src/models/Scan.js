const mongoose = require('mongoose');
// this schema track all the purchases
const scanSchema = new mongoose.Schema({
    // user who bought the item
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // the item
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // price of all items
    pricePaid: { type: Number, required: true },
    quantity: { type: Number, default: 1 }, // quantity
    gstRate: { type: Number, required: true },//rate
    gstAmount: { type: Number, required: true }, // GST for 1 unit
    totalGstAmount: { type: Number, required: true }, // GST for all units
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Scan', scanSchema);