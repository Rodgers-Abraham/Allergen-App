export const fetchProductByBarcode = async (barcode) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.status === 1) {
            return {
                found: true,
                name: data.product.product_name || 'Unknown Product',
                ingredients: data.product.ingredients_text ? data.product.ingredients_text.split(',').map(i => i.trim()) : [],
                image: data.product.image_url,
                brands: data.product.brands,
                allergens_tags: data.product.allergens_tags || [] // e.g. ["en:milk", "en:peanuts"]
            };
        } else {
            return { found: false };
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return { found: false, error: error.message };
    }
};

export const searchProductByName = async (name) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${name}&search_simple=1&action=process&json=1`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            // Return top result
            const p = data.products[0];
            return {
                found: true,
                name: p.product_name,
                ingredients: p.ingredients_text ? p.ingredients_text.split(',').map(i => i.trim()) : [],
                image: p.image_url,
                brands: p.brands,
                allergens_tags: p.allergens_tags || []
            };
        }
        return { found: false };
    } catch (error) {
        console.error("Error searching product:", error);
        return { found: false, error: error.message };
    }
};
