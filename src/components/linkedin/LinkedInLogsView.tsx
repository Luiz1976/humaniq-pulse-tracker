import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLinkedIn } from "@/hooks/useLinkedIn";

export function LinkedInLogsView() {
  const { logs, loading } = useLinkedIn();

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-accent" />;
    }
  };

  const getLogBadgeClass = (type: string) => {
    switch (type) {
      case "success": return "bg-success/20 text-success";
      case "error": return "bg-destructive/20 text-destructive";
      case "warning": return "bg-warning/20 text-warning";
      default: return "bg-accent/20 text-accent";
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "connect": return "Conexão";
      case "generate": return "Geração";
      case "publish": return "Publicação";
      case "listen": return "Escuta";
      case "comment": return "Comentário";
      default: return action;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Logs de Atividade LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhuma atividade registrada ainda.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="mt-0.5">
                    {getLogIcon(log.log_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={getLogBadgeClass(log.log_type)}>
                        {log.log_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getActionLabel(log.action)}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(log.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{log.message}</p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {JSON.stringify(log.details)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
