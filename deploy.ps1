# UNIVERSITAS - Deploy Automático na Vercel
# Execute este script para fazer deploy em 1 comando

Write-Host "🚀 UNIVERSITAS - Deploy na Vercel" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
Write-Host "📋 Verificando pré-requisitos..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git não encontrado! Instale: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Verificar se Vercel CLI está instalada
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Pré-requisitos OK!" -ForegroundColor Green
Write-Host ""

# Perguntar se já tem repositório Git
Write-Host "❓ Você já fez push do código para o GitHub? (s/n)" -ForegroundColor Yellow
$gitReady = Read-Host

if ($gitReady -eq 'n') {
    Write-Host ""
    Write-Host "📚 Siga estes passos primeiro:" -ForegroundColor Cyan
    Write-Host "1. Crie repositório no GitHub: https://github.com/new"
    Write-Host "2. Execute os comandos:"
    Write-Host ""
    Write-Host "   git init" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor White
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/SEU_USUARIO/universitas.git" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Execute este script novamente"
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "🎯 Fazendo deploy do FRONTEND..." -ForegroundColor Cyan

# Navegar para frontend
Set-Location "$PSScriptRoot\platform\frontend"

# Deploy na Vercel
Write-Host "📤 Executando: vercel --prod" -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Sua plataforma está online!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Acesse pelo smartphone usando a URL que apareceu acima" -ForegroundColor Cyan
Write-Host "🌐 Compartilhe com qualquer pessoa" -ForegroundColor Cyan
Write-Host ""

# Voltar ao diretório raiz
Set-Location "$PSScriptRoot"
