import { motion } from "framer-motion";
import { WORLDS } from "@/lib/worlds";
import { Story } from "@/lib/storyStore";
import { BookOpen } from "lucide-react";

interface CoverPageProps {
  story: Story;
  userName?: string;
}

export function CoverPage({ story, userName }: CoverPageProps) {
  const world = WORLDS.find(w => w.id === story.world) ?? WORLDS[0];
  const coverImage = story.coverImageUrl ?? story.pages[0]?.aiImageUrl;

  return (
    <div className="relative w-full h-full flex overflow-hidden">

      {/* ── LEFT HALF — cover illustration ── */}
      <div className="relative w-1/2 h-full overflow-hidden flex-shrink-0 border-r border-black/15">
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt="Cover illustration"
              className="w-full h-full object-cover"
            />
            {/* Subtle vignette around edges */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)] pointer-events-none" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${world.gradient} flex items-center justify-center`}
          >
            <span className="text-8xl opacity-30 select-none">✦</span>
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.15)] pointer-events-none" />
          </div>
        )}

        {/* Spine shadow on the right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* ── RIGHT HALF — title page ── */}
      <div
        className="relative w-1/2 h-full flex flex-col items-center justify-center text-center px-6 py-8 overflow-hidden gap-0"
        style={{ background: `linear-gradient(160deg, hsl(${world.gradient.replace("from-", "").split(" ")[0].replace("from-", "")} / 0.25) 0%, hsl(var(--background)) 60%)` }}
      >
        {/* Soft world-colour wash */}
        <div className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-25 pointer-events-none`} />

        {/* Decorative top ornament */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative mb-5 flex flex-col items-center gap-1"
        >
          <div className="w-12 h-0.5 bg-primary/20 rounded-full" />
          <BookOpen className="w-7 h-7 text-primary/50 my-1" />
          <div className="w-12 h-0.5 bg-primary/20 rounded-full" />
        </motion.div>

        {/* World label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3"
        >
          {world.name}
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", bounce: 0.25 }}
          className="relative w-full text-center text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground leading-tight mb-4"
        >
          {story.title}
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative w-16 h-0.5 bg-primary/25 rounded-full mb-4 mx-auto"
        />

        {/* Author */}
        {userName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.58 }}
            className="relative w-full text-center text-sm text-muted-foreground"
          >
            by <span className="font-semibold text-foreground">{userName}</span>
          </motion.p>
        )}

        {/* Decorative bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative mt-auto flex items-center gap-2"
        >
          <div className="w-8 h-0.5 bg-primary/15 rounded-full" />
          <span className="text-primary/20 text-lg">✦</span>
          <div className="w-8 h-0.5 bg-primary/15 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
