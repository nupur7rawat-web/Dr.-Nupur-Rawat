
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractIngredientsFromImage(base64Data: string, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: "Extract the full list of ingredients from this product label. Return only the comma-separated names, nothing else. If the text is messy, try to normalize common chemical names (e.g. 'Methyl-paraben' -> 'Methylparaben')." }
      ]
    }
  });
  return response.text || "";
}

export async function analyzeIngredientsWithAI(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this ingredient list: "${text}". 
    
    1. Categorize each into Risk Levels: LOW (Safe), MODERATE (Caution), HIGH (Avoid).
    2. Identify specific harms: Endocrine disruption, Carcinogens, Skin Irritation.
    3. Determine Pregnancy Safety: SAFE, CAUTION, AVOID.
    4. Provide a 'Purity Score' (0-100) where 100 is perfectly safe.
    
    Reference data: Parabens, Phthalates, Formaldehyde, Oxybenzone, and PFAS are HIGH risk.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ['LOW', 'MODERATE', 'HIGH'] },
                harm: { type: Type.STRING },
                evidence: { type: Type.STRING },
                pregnancySafe: { type: Type.STRING, enum: ['SAFE', 'CAUTION', 'AVOID'] },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "riskLevel", "harm"]
            }
          },
          concerns: {
            type: Type.OBJECT,
            properties: {
              endocrine: { type: Type.NUMBER },
              pregnancy: { type: Type.NUMBER },
              skin: { type: Type.NUMBER },
              pcos: { type: Type.NUMBER }
            }
          }
        },
        required: ["overallScore", "summary", "ingredients", "concerns"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (e) {
    throw new Error("Analysis failed. Please try a clearer text input.");
  }
}
