import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoryStore, AWARD_TIERS } from "@/lib/storyStore";
import confetti from "canvas-confetti";

interface AwardScreenProps {
  onClose: () => void;
  /** The award just earned this session — null means story complete but no new badge */
  newAward?: import("@/lib/storyStore").Award | null;
}

/* Unique look per badge tier — emoji + background gradient */
const TIER_STYLES: Record<string, { icon: string; from: string; to: string; glow: string }> = {
  spark:       { icon: "✨", from: "#FBBF24", to: "#F59E0B", glow: "hsl(45 90% 60% / 0.7)" },
  explorer:    { icon: "🌍", from: "#34D399", to: "#059669", glow: "hsl(160 70% 50% / 0.7)" },
  storyteller: { icon: "📖", from: "#60A5FA", to: "#2563EB", glow: "hsl(217 90% 60% / 0.7)" },
  creator:     { icon: "🎨", from: "#F472B6", to: "#DB2777", glow: "hsl(330 85% 60% / 0.7)" },
  luminary:    { icon: "🌟", from: "#A78BFA", to: "#7C3AED", glow: "hsl(263 80% 65% / 0.7)" },
};

/* Warm palette confetti colours */
const CONFETTI_COLORS = [
  "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8",
];

function useConfetti(active: boolean) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    // Initial burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.55 },
      colors: CONFETTI_COLORS,
      startVelocity: 40,
      gravity: 0.9,
      scalar: 1.1,
    });

    // Side cannons with a short delay
    const sideTimer = setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: CONFETTI_COLORS });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: CONFETTI_COLORS });
    }, 300);

    // Trickle for 3 s
    let elapsed = 0;
    const trickle = () => {
      if (elapsed > 3000) return;
      confetti({
        particleCount: 4,
        spread: 120,
        origin: { x: Math.random(), y: 0 },
        colors: CONFETTI_COLORS,
        gravity: 1.2,
        scalar: 0.8,
        drift: (Math.random() - 0.5) * 0.4,
      });
      elapsed += 150;
      frameRef.current = requestAnimationFrame(trickle);
    };
    const trickleTimer = setTimeout(() => { frameRef.current = requestAnimationFrame(trickle); }, 400);

    return () => {
      clearTimeout(sideTimer);
      clearTimeout(trickleTimer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      confetti.reset();
    };
  }, [active]);
}

export function AwardScreen({ onClose, newAward }: AwardScreenProps) {
  const points = useStoryStore(s => s.points);
  const stars = useStoryStore(s => s.stars);
  const awards = useStoryStore(s => s.awards);

  // Use the award just earned this session if provided, otherwise show story-complete state
  const badge = newAward ?? null;
  const style = badge ? (TIER_STYLES[badge.id] ?? TIER_STYLES["spark"]) : null;

  const nextTier = AWARD_TIERS.find(t => points < t.threshold);
  const prevThreshold = (() => {
    const idx = AWARD_TIERS.findIndex(t => points < t.threshold);
    return idx <= 0 ? 0 : AWARD_TIERS[idx - 1].threshold;
  })();
  const progressToNext = nextTier
    ? Math.min(100, Math.round(((points - prevThreshold) / (nextTier.threshold - prevThreshold)) * 100))
    : 100;

  useConfetti(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 60%, hsl(212 50% 18% / 0.97), hsl(218 35% 10% / 0.99))" }}
    >
      {/* Glowing backdrop ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(35 85% 60% / 0.18) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ scale: 0.8, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35, delay: 0.1 }}
        className="relative max-w-md w-full"
      >
        {/* Trophy centrepiece */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.55, delay: 0.15 }}
            className="relative"
          >
            {/* Outer glow rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.5 + i * 0.3, 1.5 + i * 0.3], opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, hsl(35 85% 60% / ${0.4 - i * 0.1}), transparent 70%)` }}
              />
            ))}

            {/* Badge circle — unique colour per tier */}
            <div
              className="relative w-32 h-32 rounded-full shadow-2xl flex items-center justify-center"
              style={{
                background: style
                  ? `linear-gradient(135deg, ${style.from}, ${style.to})`
                  : "linear-gradient(135deg, #FBBF24, #F59E0B)",
                boxShadow: `0 0 48px ${style?.glow ?? "hsl(35 85% 60% / 0.7)"}, 0 8px 24px rgba(0,0,0,0.4)`,
              }}
            >
              <span className="text-6xl select-none" role="img" aria-label="award">
                {badge ? (TIER_STYLES[badge.id]?.icon ?? "🏆") : "🌟"}
              </span>
            </div>
          </motion.div>

          {/* Floating stars */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
                x: Math.cos((i / 8) * Math.PI * 2) * (56 + (i % 2) * 20),
                y: Math.sin((i / 8) * Math.PI * 2) * (56 + (i % 2) * 20),
              }}
              transition={{ duration: 1.6, delay: 0.25 + i * 0.07, ease: "easeOut" }}
              className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none text-yellow-300 text-lg"
            >
              {i % 2 === 0 ? "⭐" : "✨"}
            </motion.div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-md rounded-3xl border border-white/10 p-7 text-center shadow-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-amber-300 text-xs font-bold uppercase tracking-[0.2em] mb-1"
          >
            {badge ? "New badge unlocked!" : "Story complete!"}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold font-serif text-white mb-2 leading-tight"
          >
            {badge ? badge.name : "Amazing work!"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 text-sm mb-6 leading-relaxed"
          >
            {badge ? badge.description : "You finished a whole story from your imagination."}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68 }}
            className="grid grid-cols-3 gap-2 mb-5"
          >
            <div className="rounded-2xl p-3 border border-white/10 bg-white/5">
              <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />{points}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">Points</div>
            </div>
            <div className="rounded-2xl p-3 border border-yellow-500/30 bg-yellow-500/10">
              <div className="text-xl font-bold text-yellow-300 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-300" />{stars}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">Stars</div>
            </div>
            <div className="rounded-2xl p-3 border border-white/10 bg-white/5">
              <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 text-sky-400" />{awards.length}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">Badges</div>
            </div>
          </motion.div>

          {/* Progress to next badge */}
          {nextTier && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-5"
            >
              <div className="text-xs text-white/40 mb-1.5 flex justify-between">
                <span>Next badge: <span className="text-white/60 font-medium">{nextTier.name}</span></span>
                <span>{points} / {nextTier.threshold}</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(212 80% 60%), hsl(35 85% 60%))" }}
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={onClose}
              size="lg"
              className="w-full rounded-full font-bold text-base py-6"
              style={{ background: "linear-gradient(135deg, hsl(35 85% 55%), hsl(20 90% 55%))", border: "none", color: "white", boxShadow: "0 4px 20px hsl(35 85% 55% / 0.5)" }}
            >
              Back to my bookshelf 🎉
            </Button>
          </motion.div>
        </div>

        {/* All collected badges */}
        {awards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-4 flex justify-center gap-2 flex-wrap"
          >
            {awards.map((a) => {
              const ts = TIER_STYLES[a.id];
              return (
                <div
                  key={a.id}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white/20"
                  style={ts ? { background: `linear-gradient(135deg, ${ts.from}, ${ts.to})` } : { background: "rgba(255,255,255,0.1)" }}
                  title={a.name}
                >
                  {ts?.icon ?? "🏆"}
                </div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
