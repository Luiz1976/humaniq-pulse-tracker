import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <MetaTags
                title="Sobre a HumaniQ AI - Nossa Missão e Equipe"
                description="Conheça a equipe de especialistas em SST e Tecnologia por trás do HumaniQ Pulse Tracker."
            />
            <PublicNavbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Mission Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-6">Nossa Missão</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Democratizar a gestão de Segurança e Saúde do Trabalho (SST) através da Inteligência Artificial,
                        tornando o ambiente corporativo mais seguro, saudável e produtivo para todos.
                    </p>
                </section>

                {/* Team Section */}
                <section id="carlos-mendes" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <FileText className="text-primary" />
                        Corpo Técnico e Editorial
                    </h2>

                    <Card className="overflow-hidden border-primary/20 shadow-lg">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-muted flex items-center justify-center p-8">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                                    CM
                                </div>
                            </div>
                            <div className="md:w-2/3 p-6 md:p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary">TST Certificado</Badge>
                                    <Badge variant="secondary">MBA Gestão de Riscos</Badge>
                                    <Badge variant="secondary">Membro CIPA</Badge>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">Dr. Carlos Mendes, TST</h3>
                                <p className="text-primary font-medium mb-4">Diretor de Saúde Ocupacional</p>

                                <p className="text-muted-foreground mb-6">
                                    Especialista em Segurança e Saúde do Trabalho com 15 anos de experiência prática em indústrias de grande porte.
                                    Formado em Engenharia de Segurança do Trabalho pela USP, com MBA em Gestão de Riscos Corporativos.
                                    Lidera a curadoria técnica dos conteúdos da HumaniQ AI, garantindo conformidade rigorosa com a NR-01 e normas regulamentadoras vigentes.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>+80 Artigos Publicados</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Auditor Líder ISO 45001</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Perito Técnico Judicial</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <a href="#" className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="mailto:contato@humaniqai.com.br" className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Company Info */}
                <section className="mt-16 grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transparência Editorial</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm space-y-2">
                            <p>Todo o conteúdo publicado pela HumaniQ AI passa por rigorosa revisão técnica.</p>
                            <p>Utilizamos Inteligência Artificial como ferramenta de auxílio, mas a validação final é sempre humana e técnica.</p>
                            <p>Nosso compromisso é com a verdade técnica e a atualização constante frente às leis trabalhistas brasileiras.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>contato@humaniqai.com.br</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 flex items-center justify-center font-bold text-primary">📍</div>
                                <span>São Paulo, SP - Brasil</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </main>
        </div>
    );
}
