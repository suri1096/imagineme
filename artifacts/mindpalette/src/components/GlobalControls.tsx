import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { MascotSetup } from "./MascotSetup";
import { MascotGuide } from "./MascotGuide";
import { useStoryStore } from "@/lib/storyStore";
import { motion, AnimatePresence } from "framer-motion";

const NUDGE_AFTER_MS = 20 * 60 * 1000;

interface GlobalControlsProps {
  /** Lifted up so the header button and the nudge timer share one modal */
  onOpenBreak: (reason?: string) => void;
}

export function GlobalControls({ onOpenBreak }: GlobalControlsProps) {
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const lastBreakAt = useStoryStore(s => s.lastBreakAt);
  const mascot = useStoryStore(s => s.mascot);
  const mood = useStoryStore(s => s.mood);
  const reduceMotion = useStoryStore(s => s.reduceMotion);
  const largeText = useStoryStore(s => s.largeText);
  const textSize = useStoryStore(s => s.textSize);
  const fontStyle = useStoryStore(s => s.fontStyle);
  const darkMode = useStoryStore(s => s.darkMode);
  const appTheme = useStoryStore(s => s.appTheme);
  const sessionStart = useRef<number>(Date.now());
  const [mascotSetupOpen, setMascotSetupOpen] = useState(false);

  // Apply accessibility & display preferences as body classes
  useEffect(() => {
    document.body.classList.toggle("reduce-motion", reduceMotion);
    // text-size
    document.body.classList.remove("text-size-small", "text-size-medium", "text-size-large", "text-size-xl");
    document.body.classList.add(`text-size-${textSize}`);
    // font style
    document.body.classList.toggle("font-dyslexia", fontStyle === "dyslexia");
    // dark mode
    document.documentElement.classList.toggle("dark", darkMode);
    // theme
    document.body.classList.remove("theme-standard", "theme-low-stimulation", "theme-high-contrast");
    document.body.classList.add(`theme-${appTheme}`);
  }, [reduceMotion, largeText, textSize, fontStyle, darkMode, appTheme]);

  // First-time mascot prompt
  useEffect(() => {
    if (mascot) return;
    const t = setTimeout(() => setMascotSetupOpen(true), 1600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Break nudge timer
  useEffect(() => {
    const id = setInterval(() => {
      const since = Date.now() - (lastBreakAt ?? sessionStart.current);
      if (since >= NUDGE_AFTER_MS && !nudgeOpen) setNudgeOpen(true);
    }, 30 * 1000);
    return () => clearInterval(id);
  }, [lastBreakAt, nudgeOpen]);

  const handleNudgeBreak = () => {
    setNudgeOpen(false);
    onOpenBreak("A gentle pause after lots of creating.");
  };

  return (
    <>
      <MascotSetup open={mascotSetupOpen} onClose={() => setMascotSetupOpen(false)} />
      <MascotGuide onOpenSetup={() => setMascotSetupOpen(true)} />

      {/* Break nudge toast */}
      <AnimatePresence>
        {nudgeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-sm w-[calc(100%-2rem)]"
          >
            <div className="bg-card border-2 border-amber-200 rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Coffee className="w-5 h-5" />
              </span>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-foreground">You've been creating for a while!</p>
                <p className="text-muted-foreground">A short break might feel good.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button size="sm" onClick={handleNudgeBreak} className="rounded-full">
                  Take a break
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setNudgeOpen(false)} className="text-muted-foreground">
                  Not now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
