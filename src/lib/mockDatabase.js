export const PRODUCTS = [
    {
        id: '123456789',
        name: 'Peanut Butter Crunch',
        ingredients: ['Peanuts', 'Sugar', 'Salt', 'Vegetable Oil'],
        allergens: ['Peanuts'],
        barcode: '123456789'
    },
    {
        id: '987654321',
        name: 'Whole Wheat Bread',
        ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Soybean Oil'],
        allergens: ['Wheat', 'Soy'],
        barcode: '987654321'
    },
    {
        id: '456123789',
        name: 'Almond Milk',
        ingredients: ['Almondmilk', 'Calcium Carbonate', 'Vitamin E Acetate'],
        allergens: ['Tree Nuts (Almonds)'],
        barcode: '456123789'
    },
    {
        id: '111222333',
        name: 'Oat Milk',
        ingredients: ['Oatmilk', 'Sunflower Oil', 'Vitamins'],
        allergens: [], // Safe for most
        barcode: '111222333'
    },
    {
        id: '444555666',
        name: 'Cheese Crackers',
        ingredients: ['Enriched Flour', 'Vegetable Oil', 'Cheese', 'Salt'],
        allergens: ['Wheat', 'Milk'],
        barcode: '444555666'
    }
];

export const COMMON_ALLERGENS = [
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Egg',
    'Wheat',
    'Soy',
    'Fish',
    'Shellfish',
    'Sesame'
];
