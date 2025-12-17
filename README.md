# 🛡️ My Allergy Diary (AI-Powered Food Safety)

**Live Demo:** https://allergen-app-eight.vercel.app/

## 📖 Project Overview
My Allergy Diary is a Progressive Web Application (PWA) designed to save lives by helping users identify food allergens in real-time. It combines **Google's Gemini 2.0 AI** for vision analysis with gamification and emergency safety protocols to make food safety engaging and accessible for all ages.

> **Built by:** Black Puppy🐾 (Rodgers Abraham)
> **Status:** Phase 2 Complete (MVP)

---

## 💡 The Problem
For people with severe food allergies, every meal is a potential risk. Reading tiny ingredient labels is tedious, interpreting chemical names is difficult, and children often struggle to understand the danger. Furthermore, in the event of an anaphylactic reaction, communicating with medical personnel can be impossible.

## 🚀 The Solution
An intelligent digital assistant that:
1.  **Sees:** Scans ingredients using AI Vision.
2.  **Thinks:** Identifies hidden allergens and suggests safe swaps.
3.  **Protects:** Provides one-touch SOS signaling and medical ID display.
4.  **Engages:** Uses gamification to encourage kids to stay safe.

---

## ✨ Key Features

### 1. 📷 AI Allergen Scanner
* Powered by **Google Gemini API**.
* Users snap a photo of a product.
* The AI reads the label, cross-references it with the user's specific profile, and highlights danger in RED or safety in GREEN.
* **Safe Swaps:** If a product is unsafe, the AI suggests a healthy alternative.

### 2. 🆘 Emergency SOS System
* **One-Touch Alarm:** A floating emergency button available on the dashboard.
* **Smart SMS:** Automatically drafts a text to the "Next of Kin" with the user's GPS location.
* **Flash Card Mode:** Turns the screen into a high-visibility medical ID card for paramedics (shows Blood Type, Allergies, and EpiPen status).

### 3. 👨‍🍳 The Chef Card
* A dedicated "Travel Mode" for dining out.
* Rotates the screen and displays a large, clear warning message for restaurant staff.
* Designed to prevent cross-contamination in kitchens.

### 4. 🎮 Gamification (Hero Mode)
* Turns scanning into a game.
* Users earn a "Streak" for every safe scan.
* Features sound effects and a "Hero Level" to motivate children to check their food.

### 5. 🔐 Secure User Profile
* Stores critical data: Blood Type, Emergency Contacts, and Specific Allergens.
* Note: Currently uses LocalStorage (Device-based persistence).

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite)
* **AI Engine:** Google Gemini 2.0 Flash API
* **Styling:** CSS Modules & Lucide React (Icons)
* **Deployment:** Vercel Cloud Hosting
* **Version Control:** Git & GitHub

---

## 🚀 How to Run Locally

If you want to run this project on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Rodgers-Abraham/allergen-app.git](https://github.com/Rodgers-Abraham/allergen-app.git)
    cd allergen-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file and add your Gemini API Key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the Server**
    ```bash
    npm run dev
    ```

---

## 🔮 Future Roadmap (Phase 3)
* [ ] **Cloud Sync:** Migrating from LocalStorage to Google Firebase.
* [ ] **Community Map:** Users can pin "Safe Restaurants" on a map.
* [ ] **Barcode Database:** Integration with OpenFoodFacts API.