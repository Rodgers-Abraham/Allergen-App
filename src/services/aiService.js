import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Setup the API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ MISSING API KEY: Please set VITE_GEMINI_API_KEY in your .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Select the Model (We confirmed this works for you!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Converts a File object to a GoogleGenerativeAI Part object.
 */
async function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Main Function: Analyzes image for allergens and finds alternatives
 */
export async function analyzeImage(imageFile, userAllergens = []) {
    try {
        console.log("🤖 AI Service: Analyzing image...");

        // Convert image for Gemini
        const imagePart = await fileToGenerativePart(imageFile);

        // 3. The Smart Prompt
        // We explicitly ask for JSON so we can easily read the result in our app
        const prompt = `
      You are an expert food safety assistant.
      
      Task:
      1. Analyze the ingredients in this image.
      2. Check against these user allergies: ${userAllergens.join(", ")}.
      3. If you find a match, suggest 3 safe, common alternatives (e.g., if Dairy is found, suggest Oat Milk).
      
      Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
      {
        "status": "safe" | "danger" | "caution",
        "detected": ["allergen1", "allergen2"],
        "alternatives": ["Safe Option 1", "Safe Option 2", "Safe Option 3"]
      }
    `;

        // 4. Send to Google
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();

        console.log("🤖 Raw AI Response:", text);

        // Clean up potential markdown formatting (just in case)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // 5. Parse the JSON
        const data = JSON.parse(text);
        return data;

    } catch (error) {
        console.error("❌ AI Service Error:", error);
        // Return a "safe fail" object so the app doesn't crash
        return {
            status: "caution",
            detected: ["Error analyzing image"],
            alternatives: []
        };
    }
}

/**
 * Chat Function (for the Buddy feature)
 */
export async function chatWithBuddy(message, history = []) {
    try {
        const chat = model.startChat({
            history: history,
        });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble connecting right now. Please try again later!";
    }
}