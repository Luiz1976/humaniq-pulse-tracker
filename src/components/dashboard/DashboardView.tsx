import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Users,
  Activity,
  Zap
} from "lucide-react";

export function DashboardView() {
  const recentActivity = [
    { id: 1, type: "comment", text: "Comentário postado em @empresa_rh", time: "2 min atrás", status: "success" },
    { id: 2, type: "scan", text: "Escaneados 15 posts com #NR01", time: "5 min atrás", status: "info" },
    { id: 3, type: "comment", text: "Comentário postado em @saude_trabalho", time: "15 min atrás", status: "success" },
    { id: 4, type: "scan", text: "Escaneados 8 posts com #riscospsicossociais", time: "22 min atrás", status: "info" },
    { id: 5, type: "limit", text: "Limite diário atingido - pausando", time: "30 min atrás", status: "warning" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral da automação HumaniQ Pulse</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Comentários Hoje"
          value="8"
          change="+12% vs ontem"
          changeType="positive"
          icon={MessageSquare}
          iconColor="text-primary"
          delay={0}
        />
        <StatCard
          title="Posts Escaneados"
          value="156"
          change="Últimas 24h"
          changeType="neutral"
          icon={Eye}
          iconColor="text-accent"
          delay={100}
        />
        <StatCard
          title="Taxa de Engajamento"
          value="4.2%"
          change="+0.8% esta semana"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          delay={200}
        />
        <StatCard
          title="Leads Gerados"
          value="23"
          change="Este mês"
          changeType="neutral"
          icon={Users}
          iconColor="text-warning"
          delay={300}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Placeholder */}
        <Card className="lg:col-span-2 glass-card animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Atividade Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-instagram mx-auto flex items-center justify-center mb-4 animate-pulse-slow">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Gráfico de atividade</p>
                <p className="text-sm text-muted-foreground/70">Conecte o Instagram para ver dados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card animate-fade-in" style={{ animationDelay: "500ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  style={{ animationDelay: `${600 + index * 50}ms` }}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success" ? "bg-success" :
                    activity.status === "warning" ? "bg-warning" :
                    "bg-accent"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
