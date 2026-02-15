const GST_SLABS = {
    NIL: 0,             // Fresh, unbranded essentials
    REDUCED: 5,         // Packaged staples, processed food, dairy
    PRESERVED: 12,      // Jams, jellies, juices
    STANDARD: 18,       // Chocolates, cocoa, premium soups
    PREMIUM_SIN: 40,    // Aerated/Sugary/Caffeinated beverages
};

const CATEGORY_MAP = {
    // 40% Slab (Sin Goods)
    'cola': GST_SLABS.PREMIUM_SIN,
    'soda': GST_SLABS.PREMIUM_SIN,
    'energy-drink': GST_SLABS.PREMIUM_SIN,
    'aerated': GST_SLABS.PREMIUM_SIN,

    // 18% Slab (Premium/Unhealthy)
    'chocolate': GST_SLABS.STANDARD,
    'cocoa': GST_SLABS.STANDARD,
    'soup': GST_SLABS.STANDARD,

    // 12% Slab (Preserved/Processed)
    'jam': GST_SLABS.PRESERVED,
    'jelly': GST_SLABS.PRESERVED,
    'juice': GST_SLABS.PRESERVED,

    // 5% Slab (The New Standard for Processed/Packaged)
    'packaged': GST_SLABS.REDUCED,
    'branded': GST_SLABS.REDUCED,
    'biscuits': GST_SLABS.REDUCED,
    'snacks': GST_SLABS.REDUCED,
    'dairy': GST_SLABS.REDUCED,
    'cheese': GST_SLABS.REDUCED,
    'ghee': GST_SLABS.REDUCED,
    'butter': GST_SLABS.REDUCED,
    'namkeen': GST_SLABS.REDUCED,
    'sweets': GST_SLABS.REDUCED,
    'edible-oil': GST_SLABS.REDUCED,
    'flour': GST_SLABS.REDUCED,
    'rice': GST_SLABS.REDUCED,

    // 0% Slab (Fresh Essentials)
    'fresh': GST_SLABS.NIL,
    'vegetables': GST_SLABS.NIL,
    'fruits': GST_SLABS.NIL,
    'milk': GST_SLABS.NIL,
    'bread': GST_SLABS.NIL,
};

exports.getRateByCategory = (category) => {
    if (!category) return GST_SLABS.REDUCED; // 2026 default is safer at 5% for packaged goods

    const normalizedCategory = category.toLowerCase().trim();
    
    for (const [key, value] of Object.entries(CATEGORY_MAP)) {
        if (normalizedCategory.includes(key)) {
            return value;
        }
    }

    return GST_SLABS.REDUCED; // Fallback to 5% for most food items
};