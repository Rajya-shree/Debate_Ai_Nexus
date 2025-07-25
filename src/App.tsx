
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { DebateProvider } from "./contexts/DebateContext";
import { QuestionProvider } from "./contexts/QuestionContext";

import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import AnswerPosts from "./pages/AnswerPosts";
import Debates from "./pages/Debates";
import Notifications from "./pages/Notifications";
import Question from "./pages/Question";
import Explore from "./pages/Explore";
import StartDebate from "./pages/StartDebate";
import DebateRoom from "./pages/DebateRoom";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <DebateProvider>
            <QuestionProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/answer-posts" element={<AnswerPosts />} />
                    <Route path="/debates" element={<Debates />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/question/:id" element={<Question />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/start-debate" element={<StartDebate />} />
                    <Route path="/debate-room" element={<DebateRoom />} />
                    <Route path="/debate-room/:id" element={<DebateRoom />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </TooltipProvider>
            </QuestionProvider>
          </DebateProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
