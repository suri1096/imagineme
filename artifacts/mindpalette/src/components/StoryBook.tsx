import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Loader2, Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Story, useStoryStore } from "@/lib/storyStore";
import { BookPage } from "./BookPage";
import { CoverPage } from "./CoverPage";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/authStore";

interface StoryBookProps {
  story: Story;
  onFinish?: () => void;
}

// Index -1 = cover page, 0-4 = story pages
export function StoryBook({ story, onFinish }: StoryBookProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(-1); // start on cover
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [direction, setDirection] = useState(1);
  const [readPages, setReadPages] = useState<Set<number>>(new Set([-1]));
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const autoPlayPendingRef = useRef(false);
  const addPoints = useStoryStore(s => s.addPoints);
  const setPageRecording = useStoryStore(s => s.setPageRecording);
  const calmMode = useStoryStore(s => s.calmMode);
  const mascotMuted = useStoryStore(s => s.mascotMuted);
  const userName = useAuthStore(s => s.userName) ?? undefined;

  // Voice recording (record your own read-aloud)
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const isLastPage = currentPageIndex === story.pages.length - 1;
  const isCoverPage = currentPageIndex === -1;

  // Derive the cover image — use dedicated coverImageUrl or first page's AI image
  const coverImageUrl = story.coverImageUrl ?? story.pages[0]?.aiImageUrl;

  const releaseBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    releaseBlobUrl();
    window.speechSynthesis.cancel();
  };

  // Full cleanup on unmount: stop playback, speech, and any live recording/mic stream
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop(); // onstop handler releases the stream tracks
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = useCallback(() => {
    if (currentPageIndex < story.pages.length - 1) {
      setDirection(1);
      setCurrentPageIndex(prev => prev + 1);
    } else if (onFinish) {
      onFinish();
    }
  }, [currentPageIndex, story.pages.length, onFinish]);

  // Play the current page's audio (recorded → TTS → speech synthesis fallback)
  // Returns a promise that resolves when playback ends (or errors)
  const playCurrentPageAudio = useCallback(async (onEnded?: () => void) => {
    if (isCoverPage) return;
    const pageText = story.pages[currentPageIndex]?.text ?? "";
    if (!pageText) { onEnded?.(); return; }

    // If muted, skip audio but still call onEnded so auto-advance works
    if (mascotMuted) { onEnded?.(); return; }

    // Use existing recorded audio if available
    const recorded = story.pages[currentPageIndex]?.recordedAudioUrl;
    if (recorded) {
      const audio = new Audio(recorded);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        onEnded?.();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        onEnded?.();
      };
      setIsSpeaking(true);
      await audio.play().catch(() => { setIsSpeaking(false); onEnded?.(); });
      return;
    }

    // Fetch ElevenLabs TTS
    setIsLoadingAudio(true);
    try {
      const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
      const url = `${base}/api/tts`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pageText }),
      });

      if (!res.ok) throw new Error("TTS request failed");

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      blobUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        releaseBlobUrl();
        onEnded?.();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        audioRef.current = null;
        releaseBlobUrl();
        onEnded?.();
      };

      setIsLoadingAudio(false);
      setIsSpeaking(true);
      await audio.play();
    } catch {
      // Fallback to browser speech synthesis if ElevenLabs fails
      setIsLoadingAudio(false);
      const utterance = new SpeechSynthesisUtterance(story.pages[currentPageIndex]?.text ?? "");
      utterance.rate = calmMode ? 0.8 : 0.9;
      utterance.pitch = 1.05;
      utterance.onend = () => { setIsSpeaking(false); onEnded?.(); };
      utterance.onerror = () => { setIsSpeaking(false); onEnded?.(); };
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex, isCoverPage, story.pages, mascotMuted, calmMode]);

  // Stop audio whenever the page changes
  useEffect(() => {
    stopAllAudio();
    setIsSpeaking(false);
    setIsLoadingAudio(false);

    // Stop any in-progress recording when the page changes
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    if (!readPages.has(currentPageIndex)) {
      setReadPages(prev => {
        const next = new Set(prev);
        next.add(currentPageIndex);
        return next;
      });
      addPoints(2);
    }

    // Auto-play: begin playing audio on this page then advance
    if (isAutoPlay && !isCoverPage) {
      autoPlayPendingRef.current = true;
      // Small settling delay so the page animation completes before audio starts
      const delay = calmMode ? 1200 : 600;
      const t = setTimeout(() => {
        if (!autoPlayPendingRef.current) return;
        autoPlayPendingRef.current = false;
        playCurrentPageAudio(() => {
          // After audio ends, pause briefly then advance
          if (isAutoPlay) {
            const advanceDelay = calmMode ? 2000 : 1000;
            setTimeout(() => {
              setCurrentPageIndex(prev => {
                if (prev < story.pages.length - 1) {
                  setDirection(1);
                  return prev + 1;
                }
                // Reached last page — stop auto-play and call onFinish
                setIsAutoPlay(false);
                if (onFinish) onFinish();
                return prev;
              });
            }, advanceDelay);
          }
        });
      }, delay);
      return () => {
        clearTimeout(t);
        autoPlayPendingRef.current = false;
      };
    } else {
      autoPlayPendingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex]);

  // When auto-play is toggled on, immediately start on the current page
  useEffect(() => {
    if (!isAutoPlay) {
      stopAllAudio();
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      autoPlayPendingRef.current = false;
      return;
    }
    // If auto-play was just turned on and we're on a story page, start it
    if (!isCoverPage) {
      autoPlayPendingRef.current = true;
      const delay = calmMode ? 1200 : 600;
      const t = setTimeout(() => {
        if (!autoPlayPendingRef.current) return;
        autoPlayPendingRef.current = false;
        playCurrentPageAudio(() => {
          if (isAutoPlay) {
            const advanceDelay = calmMode ? 2000 : 1000;
            setTimeout(() => {
              setCurrentPageIndex(prev => {
                if (prev < story.pages.length - 1) {
                  setDirection(1);
                  return prev + 1;
                }
                setIsAutoPlay(false);
                if (onFinish) onFinish();
                return prev;
              });
            }, advanceDelay);
          }
        });
      }, delay);
      return () => {
        clearTimeout(t);
        autoPlayPendingRef.current = false;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlay]);

  const handlePrev = () => {
    // Turning pages manually cancels auto-play
    setIsAutoPlay(false);
    if (currentPageIndex > -1) {
      setDirection(-1);
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleNextManual = () => {
    setIsAutoPlay(false);
    handleNext();
  };

  const toggleSpeech = async () => {
    // Stop if already speaking
    if (isSpeaking || isLoadingAudio) {
      stopAllAudio();
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      return;
    }

    if (isCoverPage) return; // no text on cover
    await playCurrentPageAudio();
  };

  const toggleRecording = async () => {
    // Stop recording → save
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (isCoverPage) return;
    // Stop any playback first
    stopAllAudio();
    setIsSpeaking(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const pageAtStart = currentPageIndex;
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setPageRecording(story.id, pageAtStart, reader.result);
          }
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      // Mic permission denied or unavailable — do nothing loud
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setPageRecording(story.id, currentPageIndex, undefined);
  };

  const hasRecording = !isCoverPage && !!story.pages[currentPageIndex]?.recordedAudioUrl;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: dir > 0 ? 90 : -90,
    }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: dir < 0 ? 90 : -90,
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">

      {/* The Book — mb-20 leaves room for the labeled audio buttons below */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-1000 mb-20">
        <div className="absolute inset-0 rounded-2xl bg-card border-8 border-primary/20 shadow-2xl overflow-hidden flex">

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPageIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.4 },
              }}
              className="absolute inset-0 w-full h-full origin-left bg-white"
            >
              {isCoverPage ? (
                <CoverPage story={story} userName={userName} />
              ) : (
                <BookPage
                  page={story.pages[currentPageIndex]}
                  worldId={story.world}
                  companionId={story.companionType}
                  drawingDataUrl={story.drawingDataUrl}
                  pageIndex={currentPageIndex}
                  isLeftPage={false}
                  coverImageUrl={coverImageUrl}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Read Aloud + Record buttons — below the book, NOT overlapping (hidden on cover) */}
        {!isCoverPage && !isAutoPlay && (
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-3 px-4">
            {/* Delete recording */}
            {hasRecording && !isRecording && (
              <Button
                variant="outline"
                size="sm"
                onClick={deleteRecording}
                title="Remove your recording"
                className="rounded-full gap-2 border-muted-foreground/30 text-muted-foreground hover:text-destructive hover:border-destructive/40 h-11 px-4"
                data-testid="button-delete-recording"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </Button>
            )}

            {/* Record your own voice */}
            <Button
              size="sm"
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Record your voice reading this page"}
              className={cn(
                "rounded-full gap-2 h-11 px-5 text-sm font-medium shadow-sm",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
              )}
              variant="ghost"
              data-testid="button-record-voice"
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? "Stop" : hasRecording ? "Re-record" : "Record me"}
            </Button>

            {/* Read aloud */}
            <Button
              size="sm"
              onClick={toggleSpeech}
              disabled={isLoadingAudio || isRecording}
              title={hasRecording ? "Play your recording" : "Read aloud"}
              className={cn(
                "rounded-full gap-2 h-11 px-5 text-sm font-medium shadow-sm",
                hasRecording
                  ? "bg-accent/20 border border-accent/40 text-accent-foreground hover:bg-accent/30"
                  : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
              )}
              variant="ghost"
            >
              {isLoadingAudio
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : isSpeaking
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />
              }
              {isSpeaking ? "Stop" : hasRecording ? "Play mine" : "Read aloud"}
            </Button>
          </div>
        )}

        {/* Auto-play indicator — shown while running */}
        {isAutoPlay && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1.5 shadow-md text-sm font-medium text-primary">
            {isLoadingAudio
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : isSpeaking
                ? <Volume2 className="w-4 h-4 animate-pulse" />
                : <Loader2 className="w-4 h-4 animate-spin" />
            }
            Story playing…
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between w-full mt-2 px-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={handlePrev}
          disabled={isCoverPage}
          className="gap-2 text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
          {currentPageIndex === 0 ? "Cover" : "Previous"}
        </Button>

        {/* Centre: page dots + play-story toggle */}
        <div className="flex flex-col items-center gap-2">
          {/* Play Story toggle — only shown once we're past the cover */}
          {!isCoverPage && (
            <Button
              variant={isAutoPlay ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAutoPlay(v => !v)}
              disabled={isRecording}
              className={cn(
                "gap-1.5 rounded-full px-4 text-sm font-medium transition-all",
                isAutoPlay
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground"
              )}
              title={isAutoPlay ? "Stop story mode" : "Play story — reads each page and turns automatically"}
              data-testid="button-autoplay-toggle"
            >
              {isAutoPlay
                ? <><Pause className="w-3.5 h-3.5" /> Stop Story</>
                : <><Play className="w-3.5 h-3.5" /> Play Story</>
              }
            </Button>
          )}

          {/* Page dots — cover + story pages */}
          <div className="flex gap-2 items-center">
            {/* Cover dot */}
            <div className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentPageIndex === -1 ? "w-6 bg-primary" : "w-2 bg-primary/20"
            )} />
            {story.pages.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === currentPageIndex ? "w-6 bg-primary" : "w-2 bg-primary/20"
                )}
              />
            ))}
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleNextManual}
          className="gap-2 shadow-sm rounded-full px-6"
        >
          {isLastPage ? "Finish Story" : isCoverPage ? "Open Book" : "Next Page"}
          {!isLastPage && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
