export type StampDraw = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) => void;

export interface Stamp {
  id: string;
  name: string;
  draw: StampDraw;
}

const filled = (ctx: CanvasRenderingContext2D, color: string, fn: () => void) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  fn();
  ctx.restore();
};

const drawCircle: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.beginPath();
    ctx.arc(x, y, s / 2, 0, Math.PI * 2);
    ctx.fill();
  });

const drawSquare: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s * 0.15;
    const w = s;
    const x0 = x - w / 2;
    const y0 = y - w / 2;
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x0 + w - r, y0);
    ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
    ctx.lineTo(x0 + w, y0 + w - r);
    ctx.quadraticCurveTo(x0 + w, y0 + w, x0 + w - r, y0 + w);
    ctx.lineTo(x0 + r, y0 + w);
    ctx.quadraticCurveTo(x0, y0 + w, x0, y0 + w - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.fill();
  });

const drawTriangle: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const h = (s * Math.sqrt(3)) / 2;
    ctx.beginPath();
    ctx.moveTo(x, y - h / 2);
    ctx.lineTo(x + s / 2, y + h / 2);
    ctx.lineTo(x - s / 2, y + h / 2);
    ctx.closePath();
    ctx.fill();
  });

const drawHexagon: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s / 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const px = x + r * Math.cos(a);
      const py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  });

const drawDiamond: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s / 2;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.75, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r * 0.75, y);
    ctx.closePath();
    ctx.fill();
  });

const drawStar: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const outer = s / 2;
    const inner = outer * 0.45;
    const points = 5;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / points) * i - Math.PI / 2;
      const px = x + r * Math.cos(a);
      const py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  });

const drawHeart: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const w = s;
    const h = s * 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y + h / 3);
    ctx.bezierCurveTo(x, y - h / 4, x - w / 2, y - h / 4, x - w / 2, y);
    ctx.bezierCurveTo(x - w / 2, y + h / 4, x, y + h / 2, x, y + h / 2);
    ctx.bezierCurveTo(x, y + h / 2, x + w / 2, y + h / 4, x + w / 2, y);
    ctx.bezierCurveTo(x + w / 2, y - h / 4, x, y - h / 4, x, y + h / 3);
    ctx.fill();
  });

const drawSun: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s * 0.28;
    const rayLen = s * 0.22;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(2, s * 0.06);
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      const x1 = x + Math.cos(a) * (r + rayLen * 0.4);
      const y1 = y + Math.sin(a) * (r + rayLen * 0.4);
      const x2 = x + Math.cos(a) * (r + rayLen + rayLen * 0.4);
      const y2 = y + Math.sin(a) * (r + rayLen + rayLen * 0.4);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });

const drawMoon: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s / 2;
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.25, Math.PI * 1.75);
    ctx.arc(x + r * 0.5, y, r * 0.95, Math.PI * 1.75, Math.PI * 0.25, true);
    ctx.closePath();
    ctx.fill();
  });

const drawCloud: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s * 0.22;
    ctx.beginPath();
    ctx.arc(x - r * 1.4, y, r, 0, Math.PI * 2);
    ctx.arc(x - r * 0.3, y - r * 0.6, r * 1.2, 0, Math.PI * 2);
    ctx.arc(x + r * 1.1, y - r * 0.2, r * 1.05, 0, Math.PI * 2);
    ctx.arc(x + r * 0.4, y + r * 0.2, r, 0, Math.PI * 2);
    ctx.fill();
  });

const drawRain: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const r = s * 0.32;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.4);
    ctx.bezierCurveTo(x + r, y - r * 0.2, x + r, y + r * 0.6, x, y + r * 0.9);
    ctx.bezierCurveTo(x - r, y + r * 0.6, x - r, y - r * 0.2, x, y - r * 1.4);
    ctx.fill();
  });

const drawFlower: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const petalR = s * 0.2;
    const orbit = s * 0.22;
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * orbit, y + Math.sin(a) * orbit, petalR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fff8d6";
    ctx.beginPath();
    ctx.arc(x, y, s * 0.14, 0, Math.PI * 2);
    ctx.fill();
  });

const drawTree: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const trunkW = s * 0.16;
    const trunkH = s * 0.3;
    ctx.fillStyle = "#8a5a3b";
    ctx.fillRect(x - trunkW / 2, y + s * 0.1, trunkW, trunkH);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.05, s * 0.32, 0, Math.PI * 2);
    ctx.arc(x - s * 0.22, y + s * 0.08, s * 0.22, 0, Math.PI * 2);
    ctx.arc(x + s * 0.22, y + s * 0.08, s * 0.22, 0, Math.PI * 2);
    ctx.arc(x, y + s * 0.18, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
  });

