import { GoogleGenAI } from "@google/genai";
import { FairnessMetrics, SensitiveAttributeStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function explainBias(
  metrics: FairnessMetrics,
  stats: SensitiveAttributeStats,
  datasetName: string
): Promise<string> {
  const prompt = `
    You are an expert AI Fairness Auditor for FairLens AI. 
    Analyze the following fairness metrics for the dataset "${datasetName}":
    
    Sensitive Attribute: ${stats.name}
    Bias Score: ${metrics.biasScore}%
    Disparate Impact: ${metrics.disparateImpact}
    Demographic Parity Difference: ${metrics.demographicParity}
    Equalized Odds Difference: ${metrics.equalizedOdds}
    
    Group Stats:
    ${Object.entries(stats.groups).map(([group, s]) => (
      `- ${group}: Selection Rate of ${(s.selectionRate * 100).toFixed(1)}% (${s.positiveOutcomeCount}/${s.count})`
    )).join('\n')}

    Please provide a detailed audit report in Markdown format.
    The report should include:
    1. **Summary**: A high-level overview of the bias detected.
    2. **Root Cause Analysis**: Why this bias might exist (e.g., historical imbalance).
    3. **Impact Assessment**: Which group is negatively impacted and the severity.
    4. **Actionable Recommendations**: 3-4 specific steps to mitigate this bias.
    5. **Risk Level**: Assign a risk level (Low, Medium, High, Critical).

    Keep the tone professional, clear, and actionable for non-technical stakeholders (compliance officers).
    Do not use complex math jargon without explanation.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return result.text || "Unable to generate explanation at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI audit report. Please check your API key and try again.";
  }
}
