import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuthStore, AVATAR_EMOJIS } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const setProfile = useAuthStore(s => s.setProfile);
  const existingName = useAuthStore(s => s.userName);

  const [name, setName] = useState(existingName ?? "");
  const [emoji, setEmoji] = useState(AVATAR_EMOJIS[0]);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      setError("What's your name?");
      return;
    }
    setProfile(name.trim(), emoji);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">ImagineMe</h1>
          <p className="text-muted-foreground text-sm">Your magical storybook space</p>
        </div>

        <div className="bg-card border rounded-3xl p-7 shadow-sm space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">
              What's your name?
            </label>
            <Input
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleStart()}
              placeholder="Type your name…"
              className="text-base rounded-xl h-12"
              autoFocus
            />
            {error && (
              <p className="text-destructive text-xs">{error}</p>
            )}
          </div>

          {/* Avatar picker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">
              Pick your avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-primary/15 border-2 border-primary scale-110 shadow-sm"
                      : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            size="lg"
          >
            <span className="text-lg">{emoji}</span>
            Let's go, {name.trim() || "…"}!
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Your stories are saved only on this device.
        </p>
      </motion.div>
    </div>
  );
}
