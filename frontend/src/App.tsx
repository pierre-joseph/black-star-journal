import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Team from "@/pages/Team";
import Sections from "@/pages/Sections";
import SectionPiece from "@/pages/SectionPiece";
import Issue from "@/pages/Issue";
import BSJIssues from "./pages/BSJIssues";
import Archives from "@/pages/Archives";
import NotFound from "@/pages/not-found";

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShow(true));
    });
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollProgressBar />
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main id="main-content" className="flex-grow">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/sections" element={<Sections />} />
              <Route path="/sections/:issueId" element={<Sections />} />
              <Route path="/sections/:issueId/pieces/:pieceSlug" element={<SectionPiece />} />
              <Route path="/issues/:id" element={<Issue />} />
              <Route path="/issues" element={<BSJIssues />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
