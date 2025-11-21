# 🐳 DOCKER SETUP - OdontoX

Este guia mostra como configurar o ambiente completo usando Docker.

## 📋 Pré-requisitos

1. **Docker Desktop para Windows**
   - Baixe: https://www.docker.com/products/docker-desktop/
   - Instale e inicie o Docker Desktop
   - Aguarde até o ícone do Docker ficar verde na bandeja

## 🚀 Iniciar Ambiente

### 1️⃣ Iniciar Docker Desktop
Certifique-se que o Docker Desktop está rodando (ícone verde na bandeja do Windows)

### 2️⃣ Subir os Containers
Na raiz do projeto, execute:

```powershell
docker-compose up -d
```

Isso vai criar:
- ✅ **PostgreSQL** na porta 5432
- ✅ **pgAdmin** na porta 5050 (interface visual para o banco)

### 3️⃣ Verificar se Está Rodando
```powershell
docker-compose ps
```

Você deve ver 2 containers rodando:
- `odontox-postgres` - UP
- `odontox-pgadmin` - UP

### 4️⃣ Configurar o Backend
Na pasta `backend`:

```powershell
# Copiar arquivo de ambiente para Docker
Copy-Item .env.docker .env

# Gerar Prisma Client
npx prisma generate

# Criar banco de dados e tabelas
npx prisma migrate dev --name init

# Popular com dados de teste
npx prisma db seed

# Iniciar servidor
npm run start:dev
```

### 5️⃣ Iniciar Frontend
Em outro terminal, na pasta `frontend`:

```powershell
npm run dev
```

## 🎯 Acessar a Aplicação

### Frontend
- URL: http://localhost:3000
- Login: `admin@odontox.com` / `admin123`

### Backend (API)
- URL: http://localhost:3001
- Docs: http://localhost:3001/api/docs

### pgAdmin (Interface Visual do Banco)
- URL: http://localhost:5050
- Email: `admin@odontox.com`
- Senha: `admin123`

#### Conectar ao PostgreSQL no pgAdmin:
1. Faça login no pgAdmin
2. Clique em "Add New Server"
3. Na aba "General":
   - Name: `OdontoX Local`
4. Na aba "Connection":
   - Host: `host.docker.internal` (ou `localhost`)
   - Port: `5432`
   - Database: `odontox`
   - Username: `postgres`
   - Password: `postgres`
5. Salve

## 🛠️ Comandos Úteis

### Ver Logs dos Containers
```powershell
# Todos os containers
docker-compose logs -f

# Apenas PostgreSQL
docker-compose logs -f postgres

# Apenas pgAdmin
docker-compose logs -f pgadmin
```

### Parar os Containers
```powershell
docker-compose stop
```

### Iniciar os Containers Novamente
```powershell
docker-compose start
```

### Parar e Remover Containers
```powershell
docker-compose down
```

### Parar e Remover Tudo (inclusive volumes/dados)
```powershell
docker-compose down -v
```

### Resetar Banco de Dados
```powershell
# Na pasta backend
npx prisma migrate reset
npx prisma db seed
```

### Acessar o Container PostgreSQL
```powershell
docker exec -it odontox-postgres psql -U postgres -d odontox
```

Comandos úteis dentro do PostgreSQL:
```sql
-- Listar tabelas
\dt

-- Ver dados de usuários
SELECT * FROM "User";

-- Ver dados de pacientes
SELECT * FROM "Patient";

-- Sair
\q
```

## 📊 Estrutura dos Volumes

Os dados são persistidos em volumes Docker:
- `postgres_data` - Dados do banco PostgreSQL
- `pgadmin_data` - Configurações do pgAdmin

Isso significa que seus dados **não serão perdidos** quando você parar os containers.

## 🔄 Workflow de Desenvolvimento

### Dia a Dia
```powershell
# 1. Iniciar Docker (se não estiver rodando)
docker-compose up -d

# 2. Terminal 1 - Backend
cd backend
npm run start:dev

# 3. Terminal 2 - Frontend
cd frontend
npm run dev

# 4. Desenvolver...

# 5. Ao finalizar o dia
docker-compose stop
```

### Resetar Tudo (Fresh Start)
```powershell
# Parar e remover tudo
docker-compose down -v

# Subir novamente
docker-compose up -d

# Recriar banco
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 🐛 Troubleshooting

### ❌ Erro: "port is already allocated"
**Problema:** Porta 5432 ou 5050 já está em uso

**Solução:**
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :5432

# Parar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F

# Ou mudar a porta no docker-compose.yml
# Ex: "5433:5432" para PostgreSQL
```

### ❌ Erro: "Error response from daemon"
**Problema:** Docker Desktop não está rodando

**Solução:**
1. Abra o Docker Desktop
2. Aguarde até ficar verde
3. Execute `docker-compose up -d` novamente

### ❌ Erro: "Can't reach database server"
**Problema:** Container PostgreSQL não está saudável

**Solução:**
```powershell
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar container
docker-compose restart postgres

# Aguardar 10 segundos e testar novamente
```

### ❌ pgAdmin não carrega
**Problema:** Container pgAdmin demorou para iniciar

**Solução:**
```powershell
# Ver logs
docker-compose logs pgadmin

# Aguardar 30-60 segundos após o comando up
# pgAdmin demora mais para iniciar

# Acessar: http://localhost:5050
```

## 🎓 Dicas

### Usar Prisma Studio (Alternativa ao pgAdmin)
```powershell
cd backend
npx prisma studio
```
Abre em: http://localhost:5555

### Backup do Banco de Dados
```powershell
docker exec odontox-postgres pg_dump -U postgres odontox > backup.sql
```

### Restaurar Backup
```powershell
cat backup.sql | docker exec -i odontox-postgres psql -U postgres -d odontox
```

### Ver uso de recursos
```powershell
docker stats
```

## ✅ Checklist de Funcionamento

- [ ] Docker Desktop instalado e rodando
- [ ] `docker-compose up -d` executado sem erros
- [ ] `docker-compose ps` mostra 2 containers UP
- [ ] http://localhost:5050 carrega o pgAdmin
- [ ] Backend conecta no banco sem erros
- [ ] Frontend faz login com sucesso
- [ ] Dados persistem após `docker-compose restart`

## 🔗 Links Úteis

- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Docker Compose Docs: https://docs.docker.com/compose/
- PostgreSQL Docker Hub: https://hub.docker.com/_/postgres
- pgAdmin Docker Hub: https://hub.docker.com/r/dpage/pgadmin4/

---

**🎉 Pronto! Seu ambiente Docker está configurado!**
