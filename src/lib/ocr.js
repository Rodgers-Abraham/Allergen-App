import Tesseract from 'tesseract.js';

export const recognizeText = async (imageBlob) => {
  try {
    console.log("Starting OCR...");
    const result = await Tesseract.recognize(
      imageBlob,
      'eng',
      {
        logger: m => console.log(m)
      }
    );

    console.log("OCR Result:", result.data.text);
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error("OCR Error:", error);
    return { text: '', error: error.message || 'Failed to recognize text' };
  }
};
