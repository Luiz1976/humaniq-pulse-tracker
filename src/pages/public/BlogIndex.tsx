import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MetaTags } from "@/components/seo/MetaTags";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    route: string;
    image_url: string | null;
    created_at: string;
}

export default function BlogIndex() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            const { data } = await (supabase as any)
                .from("website_content")
                .select("id, title, summary, slug, route, image_url, created_at")
                .eq("status", "published")
                .order("created_at", { ascending: false });

            if (data) {
                // Map summary to excerpt for compatibility
                const postsWithExcerpt = data.map((post: any) => ({
                    ...post,
                    excerpt: post.summary || ''
                }));
                setPosts(postsWithExcerpt as BlogPost[]);
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);

    const routes = [
        { id: "all", label: "Todos" },
        { id: "blog", label: "Artigos" },
        { id: "nr01", label: "NR-01" },
        { id: "riscos-psicossociais", label: "Riscos Psicossociais" },
    ];

    const filteredPosts = activeTab === "all"
        ? posts
        : posts.filter(p => p.route === activeTab);

    return (
        <div className="min-h-screen bg-background">
            <MetaTags
                title="Blog HumaniQ AI - SST e Riscos Psicossociais"
                description="Artigos, guias e novidades sobre Segurança do Trabalho, NR-01 e Gestão de Riscos Psicossociais com IA."
            />
            <PublicNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                        Blog & Recursos
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Conteúdo especialista sobre NR-01, Saúde Mental e Tecnologia aplicada ao RH.
                    </p>
                </div>

                <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
                    <div className="flex justify-center mb-8">
                        <TabsList>
                            {routes.map(route => (
                                <TabsTrigger key={route.id} value={route.id}>
                                    {route.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map(post => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-muted">
                                    {post.image_url && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {post.route.toUpperCase()}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-3 mb-4">
                                            {post.excerpt}
                                        </CardDescription>
                                        <div className="flex items-center text-primary text-sm font-medium">
                                            Ler artigo <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Tabs>
            </main>
        </div>
    );
}
