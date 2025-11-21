# 🚀 Script de Inicialização - OdontoX com Docker

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  OdontoX - Setup com Docker" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está rodando
Write-Host "📦 Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Select-String "Server Version"

if (-not $dockerRunning) {
    Write-Host "❌ Docker Desktop não está rodando!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abra o Docker Desktop" -ForegroundColor White
    Write-Host "2. Aguarde até o ícone ficar verde na bandeja" -ForegroundColor White
    Write-Host "3. Execute este script novamente" -ForegroundColor White
    Write-Host ""
    Write-Host "Deseja abrir o Docker Desktop agora? (S/N)" -ForegroundColor Yellow
    $response = Read-Host

    if ($response -eq "S" -or $response -eq "s") {
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        Write-Host "Aguardando Docker iniciar..." -ForegroundColor Yellow
        Write-Host "Pressione ENTER quando o Docker estiver rodando (ícone verde)" -ForegroundColor Yellow
        Read-Host
    } else {
        exit 1
    }
}

Write-Host "✅ Docker está rodando!" -ForegroundColor Green
Write-Host ""

# Subir containers
Write-Host "🐳 Iniciando containers PostgreSQL e pgAdmin..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao iniciar containers!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Containers iniciados!" -ForegroundColor Green
Write-Host ""

# Aguardar PostgreSQL ficar pronto
Write-Host "⏳ Aguardando PostgreSQL inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$retries = 0
$maxRetries = 30

while ($retries -lt $maxRetries) {
    $health = docker inspect --format='{{.State.Health.Status}}' odontox-postgres 2>&1

    if ($health -eq "healthy") {
        Write-Host "✅ PostgreSQL está pronto!" -ForegroundColor Green
        break
    }

    Write-Host "  Aguardando... ($retries/$maxRetries)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "⚠️  Timeout aguardando PostgreSQL" -ForegroundColor Yellow
    Write-Host "  Continuando mesmo assim..." -ForegroundColor Gray
}

Write-Host ""

# Configurar Backend
Write-Host "⚙️  Configurando Backend..." -ForegroundColor Yellow
Set-Location backend

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    npm install
}

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao gerar Prisma Client!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Criar banco e migrations
Write-Host "🗄️  Criando banco de dados..." -ForegroundColor Yellow
npx prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Banco de dados criado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Verificando se banco já existe..." -ForegroundColor Yellow
    npx prisma migrate deploy
}

# Popular banco
Write-Host "🌱 Populando banco com dados de teste..." -ForegroundColor Yellow
npx prisma db seed

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  ✅ SETUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Informações de acesso
Write-Host "🌐 URLs de Acesso:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:3001" -ForegroundColor White
Write-Host "  API Docs:  http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "  pgAdmin:   http://localhost:5050" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Credenciais de Teste:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Admin:    admin@odontox.com / admin123" -ForegroundColor White
Write-Host "  Doutor:   dr.silva@odontox.com / admin123" -ForegroundColor White
Write-Host ""

Write-Host "🔐 Acesso pgAdmin:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Email:    admin@odontox.com" -ForegroundColor White
Write-Host "  Senha:    admin123" -ForegroundColor White
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer iniciar os servidores
Write-Host "Deseja iniciar os servidores agora? (S/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando Backend..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Em outro terminal, execute:" -ForegroundColor Cyan
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
    Write-Host ""

    npm run start:dev
} else {
    Write-Host ""
    Write-Host "Para iniciar manualmente:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm run start:dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""

    Set-Location ..
}
