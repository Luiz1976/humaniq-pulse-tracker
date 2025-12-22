import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MetaTags } from "@/components/seo/MetaTags";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldCheck, Activity } from "lucide-react";

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
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">{title}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
                </div>
            </header>

            {/* Content List */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        </div>
    );
}
