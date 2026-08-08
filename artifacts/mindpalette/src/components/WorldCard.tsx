import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { World } from "@/lib/worlds";
import { WorldScene } from "@/components/WorldScene";

interface WorldCardProps {
  world: World;
  selected: boolean;
  onClick: () => void;
}

export function WorldCard({ world, selected, onClick }: WorldCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer h-full"
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div
        onClick={onClick}
        className={cn(
          "h-full rounded-2xl transition-all duration-300 overflow-hidden group relative",
          selected
            ? "ring-4 ring-primary shadow-xl shadow-primary/25"
            : "ring-1 ring-white/20 hover:ring-primary/40 hover:shadow-lg"
        )}
      >
        {/* Illustrated scene */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <WorldScene worldId={world.id} className="transition-transform duration-700 group-hover:scale-105" />

          {/* Selected overlay shimmer */}
          {selected && (
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          )}

          {/* Bottom name overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-sm leading-tight text-white drop-shadow">{world.name}</h3>
          </div>

          {/* Selected checkmark */}
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <svg viewBox="0 0 12 12" className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,6 5,9 10,3"/>
              </svg>
            </motion.div>
          )}
        </div>

        {/* Info strip */}
        <div className="p-3 bg-card/95 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{world.description}</p>
          {world.sensoryNote && (
            <span className="inline-block mt-1.5 text-xs font-medium text-primary/80 bg-primary/8 px-2 py-0.5 rounded-full">
              {world.sensoryNote}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
