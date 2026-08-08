import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStoryStore, type Pronouns, type MascotId } from "@/lib/storyStore";
import { MASCOTS, getMascot } from "@/lib/mascots";
import { MascotAvatar } from "./MascotAvatar";
import { cn } from "@/lib/utils";
import { applyVoiceToUtterance, ensureVoicesLoaded, type VoiceType } from "@/lib/voices";
import { Check, ArrowLeft } from "lucide-react";

interface MascotSetupProps {
  open: boolean;
  onClose: () => void;
}

const PRONOUN_OPTIONS: { id: Pronouns; label: string; sub: string; color: string; border: string; ring: string }[] = [
  { id: "he",   label: "He / Him",    sub: "he made a story",    color: "bg-sky-50",    border: "border-sky-200",    ring: "ring-sky-300" },
  { id: "she",  label: "She / Her",   sub: "she made a story",   color: "bg-rose-50",   border: "border-rose-200",   ring: "ring-rose-300" },
  { id: "they", label: "They / Them", sub: "they made a story",  color: "bg-violet-50", border: "border-violet-200", ring: "ring-violet-300" },
];

// Inline sound wave SVG — no external assets
function SoundWave({ active, color }: { active: boolean; color: string }) {
  const heights = [4, 10, 16, 10, 4, 14, 8, 14, 4, 10, 16, 10, 4];
  return (
    <svg viewBox={`0 0 ${heights.length * 6} 20`} className="w-12 h-5" aria-hidden>
      {heights.map((h, i) => (
        <motion.rect
          key={i}
          x={i * 6}
          y={(20 - h) / 2}
          width={4}
          height={h}
          rx={2}
          fill={active ? color : "#d1d5db"}
          animate={active ? { scaleY: [1, 1.4, 0.7, 1.2, 1], opacity: [1, 0.8, 1] } : { scaleY: 1 }}
          transition={active ? { duration: 1.2, delay: i * 0.07, repeat: Infinity, ease: "easeInOut" } : {}}
          style={{ transformOrigin: "center" }}
        />
      ))}
    </svg>
  );
}

// Step progress dots
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i + 1 < current ? "bg-primary w-3 h-3" :
            i + 1 === current ? "bg-primary w-6 h-3" :
            "bg-muted w-3 h-3"
          )}
          layout
        />
      ))}
    </div>
  );
}

