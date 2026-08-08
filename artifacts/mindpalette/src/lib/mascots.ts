import type { MascotId } from "./storyStore";

export interface MascotDef {
  id: MascotId;
  name: string;
  vibe: string;
  bg: string;
  ring: string;
}

export const MASCOTS: MascotDef[] = [
  { id: "bunny",  name: "Pip",   vibe: "Soft and gentle",   bg: "bg-rose-100",    ring: "ring-rose-300" },
  { id: "robot",  name: "Bolt",  vibe: "Steady and curious", bg: "bg-sky-100",    ring: "ring-sky-300" },
  { id: "star",   name: "Lumi",  vibe: "Bright and kind",    bg: "bg-amber-100",  ring: "ring-amber-300" },
  { id: "dragon", name: "Ember", vibe: "Brave and warm",     bg: "bg-emerald-100",ring: "ring-emerald-300" },
  { id: "owl",    name: "Hoot",  vibe: "Quiet and wise",     bg: "bg-indigo-100", ring: "ring-indigo-300" },
  { id: "fox",    name: "Sage",  vibe: "Clever and playful", bg: "bg-orange-100", ring: "ring-orange-300" },
  { id: "cloud",  name: "Wisp",  vibe: "Calm and floaty",    bg: "bg-slate-100",  ring: "ring-slate-300" },
  { id: "cat",    name: "Mochi", vibe: "Cozy and snuggly",   bg: "bg-purple-100", ring: "ring-purple-300" },
];

export function getMascot(id: MascotId | null | undefined): MascotDef | null {
  if (!id) return null;
  return MASCOTS.find((m) => m.id === id) ?? null;
}
