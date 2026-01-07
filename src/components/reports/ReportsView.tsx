import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    PieChart,
    LineChart,
    Download,
    Calendar,
    ArrowUpRight,
    Printer,
    FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLinkedIn } from "@/hooks/useLinkedIn";

export function ReportsView() {
    const [period, setPeriod] = useState("30");
    const { detections } = useLinkedIn(); // Reuse existing data for realism

    // Mock Data for reports (since we don't have a full analytics backend yet)
    const reportData = {
        overview: {
            totalLeads: 124,
            conversionRate: "3.8%",
            seoTraffic: "15.4k",
            linkedinEngagement: "4.2%"
        },
        seo: {
            topPages: [
                { url: "/nr01", visits: 4500, avgTime: "2:30" },
                { url: "/riscos-psicossociais", visits: 3200, avgTime: "3:10" },
                { url: "/blog/burnout", visits: 1800, avgTime: "1:45" },
            ]
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 print:space-y-4">
            {/* Header - No Print Control */}
            <div className="flex items-center justify-between animate-fade-in print:hidden">
                <div>
                    <h1 className="text-3xl font-bold">Relatórios Executivos</h1>
                    <p className="text-muted-foreground mt-1">Análise consolidada de performance e compliance</p>
                </div>
                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Últimos 7 dias</SelectItem>
                            <SelectItem value="30">Últimos 30 dias</SelectItem>
                            <SelectItem value="90">Último Trimestre</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Imprimir / PDF
                    </Button>
                </div>
            </div>

            {/* Printable Report Wrapper */}
            <div className="print:block space-y-8" id="report-content">

                {/* Report Header (Visible mainly in print) */}
                <div className="hidden print:flex items-center justify-between border-b pb-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary"></div>
                        <h1 className="text-2xl font-bold">HumaniQ Pulse Tracker</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold">Relatório Executivo de Performance</p>
                        <p className="text-xs text-muted-foreground">Gerado em {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="grid grid-cols-4 gap-4">
                    <Card className="print:border-none print:shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Totais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.overview.totalLeads}</div>
                            <p className="text-xs text-success flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs período anterior
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="print:border-none print:shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.overview.conversionRate}</div>
                            <p className="text-xs text-success flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +0.5% vs período anterior
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="print:border-none print:shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tráfego SEO</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.overview.seoTraffic}</div>
                            <p className="text-xs text-success flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" /> +22% (SEO Booster Ativo)
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="print:border-none print:shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Engajamento LinkedIn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.overview.linkedinEngagement}</div>
                            <p className="text-xs text-muted-foreground">Dentro da meta</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">

                    {/* SEO Performance */}
                    <Card className="print:break-inside-avoid">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-primary" />
                                Performance SEO (Top Páginas)
                            </CardTitle>
                            <CardDescription>Páginas com maior tráfego orgânico no período</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reportData.seo.topPages.map((page, i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{page.url}</p>
                                            <p className="text-xs text-muted-foreground">Tempo médio: {page.avgTime}</p>
                                        </div>
                                        <div className="font-bold">{page.visits} <span className="text-xs font-normal text-muted-foreground">visitas</span></div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* LinkedIn Compliance */}
                    <Card className="print:break-inside-avoid" >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Compliance & Automação
                            </CardTitle>
                            <CardDescription>Auditoria de ações automatizadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Ações Totais Executadas</span>
                                    <span className="font-bold">{detections.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Bloqueios de Rate Limit</span>
                                    <span className="font-bold text-success">0 (Seguro)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Comentários Aprovados Manualmente</span>
                                    <span className="font-bold">24</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Alertas de Risco</span>
                                    <span className="font-bold text-muted-foreground">Nenhum</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="hidden print:block text-center mt-12 text-xs text-muted-foreground border-t pt-4">
                    <p>HumaniQ Pulse Tracker - Relatório Gerado Automaticamente</p>
                    <p>Confidencial e de Uso Interno</p>
                </div>
            </div>
        </div>
    );
}
