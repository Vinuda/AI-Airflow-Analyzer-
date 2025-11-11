import { GoogleGenAI, Type } from "@google/genai";
import { WindowData, AirflowAnalysis, Point } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A detailed text analysis of the airflow in the room, explaining dynamics based on its shape and open/closed windows.",
        },
        optimizations: {
            type: Type.ARRAY,
            description: "A list of actionable suggestions to improve airflow.",
            items: { type: Type.STRING },
        },
        flowPaths: {
            type: Type.ARRAY,
            description: "A simplified list of airflow vectors for visualization. Coordinates are percentages (0-100) from top-left.",
            items: {
                type: Type.OBJECT,
                properties: {
                    from: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER, description: "Start X coordinate (0-100)" },
                            y: { type: Type.NUMBER, description: "Start Y coordinate (0-100)" },
                        },
                        required: ['x', 'y'],
                    },
                    to: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER, description: "End X coordinate (0-100)" },
                            y: { type: Type.NUMBER, description: "End Y coordinate (0-100)" },
                        },
                        required: ['x', 'y'],
                    },
                    strength: {
                        type: Type.STRING,
                        description: "Strength of the flow: 'low', 'medium', or 'high'.",
                    },
                },
                required: ['from', 'to', 'strength'],
            },
        },
    },
    required: ['description', 'optimizations', 'flowPaths'],
};

function buildPrompt(windows: WindowData[], roomPoints: Point[]): string {
    const pointToString = (p: Point) => `(${p.x.toFixed(0)}, ${p.y.toFixed(0)})`;

    const roomDescription = `A room with a custom polygonal shape defined by the following vertices in a 100x100 coordinate system (where (0,0) is top-left): ${roomPoints.map(pointToString).join(', ')}.`;
    
    const windowDescriptions = windows.length > 0
      ? windows.map(w => {
          const p1 = roomPoints[w.wallIndex];
          const p2 = roomPoints[(w.wallIndex + 1) % roomPoints.length];
          const absPos = {
            x: p1.x + (p2.x - p1.x) * w.position,
            y: p1.y + (p2.y - p1.y) * w.position
          };
          const windowState = w.isOpen ? 'OPEN' : 'CLOSED';
          return `- A window at approximately ${pointToString(absPos)} is ${windowState}.`;
        }).join('\n')
      : 'There are no windows in the room.';


    return `
        You are an expert in fluid dynamics and architectural airflow simulation.
        Analyze the airflow in a custom-shaped room based on the provided configuration.
        Assume a gentle breeze is coming from the top of the screen (north, low Y values).

        Room configuration:
        - ${roomDescription}
        ${windowDescriptions}

        Based on this configuration, please provide an analysis.
        
        1.  **Description**: Describe the likely path of airflow. Consider how the room's shape and window placements create areas of high pressure, low pressure, and stagnation.
        2.  **Optimizations**: Provide a list of clear, actionable suggestions to maximize cross-ventilation and fresh air circulation throughout the entire space.
        3.  **Flow Paths**: Provide a simplified set of vectors representing the main airflow currents. Use percentage-based coordinates (from 0 to 100). The flow should originate from open windows and realistically interact with the room's walls. If no windows are open, or if the configuration results in no significant airflow, return an empty array for flowPaths.

        Return the analysis strictly as a JSON object matching the provided schema.
    `;
}

export const analyzeAirflow = async (windows: WindowData[], roomPoints: Point[]): Promise<AirflowAnalysis> => {
    const prompt = buildPrompt(windows, roomPoints);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (!result.description || !Array.isArray(result.optimizations) || !Array.isArray(result.flowPaths)) {
            throw new Error("Invalid response format from API.");
        }

        return result as AirflowAnalysis;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
};