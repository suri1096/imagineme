import { Sparkles } from "lucide-react";
import { useStoryStore } from "@/lib/storyStore";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function PointsBadge() {
  const points = useStoryStore((s) => s.points);
  const [pop, setPop] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const prev = useRef(points);

  useEffect(() => {
    if (points !== prev.current) {
      const d = points - prev.current;
      prev.current = points;
      if (d > 0) {
        setDelta(d);
        setPop(true);
        const t1 = setTimeout(() => setPop(false), 700);
        const t2 = setTimeout(() => setDelta(null), 1400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
      }
    }
  }, [points]);

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold shadow-sm border border-primary/20"
        animate={pop ? { scale: [1, 1.18, 1] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Sparkles className="w-4 h-4" />
        <span className="tabular-nums">{points}</span>
      </motion.div>
      {delta !== null && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -28 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 text-primary font-bold text-sm whitespace-nowrap"
        >
          +{delta}
        </motion.div>
      )}
    </div>
  );
}
