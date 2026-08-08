import type { Story } from "./storyStore";
import { WORLDS } from "./worlds";

// TODO: Swap this client-side renderer for a true generative-video API
// (e.g. an OpenAI / Runway / Pika endpoint) that takes story pages +
// drawing + narration audio and returns a higher-fidelity MP4. For now we
// composite an animated Ken-Burns canvas in the browser and capture it
// with MediaRecorder so kids can save and share their book today.

export interface VideoExportOptions {
  width?: number;
  height?: number;
  secondsPerPage?: number;
  fps?: number;
  onProgress?: (pct: number, label: string) => void;
}

const DEFAULT_OPTS: Required<Omit<VideoExportOptions, "onProgress">> = {
  width: 1280,
  height: 720,
  secondsPerPage: 4.5,
  fps: 30,
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function pickMimeType(): { mime: string; ext: string } {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) {
      return { mime: c, ext: "webm" };
    }
  }
  return { mime: "video/webm", ext: "webm" };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  worldId: string
) {
  const stops: Record<string, [string, string]> = {
    forest: ["#d1fae5", "#ecfdf5"],
    underwater: ["#cffafe", "#eff6ff"],
    space: ["#e0e7ff", "#f5f3ff"],
    "cozy-room": ["#fef3c7", "#fff7ed"],
    meadow: ["#ecfccb", "#fefce8"],
    castle: ["#fce7f3", "#fff1f2"],
  };
  const [a, b] = stops[worldId] ?? ["#fce7f3", "#fff1f2"];
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, a);
  grad.addColorStop(1, b);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawSoftDots(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string
) {
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = color;
  for (let i = 0; i < 24; i++) {
    const x = ((i * 137.5) % w) + Math.sin(t * 0.6 + i) * 12;
    const y = ((i * 211.3) % h) + Math.cos(t * 0.5 + i) * 12;
    const r = 6 + (i % 5) * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

interface PreparedPage {
  text: string;
  bg: HTMLImageElement | null;
  worldId: string;
  drawing: HTMLImageElement | null;
}

export async function exportStoryVideo(
  story: Story,
  opts: VideoExportOptions = {}
): Promise<{ blob: Blob; ext: string }> {
  const { width, height, secondsPerPage, fps } = { ...DEFAULT_OPTS, ...opts };
  const onProgress = opts.onProgress ?? (() => {});

  onProgress(2, "Preparing scenes");

  const world = WORLDS.find((w) => w.id === story.world);
  const bgImg = world ? await loadImage(world.imageSrc) : null;
  const drawingImg = story.drawingDataUrl ? await loadImage(story.drawingDataUrl) : null;

  const pages: PreparedPage[] = story.pages.map((p) => ({
    text: p.text,
    bg: bgImg,
    worldId: story.world,
    drawing: drawingImg,
  }));

  // Title card + pages + outro
  const totalCards = pages.length + 2;
  const totalDurationMs = totalCards * secondsPerPage * 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const stream = canvas.captureStream(fps);
  const { mime, ext } = pickMimeType();
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const accentByWorld: Record<string, string> = {
    forest: "#10b981",
    underwater: "#06b6d4",
    space: "#818cf8",
    "cozy-room": "#f59e0b",
    meadow: "#84cc16",
    castle: "#f472b6",
  };
  const accent = accentByWorld[story.world] ?? "#f472b6";

  const drawCard = (cardIndex: number, localT: number) => {
    const w = width;
    const h = height;
    ctx.clearRect(0, 0, w, h);

    drawGradientBackground(ctx, w, h, story.world);

    if (pages[0]?.bg) {
      const img = pages[0].bg;
      const scale = 1.05 + 0.08 * localT;
      const iw = w * scale;
      const ih = (img.height / img.width) * iw;
      const ox = (w - iw) / 2 + Math.sin(localT * 0.6) * 12;
      const oy = (h - ih) / 2 + Math.cos(localT * 0.5) * 8;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.drawImage(img, ox, oy, iw, ih);
      ctx.restore();
    }

    drawSoftDots(ctx, w, h, localT, accent);

    // Title card
    if (cardIndex === 0) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.fillRect(w * 0.08, h * 0.28, w * 0.84, h * 0.44);
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.round(h * 0.085)}px Quicksand, "Atkinson Hyperlegible", system-ui, sans-serif`;
      const titleLines = wrapText(ctx, story.title, w * 0.74);
      const lineH = h * 0.1;
      const startY = h * 0.5 - ((titleLines.length - 1) * lineH) / 2 - h * 0.04;
      titleLines.forEach((line, i) => ctx.fillText(line, w / 2, startY + i * lineH));

      ctx.font = `500 ${Math.round(h * 0.034)}px Quicksand, system-ui, sans-serif`;
      ctx.fillStyle = "#6b7280";
      ctx.fillText(`An ImagineMe story by ${story.companionName}'s friend`, w / 2, h * 0.66);
      ctx.restore();
      return;
    }

    // Outro card
    if (cardIndex === pages.length + 1) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fillRect(w * 0.12, h * 0.32, w * 0.76, h * 0.36);
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${Math.round(h * 0.075)}px Quicksand, system-ui, sans-serif`;
      ctx.fillText("The end.", w / 2, h * 0.46);
      ctx.font = `500 ${Math.round(h * 0.036)}px Quicksand, system-ui, sans-serif`;
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Made with ImagineMe", w / 2, h * 0.58);
      ctx.restore();
      return;
    }

    const page = pages[cardIndex - 1];

    // Drawing inset (Ken Burns)
    if (page.drawing) {
      const insetW = w * 0.42;
      const insetH = h * 0.62;
      const x = w * 0.05;
      const y = h * 0.19;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "white";
      const r = 28;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + insetW, y, x + insetW, y + insetH, r);
      ctx.arcTo(x + insetW, y + insetH, x, y + insetH, r);
      ctx.arcTo(x, y + insetH, x, y, r);
      ctx.arcTo(x, y, x + insetW, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Slow zoom on drawing
      const zoom = 1 + 0.04 * Math.sin(localT * 0.8);
      const dw = insetW * 0.92 * zoom;
      const dh = insetH * 0.92 * zoom;
      const dx = x + (insetW - dw) / 2;
      const dy = y + (insetH - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + 8, y + 8, insetW - 16, insetH - 16);
      ctx.clip();
      ctx.drawImage(page.drawing, dx, dy, dw, dh);
      ctx.restore();
    }

    // Text card
    const tx = page.drawing ? w * 0.52 : w * 0.12;
    const tw = page.drawing ? w * 0.42 : w * 0.76;
    const ty = h * 0.19;
    const th = h * 0.62;

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    const r = 28;
    ctx.beginPath();
    ctx.moveTo(tx + r, ty);
    ctx.arcTo(tx + tw, ty, tx + tw, ty + th, r);
    ctx.arcTo(tx + tw, ty + th, tx, ty + th, r);
    ctx.arcTo(tx, ty + th, tx, ty, r);
    ctx.arcTo(tx, ty, tx + tw, ty, r);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.font = `700 ${Math.round(h * 0.028)}px Quicksand, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Page ${cardIndex} of ${pages.length}`, tx + 28, ty + 24);

    ctx.fillStyle = "#1f2937";
    ctx.font = `500 ${Math.round(h * 0.044)}px Quicksand, "Atkinson Hyperlegible", system-ui, sans-serif`;
    const lines = wrapText(ctx, page.text, tw - 56);
    const lineH = h * 0.062;

    // Reveal lines progressively
    const revealRatio = Math.min(1, localT / (secondsPerPage * 0.6));
    const visibleLines = Math.max(1, Math.floor(lines.length * revealRatio + 0.5));
    const startY = ty + 80;
    for (let i = 0; i < visibleLines; i++) {
      ctx.fillText(lines[i], tx + 28, startY + i * lineH);
    }
    ctx.restore();
  };

  return new Promise((resolve, reject) => {
    recorder.onerror = (e) => reject(e);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mime });
      onProgress(100, "Done");
      resolve({ blob, ext });
    };

    recorder.start(250);

    const startTime = performance.now();
    let rafId = 0;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const cardDurMs = secondsPerPage * 1000;
      const cardIndex = Math.min(totalCards - 1, Math.floor(elapsed / cardDurMs));
      const localT = (elapsed - cardIndex * cardDurMs) / 1000;

      drawCard(cardIndex, localT);

      const pct = Math.min(99, Math.round((elapsed / totalDurationMs) * 100));
      onProgress(pct, `Rendering card ${cardIndex + 1} of ${totalCards}`);

      if (elapsed >= totalDurationMs) {
        cancelAnimationFrame(rafId);
        // Give the recorder a moment to capture the last frame
        setTimeout(() => recorder.stop(), 200);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
