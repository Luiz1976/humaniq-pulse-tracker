# 🧪 Guia de Testes - Funcionalidades SEO

## Pré-requisitos

✅ Servidor rodando: `npm run dev` (já está rodando)  
✅ Navegador com DevTools aberto (F12)

---

## 1. Testar Schema.org (JSON-LD) 🔍

### Passo 1: Verificar no HTML

1. Abra qualquer post do blog no navegador: `http://localhost:8080/blog/[slug-do-post]`
2. Abra DevTools (F12) → Aba **Elements**
3. Procure por `<script type="application/ld+json">`
4. Você deve ver algo assim:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título do Post",
  "author": {
    "@type": "Person",
    "name": "Dr. Carlos Mendes"
  }
}
```

### Passo 2: Validar com Google Rich Results Test

**Online** (necessita URL pública):
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do post
3. Clique em "Test URL"

**Offline** (código HTML):
1. Clique com botão direito na página → "View Page Source"
2. Copie todo o HTML
3. Acesse: https://validator.schema.org/
4. Cole o HTML
5. Clique em "Run Test"

✅ **Resultado esperado**: Nenhum erro, Schema Article detectado

---

## 2. Testar Interlinking Automático 🔗

### Teste no Console do Navegador

1. Abra DevTools (F12) → Aba **Console**
2. Cole este código:

```javascript
// Simular a função de interlinking
const testContent = `
A NR-01 estabelece requisitos importantes.
Empresas precisam gerenciar riscos psicossociais.
Um software especializado pode ajudar na adequação.
Para dúvidas, consulte nosso FAQ.
`;

console.log("Conteúdo original:", testContent);

// Para testar a detecção, você precisaria importar a função
// Por enquanto, verifique manualmente em posts existentes
```

### Teste Manual em Post

1. Acesse: `http://localhost:8080/blog/[algum-post]`
2. Leia o conteúdo e procure por links azuis/sublinhados
3. Verifique se existem links para:
   - `/nr01`
   - `/riscos-psicossociais`
   - `/software-nr01`
   - `/faq`

✅ **Resultado esperado**: Links contextualizados inseridos automaticamente

---

## 3. Testar Related Posts (Leia Também) 📚

### Passo 1: Verificar Renderização

1. Acesse qualquer post: `http://localhost:8080/blog/[slug]`
2. **Role até o final** do artigo
3. Procure pela seção **"📚 Leia Também"**
4. Deve mostrar **3 cards** com posts relacionados

### Passo 2: Verificar Similaridade

**No Console do Navegador** (F12 → Console):

```javascript
// Verificar se posts foram carregados
console.log('Related posts carregados');
```

**Verificar Visualmente**:
- Os posts sugeridos têm títulos **relacionados** ao post atual?
- Se o post é sobre "NR-01", os relacionados falam de SST/compliance?

✅ **Resultado esperado**: 3 posts relevantes exibidos

---

## 4. Testar Sitemap.xml 🗺️

### Método 1: Gerar e Baixar

**No Console do Navegador**:

```javascript
// Cole este código no console
async function testSitemap() {
  const { generateSitemap } = await import('/src/utils/seo/sitemap.ts');
  const xml = await generateSitemap();
  console.log(xml);
  
  // Baixar
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  a.click();
}

testSitemap();
```

### Método 2: Verificar Estrutura

O sitemap gerado deve ter:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://humaniqai.com.br/nr01</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Mais URLs aqui -->
</urlset>
```

### Validar Sitemap

1. Acesse: https://www.xml-sitemaps.com/validate-xml-sitemap.html
2. Cole o conteúdo do sitemap.xml gerado
3. Clique em "Validate"

✅ **Resultado esperado**: XML válido, sem erros

---

## 5. Testar Robots.txt 🤖

### Verificar Arquivo

1. Abra: `c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker\public\robots.txt`
2. Deve conter:

```
User-agent: *
Allow: /

Sitemap: https://humaniqai.com.br/sitemap.xml

Disallow: /api/
Disallow: /admin/
```

### Testar em Produção (futuro)

Quando deployar, acesse: `https://humaniqai.com.br/robots.txt`

✅ **Resultado esperado**: Arquivo acessível publicamente

---

## 6. Teste Completo end-to-end 🎯

### Cenário: Criar um Post de Teste

1. **Criar post no banco** com este conteúdo:

