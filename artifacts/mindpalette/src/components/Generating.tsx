import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FocusGames } from "./FocusGames";

export function Generating() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 py-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-dashed border-primary/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-dashed border-secondary/40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-accent-foreground" />
          </motion.div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-serif font-bold text-foreground"
        >
          Weaving your story...
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Gathering colors and gentle words
        </motion.p>
      </div>

      <FocusGames />
    </div>
  );
}
