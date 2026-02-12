/**
 * Calculates GST details from MRP
 * Formula: PriceWithoutGST = MRP / (1 + Rate/100)
 */
exports.calculateGst = (price, gstRate, quantity = 1) => {
    const totalAmount = price * quantity;
    const priceWithoutGst = totalAmount / (1 + gstRate / 100);
    const totalGstAmount = totalAmount - priceWithoutGst;

    return {
        gstPerUnit: (price - (price / (1 + gstRate / 100))).toFixed(2),
        totalGstAmount: totalGstAmount.toFixed(2),
        basePrice: priceWithoutGst.toFixed(2)
    };
};