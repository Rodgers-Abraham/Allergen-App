export const SAFE_SWAPS = {
    "Peanuts": [
        { name: "Sunflower Seeds", image: "🌻" },
        { name: "Pumpkin Seeds", image: "🎃" },
        { name: "Soy Nuts", image: "🫘" }
    ],
    "Tree Nuts": [
        { name: "Oat Milk", image: "🥛" },
        { name: "Sunflower Butter", image: "🌻" },
        { name: "Coconut Chips", image: "🥥" }
    ],
    "Milk": [
        { name: "Oat Milk", image: "🌾" },
        { name: "Almond Milk", image: "🌰" },
        { name: "Soy Milk", image: "🫘" },
        { name: "Coconut Yogurt", image: "🥥" }
    ],
    "Eggs": [
        { name: "Applesauce", image: "🍎" },
        { name: "Chia Seeds", image: "🌱" },
        { name: "Tofu Scramble", image: "🍳" }
    ],
    "Wheat": [
        { name: "Rice Crackers", image: "🍚" },
        { name: "Quinoa", image: "🥣" },
        { name: "Corn Pasta", image: "🌽" }
    ],
    "Soy": [
        { name: "Chickpeas", image: "🧆" },
        { name: "Lentils", image: "🍲" },
        { name: "Kidney Beans", image: "🫘" }
    ],
    "Fish": [
        { name: "Tofu Fish", image: "🧊" },
        { name: "Jackfruit", image: "🍈" },
        { name: "Seaweed", image: "🌿" }
    ],
    "Shellfish": [
        { name: "King Oyster Mushrooms", image: "🍄" },
        { name: "Hearts of Palm", image: "🌴" }
    ]
};

export const getSafeSwaps = (allergen) => {
    // Handle cases where allergen might be "Contains Peanuts" or similar
    const key = Object.keys(SAFE_SWAPS).find(k => allergen.toLowerCase().includes(k.toLowerCase()));
    return key ? SAFE_SWAPS[key] : [];
};
