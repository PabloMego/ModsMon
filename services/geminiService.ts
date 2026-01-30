
import { GoogleGenAI } from "@google/genai";

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

let ai: any;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  // Fallback stub when no API key is provided (prevents runtime exceptions)
  ai = {
    models: {
      generateContent: async () => ({ text: "[Sin clave de API] Gemini no está disponible en esta sesión." }),
    },
  };
}

export const getSurvivalAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Eres Mon, la guía AI brutalista para el modpack 'GitanoMongoloMon'.
        Tu personalidad es directa, minimalista, ligeramente oscura y profesional.
        El modpack cuenta con más de 100 mods, centrados en reforma de terrenos, IA depredadora avanzada y automatización técnica.
        Responde preguntas de los usuarios sobre estrategias de supervivencia, mods técnicos o configuración del servidor.
        Mantén tus respuestas concisas y formateadas en markdown simple.`,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "El sistema está temporalmente fuera de línea. Por ahora, la supervivencia es tu responsabilidad.";
  }
};
