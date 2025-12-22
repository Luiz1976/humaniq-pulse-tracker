import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { findRelatedPostsCached, Post } from '@/utils/seo/similarity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface RelatedPostsProps {
    currentPost: Post;
    maxPosts?: number;
}

export function RelatedPosts({ currentPost, maxPosts = 3 }: RelatedPostsProps) {
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRelatedPosts() {
            try {
                // Buscar todos os posts publicados
                const { data: allPosts } = await supabase
                    .from('website_content' as any)
                    .select('id, title, content, slug, summary')
                    .eq('status', 'published')
                    .neq('id', currentPost.id) as any;

                if (!allPosts || allPosts.length === 0) {
                    setLoading(false);
                    return;
                }

                // Calcular similaridade
                const postsWithContent: Post[] = allPosts.map((post: any) => ({
                    id: post.id,
                    title: post.title,
                    content: post.content || '',
                    slug: post.slug || '',
                    description: post.summary || ''
                }));

                const related = findRelatedPostsCached(currentPost, postsWithContent, maxPosts);
                setRelatedPosts(related);
            } catch (error) {
                console.error('Error fetching related posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRelatedPosts();
    }, [currentPost, maxPosts]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                📚 Leia Também
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-start justify-between gap-2">
                                <span className="line-clamp-2">{post.title}</span>
                                <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        {post.description && (
                            <CardContent>
                                <CardDescription className="line-clamp-3">
                                    {post.description}
                                </CardDescription>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
