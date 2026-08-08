import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStoryStore } from "@/lib/storyStore";
import { X } from "lucide-react";

interface BreakTimeProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

const PHASES = [
  { label: "Breathe in", seconds: 4 },
  { label: "Hold gently", seconds: 4 },
  { label: "Breathe out", seconds: 6 },
] as const;

export function BreakTime({ open, onClose, reason }: BreakTimeProps) {
  const recordBreak = useStoryStore((s) => s.recordBreak);
  const addPoints = useStoryStore((s) => s.addPoints);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cyclesDone, setCyclesDone] = useState(0);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    if (!open) {
      setPhaseIndex(0);
      setCyclesDone(0);
      setRewarded(false);
      return;
    }
    const phase = PHASES[phaseIndex];
    const t = setTimeout(() => {
      setPhaseIndex((i) => {
        const next = (i + 1) % PHASES.length;
        if (next === 0) setCyclesDone((c) => c + 1);
        return next;
      });
    }, phase.seconds * 1000);
    return () => clearTimeout(t);
  }, [open, phaseIndex]);

  useEffect(() => {
    if (cyclesDone >= 1 && !rewarded) {
      setRewarded(true);
      recordBreak();
      addPoints(5);
    }
  }, [cyclesDone, rewarded, recordBreak, addPoints]);

  if (!open) return null;
  const phase = PHASES[phaseIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 backdrop-blur-sm p-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-white/70 hover:bg-white"
          aria-label="End break"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex flex-col items-center max-w-md w-full text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-1">Break time</h2>
          <p className="text-muted-foreground mb-10">
            {reason ?? "Let's pause together. There is no rush."}
          </p>

          <div className="relative w-72 h-72 flex items-center justify-center mb-8">
            <motion.div
              key={phaseIndex}
              initial={{ scale: phase.label === "Breathe in" ? 0.55 : phase.label === "Breathe out" ? 1 : 1 }}
              animate={{ scale: phase.label === "Breathe in" ? 1 : phase.label === "Breathe out" ? 0.55 : 1 }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 shadow-inner"
            />
            <motion.div
              key={`ring-${phaseIndex}`}
              initial={{ scale: phase.label === "Breathe in" ? 0.6 : phase.label === "Breathe out" ? 1.05 : 1.05 }}
              animate={{ scale: phase.label === "Breathe in" ? 1.05 : phase.label === "Breathe out" ? 0.6 : 1.05 }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full border-4 border-white/60"
            />
            <div className="relative z-10 text-center">
              <motion.div
                key={`label-${phaseIndex}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-serif text-foreground font-semibold"
              >
                {phase.label}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1">
                {phase.seconds} seconds
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 min-h-[1.5rem]">
            {cyclesDone === 0
              ? "Follow the soft circle with your breath."
              : `You finished ${cyclesDone} round${cyclesDone === 1 ? "" : "s"}. Stay as long as you like.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={onClose}
              size="lg"
              className="rounded-full flex-1"
            >
              I'm ready to come back
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
