# 🐳 GUIA RÁPIDO - Docker Setup

## ✅ Passo a Passo

### 1️⃣ Abrir Docker Desktop
- Abra o Docker Desktop no Windows
- Aguarde o ícone ficar **verde** na bandeja do sistema
- Isso pode levar 1-2 minutos

### 2️⃣ Executar Script de Inicialização
No PowerShell, na pasta raiz do projeto:

```powershell
.\start-docker.ps1
```

**O script vai:**
- ✅ Verificar se Docker está rodando
- ✅ Iniciar PostgreSQL e pgAdmin
- ✅ Aguardar banco ficar pronto
- ✅ Instalar dependências (se necessário)
- ✅ Configurar Prisma e criar banco
- ✅ Popular com dados de teste
- ✅ Oferecer para iniciar os servidores

### 3️⃣ Acessar a Aplicação
Após o script, você terá acesso a:

**Frontend:** http://localhost:3000
- Login: `admin@odontox.com` / `admin123`

**Backend:** http://localhost:3001
- API Docs: http://localhost:3001/api/docs

**pgAdmin:** http://localhost:5050
- Email: `admin@odontox.com`
- Senha: `admin123`

## 🔧 Comandos Manuais

Se preferir fazer manualmente:

```powershell
# 1. Subir containers
docker-compose up -d

# 2. Configurar backend
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 3. Iniciar backend
npm run start:dev

# 4. Em outro terminal - Iniciar frontend
cd frontend
npm run dev
```

## 🛑 Parar Tudo

```powershell
.\stop-docker.ps1
```

Ou manualmente:
```powershell
docker-compose stop
```

## 🔄 Reiniciar

```powershell
docker-compose start
```

## 📊 Ver Status

```powershell
docker-compose ps
```

## 📝 Ver Logs

```powershell
docker-compose logs -f
```

## 🗄️ Acessar Banco Diretamente

```powershell
docker exec -it odontox-postgres psql -U postgres -d odontox
```

## ❌ Troubleshooting

### Docker não está rodando
- Abra o Docker Desktop
- Aguarde ficar verde
- Execute novamente

### Porta já está em uso
```powershell
# Ver o que usa a porta 5432
netstat -ano | findstr :5432

# Matar processo
taskkill /PID <PID> /F
```

### Resetar tudo
```powershell
docker-compose down -v
.\start-docker.ps1
```

---

**📚 Documentação completa:** `DOCKER-SETUP.md`
