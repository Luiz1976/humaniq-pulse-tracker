
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, RefreshCw, Search, TrendingUp, AlertTriangle, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSeo } from "@/context/SeoContext";

export function SeoBooster() {
    const {
        isScanning,
        autoMode,
        setAutoMode,
        frequency,
        setFrequency,
        urlStatuses,
        progress,
        runScan
    } = useSeo();

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Aceleração de Ranking SEO
                        </CardTitle>
                        <CardDescription>
                            Monitoramento de frequência e "ping" de indexação para páginas prioritárias.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-[160px]">
                            <Select
                                value={frequency.toString()}
                                onValueChange={(v) => setFrequency(parseInt(v))}
                                disabled={autoMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Frequência" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30000">Turbo (30s)</SelectItem>
                                    <SelectItem value="60000">Alta (1 min)</SelectItem>
                                    <SelectItem value="300000">Média (5 min)</SelectItem>
                                    <SelectItem value="600000">Baixa (10 min)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant={autoMode ? "destructive" : "outline"}
                            onClick={() => setAutoMode(!autoMode)}
                        >
                            {autoMode ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Parar Auto
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Modo Automático
                                </>
                            )}
                        </Button>
                        <Button onClick={runScan} disabled={isScanning || autoMode}>
                            {isScanning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Otimizando...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Iniciar Ciclo
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isScanning && (
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Processando URLs...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {urlStatuses.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border",
                                item.status === 'scanning' && "bg-accent border-primary/50",
                                item.status === 'success' && "bg-green-500/5 border-green-500/20",
                                item.status === 'error' && "bg-red-500/5 border-red-500/20",
                            )}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {item.status === 'pending' && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                                {item.status === 'scanning' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                {item.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {item.status === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}

                                <div className="flex flex-col min-w-0">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:underline truncate flex items-center gap-1"
                                    >
                                        {item.url.replace('https://www.humaniqai.com.br', '') || '/'}
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                    </a>
                                    <span className="text-xs text-muted-foreground">
                                        {item.status === 'success'
                                            ? `Latência: ${item.latency} ms • Indexação Solicitada`
                                            : item.status === 'scanning' ? 'Verificando...' : 'Aguardando'}
                                    </span>
                                </div>
                            </div>

                            {item.lastChecked && (
                                <Badge variant="outline" className="text-xs ml-2 shrink-0">
                                    {item.lastChecked.toLocaleTimeString()}
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
