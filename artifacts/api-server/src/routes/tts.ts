import { Router } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";

const router = Router();

// Warm, gentle storytelling voice (Rachel — ElevenLabs built-in narrator)
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

router.post("/tts", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy(
      "elevenlabs",
      `/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 2000), // guard against very long pages
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "TTS error");
      console.error("[TTS] ElevenLabs error:", response.status, errText);
      res.status(502).json({ error: "Voice generation failed" });
      return;
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("[TTS] Unexpected error:", err);
    res.status(500).json({ error: "Voice generation failed" });
  }
});

export default router;