```sql
INSERT INTO website_content (
  title,
  slug,
  content,
  summary,
  status,
  created_at
) VALUES (
  'Como Implementar NR-01 na Sua Empresa',
  'implementar-nr01-empresa',
  'A NR-01 estabelece diretrizes importantes para gestão de riscos psicossociais. Empresas devem mapear estes riscos usando software especializado.',
  'Guia prático de implementação da NR-01',
  'published',
  NOW()
);
```

2. **Acessar o post**: `http://localhost:8080/blog/implementar-nr01-empresa`

3. **Verificar cada funcionalidade**:

#### ✅ Schema.org
- [ ] Abrir DevTools → Elements
- [ ] Encontrar `<script type="application/ld+json">`
- [ ] Verificar Article schema presente

#### ✅ Interlinking
- [ ] Ler o conteúdo
- [ ] Verificar se "NR-01" está linkado para `/nr01`
- [ ] Verificar se "riscos psicossociais" está linkado para `/riscos-psicossociais`
- [ ] Verificar se "software" está linkado para `/software-nr01`

#### ✅ Related Posts
- [ ] Rolar até o final
- [ ] Ver seção "📚 Leia Também"
- [ ] Verificar 3 posts relacionados

#### ✅ Meta Tags
- [ ] DevTools → Elements → `<head>`
- [ ] Verificar `<meta property="og:title">`
- [ ] Verificar `<meta name="description">`
- [ ] Verificar `<link rel="canonical">`

---

## 7. Testes Automatizados (Opcional) 🤖

### Criar Arquivo de Teste

Crie: `src/utils/seo/__tests__/interlinking.test.ts`

```typescript
import { detectKeywords, insertLinks } from '../interlinking';

describe('Interlinking', () => {
  test('detecta keywords corretamente', () => {
    const text = 'A NR-01 estabelece riscos psicossociais';
    const keywords = detectKeywords(text);
    
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.some(k => k.key === 'nr01')).toBe(true);
  });

  test('insere links automaticamente', () => {
    const text = 'A NR-01 é importante';
    const result = insertLinks(text, 1);
    
    expect(result).toContain('[');
    expect(result).toContain('](/nr01)');
  });
});
```

**Rodar testes**:
```bash
npm test
```

---

## 8. Checklist Final ✅

Antes de considerar pronto, verifique:

### Schema.org
- [ ] JSON-LD aparece no HTML
- [ ] Article schema válido
- [ ] Breadcrumb schema válido
- [ ] Sem erros no validator

### Interlinking
- [ ] Keywords são detectadas
- [ ] Links inseridos corretamente
- [ ] Anchor text varia
- [ ] Máximo de links respeitado

### Related Posts
- [ ] Componente renderiza
- [ ] 3 posts aparecem
- [ ] Posts são relevantes
- [ ] Links funcionam

### Sitemap
- [ ] XML gerado corretamente
- [ ] Todas as páginas incluídas
- [ ] Formato válido
- [ ] Robots.txt referencia sitemap

### Performance
- [ ] Página carrega em < 3s
- [ ] Sem erros no console
- [ ] Sem warnings no console

---

## 9. Ferramentas Úteis 🛠️

### Validação
- **Schema.org**: https://validator.schema.org/
- **Google Rich Results**: https://search.google.com/test/rich-results
- **Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

### Debug
- **React DevTools**: Verificar componentes
- **Browser DevTools**: Network, Console, Elements

### SEO
- **Lighthouse** (DevTools): Auditar SEO
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

## 10. Troubleshooting 🔧

### Problema: Schema não aparece

**Solução**:
1. Verificar se `SchemaOrg` foi importado
2. Verificar se está dentro do componente
3. Verificar console para erros

### Problema: Links não inseridos

**Solução**:
1. Verificar se conteúdo tem keywords
2. Verificar mapping em `interlinking.ts`
3. Testar `detectKeywords()` manualmente

### Problema: Related Posts vazio

**Solução**:
1. Verificar se há posts no banco
2. Verificar tabela `website_content`
3. Verificar status = 'published'

### Problema: Sitemap vazio

**Solução**:
1. Verificar conexão Supabase
2. Verificar posts publicados
3. Verificar query no sitemap.ts

---

## Resultado Esperado Final 🎉

Ao finalizar todos os testes, você deve ter:

✅ Posts com **Rich Snippets** prontos  
✅ Links internos **automáticos** e **semânticos**  
✅ Seção **"Leia Também"** funcionando  
✅ **Sitemap.xml** gerado dinamicamente  
✅ **Robots.txt** otimizado  

**Pronto para aumentar CTR em 30-50%!** 🚀
