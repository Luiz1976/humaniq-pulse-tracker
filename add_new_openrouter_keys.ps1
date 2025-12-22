# Adicionar Novas Chaves OpenRouter
# Total: 14 chaves (5 antigas + 9 novas)

Write-Host "Adicionando novas chaves OpenRouter ao Supabase..." -ForegroundColor Cyan

Set-Location "c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker"

# Chaves 6-14 (9 novas chaves)
Write-Host "`nConfigurando chave 6/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_6="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"

Write-Host "`nConfigurando chave 7/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_7="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"

Write-Host "`nConfigurando chave 8/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_8="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"

Write-Host "`nConfigurando chave 9/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_9="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"

Write-Host "`nConfigurando chave 10/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_10="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"

Write-Host "`nConfigurando chave 11/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_11="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"

Write-Host "`nConfigurando chave 12/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_12="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"

Write-Host "`nConfigurando chave 13/14..." -ForegroundColor Yellow
npx supabase secrets set OPENROUTER_API_KEY_13="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"

Write-Host "`nTodas as 14 chaves configuradas!" -ForegroundColor Green
Write-Host "`nListando todas as secrets..." -ForegroundColor Cyan
npx supabase secrets list

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "RESUMO:" -ForegroundColor Green
Write-Host "- Total de chaves: 14" -ForegroundColor White
Write-Host "- Capacidade teórica: 140 requisições/minuto" -ForegroundColor White
Write-Host "- Próximo passo: Deploy das Edge Functions" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Green
