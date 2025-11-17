# Script para Parar o Sistema Paroquial
# Executa: docker compose down

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   SISTEMA PAROQUIAL - PARANDO CONTAINERS" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Parando containers..." -ForegroundColor Yellow
docker compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Containers parados com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Erro ao parar containers!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Gray
pause
