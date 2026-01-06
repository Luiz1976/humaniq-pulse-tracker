import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";

// Lazy loading pages for better performance (CWV)
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const LinkedInCallback = lazy(() => import("./pages/LinkedInCallback"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const WebsiteContent = lazy(() => import("./pages/WebsiteContent"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlogIndex = lazy(() => import("./pages/public/BlogIndex"));
const BlogPost = lazy(() => import("./pages/public/BlogPost"));
const About = lazy(() => import("./pages/public/About"));
const PillarPage = lazy(() => import("./pages/public/PillarPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }>
              <Routes>
                {/* Public Routes - SEO Optimized */}
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/sobre" element={<About />} />

                {/* Pillar Pages */}
                <Route path="/nr01" element={
                  <PillarPage
                    route="nr01"
                    title="NR-01 e Gerenciamento de Riscos"
                    description="Guia completo sobre a Norma Regulamentadora 01 e o GRO (Gerenciamento de Riscos Ocupacionais)."
                    icon="shield"
                  />
                } />
                <Route path="/riscos-psicossociais" element={
                  <PillarPage
                    route="riscos-psicossociais"
                    title="Riscos Psicossociais"
                    description="Gestão de Saúde Mental no Trabalho, conformidade legal e prevenção de burnout."
                    icon="activity"
                  />
                } />
                <Route path="/software-nr01" element={
                  <PillarPage
                    route="software-nr01"
                    title="Software para NR-01"
                    description="Tecnologia para automatizar o PGR e o mapeamento de riscos psicossociais."
                    icon="book"
                  />
                } />
                <Route path="/faq" element={
                  <PillarPage
                    route="faq"
                    title="Perguntas Frequentes (FAQ)"
                    description="Respostas rápidas sobre SST, NR-01 e Compliance."
                    icon="book"
                  />
                } />

                {/* Admin Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/linkedin-callback" element={<LinkedInCallback />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/website-content" element={<WebsiteContent />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
