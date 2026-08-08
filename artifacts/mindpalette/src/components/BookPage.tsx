import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StoryPage } from "@/lib/storyStore";
import { WORLDS } from "@/lib/worlds";
import { WorldScene } from "@/components/WorldScene";

interface BookPageProps {
  page: StoryPage;
  worldId: string;
  companionId: string;
  drawingDataUrl: string;
  pageIndex: number;
  isLeftPage: boolean;
  isFlipping?: boolean;
  /** The cover AI image — used as subtle background tint across all pages */
  coverImageUrl?: string;
}

export function BookPage({
  page,
  worldId,
  drawingDataUrl,
  pageIndex,
  isLeftPage,
  coverImageUrl,
}: BookPageProps) {
  const world = WORLDS.find(w => w.id === worldId);

  // Left illustration: per-page AI image only — never repeat the same raw drawing on every page.
  // Fall back to the WorldScene SVG (correct setting, visually distinct from a repeated drawing).
  const hasAiImage = !!page.aiImageUrl;

  // When there's no AI image, vary the fallback per page (crop, zoom, flip, tone)
  // so the five pages don't all look identical.
  const FALLBACK_VARIANTS: React.CSSProperties[] = [
    { transform: "scale(1)", transformOrigin: "center" },
    { transform: "scale(1.45)", transformOrigin: "25% 35%" },
    { transform: "scale(1.8)", transformOrigin: "70% 55%", filter: "saturate(1.15) brightness(1.03)" },
    { transform: "scale(1.35) scaleX(-1)", transformOrigin: "60% 40%" },
    { transform: "scale(1.55)", transformOrigin: "45% 80%", filter: "hue-rotate(-8deg) brightness(1.05)" },
  ];
  const variantStyle = FALLBACK_VARIANTS[pageIndex % FALLBACK_VARIANTS.length];
  const THUMB_CORNERS = ["bottom-2 right-2", "bottom-2 left-2", "top-2 right-2", "bottom-2 right-2", "top-2 left-2"];
  const thumbCorner = THUMB_CORNERS[pageIndex % THUMB_CORNERS.length];

  return (
    <div className="relative w-full h-full overflow-hidden flex">

      {/* Simple soft gradient background in the world's colors — keeps text easy to read */}
      <div className={cn(
        "absolute inset-0 z-0 bg-gradient-to-br",
        world?.gradient ?? "from-amber-50 to-orange-50"
      )} />

      {/* Subtle cover-image tint (only when AI cover exists) */}
      {coverImageUrl && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <img src={coverImageUrl} alt="" className="w-full h-full object-cover opacity-8" />
        </div>
      )}

      {/* Left half: per-page AI illustration OR world scene inset */}
      <div className="relative z-10 w-1/2 h-full flex items-center justify-center p-4 md:p-5 border-r border-black/10">
        {hasAiImage ? (
          <motion.div
            key={page.aiImageUrl}
            initial={{ opacity: 0, scale: 0.93, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full h-full max-h-[88%] rounded-2xl overflow-hidden shadow-lg border-4 border-white"
          >
            <img
              src={page.aiImageUrl}
              alt="Story illustration"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          /* No AI image — show an inset world scene card so the panel isn't empty */
          <motion.div
            key={`scene-${pageIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full max-h-[88%] rounded-2xl overflow-hidden shadow-md border-4 border-white/90 relative"
          >
            <div className="w-full h-full" style={variantStyle}>
              <WorldScene worldId={worldId} className="w-full h-full" />
            </div>

            {/* If a drawing exists, show it as a small inset so the child can see their art */}
            {drawingDataUrl && (
              <div className={`absolute ${thumbCorner} w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-white shadow-md opacity-90`}>
                <img src={drawingDataUrl} alt="Your drawing" className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Right half: story text */}
      <div className="relative z-10 w-1/2 h-full flex flex-col items-center justify-center p-6 md:p-10">
        <motion.p
          key={page.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-lg md:text-xl lg:text-2xl font-serif text-foreground leading-relaxed text-center drop-shadow-sm"
        >
          {page.text}
        </motion.p>

        {/* Page number */}
        <p className="absolute bottom-4 right-6 text-xs text-foreground/30 font-serif">
          {pageIndex + 1}
        </p>
      </div>

      {/* Book spine shadow */}
      <div className={cn(
        "absolute top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-20",
        isLeftPage ? "right-0 translate-x-full" : "left-0 -translate-x-full rotate-180"
      )} />
    </div>
  );
}
