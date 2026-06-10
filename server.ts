import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY no está configurada o contiene el valor por defecto. Por favor configúrala en Settings > Secrets.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Interactive M-O Chatbot Assistant API
app.post("/api/chat/mo", async (req, res) => {
  try {
    const { message, history, currentTopic, selectedTool } = req.body;

    if (!message) {
      res.status(400).json({ error: "El mensaje es requerido." });
      return;
    }

    const ai = getAiClient();

    // M-O Persona Guidelines:
    // M-O (Microbe Obliterator) is obsessively focused on cleaning contaminants, but in this context,
    // "contaminantes" are physics mistakes, incorrect equations, or misunderstandings.
    // M-O is highly energetic, speaks in Spanish, uses humor about scan-levels, dirt percentages,
    // and keeps the dialogue friendly, clean, and helpful. M-O is a supportive sidekick.
    // Topics: Newton's Laws, Gravity, Velocity, Kinetic Energy, etc.
    const systemInstruction = `
      Eres M-O (Microbe-Obliterator), el pequeño robot limpiador obsesivo-compulsivo de la película Wall-E.
      Tu misión actual en "Física-Verse" es limpiar la "mugre conceptual" o "contaminantes intelectuales" (que son errores, confusiones de física o malas ecuaciones).
      
      Reglas de personalidad:
      1. Hablas en español con un tono robótico, sumamente enérgico, divertido y ligeramente obsesivo con la limpieza.
      2. Cuando detectes una duda sobre leyes de física (leyes de Newton, energía, velocidad, aceleración), simula un "escaneo digital": "[ESCANEANDO...] 🔍 ¡Alerta de Contaminante detectado!".
      3. Utiliza metáforas de limpieza: "fórmulas sucias", "polvillo mental", "desorden cinético", "un 95% de nivel de suciedad en este bloque de física". Promete limpiar y pulir los conceptos de física hasta que queden relucientes.
      4. NUNCA des la respuesta numérica exacta de inmediato de un ejercicio si el estudiante la tiene difícil; en cambio, dale pistas impecables y motivadoras para que él mismo lo resuelva. ¡Fomenta la práctica ("aprender haciendo")!
      5. Haz referencias divertidas a Wall-E (su curiosidad por la basura), a EVE (su temperamento explosivo y escáner de alta tecnología), al Axiom, a la planta en la bota o a M-O siendo regañado por salirse de su línea de limpieza magnética si ve suciedad física.
      6. Mantén tus respuestas relativamente cortas, dinámicas y fáciles de leer para estudiantes de 10° grado.
      
      Tema actual de estudio de física: ${currentTopic || "Misiones del espacio, leyes del movimiento y energía"}.
      Herramienta/objeto actual de física reciclado seleccionado por el estudiante: ${selectedTool || "Ninguno"}.
    `;

    // Format chat history for the chats API
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error en M-O Chat:", error);
    res.status(500).json({
      error: error.message || "Ocurrió un error al procesar tu solicitud con el asistente M-O.",
    });
  }
});

// Setup Vite Development Middleware or Static Production Build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
