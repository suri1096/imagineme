import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Trophy, Check, LogOut, Type, Palette, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuthStore, AVATAR_EMOJIS } from "@/lib/authStore";
import { useStoryStore, type TextSize, type FontStyle, type AppTheme } from "@/lib/storyStore";
import { cn } from "@/lib/utils";

// ─── reusable toggle row (for simple on/off settings) ───────────────────
function SettingRow({
  title, hint, checked, onChange, testId,
}: { title: string; hint: string; checked: boolean; onChange: (on: boolean) => void; testId: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-primary/10 last:border-b-0">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} data-testid={testId} />
    </div>
  );
}

// ─── pill-grid selector ──────────────────────────────────────────────────
function PillGrid<T extends string>({
  options, value, onChange, cols = 2,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div className={cn("grid gap-3", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all duration-150 font-semibold text-sm",
            value === opt.value
              ? "bg-[#4A7EC0] border-[#4A7EC0] text-white shadow-md"
              : "bg-white border-border text-foreground hover:border-primary/40"
          )}
        >
          {opt.hint !== undefined && (
            <span className={cn(
              "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
              value === opt.value ? "border-white bg-white" : "border-muted-foreground/40"
            )}>
              {value === opt.value && <span className="w-2.5 h-2.5 rounded-full bg-[#4A7EC0] block" />}
            </span>
          )}
          <span>
            <span className="block">{opt.label}</span>
            {opt.hint && <span className={cn("text-xs font-normal", value === opt.value ? "text-white/80" : "text-muted-foreground")}>{opt.hint}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── section header ──────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#4A7EC0]">{icon}</span>
      <h2 className="text-lg font-bold text-foreground tracking-wide uppercase text-xs text-muted-foreground">
        {title}
      </h2>
    </div>
  );
}

// ─── subsection label ────────────────────────────────────────────────────
function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{children}</p>;
}

export default function Profile() {
  const [, navigate] = useLocation();
  const { userName, userEmoji, setProfile, clearProfile } = useAuthStore();
  const [name, setName] = useState(userName ?? "");
  const [emoji, setEmoji] = useState(userEmoji);
  const [saved, setSaved] = useState(false);

  const {
    points, stars, awards, stories,
    calmMode, setCalmMode,
    reduceMotion, setReduceMotion,
    mascotMuted, setMascotMuted,
    textSize, setTextSize,
    fontStyle, setFontStyle,
    darkMode, setDarkMode,
    appTheme, setAppTheme,
  } = useStoryStore();

  const handleSave = () => {
    if (!name.trim()) return;
    setProfile(name, emoji);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const textSizeOptions: { value: TextSize; label: string }[] = [
    { value: "small",  label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large",  label: "Large" },
    { value: "xl",     label: "Extra Large" },
  ];

  const fontStyleOptions: { value: FontStyle; label: string }[] = [
    { value: "default",  label: "Default" },
    { value: "dyslexia", label: "Dyslexia-Friendly" },
  ];

  const themeOptions: { value: AppTheme; label: string; hint: string }[] = [
    { value: "standard",        label: "Standard",        hint: "Colorful and vibrant" },
    { value: "low-stimulation", label: "Low-Stimulation", hint: "Muted and calm" },
    { value: "high-contrast",   label: "High Contrast",   hint: "Bold and clear" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Back home">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-serif font-bold text-foreground">My Profile</h1>
        </div>

        {/* Profile card */}
        <div className="bg-card rounded-3xl border-2 border-primary/15 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              {emoji}
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">Your name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name..."
                className="mt-1"
                data-testid="input-profile-name"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Pick your avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-11 h-11 rounded-full text-2xl flex items-center justify-center transition-all",
                    emoji === e
                      ? "bg-primary/15 ring-2 ring-primary scale-105"
                      : "bg-muted hover:bg-primary/10"
                  )}
                  aria-label={`Avatar ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={!name.trim()} className="w-full rounded-full" data-testid="button-save-profile">
            {saved ? <><Check className="w-4 h-4 mr-1" /> Saved!</> : "Save changes"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border-2 border-primary/15 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stories.length}</p>
            <p className="text-xs text-muted-foreground">Stories</p>
          </div>
          <div className="bg-card rounded-2xl border-2 border-primary/15 p-4 text-center">
            <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              {points} <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </p>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="bg-card rounded-2xl border-2 border-primary/15 p-4 text-center">
            <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              {awards.length} <Trophy className="w-4 h-4 text-amber-600" />
            </p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* ── ACCESSIBILITY section ── */}
        <div className="bg-card rounded-3xl border-2 border-primary/15 shadow-sm p-6 space-y-6">
          <SectionHeader icon={<Type className="w-5 h-5" />} title="Accessibility" />

          {/* Text size */}
          <div>
            <SubLabel>Text Size</SubLabel>
            <div className="grid grid-cols-2 gap-3">
              {textSizeOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTextSize(opt.value)}
                  className={cn(
                    "px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-150",
                    textSize === opt.value
                      ? "bg-[#4A7EC0] border-[#4A7EC0] text-white shadow-md"
                      : "bg-white border-border text-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font style */}
          <div>
            <SubLabel>Font Style</SubLabel>
            <div className="grid grid-cols-2 gap-3">
              {fontStyleOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFontStyle(opt.value)}
                  className={cn(
                    "px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-150",
                    fontStyle === opt.value
                      ? "bg-[#4A7EC0] border-[#4A7EC0] text-white shadow-md"
                      : "bg-white border-border text-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── DISPLAY section ── */}
        <div className="bg-card rounded-3xl border-2 border-primary/15 shadow-sm p-6 space-y-6">
          <SectionHeader icon={<Monitor className="w-5 h-5" />} title="Display" />

          {/* Dark mode */}
          <SettingRow
            title="Dark Mode"
            hint="Easier at night"
            checked={darkMode}
            onChange={setDarkMode}
            testId="switch-dark-mode"
          />

          {/* Theme */}
          <div>
            <SubLabel>Theme</SubLabel>
            <PillGrid options={themeOptions} value={appTheme} onChange={setAppTheme} cols={1} />
          </div>
        </div>

        {/* ── COMFORT section ── */}
        <div className="bg-card rounded-3xl border-2 border-primary/15 shadow-sm p-6">
          <SectionHeader icon={<Palette className="w-5 h-5" />} title="Comfort" />
          <SettingRow
            title="Calm mode"
            hint="Softer colors and a quieter feel"
            checked={calmMode}
            onChange={setCalmMode}
            testId="switch-calm-mode"
          />
          <SettingRow
            title="Less movement"
            hint="Turns off animations and spinning things"
            checked={reduceMotion}
            onChange={setReduceMotion}
            testId="switch-reduce-motion"
          />
          <SettingRow
            title="Quiet buddy"
            hint="Your mascot friend stays silent"
            checked={mascotMuted}
            onChange={setMascotMuted}
            testId="switch-mascot-muted"
          />
        </div>

        <Button
          variant="ghost"
          onClick={() => { clearProfile(); navigate("/login"); }}
          className="w-full text-muted-foreground gap-2"
          data-testid="button-switch-reader"
        >
          <LogOut className="w-4 h-4" /> Switch reader
        </Button>
      </motion.div>
    </div>
  );
}
