import { GoogleGenAI } from "@google/genai";

export async function enhanceFurnitureImage(base64Image: string, furnitureType: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: 'image/png',
            },
          },
          {
            text: `This is a photo of ${furnitureType} from a furniture store. Please professionally change the background. Place this exact furniture in a luxury, high-end modern interior design setting (like a professional studio or a luxury home). The lighting should be soft, elegant, and professional. Keep the furniture itself exactly as it is, but make the entire scene look like a professional catalog photo.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error enhancing image:", error);
    return null;
  }
}
