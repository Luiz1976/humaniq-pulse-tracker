# Setup OpenRouter API Keys no Supabase
# Execute este script para configurar as 5 chaves fornecidas

Write-Host "Configurando OpenRouter API Keys no Supabase..." -ForegroundColor Cyan

# Navegar para o diretorio do projeto
Set-Location "c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker"

# Configurar as 5 chaves do OpenRouter
Write-Host "`nConfigurando chave 1/5..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_1="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"

Write-Host "`nConfigurando chave 2/5..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_2="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"

Write-Host "`nConfigurando chave 3/5..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_3="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"

Write-Host "`nConfigurando chave 4/5..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_4="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"

Write-Host "`nConfigurando chave 5/5..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_5="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"

Write-Host "`nTodas as chaves configuradas com sucesso!" -ForegroundColor Green
Write-Host "`nListando secrets configurados..." -ForegroundColor Cyan
npx supabase secrets list

Write-Host "`nProximo passo: Deploy da Edge Function" -ForegroundColor Cyan
Write-Host "Execute: npx supabase functions deploy website-generate-content" -ForegroundColor White
