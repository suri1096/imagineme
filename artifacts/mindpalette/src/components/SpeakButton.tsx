import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStoryStore } from "@/lib/storyStore";
import { applyVoiceToUtterance, ensureVoicesLoaded } from "@/lib/voices";

interface SpeakButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function SpeakButton({ text, label = "Read aloud", size = "sm", className }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const voiceType = useStoryStore((s) => s.mascotVoice);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    ensureVoicesLoaded();
    return () => {
      if (activeUtterance) {
        window.speechSynthesis.cancel();
        activeUtterance = null;
      }
    };
  }, []);

  if (!supported || !text) return null;

  const handleClick = async () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    await ensureVoicesLoaded();
    const u = new SpeechSynthesisUtterance(text);
    applyVoiceToUtterance(u, voiceType);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    activeUtterance = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full text-primary hover:bg-primary/10",
        dim,
        speaking && "bg-primary/15",
        className
      )}
      data-testid="button-speak"
    >
      {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </Button>
  );
}