export function MascotSetup({ open, onClose }: MascotSetupProps) {
  const setPronouns = useStoryStore((s) => s.setPronouns);
  const setMascot   = useStoryStore((s) => s.setMascot);
  const setMascotVoice = useStoryStore((s) => s.setMascotVoice);
  const currentPronouns = useStoryStore((s) => s.pronouns);
  const currentMascot   = useStoryStore((s) => s.mascot);
  const currentVoice    = useStoryStore((s) => s.mascotVoice);

  const [step, setStep]           = useState<1 | 2 | 3>(currentMascot ? 3 : currentPronouns ? 2 : 1);
  const [pronouns, setPronounsLocal] = useState<Pronouns | null>(currentPronouns);
  const [mascot, setMascotLocal]     = useState<MascotId | null>(currentMascot);
  const [voice, setVoiceLocal]       = useState<VoiceType>(currentVoice);
  const [previewingVoice, setPreviewingVoice] = useState<VoiceType | null>(null);

  const handlePronoun = (p: Pronouns) => {
    setPronounsLocal(p);
    setPronouns(p);
    setTimeout(() => setStep(2), 220);
  };

  const handleMascot = () => {
    if (mascot) { setMascot(mascot); setStep(3); }
  };

  const previewVoice = async (v: VoiceType) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setPreviewingVoice(v);
    await ensureVoicesLoaded();
    const name = mascot ? getMascot(mascot)?.name ?? "your guide" : "your guide";
    const u = new SpeechSynthesisUtterance(`Hi, I'm ${name}. I'll be here whenever you need a tip.`);
    applyVoiceToUtterance(u, v);
    u.onend = () => setPreviewingVoice(null);
    window.speechSynthesis.speak(u);
  };

  const handleVoiceConfirm = () => {
    setMascotVoice(voice);
    onClose();
  };

  const selectedMascotDef = mascot ? getMascot(mascot) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="bg-card w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Coloured header strip */}
            <div className={cn(
              "h-2 w-full transition-colors duration-500",
              step === 1 ? "bg-gradient-to-r from-rose-300 via-violet-300 to-sky-300" :
              step === 2 && selectedMascotDef ? `bg-gradient-to-r from-${selectedMascotDef.ring.replace("ring-", "")} to-primary` :
              "bg-gradient-to-r from-primary via-secondary to-accent"
            )} />

            <div className="p-6 md:p-8">
              <StepDots current={step} total={3} />

              <AnimatePresence mode="wait">

                {/* ── Step 1: Pronouns ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center mb-1">
                      How would you like us<br />to talk to you?
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-7">
                      Pick the words that feel right. You can change this anytime.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {PRONOUN_OPTIONS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePronoun(p.id)}
                          data-testid={`pronoun-${p.id}`}
                          className={cn(
                            "relative group py-5 px-4 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-4",
                            pronouns === p.id
                              ? `${p.color} ${p.border} ring-4 ${p.ring}`
                              : `bg-card border-border hover:${p.color} hover:${p.border}`
                          )}
                        >
                          {pronouns === p.id && (
                            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </span>
                          )}
                          <span className="block font-bold text-foreground text-base">{p.label}</span>
                          <span className="block text-xs text-muted-foreground mt-1 italic">"{p.sub}"</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => { setPronounsLocal("they"); setPronouns("they"); setStep(2); }}
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      Skip, just use my name
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Mascot picker ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center mb-1">
                      Pick your guide
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      They'll pop in with tips along the way.
                    </p>

                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {MASCOTS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMascotLocal(m.id)}
                          data-testid={`mascot-${m.id}`}
                          className={cn(
                            "flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all duration-200 focus:outline-none",
                            mascot === m.id
                              ? `${m.bg} border-transparent ring-4 ${m.ring} scale-[1.04]`
                              : "border-border hover:border-primary/30 bg-card"
                          )}
                        >
                          <MascotAvatar id={m.id} size={56} ring={mascot === m.id} />
                          <span className="text-xs font-bold text-foreground leading-tight">{m.name}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight text-center px-0.5">{m.vibe}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => setStep(1)} className="gap-1.5 rounded-xl">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleMascot}
                        disabled={!mascot}
                        size="lg"
                        className="rounded-xl flex-1 font-semibold"
                        data-testid="button-confirm-mascot"
                      >
                        {mascot
                          ? `Go with ${MASCOTS.find(m => m.id === mascot)?.name} →`
                          : "Choose a guide"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Voice picker ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col items-center mb-6">
                      {mascot && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", bounce: 0.4 }}
                          className="mb-3"
                        >
                          <MascotAvatar id={mascot} size={80} ring />
                        </motion.div>
                      )}
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center">
                        Pick {selectedMascotDef?.name ?? "their"}'s voice
                      </h2>
                      <p className="text-sm text-muted-foreground text-center mt-1">
                        Tap any card to hear a preview.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {([
                        { id: "girl"    as VoiceType, label: "Soft",    hint: "Higher and gentle",     waveColor: "#f472b6" },
                        { id: "boy"     as VoiceType, label: "Warm",    hint: "Lower and steady",      waveColor: "#60a5fa" },
                        { id: "default" as VoiceType, label: "Natural", hint: "Your device's default", waveColor: "#34d399" },
                      ]).map((v) => (
                        <button
                          key={v.id}
                          onClick={() => { setVoiceLocal(v.id); previewVoice(v.id); }}
                          data-testid={`voice-${v.id}`}
                          className={cn(
                            "relative p-4 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none",
                            voice === v.id
                              ? "border-primary bg-primary/5 ring-4 ring-primary/20"
                              : "border-border hover:border-primary/30 bg-card"
                          )}
                        >
                          {voice === v.id && (
                            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </span>
                          )}
                          <SoundWave active={previewingVoice === v.id} color={v.waveColor} />
                          <span className="block font-bold text-foreground mt-2">{v.label}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{v.hint}</span>
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground text-center mb-5">
                      Voices come from your device. They may sound a little different.
                    </p>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => setStep(2)} className="gap-1.5 rounded-xl">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleVoiceConfirm}
                        size="lg"
                        className="rounded-xl flex-1 font-semibold"
                        data-testid="button-confirm-voice"
                      >
                        All set ✓
                      </Button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
