import { useState } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AnimatePresence, MotionConfig } from "framer-motion";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import StoryBuilder from "@/pages/StoryBuilder";
import BookViewer from "@/pages/BookViewer";
import Bookshelf from "@/pages/Bookshelf";
import Profile from "@/pages/Profile";
import { GlobalControls } from "@/components/GlobalControls";
import { AppHeader } from "@/components/AppHeader";
import { BreakTime } from "@/components/BreakTime";
import { useAuthStore } from "@/lib/authStore";
import { useStoryStore } from "@/lib/storyStore";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const userName = useAuthStore(s => s.userName);
  if (!userName) return <Redirect to="/login" />;
  return <>{children}</>;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/"><AuthGuard><Landing /></AuthGuard></Route>
        <Route path="/create"><AuthGuard><StoryBuilder /></AuthGuard></Route>
        <Route path="/book/:id">{() => <AuthGuard><BookViewer /></AuthGuard>}</Route>
        <Route path="/bookshelf"><AuthGuard><Bookshelf /></AuthGuard></Route>
        <Route path="/profile"><AuthGuard><Profile /></AuthGuard></Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

/** Inner shell — needs to be inside WouterRouter to use useLocation */
function AppShell() {
  const reduceMotion = useStoryStore(s => s.reduceMotion);
  const [location] = useLocation();

  // Break modal state lives here so both the header button and the nudge timer can open it
  const [breakOpen, setBreakOpen] = useState(false);
  const [breakReason, setBreakReason] = useState<string | undefined>();

  const openBreak = (reason?: string) => {
    setBreakReason(reason);
    setBreakOpen(true);
  };

  const isLoginPage = location === "/login";

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      {/* Sticky header — hidden on login */}
      {!isLoginPage && (
        <AppHeader onOpenBreak={openBreak} />

      )}

      {/* Global background logic: timers, mascot, accessibility classes */}
      <GlobalControls onOpenBreak={openBreak} />

      {/* Single shared BreakTime modal */}
      <BreakTime open={breakOpen} onClose={() => setBreakOpen(false)} reason={breakReason} />

      {/* Page content pushed below the fixed header */}
      <div className={isLoginPage ? "" : "pt-14"}>
        <Router />
      </div>
    </MotionConfig>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
