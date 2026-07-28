import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "CodeBau Platform", timestamp: new Date().toISOString() });
  });

  // AI Assistant endpoint using @google/genai
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { prompt, userType = "retail", projectContext } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Promptul este obligatoriu." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return helpful response if API key is missing
        return res.json({
          reply: `[Răspuns Consultanță CodeBau]: Pentru proiectul tău (${prompt}), îți recomandăm calculul automat de mai jos. (Notă: Cheia GEMINI_API_KEY nu este setată, dar calculatoarele CodeBau funcționează complet!).`,
          suggestions: [
            "Vezi fisa tehnica adeziv gresie C2TE",
            "Calculează consumul de vopsea lavabilă",
            "Contactează un meșter din meister club"
          ]
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `Ești Asistentul Tehnologic Oficial CodeBau (Ecosistem Digital de Construcții, Renovări și Amenajări din Sudul Republicii Moldova — Cahul, Cantemir, Vulcănești, Taraclia).
Obiectivul tău este să oferi consultanță tehnică precisă, recomandări de materiale de calitate (Economic, Standard, Premium), calcul de consum per m², compatibilități între produse (ex: adeziv C2TE pentru gresie porțelanată, grund de aderență, chit rosturi, hidroizolație), instrucțiuni de aplicare și recomandare de meșteri din rețeaua CodeBau Meister Club. Prețurile sunt exprimate în MDL.
Răspunde exclusiv în limba română, amabil, profesionist și structurat cu puncte clare. Context utilizator curent: ${userType}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt + (projectContext ? `\n\nContext Proiect: ${JSON.stringify(projectContext)}` : ""),
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "Asistentul CodeBau nu a generat un răspuns.",
      });
    } catch (err: any) {
      console.error("Eroare Asistent AI CodeBau:", err);
      return res.status(500).json({
        error: "Eroare la procesarea solicitării AI.",
        details: err?.message || "Eroare necunoscută",
      });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CodeBau] Server pornit pe http://0.0.0.0:${PORT}`);
  });
}

startServer();
