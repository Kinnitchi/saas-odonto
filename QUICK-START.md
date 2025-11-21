# 🚀 GUIA RÁPIDO DE INSTALAÇÃO - OdontoX

## ❌ PROBLEMA: "Não está logando"

**Causa:** O banco de dados PostgreSQL não está rodando!

---

## ✅ SOLUÇÃO: Escolha UMA das opções abaixo

### 📦 OPÇÃO 1: PostgreSQL Nativo (RECOMENDADO)

#### 1️⃣ Instalar PostgreSQL
1. Baixe em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. **IMPORTANTE:** Durante a instalação:
   - Defina a senha do usuário `postgres` (ex: `postgres`)
   - Anote esta senha!
   - Porta padrão: 5432
   - Instale tudo (PostgreSQL Server, pgAdmin, Command Line Tools)

#### 2️⃣ Configurar o Backend
Depois de instalado, **edite o arquivo:**
```
backend\.env
```

**Altere esta linha com sua senha:**
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/odontox?schema=public"
```

**Exemplo:** Se sua senha é `minhasenha123`:
```env
DATABASE_URL="postgresql://postgres:minhasenha123@localhost:5432/odontox?schema=public"
```

#### 3️⃣ Executar Comandos de Setup
Abra o PowerShell na pasta `backend` e execute:

```powershell
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados
npx prisma migrate dev --name init

# Popular com dados de teste
npx prisma db seed

# Iniciar servidor
npm run start:dev
```

#### 4️⃣ Iniciar Frontend
Abra **OUTRO** PowerShell na pasta `frontend` e execute:

```powershell
npm run dev
```

#### 5️⃣ Acessar o Sistema
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

**Credenciais de Teste:**
```
Admin:  admin@odontox.com / admin123
Doutor: dr.silva@odontox.com / admin123
```

---

### 🐳 OPÇÃO 2: Docker (SE JÁ TIVER INSTALADO)

#### 1️⃣ Iniciar Docker Desktop
- Abra o Docker Desktop no Windows
- Aguarde até ele ficar completamente iniciado (ícone na bandeja)

#### 2️⃣ Criar Container PostgreSQL
```powershell
docker run --name odontox-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=odontox `
  -p 5432:5432 `
  -d postgres:14
```

#### 3️⃣ Verificar se está Rodando
```powershell
docker ps
```

Você deve ver o container `odontox-postgres` na lista.

#### 4️⃣ Executar Comandos de Setup
Na pasta `backend`:
```powershell
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

#### 5️⃣ Iniciar Frontend
Na pasta `frontend`:
```powershell
npm run dev
```

---

## 🔍 VERIFICAR SE FUNCIONOU

### ✅ Backend Rodando
Você deve ver no terminal:
```
[Nest] 12345  - 21/11/2025, 10:30:45 AM     LOG [NestApplication] Nest application successfully started +2ms
```

### ✅ Frontend Rodando
Você deve ver:
```
- ready started server on [::]:3000, url: http://localhost:3000
```

### ✅ Login Funcionando
1. Acesse: http://localhost:3000
2. Use: `admin@odontox.com` / `admin123`
3. Deve redirecionar para o Dashboard

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "Can't reach database server"
**Problema:** PostgreSQL não está rodando

**Solução:**
- **Windows Services:** Procure "Serviços" → Encontre "postgresql-x64-14" → Clique em "Iniciar"
- **OU** Reinicie o computador
- **OU** Reinstale o PostgreSQL

### ❌ Erro: "P1001" ou "ECONNREFUSED"
**Problema:** Porta 5432 não está acessível

**Solução:**
1. Verifique se o PostgreSQL está rodando:
   ```powershell
   Get-Service postgresql*
   ```
2. Teste conexão:
   ```powershell
   psql -U postgres -h localhost
   ```

### ❌ Erro: "authentication failed"
**Problema:** Senha do PostgreSQL incorreta no .env

**Solução:**
1. Abra `backend\.env`
2. Corrija a senha na `DATABASE_URL`
3. Execute novamente: `npx prisma migrate dev`

### ❌ Frontend não conecta no Backend
**Problema:** Backend não está rodando ou URL incorreta

**Solução:**
1. Verifique se o backend está rodando em http://localhost:3001
2. Verifique `frontend\.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Reinicie o frontend: `Ctrl+C` → `npm run dev`

### ❌ Erro: "Module not found"
**Problema:** Dependências não instaladas

**Solução:**
```powershell
# No backend
cd backend
npm install

# No frontend
cd frontend
npm install
```

---

## 📝 CHECKLIST DE INSTALAÇÃO

- [ ] PostgreSQL instalado e rodando
- [ ] Arquivo `backend\.env` configurado com senha correta
- [ ] Arquivo `frontend\.env` criado
- [ ] `npm install` executado no backend
- [ ] `npm install` executado no frontend
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado (sem erros)
- [ ] `npx prisma db seed` executado (mostra credenciais)
- [ ] Backend rodando em http://localhost:3001
- [ ] Frontend rodando em http://localhost:3000
- [ ] Login funcionando com `admin@odontox.com / admin123`

---

## 🎯 COMANDOS RÁPIDOS

### Resetar Banco de Dados
```powershell
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Ver Banco de Dados Visualmente
```powershell
cd backend
npx prisma studio
```
Abre em: http://localhost:5555

### Parar Tudo
```powershell
# Backend: Ctrl+C no terminal
# Frontend: Ctrl+C no terminal
```

### Iniciar Tudo de Novo
```powershell
# Terminal 1 (Backend)
cd backend
npm run start:dev

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

---

## 📞 AINDA COM PROBLEMAS?

1. Verifique os logs do backend e frontend nos terminais
2. Abra o Console do Navegador (F12) e veja erros
3. Verifique se as portas 3000, 3001 e 5432 não estão em uso
4. Reinicie o computador e tente novamente

---

**💡 DICA:** Mantenha 2 terminais abertos - um para backend, outro para frontend!
