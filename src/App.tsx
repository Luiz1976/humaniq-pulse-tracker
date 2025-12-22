import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LinkedInCallback from "./pages/LinkedInCallback";
import AuthCallback from "./pages/AuthCallback";
import WebsiteContent from "./pages/WebsiteContent";
import NotFound from "./pages/NotFound";
import BlogIndex from "./pages/public/BlogIndex";
import BlogPost from "./pages/public/BlogPost";
import About from "./pages/public/About";
import PillarPage from "./pages/public/PillarPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
