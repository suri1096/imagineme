import { Router, type IRouter } from "express";
import OpenAI, { toFile } from "openai";

const router: IRouter = Router();

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!process.env["OPENAI_API_KEY"]) throw new Error("OPENAI_API_KEY is not configured");
  if (!_openai) _openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
  return _openai;
}

/** Convert a base64 data-URL to a Buffer + mediaType */
function parseDataUrl(dataUrl: string): { buffer: Buffer; mediaType: string } | null {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/s);
  if (!match) return null;
  return { mediaType: match[1], buffer: Buffer.from(match[2], "base64") };
}

router.post("/generate-image", async (req, res) => {
  try {
    const { prompt, drawingDataUrl } = req.body as {
      prompt?: string;
      drawingDataUrl?: string;
    };

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const openai = getOpenAI();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseData: any;

    if (drawingDataUrl && typeof drawingDataUrl === "string") {
      // ── Edit mode: transform the child's drawing to fit the page scene ──
      const parsed = parseDataUrl(drawingDataUrl);
      if (!parsed) {
        res.status(400).json({ error: "Invalid drawingDataUrl" });
        return;
      }

      const imageFile = await toFile(parsed.buffer, "drawing.png", {
        type: parsed.mediaType,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseData = await (openai.images.edit as any)({
        model: "gpt-image-1",
        image: imageFile,
        prompt,
        n: 1,
        size: "1024x1024",
      });
    } else {
      // ── Generate mode: no drawing, create from scratch ──
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseData = await (openai.images.generate as any)({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
        output_format: "png",
      });
    }

    // gpt-image-1 returns b64_json directly in data[0]
    const item = responseData?.data?.[0] as { b64_json?: string; url?: string } | undefined;
    const b64: string | undefined = item?.b64_json;

    if (b64) {
      res.json({ b64_json: b64 });
      return;
    }

    // Fallback: if a temporary URL was returned, fetch and proxy as base64
    const imageUrl: string | undefined = item?.url;
    if (imageUrl) {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        res.status(500).json({ error: "Failed to fetch generated image" });
        return;
      }
      const b64Fetched = Buffer.from(await imgRes.arrayBuffer()).toString("base64");
      res.json({ b64_json: b64Fetched });
      return;
    }

    res.status(500).json({ error: "No image data returned from API" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log?.error({ err }, "Image generation failed");
    res.status(500).json({ error: msg });
  }
});

export default router;
