import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!process.env["OPENAI_API_KEY"]) throw new Error("OPENAI_API_KEY is not configured");
  if (!_openai) _openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
  return _openai;
}

router.post("/generate-story-text", async (req, res) => {
  try {
    const { focus, world, companionName, companionType, prompt, drawingDataUrl } = req.body as {
      focus?: string;
      world?: string;
      companionName?: string;
      companionType?: string;
      prompt?: string;
      drawingDataUrl?: string;
    };

    if (!focus || !world) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const companionLine = companionName && companionType
      ? `The child's companion is: ${companionName} the ${companionType}.`
      : "";

    const textInstruction = `You write fun, lighthearted 5-page adventure storybooks for children aged 5-10.
Each page is ONE or TWO short sentences (15-30 words total), very simple words a 6-year-old knows.
Make it playful and joyful: little surprises, silly moments, friendly characters, giggles, small adventures with happy endings.
Write like a bedtime story a kid begs to hear again. No lessons or lectures, no clinical language, no emojis.
The theme should show up naturally through the fun adventure, not as a message.
The story is set in: ${world}.
${companionLine}
The theme is: ${focus}.
${prompt ? `The child described their drawing as: "${prompt}".` : ""}
${drawingDataUrl ? "The child has shared their drawing — look at it carefully and weave what you see (colours, shapes, characters, objects) into the story in a warm, affirming way." : ""}

Respond with ONLY a JSON array of exactly 5 strings, one per page. No labels, numbers, or prefixes — just the story text itself.
Example: ["The adventure began in a magical forest.", "Suddenly a friendly fox appeared.", "Together they discovered a glowing door.", "Inside was the most amazing surprise.", "And they lived happily, full of wonder."]`;

    // Build the message — use vision (GPT-4o) when a drawing is present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any[];

    if (drawingDataUrl && drawingDataUrl.startsWith("data:")) {
      // Strip the data URL prefix to get raw base64 + mediaType
      const match = drawingDataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/s);
      if (match) {
        const mediaType = match[1];
        const b64 = match[2];
        messages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: textInstruction,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${b64}`,
                  detail: "low", // low detail = cheaper, sufficient for a child's drawing
                },
              },
            ],
          },
        ];
      } else {
        // Malformed data URL — fall back to text-only
        messages = [{ role: "user", content: textInstruction }];
      }
    } else {
      messages = [{ role: "user", content: textInstruction }];
    }

    const model = drawingDataUrl ? "gpt-4o" : "gpt-4o-mini";

    const response = await getOpenAI().chat.completions.create({
      model,
      max_completion_tokens: 400,
      messages,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "[]";

    let pages: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) pages = parsed.map(String);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) {
        try { pages = JSON.parse(match[0]); } catch { /* ignore */ }
      }
    }

    res.json({ pages });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log?.error({ err }, "Story text generation failed");
    res.status(500).json({ error: msg });
  }
});

export default router;
