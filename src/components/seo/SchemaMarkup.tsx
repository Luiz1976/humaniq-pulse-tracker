
import { useEffect } from 'react';

interface SchemaProps {
    type: 'Organization' | 'WebSite' | 'Article' | 'TechArticle';
    data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaProps) {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';

        const schema = {
            '@context': 'https://schema.org',
            '@type': type,
            ...data
        };

        script.text = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [type, data]);

    return null;
}
