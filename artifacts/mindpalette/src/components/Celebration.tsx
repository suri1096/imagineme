import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface CelebrationProps {
  onComplete: () => void;
}

export function Celebration({ onComplete }: CelebrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200 - 50,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200 z-10 relative"
          >
            <Star className="w-16 h-16 text-yellow-500 fill-yellow-500" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground font-serif mb-2">Beautiful!</h2>
          <p className="text-xl text-muted-foreground">You earned a star.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
