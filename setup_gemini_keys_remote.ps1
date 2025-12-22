# Setup Gemini API Keys no Supabase REMOTO
# Execute este script para configurar as chaves Gemini NO PROJETO REMOTO

Write-Host "Configurando Gemini API Keys no Supabase REMOTO..." -ForegroundColor Cyan
Write-Host "Projeto: wdjggjsxsvexqrhyizrn" -ForegroundColor Yellow

# Navegar para o diretorio do projeto
Set-Location "c:\Users\ALICEBELLA\Desktop\NOVO HQ PULSE\humaniq-pulse-tracker"

$PROJECT_REF = "wdjggjsxsvexqrhyizrn"

# Configurar as 6 chaves do Gemini API NO PROJETO REMOTO
Write-Host "`nConfigurando chave 1/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_1="AIzaSyBOWLfdQQdtbZN0LUYaptqnXoj9FP-DUQM"

Write-Host "`nConfigurando chave 2/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_2="AIzaSyAbS6BOUfd1xrEBFLbGEzkhZzbyBux0VM4"

Write-Host "`nConfigurando chave 3/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_3="AIzaSyD2HhuQN79zM-2Qfa2GteIDqEqY-wbwAx8"

Write-Host "`nConfigurando chave 4/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_4="AIzaSyBWe1nwowMZD4hcShS1BwLnu1Rvo1zWCL0"

Write-Host "`nConfigurando chave 5/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_5="AIzaSyCR8E-1TgDlbYr4XK0NzF_3upBkfd8ClSs"

Write-Host "`nConfigurando chave 6/6..." -ForegroundColor Yellow
npx supabase secrets set --project-ref $PROJECT_REF GEMINI_API_KEY_6="AIzaSyCyuiGivBgHQ0lNGLxm2wiezMgpRs7N2xc"

Write-Host "`nTodas as 6 chaves Gemini configuradas no projeto remoto!`n" -ForegroundColor Green

Write-Host "Verificando secrets remotos..." -ForegroundColor Cyan
npx supabase secrets list --project-ref $PROJECT_REF

Write-Host "`nProximo passo: Atualizar Edge Function para usar Gemini API" -ForegroundColor Cyan
Write-Host "As chaves estarao disponiveis em 1-2 minutos." -ForegroundColor White
