import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useStoryStore } from "@/lib/storyStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, BookOpen, Sparkles, Star, Trophy } from "lucide-react";
import { format } from "date-fns";

export default function Bookshelf() {
  const [, setLocation] = useLocation();
  const { stories, deleteStory, points, stars, awards } = useStoryStore();

  return (
    <div className="min-h-screen bg-background pb-24 px-4 md:px-8 pt-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-serif font-bold text-foreground flex-1">My Bookshelf</h1>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-sm border border-primary/20">
              <Sparkles className="w-4 h-4" /> {points}
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full font-bold text-sm border border-yellow-200">
              <Star className="w-4 h-4 fill-yellow-500" /> {stars}
            </div>
          </div>
        </div>

        {awards.length > 0 && (
          <div className="mb-10 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold text-sm">
              <Trophy className="w-4 h-4" /> My awards
            </div>
            <div className="flex flex-wrap gap-2">
              {awards.map(a => (
                <div
                  key={a.id + a.earnedAt}
                  className="bg-white rounded-full pl-2 pr-4 py-1.5 border border-amber-200 shadow-sm flex items-center gap-2"
                  title={a.description}
                >
                  <span className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stories.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-dashed shadow-sm">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Your shelf is empty</h2>
            <p className="text-muted-foreground mb-8">Create your first story to fill the shelf!</p>
            <Button size="lg" onClick={() => setLocation("/create")} className="rounded-full px-8">
              Create a Story
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors bg-card h-full flex flex-col">
                  <div 
                    className="aspect-square bg-muted relative cursor-pointer"
                    onClick={() => setLocation(`/book/${story.id}`)}
                  >
                    {story.coverImageUrl ?? story.pages[0]?.aiImageUrl ? (
                      <img
                        src={story.coverImageUrl ?? story.pages[0]?.aiImageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : story.drawingDataUrl ? (
                      <img src={story.drawingDataUrl} alt={story.title} className="w-full h-full object-contain bg-white p-4" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <BookOpen className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Read
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif font-bold text-lg leading-tight mb-1 line-clamp-2 flex-1">
                      {story.title}
                    </h3>
                    <div className="flex items-end justify-between mt-4">
                      <span className="text-xs text-muted-foreground">
                        {format(story.createdAt, 'MMM d, yyyy')}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStory(story.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
