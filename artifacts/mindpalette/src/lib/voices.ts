export type VoiceType = "girl" | "boy" | "default";

const FEMALE_HINTS = [
  "female", "woman", "girl",
  "samantha", "victoria", "karen", "tessa", "moira", "fiona", "veena",
  "susan", "allison", "ava", "serena", "kate", "zira", "linda", "heather",
  "siri female", "google uk english female", "google us english",
  "natasha", "catherine", "amelie",
];

const MALE_HINTS = [
  "male", "man", "boy",
  "daniel", "alex", "fred", "tom", "lee", "oliver", "rishi",
  "george", "david", "mark", "james", "aaron", "arthur", "matthew",
  "google uk english male",
];

let cachedVoices: SpeechSynthesisVoice[] | null = null;

export function getAllVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cachedVoices && cachedVoices.length > 0) return cachedVoices;
  const v = window.speechSynthesis.getVoices();
  if (v && v.length > 0) cachedVoices = v;
  return v ?? [];
}

export function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(v);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Safety timeout
    setTimeout(() => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) cachedVoices = v;
      resolve(v ?? []);
    }, 1500);
  });
}

function score(voice: SpeechSynthesisVoice, hints: string[], lang: string): number {
  const name = voice.name.toLowerCase();
  let s = 0;
  for (const h of hints) {
    if (name.includes(h)) {
      s += h.length > 5 ? 3 : 2;
    }
  }
  if (voice.lang?.toLowerCase().startsWith(lang.toLowerCase())) s += 2;
  if (voice.localService) s += 1;
  return s;
}

export function pickVoice(type: VoiceType): SpeechSynthesisVoice | null {
  const all = getAllVoices();
  if (all.length === 0 || type === "default") return null;
  const lang = (typeof navigator !== "undefined" ? navigator.language : "en-US") || "en-US";
  const hints = type === "girl" ? FEMALE_HINTS : MALE_HINTS;
  const ranked = all
    .map((v) => ({ v, s: score(v, hints, lang) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (ranked.length > 0) return ranked[0].v;
  // Fallback: return any voice in current language so at least we have one
  const langMatch = all.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase()));
  return langMatch ?? null;
}

export function applyVoiceToUtterance(
  u: SpeechSynthesisUtterance,
  type: VoiceType
) {
  const v = pickVoice(type);
  if (v) u.voice = v;
  if (type === "girl") {
    u.pitch = 1.25;
    u.rate = 0.95;
  } else if (type === "boy") {
    u.pitch = 0.85;
    u.rate = 0.95;
  } else {
    u.pitch = 1.05;
    u.rate = 0.92;
  }
}
