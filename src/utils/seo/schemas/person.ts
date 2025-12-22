export interface PersonSchemaProps {
    name: string;
    jobTitle?: string;
    description?: string;
    url?: string;
    image?: string;
    email?: string;
    worksFor?: {
        name: string;
        url?: string;
    };
    sameAs?: string[];
}

export function generatePersonSchema(props: PersonSchemaProps) {
    const {
        name,
        jobTitle,
        description,
        url,
        image,
        email,
        worksFor,
        sameAs = []
    } = props;

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        ...(jobTitle && { "jobTitle": jobTitle }),
        ...(description && { "description": description }),
        ...(url && { "url": url }),
        ...(image && { "image": image }),
        ...(email && { "email": email }),
        ...(worksFor && {
            "worksFor": {
                "@type": "Organization",
                "name": worksFor.name,
                ...(worksFor.url && { "url": worksFor.url })
            }
        }),
        ...(sameAs.length > 0 && { "sameAs": sameAs })
    };
}
