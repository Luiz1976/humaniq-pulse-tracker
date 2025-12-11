import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Instagram, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Loader2
} from "lucide-react";

export function InstagramView() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleConnect = async () => {
    if (!username || !password) return;
    
    setIsLoading(true);
    // Simular conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold">Conexão Instagram</h1>
        <p className="text-muted-foreground mt-1">Conecte sua conta para habilitar a automação</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Card */}
        <Card className="glass-card animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-instagram flex items-center justify-center">
                <Instagram className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Conta Instagram</CardTitle>
                <CardDescription>
                  {isConnected ? "Conectado e pronto para uso" : "Não conectado"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Nome de usuário
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="seu_usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-secondary border-border"
                    />
                  </div>
                </div>
                <Button 
                  variant="instagram" 
                  className="w-full mt-4"
                  onClick={handleConnect}
                  disabled={isLoading || !username || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Instagram className="w-4 h-4" />
                      Conectar Instagram
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">Conectado com sucesso</p>
                    <p className="text-sm text-muted-foreground">@{username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary">
                  <div>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">567</p>
                    <p className="text-sm text-muted-foreground">Seguindo</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDisconnect}
                >
                  Desconectar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Info Card */}
        <Card className="glass-card animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Suas credenciais estão protegidas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Armazenamento Local</p>
                  <p className="text-sm text-muted-foreground">Credenciais salvas apenas no seu dispositivo</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Sessão Criptografada</p>
                  <p className="text-sm text-muted-foreground">Dados de sessão protegidos por criptografia</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Sem APIs de Terceiros</p>
                  <p className="text-sm text-muted-foreground">Comunicação direta via biblioteca oficial</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning">Recomendação</p>
                <p className="text-sm text-muted-foreground">Use uma conta dedicada para automação e respeite os termos de uso do Instagram.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
