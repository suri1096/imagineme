import { useLocation } from "wouter";
import { Wind, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";
import { useStoryStore } from "@/lib/storyStore";
// Shared logo — book with arch portal and sparkles
export function ImagineMeLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 12 C2 9 4.5 8 7 8 L19 8 L19 36 L7 36 C4.5 36 2 35 2 32 Z" fill="#4A7EC0"/>
      <path d="M38 12 C38 9 35.5 8 33 8 L21 8 L21 36 L33 36 C35.5 36 38 35 38 32 Z" fill="#5B8EC8"/>
      <rect x="4" y="10" width="13" height="24" rx="1" fill="#C5DBF2"/>
      <rect x="23" y="10" width="13" height="24" rx="1" fill="#BAD3EE"/>
      <rect x="19" y="8" width="2" height="28" fill="#3A6AAE" opacity="0.55"/>
      <path d="M14 36 L14 21 Q14 12 20 12 Q26 12 26 21 L26 36 Z" fill="#F4A84A" opacity="0.35"/>
      <path d="M16 36 L16 22 Q16 15 20 15 Q24 15 24 22 L24 36 Z" fill="#FFF3E0" opacity="0.95"/>
      <path d="M16 36 L16 22 Q16 15 20 15 Q24 15 24 22 L24 36" stroke="#E09040" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <circle cx="20" cy="22" r="2" fill="#E8883A"/>
      <path d="M17 36 Q17 28 20 28 Q23 28 23 36 Z" fill="#E8883A"/>
      <path d="M20 7 L20.6 5 L21.2 7 L23.2 7.6 L21.2 8.2 L20.6 10.2 L20 8.2 L18 7.6 Z" fill="#F5C842"/>
      <path d="M25.5 4 L25.8 3 L26.1 4 L27.1 4.3 L26.1 4.6 L25.8 5.6 L25.5 4.6 L24.5 4.3 Z" fill="#F5C842"/>
      <path d="M14.5 5 L14.8 4 L15.1 5 L16.1 5.3 L15.1 5.6 L14.8 6.6 L14.5 5.6 L13.5 5.3 Z" fill="#F8D870"/>
      <path d="M4 36 Q4 38.5 7 38.5 L33 38.5 Q36 38.5 36 36 L38 36 Q38 39.5 34.5 39.5 L5.5 39.5 Q2 39.5 2 36 Z" fill="#3A6AAE" opacity="0.25"/>
    </svg>
  );
}

interface AppHeaderProps {
  onOpenBreak: (reason?: string) => void;
}

export function AppHeader({ onOpenBreak }: AppHeaderProps) {
  const [location, navigate] = useLocation();
  const userName = useAuthStore(s => s.userName);
  const userEmoji = useAuthStore(s => s.userEmoji);

  // Don't render on login page
  if (location === "/login") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">

        {/* Left: logo + app name */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Go home"
        >
          <ImagineMeLogo className="w-8 h-8" />
          <span className="font-serif font-bold text-lg tracking-tight text-foreground hidden sm:block">
            ImagineMe
          </span>
        </button>

        {/* Right: controls — always labeled, never overlapping */}
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="App controls">

          {/* Bookshelf shortcut (only on home/create pages) */}
          {(location === "/" || location === "/create") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/bookshelf")}
              className="gap-1.5 text-muted-foreground rounded-full hidden md:flex"
            >
              <BookOpen className="w-4 h-4" />
              My Books
            </Button>
          )}

          {/* Take a Break */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenBreak()}
            className="gap-1.5 rounded-full border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 flex-shrink-0"
            data-testid="button-take-break"
          >
            <Wind className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Break</span>
          </Button>

          {/* Profile */}
          {userName && (
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-sm font-medium flex-shrink-0 ${
                location === "/profile"
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-card border-border hover:bg-muted text-foreground/80"
              }`}
              aria-label="My profile"
              data-testid="button-profile"
            >
              <span className="text-lg leading-none" aria-hidden="true">{userEmoji}</span>
              <span className="hidden sm:block max-w-[80px] truncate">{userName}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
