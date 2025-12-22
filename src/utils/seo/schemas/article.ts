export interface ArticleSchemaProps {
    title: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    author: {
        name: string;
        jobTitle?: string;
        url?: string;
    };
    image?: string;
    url: string;
    publisher?: {
        name: string;
        logo?: string;
    };
}

export function generateArticleSchema(props: ArticleSchemaProps) {
    const {
        title,
        description,
        datePublished,
        dateModified,
        author,
        image,
        url,
        publisher = {
            name: "HumaniQ AI",
            logo: "https://humaniqai.com.br/logo.png"
        }
    } = props;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image || "https://humaniqai.com.br/og-image.png",
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "author": {
            "@type": "Person",
            "name": author.name,
            ...(author.jobTitle && { "jobTitle": author.jobTitle }),
            ...(author.url && { "url": author.url })
        },
        "publisher": {
            "@type": "Organization",
            "name": publisher.name,
            "logo": {
                "@type": "ImageObject",
                "url": publisher.logo
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        }
    };
}
