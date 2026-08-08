import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useStoryStore } from "@/lib/storyStore";
import { StoryBook } from "@/components/StoryBook";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AwardScreen } from "@/components/AwardScreen";
import { PointsBadge } from "@/components/PointsBadge";
import type { Award } from "@/lib/storyStore";

export default function BookViewer() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { stories, addStars, addPoints } = useStoryStore();
  const [showAward, setShowAward] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [earnedAward, setEarnedAward] = useState<Award | null>(null);

  const story = stories.find(s => s.id === id);

  useEffect(() => {
    if (!story) {
      setLocation("/bookshelf");
    }
  }, [story, setLocation]);

  if (!story) return null;

  const handleFinish = () => {
    if (!hasFinished) {
      addStars(1);
      const award = addPoints(20);
      setEarnedAward(award);
      setHasFinished(true);
      setShowAward(true);
    } else {
      setShowAward(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/bookshelf")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Bookshelf
        </Button>
        <PointsBadge />
      </div>

      <div className="w-full max-w-6xl">
        <StoryBook story={story} onFinish={handleFinish} />
      </div>

      {showAward && <AwardScreen newAward={earnedAward} onClose={() => { setShowAward(false); setLocation("/bookshelf"); }} />}
    </div>
  );
}
