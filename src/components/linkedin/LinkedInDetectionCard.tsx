import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  User,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LinkedInDetection {
  id: string;
  source_url: string | null;
  source_author: string | null;
  source_content: string | null;
  detected_topic: string | null;
  relevance_score: number | null;
  action_taken: string | null;
  response_content: string | null;
  detected_at: string;
  actioned_at: string | null;
}

interface LinkedInDetectionCardProps {
  detection: LinkedInDetection;
  onComment: (message?: string) => void;
}

export function LinkedInDetectionCard({
  detection,
  onComment,
}: LinkedInDetectionCardProps) {
  const [showReply, setShowReply] = useState(false);
  const [customMessage, setCustomMessage] = useState(detection.response_content || "");
  const [sending, setSending] = useState(false);

  const isActioned = detection.action_taken === "commented" || detection.action_taken === "posted";
  const isPending = detection.action_taken === "pending";

  const relevanceColor = (detection.relevance_score || 0) >= 0.7 
    ? "text-success" 
    : (detection.relevance_score || 0) >= 0.5 
      ? "text-warning" 
      : "text-muted-foreground";

  const handleSend = async () => {
    setSending(true);
    await onComment(customMessage);
    setSending(false);
    setShowReply(false);
  };

  return (
    <Card className={`overflow-hidden ${isPending ? "border-warning/50" : ""}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{detection.source_author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(detection.detected_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={relevanceColor}>
                <Sparkles className="w-3 h-3 mr-1" />
                {Math.round((detection.relevance_score || 0) * 100)}%
              </Badge>
              <Badge 
                variant={isActioned ? "default" : "secondary"}
                className={isActioned ? "bg-success" : isPending ? "bg-warning text-warning-foreground" : ""}
              >
                {isActioned ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Respondido
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pendente
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Topic */}
          {detection.detected_topic && (
            <Badge variant="outline" className="text-xs">
              {detection.detected_topic}
            </Badge>
          )}

          {/* Content */}
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-sm">{detection.source_content}</p>
          </div>

          {/* Suggested Response */}
          {isPending && !showReply && detection.response_content && (
            <div className="p-3 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Resposta sugerida pela IA:
              </p>
              <p className="text-sm">{detection.response_content}</p>
            </div>
          )}

          {/* Reply Form */}
          {showReply && (
            <div className="space-y-3">
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Edite a resposta ou envie a sugerida..."
                rows={4}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSend}
                  disabled={sending || !customMessage.trim()}
                  className="bg-[#0A66C2] hover:bg-[#004182]"
                >
                  {sending ? "Enviando..." : "Enviar Resposta"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowReply(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {isPending && !showReply && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onComment()}
                className="gap-2 bg-[#0A66C2] hover:bg-[#004182]"
              >
                <Send className="w-3 h-3" />
                Responder Automaticamente
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReply(true)}
                className="gap-2"
              >
                <MessageSquare className="w-3 h-3" />
                Editar Resposta
              </Button>
              {detection.source_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                >
                  <a href={detection.source_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Actioned timestamp */}
          {isActioned && detection.actioned_at && (
            <p className="text-xs text-muted-foreground">
              Respondido {formatDistanceToNow(new Date(detection.actioned_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
