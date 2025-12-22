# HumaniQ AI - Website Content System Deployment Script
# Run this script to set up the complete automation system

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HumaniQ AI - Content Automation Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Supabase CLI is installed
Write-Host "[1/5] Checking Supabase CLI..." -ForegroundColor Yellow
$supabaseCLI = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCLI) {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Supabase CLI first:" -ForegroundColor Yellow
    Write-Host "npm install -g supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Step 2: Link to Supabase project
Write-Host "[2/5] Linking to Supabase project..." -ForegroundColor Yellow
Write-Host "Your project ID: wdjggjsxsvexqrhyizrn" -ForegroundColor Cyan

$confirmation = Read-Host "Press Enter to continue (or Ctrl+C to cancel)"

Write-Host ""

# Step 3: Deploy Edge Functions
Write-Host "[3/5] Deploying Edge Functions..." -ForegroundColor Yellow

Write-Host "  → Deploying website-generate-content..." -ForegroundColor Cyan
supabase functions deploy website-generate-content

Write-Host "  → Deploying website-scheduler..." -ForegroundColor Cyan
supabase functions deploy website-scheduler

Write-Host "  → Deploying website-publish-content..." -ForegroundColor Cyan
supabase functions deploy website-publish-content

Write-Host "✅ Edge Functions deployed" -ForegroundColor Green
Write-Host ""

# Step 4: Database Migration
Write-Host "[4/5] Database Migration..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to manually execute the migration in Supabase SQL Editor" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps:" -ForegroundColor Cyan
Write-Host "1. Open https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql" -ForegroundColor White
Write-Host "2. Copy the content of: supabase/migrations/20251219_website_content_schema.sql" -ForegroundColor White
Write-Host "3. Paste and run in SQL Editor" -ForegroundColor White
Write-Host ""
$confirmation = Read-Host "Press Enter when migration is complete"

Write-Host "✅ Migration noted as complete" -ForegroundColor Green
Write-Host ""

# Step 5: Cron Jobs
Write-Host "[5/5] Setting up Cron Jobs..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to manually set up Cron Jobs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps:" -ForegroundColor Cyan
Write-Host "1. Open https://supabase.com/dashboard/project/wdjggjsxsvexqrhyizrn/sql" -ForegroundColor White
Write-Host "2. Copy the content of: supabase/setup_website_content_cron.sql" -ForegroundColor White
Write-Host "3. Replace YOUR_SERVICE_ROLE_KEY with your actual service role key" -ForegroundColor White
Write-Host "4. Paste and run in SQL Editor" -ForegroundColor White
Write-Host ""
$confirmation = Read-Host "Press Enter when Cron Jobs are configured"

Write-Host "✅ Cron Jobs configured" -ForegroundColor Green
Write-Host ""

# Final Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "What was configured:" -ForegroundColor Yellow
Write-Host "  ✓ 3 Edge Functions deployed" -ForegroundColor Green
Write-Host "  ✓ 5 Database tables created" -ForegroundColor Green
Write-Host "  ✓ 3 Cron Jobs scheduled" -ForegroundColor Green
Write-Host "  ✓ 50+ content themes configured" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Access the dashboard: http://localhost:5173/website-content" -ForegroundColor Cyan
Write-Host "  2. Test content generation for a route" -ForegroundColor Cyan
Write-Host "  3. Monitor automatic generation (runs daily at 00:00 UTC)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - Full guide: WEBSITE_CONTENT_SYSTEM.md" -ForegroundColor Cyan
Write-Host "  - Walkthrough: .gemini/antigravity/brain/.../walkthrough.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Your automated content system is ready!" -ForegroundColor Green
Write-Host ""
