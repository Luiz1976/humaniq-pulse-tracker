import { Helmet } from 'react-helmet-async';

interface SchemaOrgProps {
    schema: object | object[];
}

export function SchemaOrg({ schema }: SchemaOrgProps) {
    const schemas = Array.isArray(schema) ? schema : [schema];

    return (
        <Helmet>
            {schemas.map((s, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
}
