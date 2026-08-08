import { useState } from "react";
import { motion } from "framer-motion";
import { COMPANIONS } from "@/lib/companions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MicButton } from "@/components/MicButton";
import { cn } from "@/lib/utils";

interface CompanionPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  name: string;
  onNameChange: (name: string) => void;
}

const CATEGORIES = [
  { id: "person", label: "People" },
  { id: "animal", label: "Animals" },
] as const;

export function CompanionPicker({ selectedId, onSelect, name, onNameChange }: CompanionPickerProps) {
  const [category, setCategory] = useState<"person" | "animal">("person");

  const filtered = COMPANIONS.filter(c => c.category === category);

  return (
    <div className="w-full space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-semibold transition-all",
              category === cat.id
                ? "bg-primary text-primary-foreground shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {filtered.map((companion) => {
          const isSelected = selectedId === companion.id;
          return (
            <motion.div key={companion.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card
                onClick={() => onSelect(companion.id)}
                className={cn(
                  "cursor-pointer h-full transition-all duration-300 border-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-transparent hover:border-primary/30"
                )}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                  <div className={cn(
                    "w-20 h-20 flex items-center justify-center transition-colors duration-300 rounded-full",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    <companion.SvgComponent className="w-16 h-16" />
                  </div>
                  <span className="font-medium text-foreground">{companion.name}</span>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: selectedId ? 1 : 0, y: selectedId ? 0 : 10 }}
        className="max-w-md mx-auto space-y-3"
      >
        <label htmlFor="companion-name" className="block text-sm font-medium text-center text-foreground">
          What is their name?
        </label>
        <div className="flex gap-2 items-center">
          <Input
            id="companion-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Barnaby, Luna, Pip..."
            className="text-center text-lg h-12 rounded-xl flex-1"
          />
          <MicButton
            onTranscript={(text) => {
              const cleaned = text.trim().split(/\s+/).slice(0, 2).join(" ").replace(/[.,!?]/g, "");
              onNameChange(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
