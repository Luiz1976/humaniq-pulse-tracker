import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MetaTags } from "@/components/seo/MetaTags";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";

interface PillarPageProps {
    route: string;
    title: string;
    description: string;
    icon?: 'shield' | 'activity' | 'book';
}

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    image_url: string | null;
    created_at: string;
}

export default function PillarPage({ route, title, description, icon = 'book' }: PillarPageProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            // Fetch posts for this specific route
            const { data } = await (supabase as any)
                .from("website_content_posts")
                .select("*")
                .eq("route", route)
                .order("created_at", { ascending: false });

            if (data) setPosts(data as BlogPost[]);
            setLoading(false);
        }
        fetchPosts();
    }, [route]);

    const Icon = icon === 'shield' ? ShieldCheck : icon === 'activity' ? Activity : BookOpen;

    const renderCustomContent = () => {
        if (route === 'nr01') {
            return (
                <div className="space-y-12 mb-16">
                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold">O que é a NR 01 e Sua Importância</h2>
                        <p className="text-lg text-muted-foreground">
                            A Norma Regulamentadora nº 01 (NR 01) é a base de todas as normas de segurança do trabalho no Brasil.
                            Ela estabelece as disposições gerais e o Gerenciamento de Riscos Ocupacionais (GRO).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold">Principais Mudanças na NR 01 2024</h2>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                                <span>Fim do PPRA e obrigatoriedade do PGR (Programa de Gerenciamento de Riscos).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                                <span>Inclusão dos riscos psicossociais nas avaliações de risco.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                                <span>Digitalização obrigatória de documentos de SST.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold">Como Implementar a NR 01 na Sua Empresa</h2>
                        <p className="text-lg text-muted-foreground">
                            A implementação exige um ciclo PDCA (Plan, Do, Check, Act). Comece pelo inventário de riscos,
                            elabore o plano de ação e realize o acompanhamento contínuo.
                        </p>
                    </section>

                    <section className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
                        <h2 className="text-3xl font-bold mb-4">Software Humaniq AI para NR 01</h2>
                        <p className="text-lg mb-6">
                            Simplifique a conformidade com a NR 01 usando nossa inteligência artificial.
                            Automatize o inventário de riscos, planos de ação e gestão documental.
                        </p>
                        <Button size="lg" className="w-full sm:w-auto">Solicitar Demonstração</Button>
                    </section>
                </div>
            );
        }

        if (route === 'riscos-psicossociais') {
            return (
                <div className="space-y-12 mb-16">
                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold">Identificação e Avaliação</h2>
                        <p className="text-lg text-muted-foreground">
                            Riscos psicossociais envolvem fatores como estresse, assédio, sobrecarga mental e falta de autonomia.
                            Sua identificação é agora obrigatória sob a nova NR 01.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold">Metodologia de Gestão</h2>
                        <p className="text-lg text-muted-foreground">
                            Utilizamos metodologias validadas internacionalmente (como COPSOQ II) integradas à nossa plataforma
                            para mapear e mitigar ameaças à saúde mental dos colaboradores.
                        </p>
                    </section>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-background">
            <MetaTags title={title} description={description} />
            <PublicNavbar />

            {/* Hero Section */}
            <header className="bg-muted/30 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                    {/* H1 Optimization for SEO */}
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">{title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Custom Content for SEO Pillars */}
                {renderCustomContent()}

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Artigos e Guias Recentes</h2>
                    <Link to="/blog">
                        <Button variant="ghost">Ver todos no Blog</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-10">Carregando conteúdos...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                                    <Card className="h-full hover:shadow-lg transition-shadow border-muted">
                                        {post.image_url && (
                                            <div className="h-48 overflow-hidden rounded-t-lg">
                                                <img
                                                    src={post.image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="line-clamp-3 mb-4">
                                                {post.excerpt}
                                            </CardDescription>
                                            <div className="flex items-center text-primary text-sm font-medium">
                                                Ler mais <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 bg-muted/20 rounded-xl">
                                <p className="text-muted-foreground">Nenhum conteúdo publicado nesta seção ainda.</p>
                                <p className="text-sm mt-2">Aguarde a próxima atualização automática.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* E-E-A-T Section - Author/Reviewer */}
            <section className="bg-muted/30 border-t border-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                        HQ
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Conteúdo Verificado por Especialistas</h3>
                        <p className="text-muted-foreground text-sm max-w-2xl">
                            Este conteúdo foi elaborado e revisado por nossa equipe multidisciplinar de Engenharia de Segurança do Trabalho e Psicologia Ocupacional,
                            garantindo conformidade com a NR-01 e as diretrizes da ISO 45003.
                        </p>
                        <div className="flex gap-4 mt-2 text-sm font-medium text-primary">
                            <span>Revisão Técnica: Eng. Carlos Mendes</span>
                            <span>•</span>
                            <span>Atualizado: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </section>

            <SchemaMarkup
                type="TechArticle"
                data={{
                    "headline": title,
                    "description": description,
                    "author": {
                        "@type": "Organization",
                        "name": "HumaniQ AI"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "HumaniQ Pulse",
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${window.location.origin}/logo.png`
                        }
                    },
                    "datePublished": new Date().toISOString(),
                    "dateModified": new Date().toISOString()
                }}
            />
        </div >
    );
}
