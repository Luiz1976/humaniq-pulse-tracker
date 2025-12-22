# Setup OpenRouter API Keys no Supabase REMOTO
# Execute este script para configurar as chaves NO PROJETO REMOTO

Write-Host "Configurando OpenRouter API Keys no Supabase REMOTO..." -ForegroundColor Cyan
Write-Host "Projeto: wdjggjsxsvexqrhyizrn" -ForegroundColor Yellow

# Navegar para o diretorio do projeto
Set-Location "c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker"

$PROJECT_REF = "wdjggjsxsvexqrhyizrn"

# Configurar as 13 chaves do OpenRouter NO PROJETO REMOTO
Write-Host "`nConfigurando chave 1/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_1="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"

Write-Host "`nConfigurando chave 2/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_2="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"

Write-Host "`nConfigurando chave 3/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_3="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"

Write-Host "`nConfigurando chave 4/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_4="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"

Write-Host "`nConfigurando chave 5/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_5="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"

Write-Host "`nConfigurando chave 6/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_6="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"

Write-Host "`nConfigurando chave 7/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_7="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"

Write-Host "`nConfigurando chave 8/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_8="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"

Write-Host "`nConfigurando chave 9/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_9="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"

Write-Host "`nConfigurando chave 10/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_10="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"

Write-Host "`nConfigurando chave 11/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_11="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"

Write-Host "`nConfigurando chave 12/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_12="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"

Write-Host "`nConfigurando chave 13/13..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF OPENROUTER_API_KEY_13="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"

Write-Host "`nTodas as chaves configuradas no projeto remoto!`n" -ForegroundColor Green

Write-Host "Verificando secrets remotos..." -ForegroundColor Cyan
npx supabase secrets list --project-ref $PROJECT_REF

Write-Host "`nProximo passo: As Edge Functions ja foram deployadas e pegarao os novos secrets automaticamente!" -ForegroundColor Cyan
Write-Host "Aguarde 1-2 minutos e teste novamente a geracao de posts." -ForegroundColor White
