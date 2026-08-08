import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PointsBadge } from "@/components/PointsBadge";
import { SpeakButton } from "@/components/SpeakButton";

// One distinct colour per step
const STEP_COLORS = [
  { bubble: "bg-rose-400",    bar: "bg-gradient-to-r from-rose-400 to-pink-400",    track: "bg-rose-100",    label: "text-rose-600"    },
  { bubble: "bg-sky-400",     bar: "bg-gradient-to-r from-sky-400 to-cyan-400",     track: "bg-sky-100",     label: "text-sky-600"     },
  { bubble: "bg-violet-400",  bar: "bg-gradient-to-r from-violet-400 to-purple-400",track: "bg-violet-100",  label: "text-violet-600"  },
  { bubble: "bg-amber-400",   bar: "bg-gradient-to-r from-amber-400 to-orange-400", track: "bg-amber-100",   label: "text-amber-600"   },
];

interface StepShellProps {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}

export function StepShell({
  title,
  subtitle,
  step,
  totalSteps,
  onNext,
  onBack,
  nextDisabled,
  nextLabel = "Next",
  children
}: StepShellProps) {
  const progress = (step / totalSteps) * 100;
  const c = STEP_COLORS[(step - 1) % STEP_COLORS.length];

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-24 px-4 md:px-8 max-w-4xl mx-auto w-full">

      {/* Progress row */}
      <div className="w-full mb-8 flex items-center gap-4">
        {/* Step bubbles */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const sc = STEP_COLORS[i % STEP_COLORS.length];
            const done = i + 1 < step;
            const active = i + 1 === step;
            return (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full flex items-center justify-center text-xs font-bold
                  ${active ? sc.bubble + " w-8 h-8 text-white shadow-md scale-110" : ""}
                  ${done  ? sc.bubble + " w-6 h-6 text-white opacity-70" : ""}
                  ${!active && !done ? "w-6 h-6 bg-muted text-muted-foreground" : ""}
                `}
              >
                {done ? "✓" : i + 1}
              </div>
            );
          })}
        </div>

        {/* Coloured progress bar */}
        <div className={`h-3 flex-1 rounded-full overflow-hidden ${c.track}`}>
          <motion.div
            className={`h-full rounded-full ${c.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <PointsBadge />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex-1 flex flex-col"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif tracking-tight">
              {title}
            </h1>
            <SpeakButton text={subtitle ? `${title}. ${subtitle}` : title} size="md" />
          </div>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1">
          {children}
        </div>
      </motion.div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {onBack ? (
            <Button variant="ghost" size="lg" onClick={onBack} className="text-muted-foreground gap-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
          ) : <div />}

          {onNext && (
            <Button
              size="lg"
              onClick={onNext}
              disabled={nextDisabled}
              className={`gap-2 px-8 rounded-full shadow-md text-white border-0 transition-all
                ${c.bubble.replace("bg-", "bg-")}
                ${nextDisabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"}
              `}
            >
              {nextLabel}
              {nextLabel !== "Finish" && <ArrowRight className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
