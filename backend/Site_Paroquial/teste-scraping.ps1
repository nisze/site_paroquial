# Script de teste para Web Scraping da API dos Santos
# Execute este script com o backend rodando em localhost:8080

Write-Host "=== TESTE DE WEB SCRAPING - API DOS SANTOS ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:8080/api/santos"

# Função para testar endpoint
function Test-Endpoint {
    param($url, $description)
    Write-Host "Testando: $description" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET
        Write-Host "✅ Sucesso!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3 | Write-Host
    } catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Função para testar POST endpoint
function Test-PostEndpoint {
    param($url, $description)
    Write-Host "Testando: $description" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method POST
        Write-Host "✅ Sucesso!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3 | Write-Host
    } catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "1. Verificando status do serviço de scraping..." -ForegroundColor Cyan
Test-Endpoint "$baseUrl/scraping/status" "Status do Web Scraping"

Write-Host "2. Testando conectividade com sites católicos..." -ForegroundColor Cyan
Test-PostEndpoint "$baseUrl/scraping/testar" "Teste de Conectividade"

Write-Host "3. Buscando santo do dia atual..." -ForegroundColor Cyan
Test-PostEndpoint "$baseUrl/scraping/hoje" "Santo do Dia Atual (Web Scraping)"

Write-Host "4. Buscando São Francisco de Assis (4 de outubro)..." -ForegroundColor Cyan
Test-PostEndpoint "$baseUrl/scraping/data/4/10" "São Francisco de Assis"

Write-Host "5. Verificando santos já salvos no banco..." -ForegroundColor Cyan
Test-Endpoint "$baseUrl" "Lista de Santos Salvos"

Write-Host "6. Buscando santo do dia via API normal..." -ForegroundColor Cyan
Test-Endpoint "$baseUrl/hoje" "Santo do Dia (API Normal)"

Write-Host ""
Write-Host "=== TESTE CONCLUÍDO ===" -ForegroundColor Green
Write-Host ""
Write-Host "💡 COMO USAR:" -ForegroundColor Blue
Write-Host "1. Para coletar santo do dia: POST /api/santos/scraping/hoje"
Write-Host "2. Para coletar por data: POST /api/santos/scraping/data/{dia}/{mes}"
Write-Host "3. Para coletar mês inteiro: POST /api/santos/scraping/mes/{mes}"
Write-Host "4. Para consultar dados salvos: GET /api/santos/*"
Write-Host ""