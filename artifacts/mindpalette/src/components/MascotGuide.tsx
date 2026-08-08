import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "@/lib/storyStore";
import { getMascot } from "@/lib/mascots";
import { MascotAvatar } from "./MascotAvatar";
import { SpeakButton } from "./SpeakButton";
import { Button } from "@/components/ui/button";
import { ChevronRight, Settings2, X } from "lucide-react";

interface MascotGuideProps {
  onOpenSetup: () => void;
}

function tipsForRoute(path: string, mascotName: string): string[] {
  if (path === "/" || path === "") {
    return [
      `Hi, I am ${mascotName}. I am here whenever you want a tip.`,
      "Tap 'Create My Story' when you are ready. There is no rush.",
      "Your bookshelf keeps every story you make safe.",
    ];
  }
  if (path.startsWith("/create")) {
    return [
      "Pick whatever feels true. There is no wrong answer.",
      "If something feels like a lot, the Break button is always at the top.",
      "Your drawing can be tiny scribbles or big shapes. Both are perfect.",
      "Words can be hard. The little microphone listens if you'd like to talk.",
    ];
  }
  if (path.startsWith("/book/")) {
    return [
      "Tap the speaker on the page to have it read to you.",
      "Take your time on each page. The story will wait.",
      "When you're done, you can turn it into a tiny video to keep.",
    ];
  }
  if (path.startsWith("/bookshelf")) {
    return [
      "Every story you make lives here, just for you.",
      "Tap a book cover to open it again.",
    ];
  }
  return [`I'm ${mascotName}. Tap me anytime for a tip.`];
}

export function MascotGuide({ onOpenSetup }: MascotGuideProps) {
  const mascotId = useStoryStore((s) => s.mascot);
  const muted = useStoryStore((s) => s.mascotMuted);
  const setMuted = useStoryStore((s) => s.setMascotMuted);
  const [location] = useLocation();
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const mascot = getMascot(mascotId);
  const tips = useMemo(
    () => (mascot ? tipsForRoute(location, mascot.name) : []),
    [mascot, location]
  );

  useEffect(() => {
    setTipIndex(0);
    setBubbleOpen(true);
  }, [location]);

  if (!mascot) return null;

  const tip = tips[tipIndex % tips.length];
  const nextTip = () => setTipIndex((i) => (i + 1) % tips.length);

  return (
    <div className="fixed bottom-4 left-4 z-30 flex items-end gap-2 max-w-[calc(100vw-2rem)] sm:max-w-md">
      <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!bubbleOpen) setBubbleOpen(true);
          else nextTip();
        }}
        className="flex-shrink-0 focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-full drop-shadow-lg"
        aria-label={`${mascot.name}, your guide`}
        data-testid="button-mascot"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
        >
          <MascotAvatar id={mascot.id} size={64} ring />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {bubbleOpen && tip && (
          <motion.div
            key={tip}
            initial={{ opacity: 0, scale: 0.9, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -8 }}
            transition={{ duration: 0.25 }}
            className="relative bg-foreground text-background rounded-2xl rounded-bl-sm shadow-2xl ring-2 ring-foreground/80 p-4 pr-3 max-w-xs"
          >
            <div className="flex items-start gap-2">
              <p className="text-sm font-semibold flex-1 pr-1 leading-snug">{tip}</p>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); setBubbleOpen(false); }}
                className="w-7 h-7 flex-shrink-0 -mt-1 -mr-1 rounded-full text-background/70 hover:text-background hover:bg-white/10"
                aria-label="Hide tip"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3 gap-1">
              <div className="flex items-center gap-1">
                {!muted && <SpeakButton text={tip} label="Read tip aloud" />}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                  className="w-8 h-8 rounded-full text-background/60 hover:text-background hover:bg-white/10"
                  aria-label={muted ? "Turn mascot voice on" : "Turn mascot voice off"}
                  title={muted ? "Voice off — tap to turn on" : "Voice on"}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); onOpenSetup(); }}
                  className="w-8 h-8 rounded-full text-background/60 hover:text-background hover:bg-white/10"
                  aria-label="Change guide"
                  title="Change guide"
                >
                  <span className="text-[10px] font-bold">{mascot.name[0]}</span>
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); nextTip(); }}
                className="text-xs font-semibold text-background hover:bg-white/15 gap-1 h-7 px-2 rounded-full"
              >
                Next tip <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
