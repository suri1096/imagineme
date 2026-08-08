import React from 'react';

export interface Companion {
  id: string;
  name: string;
  category: 'animal' | 'person';
  SvgComponent: React.FC<{ className?: string }>;
}

/* ── Animals ── */

const Fox = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40 Q 50 10 80 40 Q 90 70 50 90 Q 10 70 20 40 Z" fill="currentColor" />
    <circle cx="35" cy="45" r="5" fill="#1a1a1a" />
    <circle cx="65" cy="45" r="5" fill="#1a1a1a" />
    <path d="M45 55 Q 50 60 55 55" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    <path d="M15 20 L 25 40 L 35 25 Z" fill="currentColor" />
    <path d="M85 20 L 75 40 L 65 25 Z" fill="currentColor" />
  </svg>
);

const Owl = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="20" width="60" height="70" rx="30" fill="currentColor" />
    <circle cx="35" cy="45" r="12" fill="white" />
    <circle cx="35" cy="45" r="4" fill="#1a1a1a" />
    <circle cx="65" cy="45" r="12" fill="white" />
    <circle cx="65" cy="45" r="4" fill="#1a1a1a" />
    <path d="M45 60 L 50 65 L 55 60 Z" fill="#FFA500" />
    <path d="M25 20 L 20 35" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M75 20 L 80 35" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const Turtle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 65 Q 50 20 85 65 Z" fill="currentColor" />
    <circle cx="85" cy="70" r="12" fill="#88c0d0" />
    <circle cx="88" cy="68" r="3" fill="#1a1a1a" />
    <rect x="25" y="65" width="50" height="15" rx="7.5" fill="currentColor" />
    <circle cx="30" cy="80" r="8" fill="#88c0d0" />
    <circle cx="70" cy="80" r="8" fill="#88c0d0" />
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10 L 60 40 L 90 40 L 65 60 L 75 90 L 50 70 L 25 90 L 35 60 L 10 40 L 40 40 Z" fill="currentColor" strokeLinejoin="round" />
    <circle cx="40" cy="50" r="4" fill="#1a1a1a" />
    <circle cx="60" cy="50" r="4" fill="#1a1a1a" />
    <path d="M45 60 Q 50 65 55 60" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Jellyfish = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50 Q 50 10 80 50 Z" fill="currentColor" />
    <path d="M20 50 Q 30 60 40 50 Q 50 60 60 50 Q 70 60 80 50" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M30 55 Q 25 80 35 90" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M50 55 Q 45 85 55 95" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M70 55 Q 65 80 75 90" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="35" cy="40" r="4" fill="#1a1a1a" />
    <circle cx="65" cy="40" r="4" fill="#1a1a1a" />
    <path d="M45 45 Q 50 50 55 45" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Dragon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 70 Q 50 20 75 70" fill="currentColor" />
    <circle cx="75" cy="65" r="15" fill="currentColor" />
    <circle cx="80" cy="60" r="3" fill="#1a1a1a" />
    <path d="M70 65 Q 75 70 80 65" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
    <path d="M35 45 L 20 20 L 45 35" fill="currentColor" />
    <path d="M55 35 L 70 10 L 65 30" fill="currentColor" />
    <path d="M15 70 Q 50 90 85 70" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
  </svg>
);

/* ── People ── */

/* Shared helpers */
const Face = ({ cx, cy, r, eyeR = 3.5, mouthY }: { cx: number; cy: number; r: number; eyeR?: number; mouthY: number }) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="currentColor" />
    <circle cx={cx - r * 0.35} cy={cy - r * 0.1} r={eyeR} fill="#1a1a1a" />
    <circle cx={cx + r * 0.35} cy={cy - r * 0.1} r={eyeR} fill="#1a1a1a" />
    <path d={`M${cx - r * 0.3} ${mouthY} Q${cx} ${mouthY + r * 0.25} ${cx + r * 0.3} ${mouthY}`} stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

/* Boy — round head, short hair spikes, T-shirt */
const Boy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* hair */}
    <path d="M28 36 Q 30 18 50 16 Q 70 18 72 36" fill="currentColor" />
    {/* head */}
    <Face cx={50} cy={38} r={18} mouthY={43} />
    {/* body */}
    <rect x="30" y="56" width="40" height="28" rx="8" fill="currentColor" />
    {/* arms */}
    <rect x="12" y="58" width="18" height="10" rx="5" fill="currentColor" />
    <rect x="70" y="58" width="18" height="10" rx="5" fill="currentColor" />
    {/* legs */}
    <rect x="32" y="82" width="14" height="14" rx="5" fill="currentColor" />
    <rect x="54" y="82" width="14" height="14" rx="5" fill="currentColor" />
  </svg>
);

