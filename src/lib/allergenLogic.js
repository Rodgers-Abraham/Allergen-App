import { PRODUCTS } from './mockDatabase';

export const analyzeProduct = (productData, userAllergens) => {
    // productData can be from Mock DB or OpenFoodFacts

    if (!productData) {
        return {
            status: 'unknown',
            product: null,
            message: 'Product not found.'
        };
    }

    let detectedAllergens = [];

    // 1. Check Explicit Allergens (Mock DB style or OpenFoodFacts tags)
    if (productData.allergens_tags) {
        // OpenFoodFacts format: ["en:milk", "en:peanuts"]
        detectedAllergens = productData.allergens_tags.filter(tag => {
            const cleanTag = tag.replace('en:', '').toLowerCase();
            return userAllergens.some(u => cleanTag.includes(u.toLowerCase()));
        });
    } else if (productData.allergens) {
        // Mock DB format
        detectedAllergens = productData.allergens.filter(allergen =>
            userAllergens.some(userAllergen =>
                allergen.toLowerCase().includes(userAllergen.toLowerCase()) ||
                userAllergen.toLowerCase().includes(allergen.toLowerCase())
            )
        );
    }

    // 2. Check Ingredients Text (OCR or Ingredient List)
    if (productData.ingredients) {
        // ingredients can be array or string
        const textToCheck = Array.isArray(productData.ingredients)
            ? productData.ingredients.join(' ').toLowerCase()
            : productData.ingredients.toLowerCase();

        userAllergens.forEach(allergen => {
            if (textToCheck.includes(allergen.toLowerCase()) && !detectedAllergens.includes(allergen)) {
                detectedAllergens.push(allergen);
            }
        });
    }

    if (detectedAllergens.length > 0) {
        // Clean up tags for display
        const displayAllergens = detectedAllergens.map(a => a.replace('en:', ''));

        return {
            status: 'danger',
            product: productData,
            detectedAllergens: displayAllergens,
            message: `Contains ${displayAllergens.join(', ')}. Do not consume.`
        };
    }

    return {
        status: 'safe',
        product: productData,
        message: 'No selected allergens detected.'
    };
};
