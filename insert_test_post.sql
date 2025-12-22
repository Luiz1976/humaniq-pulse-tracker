INSERT INTO website_content_posts (
    id,
    route,
    slug,
    title,
    excerpt,
    content,
    image_url,
    status,
    priority,
    created_at,
    published_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'blog',
    'post-de-teste-seo',
    'Teste de Frontend e SEO HumaniQ',
    'Este é um post de teste para verificar a renderização do frontend público e as meta tags de SEO.',
    '# Teste de Renderização

Este conteúdo deve ser renderizado como markdown.

## Subtítulo de Teste

- Item 1
- Item 2

### Autoridade

> Citação de teste.

[Link para NR-01](/nr01)
    ',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'published',
    'high',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
