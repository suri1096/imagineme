import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Gentle focus games shown while a story is being woven.
 * Designed to be calm and low-pressure for neurodivergent kids:
 * no timers, no failure states, no loud effects.
 */

type GameId = "bubbles" | "breathe" | "stars";

const GAMES: { id: GameId; label: string; emoji: string }[] = [
  { id: "bubbles", label: "Pop Bubbles", emoji: "🫧" },
  { id: "breathe", label: "Breathe", emoji: "🌬️" },
  { id: "stars", label: "Catch Stars", emoji: "⭐" },
];

/* ── Bubble Pop ── */
interface Bubble {
  id: number;
  x: number;      // % from left
  size: number;   // px
  duration: number;
  hue: number;
}

function BubblesGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popped, setPopped] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const b: Bubble = {
        id: nextId.current++,
        x: 8 + Math.random() * 80,
        size: 36 + Math.random() * 40,
        duration: 7 + Math.random() * 5,
        hue: 180 + Math.random() * 100,
      };
      setBubbles(prev => [...prev.slice(-11), b]);
    };
    spawn(); spawn(); spawn();
    const id = setInterval(spawn, 1400);
    return () => clearInterval(id);
  }, []);

  const pop = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setPopped(n => n + 1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence>
        {bubbles.map(b => (
          <motion.button
            key={b.id}
            initial={{ y: "110%", opacity: 0.9 }}
            animate={{ y: "-130%" }}
            exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: b.duration, ease: "linear" }}
            onAnimationComplete={() => setBubbles(prev => prev.filter(x => x.id !== b.id))}
            onClick={() => pop(b.id)}
            className="absolute rounded-full border-2 border-white/70 shadow-inner cursor-pointer"
            style={{
              left: `${b.x}%`,
              bottom: 0,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, hsla(${b.hue},80%,92%,.95), hsla(${b.hue},70%,75%,.6))`,
            }}
            aria-label="Pop bubble"
          />
        ))}
      </AnimatePresence>
      {popped > 0 && (
        <div className="absolute top-2 right-3 text-sm text-muted-foreground font-medium">
          {popped} popped 🫧
        </div>
      )}
    </div>
  );
}

/* ── Guided Breathing ── */
function BreatheGame() {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    let alive = true;
    const cycle = async () => {
      while (alive) {
        setPhase("in");
        await new Promise(r => setTimeout(r, 4000));
        if (!alive) break;
        setPhase("hold");
        await new Promise(r => setTimeout(r, 2000));
        if (!alive) break;
        setPhase("out");
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    cycle();
    return () => { alive = false; };
  }, []);

  const label = phase === "in" ? "Breathe in..." : phase === "hold" ? "Hold..." : "Breathe out...";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: phase === "in" ? 1.35 : phase === "hold" ? 1.35 : 0.85 }}
        transition={{ duration: phase === "hold" ? 0.3 : 3.8, ease: "easeInOut" }}
        className="w-28 h-28 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 shadow-lg flex items-center justify-center text-4xl"
      >
        🌙
      </motion.div>
      <p className="text-lg font-serif text-foreground/80">{label}</p>
    </div>
  );
}

/* ── Catch Stars (tap the twinkling star) ── */
function StarsGame() {
  const [star, setStar] = useState({ x: 50, y: 50, key: 0 });
  const [caught, setCaught] = useState(0);

  const moveStar = () => {
    setStar({ x: 10 + Math.random() * 80, y: 15 + Math.random() * 65, key: Date.now() });
    setCaught(n => n + 1);
  };

  return (
    <div className="relative w-full h-full">
      <motion.button
        key={star.key}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: [1, 1.15, 1], rotate: 0 }}
        transition={{ scale: { repeat: Infinity, duration: 1.6 } }}
        onClick={moveStar}
        className="absolute text-4xl cursor-pointer select-none"
        style={{ left: `${star.x}%`, top: `${star.y}%`, transform: "translate(-50%,-50%)" }}
        aria-label="Catch the star"
      >
        ⭐
      </motion.button>
      {caught > 0 && (
        <div className="absolute top-2 right-3 text-sm text-muted-foreground font-medium">
          {caught} caught ⭐
        </div>
      )}
    </div>
  );
}

export function FocusGames() {
  const [game, setGame] = useState<GameId>("bubbles");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="w-full max-w-md mx-auto"
    >
      <p className="text-center text-sm text-muted-foreground mb-3">
        Want to play something gentle while you wait?
      </p>
      <div className="flex justify-center gap-2 mb-3">
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setGame(g.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              game === g.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white/70 text-foreground/70 border-primary/20 hover:bg-white"
            )}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>
      <div className="h-56 rounded-2xl border-2 border-primary/15 bg-gradient-to-b from-sky-50/80 to-indigo-50/60 overflow-hidden">
        {game === "bubbles" && <BubblesGame />}
        {game === "breathe" && <BreatheGame />}
        {game === "stars" && <StarsGame />}
      </div>
    </motion.div>
  );
}
