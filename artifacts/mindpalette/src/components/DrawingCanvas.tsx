import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eraser, Undo, Trash2, Brush, Shapes, Droplets, PaintBucket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAMPS, type Stamp } from "@/lib/stamps";

const CALM_COLORS = [
  "#2d3748", "#4c566a", "#e53e3e", "#ed8936",
  "#ecc94b", "#48bb78", "#38b2ac", "#4299e1",
  "#667eea", "#b794f4", "#ed64a6", "#fc8181",
  "#f6ad55", "#68d391", "#63b3ed", "#ffffff",
];

type Mode = "brush" | "spray" | "rainbow" | "fill" | "shapes" | "stamp";
type ShapeType = "line" | "rect" | "oval" | "triangle" | "diamond" | "star" | "heart" | "arrow";

const SHAPE_OPTIONS: { id: ShapeType; label: string; draw: (ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number) => void }[] = [
  {
    id: "line", label: "Line",
    draw: (ctx, sx, sy, ex, ey) => {
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    },
  },
  {
    id: "rect", label: "Rectangle",
    draw: (ctx, sx, sy, ex, ey) => {
      ctx.beginPath(); ctx.strokeRect(sx, sy, ex - sx, ey - sy);
    },
  },
  {
    id: "oval", label: "Oval",
    draw: (ctx, sx, sy, ex, ey) => {
      const cx = (sx + ex) / 2, cy = (sy + ey) / 2;
      const rx = Math.max(Math.abs(ex - sx) / 2, 1);
      const ry = Math.max(Math.abs(ey - sy) / 2, 1);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    },
  },
  {
    id: "triangle", label: "Triangle",
    draw: (ctx, sx, sy, ex, ey) => {
      ctx.beginPath();
      ctx.moveTo((sx + ex) / 2, sy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(sx, ey);
      ctx.closePath(); ctx.stroke();
    },
  },
  {
    id: "diamond", label: "Diamond",
    draw: (ctx, sx, sy, ex, ey) => {
      const cx = (sx + ex) / 2, cy = (sy + ey) / 2;
      ctx.beginPath();
      ctx.moveTo(cx, sy);
      ctx.lineTo(ex, cy);
      ctx.lineTo(cx, ey);
      ctx.lineTo(sx, cy);
      ctx.closePath(); ctx.stroke();
    },
  },
  {
    id: "star", label: "Star",
    draw: (ctx, sx, sy, ex, ey) => {
      const cx = (sx + ex) / 2, cy = (sy + ey) / 2;
      const outerR = Math.min(Math.abs(ex - sx), Math.abs(ey - sy)) / 2;
      const innerR = outerR * 0.42;
      const spikes = 5;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    },
  },
  {
    id: "heart", label: "Heart",
    draw: (ctx, sx, sy, ex, ey) => {
      const w = ex - sx, h = ey - sy;
      const x = sx, y = sy;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + h * 0.25);
      ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + h * 0.35);
      ctx.bezierCurveTo(x, y + h * 0.65, x + w / 2, y + h * 0.85, x + w / 2, y + h);
      ctx.bezierCurveTo(x + w / 2, y + h * 0.85, x + w, y + h * 0.65, x + w, y + h * 0.35);
      ctx.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + h * 0.25);
      ctx.closePath(); ctx.stroke();
    },
  },
  {
    id: "arrow", label: "Arrow",
    draw: (ctx, sx, sy, ex, ey) => {
      const dx = ex - sx, dy = ey - sy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / len, uy = dy / len;
      const headLen = Math.min(len * 0.35, 40);
      const headW = headLen * 0.55;
      const px = -uy, py = ux;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex - ux * headLen, ey - uy * headLen);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - ux * headLen + px * headW, ey - uy * headLen + py * headW);
      ctx.lineTo(ex - ux * headLen - px * headW, ey - uy * headLen - py * headW);
      ctx.closePath(); ctx.stroke();
    },
  },
];

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  className?: string;
}

let rainbowHue = 0;

export interface DrawingCanvasHandle {
  getCanvasData: () => string | null;
  loadBackground: (dataUrl: string) => void;
}

