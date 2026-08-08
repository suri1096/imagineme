import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore } from "@/lib/storyStore";
import { generateStory } from "@/lib/storyGenerator";
import { getDrawingSuggestions } from "@/lib/drawingPrompts";

import { StepShell } from "@/components/StepShell";
import { FocusCard } from "@/components/FocusCard";
import { WorldCard } from "@/components/WorldCard";
import { DrawingCanvas, type DrawingCanvasHandle } from "@/components/DrawingCanvas";
import { MicButton } from "@/components/MicButton";
import { Generating } from "@/components/Generating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { WORLDS, WORLD_CATEGORIES, type WorldCategory } from "@/lib/worlds";
import { Heart, Cloud, Sun, Shield, Compass, Sparkles, Pencil, Upload, CheckCircle2 } from "lucide-react";

const FOCUS_OPTIONS = [
  {
    id: "Big feelings", title: "Big feelings", description: "When everything feels like a lot",
    icon: <Heart className="w-8 h-8" />,
    color: { cardBg: "bg-rose-50", iconBg: "bg-rose-100", iconText: "text-rose-500", border: "border-rose-300", ring: "ring-rose-200", titleText: "text-rose-700" },
  },
  {
    id: "Sensory overload", title: "Too much noise", description: "When the world is too bright or loud",
    icon: <Cloud className="w-8 h-8" />,
    color: { cardBg: "bg-sky-50", iconBg: "bg-sky-100", iconText: "text-sky-500", border: "border-sky-300", ring: "ring-sky-200", titleText: "text-sky-700" },
  },
  {
    id: "School day", title: "School day", description: "Navigating learning and friends",
    icon: <Compass className="w-8 h-8" />,
    color: { cardBg: "bg-teal-50", iconBg: "bg-teal-100", iconText: "text-teal-500", border: "border-teal-300", ring: "ring-teal-200", titleText: "text-teal-700" },
  },
  {
    id: "Change/transitions", title: "Changes", description: "Moving from one thing to another",
    icon: <Sun className="w-8 h-8" />,
    color: { cardBg: "bg-amber-50", iconBg: "bg-amber-100", iconText: "text-amber-500", border: "border-amber-300", ring: "ring-amber-200", titleText: "text-amber-700" },
  },
  {
    id: "Friendship", title: "Friendship", description: "Playing together and apart",
    icon: <Shield className="w-8 h-8" />,
    color: { cardBg: "bg-violet-50", iconBg: "bg-violet-100", iconText: "text-violet-500", border: "border-violet-300", ring: "ring-violet-200", titleText: "text-violet-700" },
  },
  {
    id: "My strengths", title: "My super powers", description: "Things I am really good at",
    icon: <Sparkles className="w-8 h-8" />,
    color: { cardBg: "bg-orange-50", iconBg: "bg-orange-100", iconText: "text-orange-500", border: "border-orange-300", ring: "ring-orange-200", titleText: "text-orange-700" },
  },
];

type StoryMode = "ai" | "write" | "upload";