/* Girl — round head, pigtails, dress */
const Girl = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* pigtail left */}
    <circle cx={22} cy={30} r={8} fill="currentColor" />
    {/* pigtail right */}
    <circle cx={78} cy={30} r={8} fill="currentColor" />
    {/* head */}
    <Face cx={50} cy={38} r={18} mouthY={43} />
    {/* dress */}
    <path d="M30 57 L20 90 H80 L70 57 Z" fill="currentColor" />
    {/* arms */}
    <rect x="12" y="58" width="18" height="10" rx="5" fill="currentColor" />
    <rect x="70" y="58" width="18" height="10" rx="5" fill="currentColor" />
  </svg>
);

/* Mom — taller, bun hair, dress */
const Mom = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* bun */}
    <circle cx={50} cy={18} r={9} fill="currentColor" />
    {/* head */}
    <Face cx={50} cy={35} r={16} mouthY={40} />
    {/* body */}
    <path d="M28 52 L18 92 H82 L72 52 Z" fill="currentColor" />
    {/* arms */}
    <rect x="10" y="54" width="18" height="10" rx="5" fill="currentColor" />
    <rect x="72" y="54" width="18" height="10" rx="5" fill="currentColor" />
  </svg>
);

/* Dad — taller, flat-top hair, shirt + pants */
const Dad = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* flat-top hair */}
    <rect x="32" y="12" width="36" height="8" rx="3" fill="currentColor" />
    {/* head */}
    <Face cx={50} cy={34} r={17} mouthY={39} />
    {/* shirt */}
    <rect x="28" y="52" width="44" height="22" rx="6" fill="currentColor" />
    {/* pants */}
    <rect x="30" y="72" width="16" height="22" rx="6" fill="currentColor" />
    <rect x="54" y="72" width="16" height="22" rx="6" fill="currentColor" />
    {/* arms */}
    <rect x="10" y="54" width="18" height="10" rx="5" fill="currentColor" />
    <rect x="72" y="54" width="18" height="10" rx="5" fill="currentColor" />
  </svg>
);

/* Grandma — shorter, curly hair, rounded dress */
const Grandma = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* curly hair */}
    <circle cx={34} cy={26} r={10} fill="currentColor" />
    <circle cx={50} cy={20} r={10} fill="currentColor" />
    <circle cx={66} cy={26} r={10} fill="currentColor" />
    {/* head */}
    <Face cx={50} cy={38} r={16} eyeR={3} mouthY={44} />
    {/* body */}
    <ellipse cx={50} cy={72} rx={24} ry={22} fill="currentColor" />
    {/* arms */}
    <rect x="12" y="56" width="16" height="9" rx="4.5" fill="currentColor" />
    <rect x="72" y="56" width="16" height="9" rx="4.5" fill="currentColor" />
    {/* cane */}
    <path d="M80 65 Q88 70 82 82" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

/* Grandpa — shorter, bald with side wisps, shirt */
const Grandpa = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* wisp left */}
    <path d="M32 24 Q28 16 36 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* wisp right */}
    <path d="M68 24 Q72 16 64 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* head */}
    <Face cx={50} cy={37} r={17} eyeR={3} mouthY={43} />
    {/* shirt */}
    <rect x="28" y="55" width="44" height="20" rx="6" fill="currentColor" />
    {/* pants */}
    <rect x="30" y="73" width="16" height="20" rx="6" fill="currentColor" />
    <rect x="54" y="73" width="16" height="20" rx="6" fill="currentColor" />
    {/* arms */}
    <rect x="10" y="57" width="18" height="9" rx="4.5" fill="currentColor" />
    <rect x="72" y="57" width="18" height="9" rx="4.5" fill="currentColor" />
  </svg>
);

export const COMPANIONS: Companion[] = [
  { id: 'boy',      name: 'Boy',     category: 'person', SvgComponent: Boy },
  { id: 'girl',     name: 'Girl',    category: 'person', SvgComponent: Girl },
  { id: 'mom',      name: 'Mom',     category: 'person', SvgComponent: Mom },
  { id: 'dad',      name: 'Dad',     category: 'person', SvgComponent: Dad },
  { id: 'grandma',  name: 'Grandma', category: 'person', SvgComponent: Grandma },
  { id: 'grandpa',  name: 'Grandpa', category: 'person', SvgComponent: Grandpa },
  { id: 'fox',      name: 'Fox',     category: 'animal', SvgComponent: Fox },
  { id: 'owl',      name: 'Owl',     category: 'animal', SvgComponent: Owl },
  { id: 'turtle',   name: 'Turtle',  category: 'animal', SvgComponent: Turtle },
  { id: 'star',     name: 'Star',    category: 'animal', SvgComponent: Star },
  { id: 'jellyfish',name: 'Jellyfish',category:'animal', SvgComponent: Jellyfish },
  { id: 'dragon',   name: 'Dragon',  category: 'animal', SvgComponent: Dragon },
];
