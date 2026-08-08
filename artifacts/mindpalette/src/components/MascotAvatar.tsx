import type { MascotId } from "@/lib/storyStore";
import { getMascot } from "@/lib/mascots";
import { cn } from "@/lib/utils";

interface MascotAvatarProps {
  id: MascotId;
  size?: number;
  className?: string;
  ring?: boolean;
}

function MascotShape({ id, size }: { id: MascotId; size: number }) {
  const s = size;
  switch (id) {
    case "bunny":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <ellipse cx="35" cy="22" rx="8" ry="20" fill="#fff" stroke="#374151" strokeWidth="2" />
          <ellipse cx="65" cy="22" rx="8" ry="20" fill="#fff" stroke="#374151" strokeWidth="2" />
          <ellipse cx="35" cy="22" rx="3" ry="12" fill="#fda4af" />
          <ellipse cx="65" cy="22" rx="3" ry="12" fill="#fda4af" />
          <circle cx="50" cy="60" r="28" fill="#fff" stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy="58" r="3" fill="#374151" />
          <circle cx="60" cy="58" r="3" fill="#374151" />
          <ellipse cx="50" cy="68" rx="3" ry="2" fill="#fda4af" />
          <path d="M 44 72 Q 50 76 56 72" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "robot":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <line x1="50" y1="10" x2="50" y2="22" stroke="#374151" strokeWidth="2" />
          <circle cx="50" cy="10" r="4" fill="#f59e0b" />
          <rect x="22" y="22" width="56" height="50" rx="10" fill="#bae6fd" stroke="#374151" strokeWidth="2" />
          <rect x="32" y="38" width="14" height="14" rx="3" fill="#fff" stroke="#374151" strokeWidth="2" />
          <rect x="54" y="38" width="14" height="14" rx="3" fill="#fff" stroke="#374151" strokeWidth="2" />
          <circle cx="39" cy="45" r="3" fill="#374151" />
          <circle cx="61" cy="45" r="3" fill="#374151" />
          <rect x="40" y="60" width="20" height="4" rx="2" fill="#374151" />
          <rect x="36" y="76" width="28" height="10" rx="2" fill="#7dd3fc" stroke="#374151" strokeWidth="2" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <polygon
            points="50,10 61,38 90,40 67,58 76,86 50,70 24,86 33,58 10,40 39,38"
            fill="#fde68a"
            stroke="#374151"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="42" cy="48" r="3" fill="#374151" />
          <circle cx="58" cy="48" r="3" fill="#374151" />
          <path d="M 44 58 Q 50 62 56 58" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "dragon":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <polygon points="32,18 38,30 26,28" fill="#86efac" stroke="#374151" strokeWidth="2" />
          <polygon points="68,18 74,28 62,30" fill="#86efac" stroke="#374151" strokeWidth="2" />
          <circle cx="50" cy="55" r="32" fill="#86efac" stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy="50" r="4" fill="#fff" />
          <circle cx="60" cy="50" r="4" fill="#fff" />
          <circle cx="40" cy="51" r="2" fill="#374151" />
          <circle cx="60" cy="51" r="2" fill="#374151" />
          <ellipse cx="44" cy="68" rx="2" ry="1" fill="#374151" />
          <ellipse cx="56" cy="68" rx="2" ry="1" fill="#374151" />
          <path d="M 44 74 Q 50 78 56 74" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "owl":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <ellipse cx="50" cy="55" rx="32" ry="36" fill="#c7d2fe" stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy="48" r="11" fill="#fff" stroke="#374151" strokeWidth="2" />
          <circle cx="60" cy="48" r="11" fill="#fff" stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy="48" r="4" fill="#374151" />
          <circle cx="60" cy="48" r="4" fill="#374151" />
          <polygon points="50,58 46,64 54,64" fill="#f59e0b" stroke="#374151" strokeWidth="1.5" />
          <path d="M 30 28 L 38 36" stroke="#374151" strokeWidth="2" fill="none" />
          <path d="M 70 28 L 62 36" stroke="#374151" strokeWidth="2" fill="none" />
        </svg>
      );
    case "fox":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <polygon points="22,30 32,16 38,32" fill="#fdba74" stroke="#374151" strokeWidth="2" />
          <polygon points="78,30 68,16 62,32" fill="#fdba74" stroke="#374151" strokeWidth="2" />
          <path d="M 22 50 Q 50 22 78 50 Q 68 86 50 86 Q 32 86 22 50 Z" fill="#fdba74" stroke="#374151" strokeWidth="2" />
          <path d="M 36 60 Q 50 50 64 60 L 50 78 Z" fill="#fff" stroke="#374151" strokeWidth="1.5" />
          <circle cx="40" cy="55" r="3" fill="#374151" />
          <circle cx="60" cy="55" r="3" fill="#374151" />
          <ellipse cx="50" cy="68" rx="2.5" ry="2" fill="#374151" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <path
            d="M 20 65 Q 14 50 28 46 Q 30 32 46 34 Q 52 22 66 30 Q 84 30 82 50 Q 92 60 78 68 L 24 68 Q 16 70 20 65 Z"
            fill="#f1f5f9"
            stroke="#374151"
            strokeWidth="2"
          />
          <circle cx="42" cy="52" r="3" fill="#374151" />
          <circle cx="60" cy="52" r="3" fill="#374151" />
          <path d="M 44 60 Q 51 64 58 60" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 100 100" width={s} height={s}>
          <polygon points="22,38 30,18 40,36" fill="#e9d5ff" stroke="#374151" strokeWidth="2" />
          <polygon points="78,38 70,18 60,36" fill="#e9d5ff" stroke="#374151" strokeWidth="2" />
          <circle cx="50" cy="56" r="30" fill="#e9d5ff" stroke="#374151" strokeWidth="2" />
          <ellipse cx="40" cy="55" rx="3" ry="5" fill="#374151" />
          <ellipse cx="60" cy="55" rx="3" ry="5" fill="#374151" />
          <polygon points="50,64 46,68 54,68" fill="#f472b6" stroke="#374151" strokeWidth="1.5" />
          <path d="M 50 68 Q 50 72 46 74 M 50 68 Q 50 72 54 74" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="22" y1="56" x2="34" y2="58" stroke="#374151" strokeWidth="1.5" />
          <line x1="78" y1="56" x2="66" y2="58" stroke="#374151" strokeWidth="1.5" />
        </svg>
      );
  }
}

export function MascotAvatar({ id, size = 64, className, ring = false }: MascotAvatarProps) {
  const def = getMascot(id);
  if (!def) return null;
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shadow-sm",
        def.bg,
        ring && `ring-4 ${def.ring}`,
        className
      )}
      style={{ width: size, height: size }}
    >
      <MascotShape id={id} size={Math.round(size * 0.78)} />
    </div>
  );
}