export default function StoryBuilder() {
  const [, setLocation] = useLocation();
  const addStory    = useStoryStore(state => state.addStory);
  const addPoints   = useStoryStore(state => state.addPoints);

  const [step, setStep]               = useState(1);
  const [focus, setFocus]             = useState("");
  const [world, setWorld]             = useState("");
  const [worldCategory, setWorldCategory] = useState<WorldCategory>("nature");
  const [drawingDataUrl, setDrawingDataUrl] = useState("");
  const [prompt, setPrompt]           = useState("");
  const [storyMode, setStoryMode]     = useState<StoryMode>("ai");
  const [customStoryText, setCustomStoryText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepRewarded, setStepRewarded] = useState<Record<number, boolean>>({});

  const canvasRef = useRef<DrawingCanvasHandle>(null);

  const rewardOnce = (n: number, key: number) => {
    if (stepRewarded[key]) return;
    setStepRewarded(prev => ({ ...prev, [key]: true }));
    addPoints(n);
  };

  const handleNext = async () => {
    if (step === 1) rewardOnce(5, 1);
    if (step === 2) rewardOnce(5, 2);

    if (step < 4) {
      setStep(s => s + 1);
    } else {
      const drawPts   = drawingDataUrl ? 10 : 0;
      const promptPts = prompt.trim()  ? 10 : 0;
      const customPts = customStoryText.trim() ? 10 : 0;
      addPoints(drawPts + promptPts + customPts + 15);

      setIsGenerating(true);
      try {
        const customText = storyMode !== "ai" ? customStoryText : undefined;
        const story = await generateStory({ focus, world, drawingDataUrl, prompt, customStoryText: customText });
        addStory(story);
        setLocation(`/book/${story.id}`);
      } catch (err) {
        console.error(err);
        setIsGenerating(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else setLocation("/");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCustomStoryText(text ?? "");
    };
    reader.readAsText(file);
  };

  if (isGenerating) return <Generating />;

  // Drawing step suggestions
  const drawingSuggestions = step === 3 && focus && world
    ? getDrawingSuggestions(focus, world)
    : [];

  const STORY_MODE_CARDS: { id: StoryMode; title: string; description: string; icon: React.ReactNode; color: string; border: string; ring: string }[] = [
    {
      id: "ai",
      title: "AI writes it",
      description: "A magical story based on your feeling and world",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-300 dark:border-violet-700",
      ring: "ring-violet-200 dark:ring-violet-800",
    },
    {
      id: "write",
      title: "Write it myself",
      description: "Type your own story in the box below",
      icon: <Pencil className="w-6 h-6" />,
      color: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-300 dark:border-amber-700",
      ring: "ring-amber-200 dark:ring-amber-800",
    },
    {
      id: "upload",
      title: "Upload a file",
      description: "Use a story saved as a .txt file",
      icon: <Upload className="w-6 h-6" />,
      color: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-300 dark:border-emerald-700",
      ring: "ring-emerald-200 dark:ring-emerald-800",
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        {/* Step 1: Feeling */}
        {step === 1 && (
          <StepShell
            title="How are you feeling today?"
            subtitle="Pick a thought or feeling to explore in your story."
            step={1} totalSteps={4}
            onNext={handleNext} onBack={handleBack}
            nextDisabled={!focus}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FOCUS_OPTIONS.map(opt => (
                <FocusCard key={opt.id} title={opt.title} description={opt.description}
                  icon={opt.icon} color={opt.color} selected={focus === opt.id} onClick={() => setFocus(opt.id)} />
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 2: World */}
        {step === 2 && (
          <StepShell
            title="Where should we go?"
            subtitle="Pick a calm place for your adventure."
            step={2} totalSteps={4}
            onNext={handleNext} onBack={handleBack}
            nextDisabled={!world}
          >
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap">
                {WORLD_CATEGORIES.map((cat, i) => {
                  const pillColors = [
                    "bg-emerald-500 text-white shadow-emerald-200",
                    "bg-sky-500 text-white shadow-sky-200",
                    "bg-violet-500 text-white shadow-violet-200",
                    "bg-amber-500 text-white shadow-amber-200",
                    "bg-rose-500 text-white shadow-rose-200",
                  ];
                  const activeCls = pillColors[i % pillColors.length];
                  return (
                    <button key={cat.id} type="button" onClick={() => setWorldCategory(cat.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                        worldCategory === cat.id
                          ? activeCls + " shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}>
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {WORLDS.filter(w => w.category === worldCategory).map(w => (
                  <WorldCard key={w.id} world={w} selected={world === w.id} onClick={() => setWorld(w.id)} />
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {/* Step 3: Draw */}
        {step === 3 && (
          <StepShell
            title="Draw something!"
            subtitle="Add your drawing to the story, or let AI start one for you."
            step={3} totalSteps={4}
            onNext={handleNext} onBack={handleBack}
          >
            <div className="space-y-5">

              {/* Drawing canvas */}
              <DrawingCanvas ref={canvasRef} onSave={setDrawingDataUrl} />

              {/* Suggestions */}
              {drawingSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Need a spark? Try drawing…
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {drawingSuggestions.map((s, i) => {
                      const chipPalette = [
                        { active: "bg-violet-500 text-white border-violet-500", idle: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
                        { active: "bg-teal-500 text-white border-teal-500",     idle: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100" },
                        { active: "bg-amber-500 text-white border-amber-500",   idle: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
                        { active: "bg-rose-500 text-white border-rose-500",     idle: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
                        { active: "bg-sky-500 text-white border-sky-500",       idle: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100" },
                      ];
                      const chip = chipPalette[i % chipPalette.length];
                      return (
                        <motion.button
                          key={i}
                          type="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          onClick={() => setPrompt(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${prompt === s ? chip.active + " shadow-sm" : chip.idle}`}
                        >
                          {s}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prompt box */}
              <div className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border space-y-3">
                <label className="text-sm font-medium text-foreground block">
                  What is happening in your drawing? <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <div className="flex gap-3">
                  <Textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Once upon a time…"
                    className="resize-none min-h-[80px]"
                  />
                  <div className="flex-shrink-0">
                    <MicButton onTranscript={text => setPrompt(p => p ? `${p} ${text}` : text)} />
                  </div>
                </div>
              </div>

            </div>
          </StepShell>
        )}

        {/* Step 4: Story */}
        {step === 4 && (
          <StepShell
            title="How should the story be written?"
            subtitle="Let AI write it, or use your own words."
            step={4} totalSteps={4}
            onNext={handleNext} onBack={handleBack}
            nextLabel="Create Story"
          >
            <div className="space-y-5">

              {/* Mode cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STORY_MODE_CARDS.map(card => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setStoryMode(card.id)}
                    className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                      storyMode === card.id
                        ? `${card.color} ${card.border} ring-4 ${card.ring}`
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    {storyMode === card.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
                    )}
                    <span className={`mb-3 inline-flex items-center justify-center w-10 h-10 rounded-xl ${storyMode === card.id ? "bg-white/60 dark:bg-black/20" : "bg-muted"}`}>
                      {card.icon}
                    </span>
                    <span className="block font-semibold text-foreground text-base mb-1">{card.title}</span>
                    <span className="block text-sm text-muted-foreground leading-relaxed">{card.description}</span>
                  </button>
                ))}
              </div>

              {/* Write mode */}
              <AnimatePresence mode="wait">
                {storyMode === "write" && (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <label className="text-base font-semibold text-foreground block mb-0.5">
                          Write your story
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Add a blank line between paragraphs to split the story into pages.
                        </p>
                      </div>
                      <MicButton onTranscript={text => setCustomStoryText(p => p ? `${p} ${text}` : text)} />
                    </div>
                    <Textarea
                      value={customStoryText}
                      onChange={e => setCustomStoryText(e.target.value)}
                      placeholder={"Once upon a time…\n\nThe adventure began when…\n\nAlong the way…\n\nThen something amazing happened…\n\nAnd in the end…"}
                      className="resize-none min-h-[220px] text-base leading-relaxed font-serif"
                    />
                    <p className="text-sm text-muted-foreground">
                      {customStoryText.split(/\n{2,}/).filter(Boolean).length} page{customStoryText.split(/\n{2,}/).filter(Boolean).length !== 1 ? "s" : ""} detected
                    </p>
                  </motion.div>
                )}

                {storyMode === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border space-y-4"
                  >
                    <div>
                      <label className="text-base font-semibold text-foreground block mb-1">
                        Upload a story file
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose a plain text (.txt) file from your device.
                      </p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors">
                          <Upload className="w-4 h-4" />
                          Choose file
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {uploadedFileName || "No file chosen"}
                        </span>
                        <input
                          type="file"
                          accept=".txt,.text,text/plain"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {customStoryText && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Story loaded!</p>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 line-clamp-2">
                            {customStoryText.slice(0, 120)}{customStoryText.length > 120 ? "…" : ""}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </StepShell>
        )}

      </motion.div>
    </div>
  );
}
