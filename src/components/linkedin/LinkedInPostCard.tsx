import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  image_index: number | null;
  status: string;
  published_at: string | null;
  engagement_likes: number | null;
  engagement_comments: number | null;
  engagement_shares: number | null;
  created_at: string;
}

interface LinkedInPostCardProps {
  post: LinkedInPost;
  image: string;
  isPublished?: boolean;
  onPublish?: () => void;
  onDelete?: () => void;
}

export function LinkedInPostCard({
  post,
  image,
  isPublished = false,
  onPublish,
  onDelete,
}: LinkedInPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!onPublish) return;
    setPublishing(true);
    await onPublish();
    setPublishing(false);
  };

  const truncatedContent = post.content.length > 200 
    ? post.content.slice(0, 200) + "..." 
    : post.content;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* Image Preview */}
        <div className="w-32 h-32 flex-shrink-0 bg-secondary">
          <img 
            src={image} 
            alt="Post preview" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant={isPublished ? "default" : "secondary"}
                  className={isPublished ? "bg-success" : ""}
                >
                  {isPublished ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      Pronto
                    </>
                  )}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(
                    new Date(isPublished && post.published_at ? post.published_at : post.created_at),
                    { addSuffix: true, locale: ptBR }
                  )}
                </span>
              </div>

              <h3 className="font-medium text-sm mb-1 truncate">{post.title}</h3>
              
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {expanded ? post.content : truncatedContent}
              </p>

              {post.content.length > 200 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 h-6 px-2 text-xs"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Ver mais
                    </>
                  )}
                </Button>
              )}

              {/* Engagement Stats */}
              {isPublished && (
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {post.engagement_likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.engagement_comments || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {post.engagement_shares || 0}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {!isPublished && (
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-[#0A66C2] hover:bg-[#004182]"
                >
                  <Send className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
