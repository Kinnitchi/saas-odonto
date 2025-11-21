# 🛑 Script para Parar - OdontoX

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  OdontoX - Parar Containers" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛑 Parando containers..." -ForegroundColor Yellow
docker-compose stop

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers parados!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao parar containers!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deseja remover os containers? (S/N)" -ForegroundColor Yellow
Write-Host "  S - Remove containers (mantém dados)" -ForegroundColor Gray
Write-Host "  N - Apenas para (pode iniciar depois com docker-compose start)" -ForegroundColor Gray
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🗑️  Removendo containers..." -ForegroundColor Yellow
    docker-compose down

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers removidos!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao remover containers!" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "Deseja remover TODOS os dados? (S/N)" -ForegroundColor Red
    Write-Host "  ⚠️  ATENÇÃO: Isso vai apagar o banco de dados!" -ForegroundColor Yellow
    $response2 = Read-Host

    if ($response2 -eq "S" -or $response2 -eq "s") {
        Write-Host ""
        Write-Host "🗑️  Removendo volumes (dados)..." -ForegroundColor Red
        docker-compose down -v
        Write-Host "✅ Todos os dados foram removidos!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  ✅ CONCLUÍDO!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Para iniciar novamente:" -ForegroundColor Cyan
Write-Host "  .\start-docker.ps1" -ForegroundColor White
Write-Host ""
