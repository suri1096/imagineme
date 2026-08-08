import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';

export interface StoryPage {
  text: string;
  layout: 'full' | 'inset' | 'scene';
  sceneAccents?: string[];
  aiImageUrl?: string;
  /** Child/parent-recorded narration for this page (base64 data URL) */
  recordedAudioUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  createdAt: number;
  focus: string;
  world: string;
  companionName: string;
  companionType: string;
  drawingDataUrl: string;
  prompt: string;
  pages: StoryPage[];
  /** AI-generated cover image (base64 data URL) */
  coverImageUrl?: string;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  earnedAt: number;
}

export const AWARD_TIERS: { threshold: number; id: string; name: string; description: string }[] = [
  { threshold: 25, id: "spark", name: "Bright Spark", description: "You started a story and made it your own." },
  { threshold: 50, id: "explorer", name: "Gentle Explorer", description: "You explored a whole new world with a friend." },
  { threshold: 100, id: "storyteller", name: "Storyteller Star", description: "You finished a beautiful storybook from start to end." },
  { threshold: 175, id: "creator", name: "Magical Creator", description: "You have built more than one story. Your imagination is huge." },
  { threshold: 300, id: "luminary", name: "Palette Luminary", description: "Your stories light up the bookshelf." },
];

export type TextSize = "small" | "medium" | "large" | "xl";
export type FontStyle = "default" | "dyslexia";
export type AppTheme = "standard" | "low-stimulation" | "high-contrast";

export type Pronouns = "he" | "she" | "they";
export type MascotId = "bunny" | "robot" | "star" | "dragon" | "owl" | "fox" | "cloud" | "cat";

export type Mood = "calm" | "happy" | "wiggly" | "loud-inside" | "tired";

export const MOODS: { id: Mood; label: string; hint: string }[] = [
  { id: "calm", label: "Calm", hint: "Soft and steady" },
  { id: "happy", label: "Happy", hint: "Warm and bright" },
  { id: "wiggly", label: "Wiggly", hint: "Lots of energy" },
  { id: "loud-inside", label: "Loud inside", hint: "A lot of feelings at once" },
  { id: "tired", label: "Tired", hint: "Slow and sleepy" },
];

export const MOODS_THAT_SUGGEST_BREAK: Mood[] = ["wiggly", "loud-inside", "tired"];

export interface MoodEntry {
  mood: Mood;
  at: number;
}

interface StoryState {
  stories: Story[];
  stars: number;
  points: number;
  awards: Award[];
  calmMode: boolean;
  mood: Mood | null;
  moodHistory: MoodEntry[];
  breaksTaken: number;
  lastBreakAt: number | null;
  pronouns: Pronouns | null;
  mascot: MascotId | null;
  mascotMuted: boolean;
  mascotVoice: "girl" | "boy" | "default";
  /** Accessibility preferences */
  reduceMotion: boolean;
  largeText: boolean;
  textSize: TextSize;
  fontStyle: FontStyle;
  darkMode: boolean;
  appTheme: AppTheme;
  addStory: (story: Story) => void;
  deleteStory: (id: string) => void;
  setPageRecording: (storyId: string, pageIndex: number, audioDataUrl: string | undefined) => void;
  addStars: (n: number) => void;
  addPoints: (n: number, reason?: string) => Award | null;
  setCalmMode: (calm: boolean) => void;
  setMood: (mood: Mood) => void;
  recordBreak: () => void;
  setPronouns: (p: Pronouns) => void;
  setMascot: (m: MascotId) => void;
  setMascotMuted: (muted: boolean) => void;
  setMascotVoice: (v: "girl" | "boy" | "default") => void;
  setReduceMotion: (on: boolean) => void;
  setLargeText: (on: boolean) => void;
  setTextSize: (s: TextSize) => void;
  setFontStyle: (s: FontStyle) => void;
  setDarkMode: (on: boolean) => void;
  setAppTheme: (t: AppTheme) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: [],
      stars: 0,
      points: 0,
      awards: [],
      calmMode: false,
      mood: null,
      moodHistory: [],
      breaksTaken: 0,
      lastBreakAt: null,
      pronouns: null,
      mascot: null,
      mascotMuted: false,
      mascotVoice: "default",
      reduceMotion: false,
      largeText: false,
      textSize: "medium",
      fontStyle: "default",
      darkMode: false,
      appTheme: "standard",
      addStory: (story) => set((state) => ({ stories: [story, ...state.stories] })),
      deleteStory: (id) => set((state) => ({ stories: state.stories.filter(s => s.id !== id) })),
      setPageRecording: (storyId, pageIndex, audioDataUrl) =>
        set((state) => ({
          stories: state.stories.map(s =>
            s.id !== storyId
              ? s
              : {
                  ...s,
                  pages: s.pages.map((p, i) =>
                    i === pageIndex ? { ...p, recordedAudioUrl: audioDataUrl } : p
                  ),
                }
          ),
        })),
      addStars: (n) => set((state) => ({ stars: state.stars + n })),
      addPoints: (n) => {
        const before = get().points;
        const after = before + n;
        const earnedIds = new Set(get().awards.map(a => a.id));
        const newlyEarned = AWARD_TIERS.filter(
          t => before < t.threshold && after >= t.threshold && !earnedIds.has(t.id)
        );
        const newAwards: Award[] = newlyEarned.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          earnedAt: Date.now(),
        }));
        set({ points: after, awards: [...get().awards, ...newAwards] });
        return newAwards[0] ?? null;
      },
      setCalmMode: (calm) => set({ calmMode: calm }),
      setMood: (mood) =>
        set((state) => ({
          mood,
          moodHistory: [...state.moodHistory.slice(-49), { mood, at: Date.now() }],
        })),
      recordBreak: () =>
        set((state) => ({
          breaksTaken: state.breaksTaken + 1,
          lastBreakAt: Date.now(),
        })),
      setPronouns: (p) => set({ pronouns: p }),
      setMascot: (m) => set({ mascot: m }),
      setMascotMuted: (muted) => set({ mascotMuted: muted }),
      setMascotVoice: (v) => set({ mascotVoice: v }),
      setReduceMotion: (on) => set({ reduceMotion: on }),
      setLargeText: (on) => set({ largeText: on }),
      setTextSize: (s) => set({ textSize: s }),
      setFontStyle: (s) => set({ fontStyle: s }),
      setDarkMode: (on) => set({ darkMode: on }),
      setAppTheme: (t) => set({ appTheme: t }),
    }),
    {
      name: 'imagineme-storage',
      // IndexedDB instead of localStorage: base64 AI images are ~2MB each
      // and quickly exceed localStorage's ~5MB quota.
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
