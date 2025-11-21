@echo off
chcp 65001 >nul
color 0B

echo ====================================
echo   🐳 OdontoX - Docker Setup
echo ====================================
echo.

echo 📦 Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ Docker Desktop não está rodando!
    echo.
    echo Por favor:
    echo   1. Abra o Docker Desktop
    echo   2. Aguarde o ícone ficar verde
    echo   3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

color 0A
echo ✅ Docker está rodando!
echo.

color 0E
echo 🐳 Iniciando containers...
docker-compose up -d

if %errorlevel% neq 0 (
    color 0C
    echo ❌ Erro ao iniciar containers!
    pause
    exit /b 1
)

color 0A
echo ✅ Containers iniciados!
echo.

color 0E
echo ⏳ Aguardando PostgreSQL (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Pronto para usar!
echo.
color 0B
echo 📝 Execute agora:
echo   .\start-docker.ps1
echo.
echo Ou manualmente:
echo   cd backend
echo   npm run start:dev
echo.
pause