const drawMountain: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.beginPath();
    ctx.moveTo(x - s / 2, y + s * 0.35);
    ctx.lineTo(x - s * 0.1, y - s * 0.35);
    ctx.lineTo(x + s * 0.05, y - s * 0.05);
    ctx.lineTo(x + s * 0.25, y - s * 0.25);
    ctx.lineTo(x + s / 2, y + s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(x - s * 0.1, y - s * 0.35);
    ctx.lineTo(x - s * 0.02, y - s * 0.18);
    ctx.lineTo(x - s * 0.18, y - s * 0.18);
    ctx.closePath();
    ctx.fill();
  });

const drawHouse: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const w = s * 0.7;
    const h = s * 0.45;
    const rx = x - w / 2;
    const ry = y - h * 0.1;
    ctx.fillRect(rx, ry, w, h);
    ctx.beginPath();
    ctx.moveTo(rx - s * 0.05, ry);
    ctx.lineTo(x, ry - s * 0.35);
    ctx.lineTo(rx + w + s * 0.05, ry);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff8d6";
    ctx.fillRect(x - s * 0.08, ry + h - s * 0.25, s * 0.16, s * 0.25);
  });

const drawWave: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.lineWidth = Math.max(3, s * 0.1);
    ctx.beginPath();
    ctx.moveTo(x - s / 2, y);
    ctx.bezierCurveTo(x - s * 0.25, y - s * 0.3, x - s * 0.1, y + s * 0.3, x, y);
    ctx.bezierCurveTo(x + s * 0.1, y - s * 0.3, x + s * 0.25, y + s * 0.3, x + s / 2, y);
    ctx.stroke();
  });

const drawRainbow: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    const colors = ["#e08a8a", "#e8b27a", "#ecd478", "#a3c9a8", "#88b8d0", "#b48ead"];
    const r0 = s * 0.46;
    const stripe = (s * 0.46) / colors.length;
    ctx.lineWidth = stripe;
    colors.forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.arc(x, y + s * 0.1, r0 - i * stripe, Math.PI, 0);
      ctx.stroke();
    });
    void c;
  });

const drawLeaf: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.beginPath();
    ctx.moveTo(x - s * 0.4, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.4, y - s * 0.4, x + s * 0.4, y - s * 0.4, x + s * 0.4, y + s * 0.3);
    ctx.bezierCurveTo(x, y + s * 0.45, x, y + s * 0.45, x - s * 0.4, y + s * 0.3);
    ctx.fill();
  });

const drawFish: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.beginPath();
    ctx.ellipse(x - s * 0.05, y, s * 0.32, s * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + s * 0.22, y);
    ctx.lineTo(x + s * 0.42, y - s * 0.18);
    ctx.lineTo(x + s * 0.42, y + s * 0.18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x - s * 0.18, y - s * 0.04, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  });

const drawButterfly: StampDraw = (ctx, x, y, s, c) =>
  filled(ctx, c, () => {
    ctx.beginPath();
    ctx.ellipse(x - s * 0.18, y - s * 0.05, s * 0.18, s * 0.22, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + s * 0.18, y - s * 0.05, s * 0.18, s * 0.22, 0.4, 0, Math.PI * 2);
    ctx.ellipse(x - s * 0.16, y + s * 0.16, s * 0.14, s * 0.16, 0.5, 0, Math.PI * 2);
    ctx.ellipse(x + s * 0.16, y + s * 0.16, s * 0.14, s * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2d3748";
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.04, s * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  });

export const STAMPS: Stamp[] = [
  { id: "circle", name: "Circle", draw: drawCircle },
  { id: "square", name: "Square", draw: drawSquare },
  { id: "triangle", name: "Triangle", draw: drawTriangle },
  { id: "diamond", name: "Diamond", draw: drawDiamond },
  { id: "hexagon", name: "Hexagon", draw: drawHexagon },
  { id: "star", name: "Star", draw: drawStar },
  { id: "heart", name: "Heart", draw: drawHeart },
  { id: "sun", name: "Sun", draw: drawSun },
  { id: "moon", name: "Moon", draw: drawMoon },
  { id: "cloud", name: "Cloud", draw: drawCloud },
  { id: "rain", name: "Raindrop", draw: drawRain },
  { id: "rainbow", name: "Rainbow", draw: drawRainbow },
  { id: "flower", name: "Flower", draw: drawFlower },
  { id: "leaf", name: "Leaf", draw: drawLeaf },
  { id: "tree", name: "Tree", draw: drawTree },
  { id: "mountain", name: "Mountain", draw: drawMountain },
  { id: "wave", name: "Wave", draw: drawWave },
  { id: "house", name: "House", draw: drawHouse },
  { id: "fish", name: "Fish", draw: drawFish },
  { id: "butterfly", name: "Butterfly", draw: drawButterfly },
];
