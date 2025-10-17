# Quick Deploy Script for Fly.io

Write-Host "🚀 Deploying Backend to Fly.io..." -ForegroundColor Cyan

# Check if fly CLI is installed
if (!(Get-Command fly -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Fly CLI not found. Installing..." -ForegroundColor Red
    powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
    Write-Host "✅ Fly CLI installed. Please restart terminal and run this script again." -ForegroundColor Green
    exit
}

# Launch app (if first time)
Write-Host "📦 Launching Fly.io app..." -ForegroundColor Yellow
fly launch --no-deploy

# Set secrets
Write-Host "🔐 Setting environment variables..." -ForegroundColor Yellow
fly secrets set MONGODB_URI="mongodb+srv://emithru:emit_cmrit_2025@fsdproject.hojgqql.mongodb.net/Live-poll"
fly secrets set NODE_ENV="production"

# Deploy
Write-Host "🚢 Deploying..." -ForegroundColor Yellow
fly deploy

# Show info
Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
fly info
Write-Host "`n📝 Your API URL: https://$(fly info --json | ConvertFrom-Json).hostname" -ForegroundColor Cyan
Write-Host "   Use this URL in your frontend .env.production file!" -ForegroundColor Cyan
