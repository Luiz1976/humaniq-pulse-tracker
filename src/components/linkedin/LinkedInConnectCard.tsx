import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, CheckCircle2, Zap, Radio, Clock } from "lucide-react";

interface LinkedInConnectCardProps {
  onConnect: () => void;
}

export function LinkedInConnectCard({ onConnect }: LinkedInConnectCardProps) {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="glass-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#0A66C2] to-[#004182]" />
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
            <Linkedin className="w-10 h-10 text-[#0A66C2]" />
          </div>
          <CardTitle className="text-2xl">Conecte seu LinkedIn</CardTitle>
          <CardDescription className="text-base">
            Automatize sua presença no LinkedIn com IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Geração Automática de Conteúdo</p>
                <p className="text-sm text-muted-foreground">
                  IA gera posts profissionais sobre NR01 e riscos psicossociais
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#0A66C2]" />
              </div>
              <div>
                <p className="font-medium">Publicação Programada</p>
                <p className="text-sm text-muted-foreground">
                  Posts automáticos de hora em hora, entre 6h e 22h (Brasília)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Radio className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Escuta Ativa Inteligente</p>
                <p className="text-sm text-muted-foreground">
                  Monitora discussões relevantes e responde automaticamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Portfólio de 10 Posts</p>
                <p className="text-sm text-muted-foreground">
                  Sempre mantém 10 posts prontos, gerando novos automaticamente
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onConnect}
            className="w-full gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white h-12 text-lg"
          >
            <Linkedin className="w-5 h-5" />
            Conectar com LinkedIn
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao conectar, você autoriza o HumaniQ Pulse a publicar e interagir em seu nome.
            Você pode desconectar a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
