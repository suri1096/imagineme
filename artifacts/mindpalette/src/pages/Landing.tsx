import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StarBadge } from "@/components/StarBadge";
import { WorldScene } from "@/components/WorldScene";

const PREVIEW_WORLDS = [
  { id: "crystal-cave",    label: "Crystal Cave",    rot: -7, x: "5%",  y: "8%",  w: "52%" },
  { id: "cherry-blossom",  label: "Cherry Blossom",  rot: 5,  x: "38%", y: "28%", w: "48%" },
  { id: "mushroom-village",label: "Mushroom Village", rot: -3, x: "12%", y: "52%", w: "44%" },
  { id: "underwater",      label: "Coral Cove",       rot:  8, x: "44%", y: "60%", w: "46%" },
];

// Open-book logo: blue covers, warm arch portal, person silhouette, golden sparkles
export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row items-start lg:items-stretch gap-10 lg:gap-0 pb-12 lg:pb-0 overflow-hidden">

        {/* Left — text, pushed to left edge */}
        <div className="w-full lg:w-[46%] px-6 lg:pl-10 xl:pl-14 lg:pr-6 flex flex-col justify-center pt-6 lg:pt-0 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="font-serif font-bold text-foreground leading-[1.05] text-[clamp(2.8rem,6vw,4.5rem)] mb-5">
              Draw your feelings.<br />Read your story.
            </h1>

            <p className="text-base text-muted-foreground max-w-[28ch] leading-relaxed mb-8">
              Choose a world, draw something, and make a storybook that's completely yours.
            </p>

            <div className="flex items-center gap-5">
              <Button
                size="lg"
                onClick={() => setLocation("/create")}
                className="px-7 h-12 rounded-2xl text-base font-semibold"
                data-testid="button-create-story"
              >
                Make my story
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocation("/bookshelf")}
                className="px-7 h-12 rounded-2xl text-base font-semibold border-2"
                data-testid="link-bookshelf-desktop"
              >
                My bookshelf
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right — scattered world cards */}
        <div className="lg:w-[54%] relative flex-shrink-0 lg:self-stretch">

          {/* Desktop scattered */}
          <div className="hidden lg:block relative w-full h-full">
            {PREVIEW_WORLDS.map((world, i) => (
              <motion.div
                key={world.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.09, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: world.x,
                  top: world.y,
                  width: world.w,
                  zIndex: i + 1,
                  rotate: `${world.rot}deg`,
                }}
                className="rounded-2xl overflow-hidden shadow-md border border-white/60"
              >
                <div className="relative aspect-[4/3]">
                  <WorldScene worldId={world.id} className="w-full h-full" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                    <span className="text-white text-xs font-semibold tracking-wide drop-shadow">{world.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 px-6 snap-x snap-mandatory">
            {PREVIEW_WORLDS.map((world, i) => (
              <motion.div
                key={world.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.07 }}
                className="flex-shrink-0 snap-center w-44 rounded-2xl overflow-hidden shadow border border-white/60"
              >
                <div className="relative aspect-[4/3]">
                  <WorldScene worldId={world.id} className="w-full h-full" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                    <span className="text-white text-xs font-semibold tracking-wide drop-shadow">{world.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
