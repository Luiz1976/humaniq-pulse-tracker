export interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
    telephone?: string;
    email?: string;
    address?: {
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
    };
    sameAs?: string[];
}

export function generateOrganizationSchema(props: OrganizationSchemaProps = {}) {
    const {
        name = "HumaniQ AI",
        url = "https://humaniqai.com.br",
        logo = "https://humaniqai.com.br/logo.png",
        description = "Plataforma completa para gestão de Segurança e Saúde do Trabalho (SST) com foco em NR-01 e riscos psicossociais",
        telephone,
        email,
        address,
        sameAs = []
    } = props;

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": logo,
        "description": description,
        ...(telephone && { "telephone": telephone }),
        ...(email && { "email": email }),
        ...(address && {
            "address": {
                "@type": "PostalAddress",
                ...address
            }
        }),
        ...(sameAs.length > 0 && { "sameAs": sameAs })
    };
}
