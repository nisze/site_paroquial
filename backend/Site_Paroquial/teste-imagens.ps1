#  TESTE DO SISTEMA DE IMAGENS LEGAIS PARA SANTOS
Write-Host "=== SISTEMA DE IMAGENS LEGAIS - TESTE ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:8080/api/santos"

function Test-ImagemSanto {
    param($nomeSanto, $descricao)
    
    Write-Host " Testando: $descricao" -ForegroundColor Cyan
    Write-Host "   Santo: $nomeSanto" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/imagem/$nomeSanto" -Method Get -ContentType "application/json"
        Write-Host "    URL Gerada: $($response.imagem_url)" -ForegroundColor Green
        Write-Host "    Fonte Segura: $($response.fonte_segura)" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "    Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host " Iniciando testes do sistema de imagens legais..." -ForegroundColor Blue
Write-Host ""

# Testes com santos populares
Test-ImagemSanto "São Francisco de Assis" "Santo com imagem mapeada"
Test-ImagemSanto "Santa Teresinha" "Santa popular"
Test-ImagemSanto "São Antônio" "Santo conhecido"
Test-ImagemSanto "Nossa Senhora Aparecida" "Padroeira do Brasil"

# Testes com santos não mapeados (vai gerar placeholder)
Test-ImagemSanto "São João" "Santo sem imagem específica"

Write-Host "=== RESUMO DO SISTEMA ===" -ForegroundColor Blue
Write-Host ""
Write-Host " Fontes Aprovadas:" -ForegroundColor Green
Write-Host "   - Wikimedia Commons (domínio público)"
Write-Host "   - Vatican Official (uso educacional)"
Write-Host "   - Placeholders personalizados"
Write-Host ""
Write-Host " Fontes NÃO Aprovadas:" -ForegroundColor Red
Write-Host "   - Canção Nova (copyright)"
Write-Host "   - Sites comerciais"
Write-Host ""
Write-Host "=== TESTE CONCLUÍDO ===" -ForegroundColor Green
