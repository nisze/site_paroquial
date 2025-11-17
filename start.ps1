# Script de Inicialização do Sistema Paroquial
# Executa: docker compose up -d --build

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   SISTEMA PAROQUIAL - INICIANDO CONTAINERS" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está instalado
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker detectado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker não encontrado! Instale o Docker primeiro." -ForegroundColor Red
    Write-Host "  Download: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "Iniciando containers..." -ForegroundColor Yellow
Write-Host ""

# Executar docker compose
docker compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "   ✓ CONTAINERS INICIADOS COM SUCESSO!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Aguarde alguns minutos para o build completo..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Acesse a aplicação em:" -ForegroundColor Cyan
    Write-Host "  • Frontend:    http://localhost" -ForegroundColor White
    Write-Host "  • Backend API: http://localhost:8081" -ForegroundColor White
    Write-Host "  • H2 Console:  http://localhost:8081/h2-console" -ForegroundColor White
    Write-Host ""
    Write-Host "Para ver logs: docker compose logs -f" -ForegroundColor Gray
    Write-Host "Para parar:    docker compose down" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✗ Erro ao iniciar containers!" -ForegroundColor Red
    Write-Host "Verifique se as portas 80 e 8081 estão disponíveis." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Gray
pause
