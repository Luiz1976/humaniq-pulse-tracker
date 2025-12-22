import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MetaTags } from "@/components/seo/MetaTags";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/utils/seo/schemas";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    meta_title: string;
    meta_description: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    route: string;
    slug: string;
}

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            if (!slug) return;

            const { data } = await (supabase as any)
                .from("website_content")
                .select("*")
                .eq("slug", slug)
                .single();

            if (data) setPost(data);
            setLoading(false);
        }
        fetchPost();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;

    if (!post) return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
                <Link to="/blog">
                    <Button>Voltar para o Blog</Button>
                </Link>
            </div>
        </div>
    );

    // Gerar schemas SEO
    const articleSchema = generateArticleSchema({
        title: post.title,
        description: post.meta_description || post.excerpt,
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
            name: "Dr. Carlos Mendes",
            jobTitle: "Diretor de Saúde Ocupacional",
            url: "https://humaniqai.com.br/sobre#carlos-mendes"
        },
        image: post.image_url || undefined,
        url: `https://humaniqai.com.br/blog/${post.slug}`
    });

    const breadcrumbSchema = generateBreadcrumbSchema({
        items: [
            { name: "Home", url: "https://humaniqai.com.br" },
            { name: "Blog", url: "https://humaniqai.com.br/blog" },
            { name: post.title, url: `https://humaniqai.com.br/blog/${post.slug}` }
        ]
    });

    return (
        <div className="min-h-screen bg-background">
            <MetaTags
                title={post.meta_title || post.title}
                description={post.meta_description || post.excerpt}
                image={post.image_url || undefined}
                type="article"
                canonical={`https://humaniqai.com.br/blog/${post.slug}`}
            />

            {/* Schema.org Structured Data */}
            <SchemaOrg schema={[articleSchema, breadcrumbSchema]} />

            <PublicNavbar />

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 text-sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar para o Blog
                </Link>

                <header className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span className="uppercase tracking-wide font-semibold text-primary">{post.route}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                        {post.title}
                    </h1>
                    {post.image_url && (
                        <div className="rounded-xl overflow-hidden aspect-video mb-8">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Related Posts - Sistema "Leia Também" */}
                <RelatedPosts
                    currentPost={{
                        id: post.id,
                        title: post.title,
                        content: post.content,
                        slug: post.slug,
                        description: post.excerpt
                    }}
                    maxPosts={3}
                />
            </article>

            {/* Author Box / Newsletter CTA */}
            <footer className="border-t border-border mt-20 py-12 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-xl font-bold mb-4">Gostou deste conteúdo?</h3>
                    <p className="text-muted-foreground mb-6">Receba atualizações sobre NR-01 e SST diretamente no seu e-mail.</p>
                    <Link to="/auth">
                        <Button size="lg" className="gradient-instagram text-white border-0">
                            Inscrever-se na Newsletter
                        </Button>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
