import { useState } from "react";
import { Film, Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { Story } from "@/lib/storyStore";
import { useStoryStore } from "@/lib/storyStore";
import { exportStoryVideo, downloadBlob } from "@/lib/videoExport";

interface VideoExportButtonProps {
  story: Story;
}

export function VideoExportButton({ story }: VideoExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [label, setLabel] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [ext, setExt] = useState("webm");
  const [error, setError] = useState<string | null>(null);
  const addPoints = useStoryStore(s => s.addPoints);

  const startExport = async () => {
    setBusy(true);
    setError(null);
    setVideoUrl(null);
    setBlob(null);
    setPct(0);
    setLabel("Warming up the projector");
    try {
      const result = await exportStoryVideo(story, {
        onProgress: (p, l) => {
          setPct(p);
          setLabel(l);
        },
      });
      const url = URL.createObjectURL(result.blob);
      setVideoUrl(url);
      setBlob(result.blob);
      setExt(result.ext);
      addPoints(15);
    } catch (e) {
      console.error(e);
      setError("Your browser couldn't record the video. Try Chrome or Edge.");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setBlob(null);
    setOpen(false);
    setBusy(false);
    setPct(0);
    setLabel("");
    setError(null);
  };

  const handleDownload = () => {
    if (!blob) return;
    const safe = story.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40) || "imagineme-story";
    downloadBlob(blob, `${safe}.${ext}`);
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => { setOpen(true); startExport(); }}
        className="gap-2 rounded-full"
      >
        <Film className="w-5 h-5" />
        Make a video
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-card rounded-3xl shadow-xl border max-w-xl w-full p-6 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute top-3 right-3 rounded-full"
                disabled={busy}
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif">Your storybook video</h3>
                  <p className="text-xs text-muted-foreground">A short animated movie of your story.</p>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-xl p-3 text-sm mb-4">
                  {error}
                </div>
              )}

              {!videoUrl && !error && (
                <div className="space-y-4">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">{label || "Getting ready"}</p>
                  </div>
                  <div>
                    <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-pink-400"
                        animate={{ width: `${pct}%` }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1.5 text-right tabular-nums">{pct}%</div>
                  </div>
                </div>
              )}

              {videoUrl && (
                <div className="space-y-4">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full rounded-2xl bg-black aspect-video shadow-md"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleDownload} size="lg" className="gap-2 rounded-full flex-1">
                      <Download className="w-5 h-5" />
                      Save video
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => { if (videoUrl) URL.revokeObjectURL(videoUrl); setVideoUrl(null); setBlob(null); startExport(); }}
                      className="rounded-full"
                    >
                      Make another
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Saved as a .{ext} video. Plays in most modern players and browsers.
                  </p>
                </div>
              )}

              {error && (
                <Button onClick={handleClose} variant="outline" className="w-full mt-4 rounded-full">
                  Close
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