export const DrawingCanvas = React.forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ onSave, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(CALM_COLORS[0]);
    const [brushSize, setBrushSize] = useState(6);
    const [stampSize, setStampSize] = useState(64);
    const [isEraser, setIsEraser] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);
    const [mode, setMode] = useState<Mode>("brush");
    const [activeStamp, setActiveStamp] = useState<Stamp>(STAMPS[0]);
    const [shapeType, setShapeType] = useState<ShapeType>("rect");
    const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
    const shapeShotRef = useRef<ImageData | null>(null);
    const sprayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const rect = container.getBoundingClientRect();
        if (Math.abs(canvas.width - rect.width) > 10) {
          const temp = document.createElement('canvas');
          temp.width = canvas.width; temp.height = canvas.height;
          temp.getContext('2d')?.drawImage(canvas, 0, 0);
          canvas.width = rect.width; canvas.height = rect.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#fdf6ee';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(temp, 0, 0);
          }
        }
      };
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width; canvas.height = rect.height;
          const ctx = canvas.getContext('2d');
          if (ctx) { ctx.fillStyle = '#fdf6ee'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          saveHistoryState();
        }
      }
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(ref, () => ({
      getCanvasData: () => canvasRef.current?.toDataURL('image/png') ?? null,
      loadBackground: (dataUrl: string) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHistory(prev => [...prev.slice(-12), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
          onSave(canvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
      },
    }), [onSave]);

    const saveHistoryState = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      setHistory((prev) => [...prev.slice(-12), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    }, []);

    const emitSave = useCallback(() => {
      if (canvasRef.current) onSave(canvasRef.current.toDataURL('image/png'));
    }, [onSave]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      let clientX = 0, clientY = 0;
      if ('touches' in e) {
        const t = (e as TouchEvent).touches[0] ?? (e as TouchEvent).changedTouches?.[0];
        if (!t) return null;
        clientX = t.clientX; clientY = t.clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    // ---------- FLOOD FILL ----------
    const floodFill = (startX: number, startY: number, fillHex: string) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width, h = canvas.height;
      const hex = fillHex.replace('#', '');
      const fr = parseInt(hex.slice(0, 2), 16);
      const fg = parseInt(hex.slice(2, 4), 16);
      const fb = parseInt(hex.slice(4, 6), 16);
      const sx = Math.floor(startX), sy = Math.floor(startY);
      if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;
      const ti = (sy * w + sx) * 4;
      const tr = data[ti], tg = data[ti + 1], tb = data[ti + 2], ta = data[ti + 3];
      if (tr === fr && tg === fg && tb === fb) return;
      const matches = (i: number) =>
        Math.abs(data[i] - tr) <= 30 && Math.abs(data[i + 1] - tg) <= 30 &&
        Math.abs(data[i + 2] - tb) <= 30 && Math.abs(data[i + 3] - ta) <= 30;
      const stack: [number, number][] = [[sx, sy]];
      const visited = new Uint8Array(w * h);
      while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const vi = y * w + x;
        if (visited[vi]) continue;
        const i = (y * w + x) * 4;
        if (!matches(i)) continue;
        visited[vi] = 1;
        data[i] = fr; data[i + 1] = fg; data[i + 2] = fb; data[i + 3] = 255;
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      ctx.putImageData(imgData, 0, 0);
      saveHistoryState(); emitSave();
    };

    // ---------- SPRAY ----------
    const doSpray = (x: number, y: number) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      const radius = brushSize * 3;
      ctx.fillStyle = isEraser ? '#ffffff' : color;
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        ctx.beginPath();
        ctx.arc(x + r * Math.cos(angle), y + r * Math.sin(angle), 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ---------- RAINBOW ----------
    const doRainbow = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      rainbowHue = (rainbowHue + 4) % 360;
      ctx.strokeStyle = `hsl(${rainbowHue}, 90%, 55%)`;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (lastPosRef.current) { ctx.lineTo(x, y); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(x, y);
    };

    // ---------- SHAPES preview ----------
    const drawShapePreview = (ex: number, ey: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !shapeStartRef.current || !shapeShotRef.current) return;
      ctx.putImageData(shapeShotRef.current, 0, 0);
      const { x: sx, y: sy } = shapeStartRef.current;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const shape = SHAPE_OPTIONS.find(s => s.id === shapeType);
      shape?.draw(ctx, sx, sy, ex, ey);
    };

    // ---------- EVENT HANDLERS ----------
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e);
      if (!coords) return;

      if (mode === "stamp") {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        activeStamp.draw(ctx, coords.x, coords.y, stampSize, isEraser ? '#ffffff' : color);
        saveHistoryState(); emitSave();
        return;
      }
      if (mode === "fill") {
        floodFill(coords.x, coords.y, isEraser ? '#ffffff' : color);
        return;
      }
      if (mode === "shapes") {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        shapeStartRef.current = coords;
        shapeShotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setIsDrawing(true);
        return;
      }
      if (mode === "spray") {
        setIsDrawing(true);
        lastPosRef.current = coords;
        doSpray(coords.x, coords.y);
        sprayTimerRef.current = setInterval(() => {
          if (lastPosRef.current) doSpray(lastPosRef.current.x, lastPosRef.current.y);
        }, 40);
        return;
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      setIsDrawing(true);
      lastPosRef.current = coords;
      if (mode === "rainbow") {
        ctx.beginPath(); ctx.moveTo(coords.x, coords.y);
        return;
      }
      // brush / eraser
      ctx.fillStyle = isEraser ? '#ffffff' : color;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e);
      if (!coords) return;
      if (mode === "shapes" && isDrawing) { drawShapePreview(coords.x, coords.y); return; }
      if (!isDrawing) return;
      if (mode === "spray") { lastPosRef.current = coords; doSpray(coords.x, coords.y); return; }
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      if (mode === "rainbow") { doRainbow(ctx, coords.x, coords.y); lastPosRef.current = coords; return; }
      ctx.strokeStyle = isEraser ? '#ffffff' : color;
      ctx.lineWidth = brushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y); ctx.stroke();
    };

    const stopDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
      if (sprayTimerRef.current) { clearInterval(sprayTimerRef.current); sprayTimerRef.current = null; }
      if (mode === "shapes" && isDrawing && e) {
        const coords = getCoordinates(e);
        if (coords) drawShapePreview(coords.x, coords.y);
        shapeStartRef.current = null; shapeShotRef.current = null;
      }
      if (isDrawing) { setIsDrawing(false); saveHistoryState(); emitSave(); }
      lastPosRef.current = null;
    };

    const handleUndo = () => {
      if (history.length <= 1) return;
      const next = [...history];
      next.pop();
      const prev = next[next.length - 1];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !prev) return;
      ctx.putImageData(prev, 0, 0);
      setHistory(next); emitSave();
    };

    const handleClear = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#fdf6ee';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistoryState(); emitSave();
    };

    const switchMode = (m: Mode) => { setMode(m); setIsEraser(false); };

    const sizeLabel = mode === "stamp" ? "Stamp size" : mode === "spray" ? "Spray area" : "Brush size";
    const sizeValue = mode === "stamp" ? stampSize : brushSize;
    const sizeMax = mode === "stamp" ? 140 : mode === "spray" ? 40 : 30;
    const sizeMin = mode === "stamp" ? 28 : 2;
    const setSize = (v: number) => { if (mode === "stamp") setStampSize(v); else setBrushSize(v); };

    const TOOLS: { id: Mode; label: string; icon: React.ReactNode }[] = [
      { id: "brush",   label: "Brush",   icon: <Brush className="w-4 h-4" /> },
      { id: "spray",   label: "Spray",   icon: <Droplets className="w-4 h-4" /> },
      { id: "rainbow", label: "Rainbow", icon: <Sparkles className="w-4 h-4" /> },
      { id: "fill",    label: "Fill",    icon: <PaintBucket className="w-4 h-4" /> },
      { id: "shapes",  label: "Shapes",  icon: <Shapes className="w-4 h-4" /> },
      { id: "stamp",   label: "Stamps",  icon: <Shapes className="w-4 h-4" /> },
    ];

    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {/* Canvas */}
        <div ref={containerRef} className="w-full h-64 md:h-80 bg-white rounded-xl border shadow-sm overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={() => stopDrawing()}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={() => stopDrawing()}
            className={cn(
              "w-full h-full",
              mode === "fill" ? "cursor-cell" :
              mode === "shapes" ? "cursor-crosshair" :
              mode === "stamp" ? "cursor-pointer" : "cursor-crosshair"
            )}
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Tool selector */}
        <div className="flex gap-2 flex-wrap">
          {TOOLS.map(t => (
            <Button key={t.id} type="button"
              variant={mode === t.id ? "default" : "secondary"}
              size="sm"
              onClick={() => switchMode(t.id)}
              className="rounded-full gap-1.5"
            >
              {t.icon}{t.label}
            </Button>
          ))}
        </div>

        {/* Shape picker — shown only when shapes mode is active */}
        {mode === "shapes" && (
          <div className="bg-muted/30 border rounded-xl p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-0.5">
              Pick a shape, then drag on your picture to draw it.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {SHAPE_OPTIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShapeType(s.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 text-xs font-medium transition-all",
                    shapeType === s.id
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border bg-white hover:border-primary/40 text-muted-foreground"
                  )}
                >
                  <ShapeIcon id={s.id} color={shapeType === s.id ? color : "#94a3b8"} size={32} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stamp grid — shown only when stamp mode is active */}
        {mode === "stamp" && (
          <div className="bg-muted/30 p-3 rounded-xl border">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-0.5">
              Tap a shape, then tap your picture to place it.
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {STAMPS.map((stamp) => (
                <button key={stamp.id} type="button"
                  onClick={() => { setActiveStamp(stamp); setIsEraser(false); }}
                  title={stamp.name}
                  aria-label={`Stamp: ${stamp.name}`}
                  className={cn(
                    "aspect-square rounded-lg bg-white border transition-all flex items-center justify-center",
                    activeStamp.id === stamp.id && !isEraser
                      ? "ring-2 ring-primary ring-offset-2 border-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <StampPreview stamp={stamp} color={color} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hints */}
        {mode === "rainbow" && (
          <p className="text-xs text-muted-foreground px-1">Draw freely — colors shift as you go.</p>
        )}
        {mode === "fill" && (
          <p className="text-xs text-muted-foreground px-1">Tap any area to flood it with the chosen color.</p>
        )}

        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-3 rounded-xl border">
          {/* Color palette + custom picker */}
          <div className="flex gap-2 flex-wrap items-center">
            {CALM_COLORS.map(c => (
              <button key={c} type="button"
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={cn(
                  "w-8 h-8 rounded-full transition-transform border-2",
                  color === c && !isEraser ? "scale-125 ring-2 ring-primary ring-offset-1 border-primary" : "hover:scale-110 border-transparent",
                  c === "#ffffff" ? "border-border" : ""
                )}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
            {/* Custom colour picker */}
            <label
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 overflow-hidden relative",
                !CALM_COLORS.includes(color) && !isEraser
                  ? "ring-2 ring-primary ring-offset-1 border-primary scale-125"
                  : "border-dashed border-muted-foreground/50"
              )}
              title="Pick any colour"
              style={{ background: !CALM_COLORS.includes(color) && !isEraser ? color : "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }}
            >
              <input
                type="color"
                value={color}
                onChange={e => { setColor(e.target.value); setIsEraser(false); }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                aria-label="Pick a custom colour"
              />
            </label>
          </div>

          <div className="w-px h-8 bg-border hidden sm:block" />

          {/* Size slider */}
          {mode !== "fill" && mode !== "rainbow" && (
            <div className="flex items-center gap-3 flex-1 min-w-[140px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{sizeLabel}</span>
              <Slider value={[sizeValue]} onValueChange={([val]) => setSize(val)}
                max={sizeMax} min={sizeMin} step={1} className="flex-1" />
            </div>
          )}

          <div className="w-px h-8 bg-border hidden sm:block" />

          {/* Utility buttons */}
          <div className="flex gap-1.5 items-center flex-wrap">
            <Button type="button"
              variant={isEraser ? "secondary" : "ghost"}
              size="icon"
              onClick={() => { setIsEraser(!isEraser); setMode("brush"); }}
              title="Eraser"
              className="rounded-lg"
            >
              <Eraser className="w-5 h-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon"
              onClick={handleUndo} disabled={history.length <= 1}
              title="Undo" className="rounded-lg"
            >
              <Undo className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button type="button" variant="ghost"
              onClick={handleClear}
              size="sm"
              className="rounded-lg gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
DrawingCanvas.displayName = 'DrawingCanvas';

/* Tiny canvas preview for each shape option */
function ShapeIcon({ id, color, size }: { id: ShapeType; size: number; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr; c.height = size * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const p = 4;
    const shape = SHAPE_OPTIONS.find(s => s.id === id);
    shape?.draw(ctx, p, p, size - p, size - p);
  }, [id, color, size]);
  return <canvas ref={ref} style={{ width: size, height: size }} />;
}

function StampPreview({ stamp, color }: { stamp: Stamp; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const sz = 36;
    c.width = sz * dpr; c.height = sz * dpr;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sz, sz);
    stamp.draw(ctx, sz / 2, sz / 2, sz * 0.78, color);
  }, [stamp, color]);
  return <canvas ref={ref} style={{ width: 36, height: 36 }} />;
}
