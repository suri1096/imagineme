import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FocusCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  /** Tailwind color tokens for the card: bg, icon-bg, border, text */
  color?: {
    cardBg: string;        // e.g. "bg-pink-50"
    iconBg: string;        // e.g. "bg-pink-100"
    iconText: string;      // e.g. "text-pink-500"
    border: string;        // e.g. "border-pink-300"
    ring: string;          // e.g. "ring-pink-200"
    titleText: string;     // e.g. "text-pink-700"
  };
}

export function FocusCard({ title, description, selected, onClick, icon, color }: FocusCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer h-full"
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <div
        onClick={onClick}
        className={cn(
          "h-full rounded-2xl border-2 p-6 flex flex-col items-center text-center gap-4 transition-all duration-200 select-none",
          selected
            ? cn(color?.cardBg ?? "bg-primary/8", color?.border ?? "border-primary", "ring-4", color?.ring ?? "ring-primary/20", "shadow-lg")
            : cn("bg-card border-transparent hover:border-border/60 hover:shadow-md", color && "hover:" + color.cardBg)
        )}
      >
        {icon && (
          <div className={cn(
            "p-4 rounded-2xl transition-colors duration-200",
            selected
              ? cn(color?.iconBg ?? "bg-primary/20", color?.iconText ?? "text-primary")
              : cn("bg-muted/70", color?.iconText ?? "text-muted-foreground")
          )}>
            {icon}
          </div>
        )}
        <div>
          <h3 className={cn(
            "font-bold text-lg mb-1.5",
            selected ? (color?.titleText ?? "text-primary") : "text-foreground"
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
