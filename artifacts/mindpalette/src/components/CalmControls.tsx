import { Moon, Sun, Monitor } from "lucide-react";
import { useStoryStore } from "@/lib/storyStore";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CalmControls() {
  const { calmMode, setCalmMode } = useStoryStore();

  useEffect(() => {
    if (calmMode) {
      document.body.classList.add("calm-mode");
    } else {
      document.body.classList.remove("calm-mode");
    }
  }, [calmMode]);

  return (
    <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
      <Moon className="w-4 h-4 text-primary" />
      <Switch 
        id="calm-mode" 
        checked={calmMode} 
        onCheckedChange={setCalmMode}
        className="data-[state=checked]:bg-primary"
      />
      <Label htmlFor="calm-mode" className="text-xs font-medium text-foreground/80 cursor-pointer select-none">
        Calm Mode
      </Label>
    </div>
  );
}
