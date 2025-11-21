# 🚀 Scripts de Setup - OdontoX

## Windows (PowerShell)

### Setup Completo do Projeto

```powershell
# Navegue até a pasta do projeto
cd saas-odonto

# Backend Setup
Write-Host "🔧 Configurando Backend..." -ForegroundColor Green
cd backend
npm install
Copy-Item .env.example .env
Write-Host "⚠️  Configure o arquivo backend\.env com suas credenciais do PostgreSQL" -ForegroundColor Yellow
Read-Host "Pressione ENTER após configurar o .env"

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

Write-Host "✅ Backend configurado!" -ForegroundColor Green

# Frontend Setup
cd ..\frontend
Write-Host "🔧 Configurando Frontend..." -ForegroundColor Green
npm install
Copy-Item .env.example .env
Write-Host "✅ Frontend configurado!" -ForegroundColor Green

Write-Host "🎉 Setup concluído! Execute os comandos abaixo em terminais separados:" -ForegroundColor Green
Write-Host "Terminal 1: cd backend && npm run start:dev" -ForegroundColor Cyan
Write-Host "Terminal 2: cd frontend && npm run dev" -ForegroundColor Cyan
```

### Iniciar Desenvolvimento

```powershell
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 (novo terminal) - Frontend
cd frontend
npm run dev
```

### Reset do Banco de Dados

```powershell
cd backend
npx prisma migrate reset
npx prisma db seed
```

## Linux/Mac (Bash)

### Setup Completo do Projeto

```bash
#!/bin/bash

# Navegue até a pasta do projeto
cd saas-odonto

# Backend Setup
echo "🔧 Configurando Backend..."
cd backend
npm install
cp .env.example .env
echo "⚠️  Configure o arquivo backend/.env com suas credenciais do PostgreSQL"
read -p "Pressione ENTER após configurar o .env"

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

echo "✅ Backend configurado!"

# Frontend Setup
cd ../frontend
echo "🔧 Configurando Frontend..."
npm install
cp .env.example .env
echo "✅ Frontend configurado!"

echo "🎉 Setup concluído! Execute os comandos abaixo em terminais separados:"
echo "Terminal 1: cd backend && npm run start:dev"
echo "Terminal 2: cd frontend && npm run dev"
```

### Iniciar Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 (novo terminal) - Frontend
cd frontend
npm run dev
```

### Reset do Banco de Dados

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

## Docker Setup (Opcional)

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: odontox_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: odontox
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: odontox_backend
    restart: always
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/odontox?schema=public
      JWT_SECRET: your-super-secret-jwt-key
      JWT_REFRESH_SECRET: your-super-secret-refresh-key
      PORT: 3001
    ports:
      - '3001:3001'
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    container_name: odontox_frontend
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

### Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reset completo (apaga dados)
docker-compose down -v
```

## Troubleshooting

### Problema: Erro ao conectar ao PostgreSQL

**Solução:**
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no .env
3. Teste a conexão:
```bash
psql -U postgres -h localhost
```

### Problema: Porta 3000 ou 3001 já em uso

**Windows:**
```powershell
# Ver processos na porta
netstat -ano | findstr :3000
# Matar processo (substitua PID)
taskkill /PID [número] /F
```

**Linux/Mac:**
```bash
# Ver processos na porta
lsof -i :3000
# Matar processo
kill -9 [PID]
```

### Problema: node_modules corrompido

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

### Problema: Prisma Client desatualizado

```bash
cd backend
npx prisma generate
```

## Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/odontox?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
PORT=3001
NODE_ENV="development"

# Upload (opcional)
MAX_FILE_SIZE=5242880
UPLOAD_FOLDER="./uploads"
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Scripts Úteis

### Backup do Banco

```bash
# Criar backup
pg_dump -U postgres odontox > backup.sql

# Restaurar backup
psql -U postgres odontox < backup.sql
```

### Verificar Saúde do Sistema

```bash
# Backend
curl http://localhost:3001/

# Frontend
curl http://localhost:3000/
```

### Logs de Desenvolvimento

```bash
# Backend com logs detalhados
cd backend
npm run start:debug

# Frontend com logs
cd frontend
npm run dev -- --debug
```

## Checklist Pós-Instalação

- [ ] PostgreSQL instalado e rodando
- [ ] Node.js 18+ instalado
- [ ] Dependências do backend instaladas
- [ ] Dependências do frontend instaladas
- [ ] Arquivo .env do backend configurado
- [ ] Arquivo .env do frontend configurado
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Backend rodando em http://localhost:3001
- [ ] Frontend rodando em http://localhost:3000
- [ ] Swagger acessível em http://localhost:3001/api/docs
- [ ] Login funcional com credenciais de teste

## Próximos Passos

1. ✅ Faça login com uma das credenciais de teste
2. ✅ Explore o dashboard
3. ✅ Cadastre um novo paciente
4. ✅ Crie um agendamento
5. ✅ Teste as notificações
6. ✅ Explore a documentação da API no Swagger

---

💡 **Dica:** Mantenha sempre dois terminais abertos - um para o backend e outro para o frontend durante o desenvolvimento.
