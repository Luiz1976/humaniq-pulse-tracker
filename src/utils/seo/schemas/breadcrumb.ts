export interface BreadcrumbItem {
    name: string;
    url: string;
}

export interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function generateBreadcrumbSchema(props: BreadcrumbSchemaProps) {
    const { items } = props;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}
