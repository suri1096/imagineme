import { Star } from "lucide-react";
import { useStoryStore } from "@/lib/storyStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function StarBadge() {
  const stars = useStoryStore((state) => state.stars);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (stars > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [stars]);

  if (stars === 0) return null;

  return (
    <motion.div 
      className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full font-bold shadow-sm border border-yellow-200"
      animate={animate ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      <span>{stars}</span>
    </motion.div>
  );
}
