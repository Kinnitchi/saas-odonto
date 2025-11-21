# 🚀 INÍCIO RÁPIDO - OdontoX

## 🎯 Escolha seu método de instalação:

### 🐳 Opção 1: Docker (RECOMENDADO - Mais Fácil)

#### Pré-requisito:
- Docker Desktop instalado e rodando

#### Passo a Passo:
1. **Abra o Docker Desktop** e aguarde ficar verde
2. **Execute o script:**
   ```powershell
   .\start-docker.ps1
   ```
3. **Aguarde** a configuração automática (2-3 minutos)
4. **Acesse:** http://localhost:3000
5. **Login:** `admin@odontox.com` / `admin123`

✅ **Pronto! Tudo configurado automaticamente!**

📚 **Guia completo:** `README-DOCKER.md`

---

### 💻 Opção 2: Instalação Local (PostgreSQL Nativo)

#### Pré-requisitos:
- Node.js 18+
- PostgreSQL 14+ instalado
- npm

#### Passo a Passo:
1. **Configure o .env do backend:**
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/odontox"
   ```

2. **Backend:**
   ```powershell
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run start:dev
   ```

3. **Frontend (outro terminal):**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. **Acesse:** http://localhost:3000

📚 **Guia completo:** `QUICK-START.md`

---

## 🌐 URLs de Acesso

| Serviço      | URL                            | Credenciais                  |
| ------------ | ------------------------------ | ---------------------------- |
| **Frontend** | http://localhost:3000          | admin@odontox.com / admin123 |
| **Backend**  | http://localhost:3001          | -                            |
| **API Docs** | http://localhost:3001/api/docs | -                            |
| **pgAdmin**  | http://localhost:5050          | admin@odontox.com / admin123 |

---

## 📚 Documentação Completa

- **README-DOCKER.md** - Guia rápido Docker
- **DOCKER-SETUP.md** - Documentação completa Docker
- **QUICK-START.md** - Instalação local
- **DELIVERY-REPORT.md** - Relatório do projeto
- **README.md** - Documentação técnica completa

---

## 🛑 Parar Aplicação

### Docker:
```powershell
.\stop-docker.ps1
```

### Local:
Pressione `Ctrl+C` nos terminais

---

## ❌ Problemas?

### Docker não inicia
1. Abra o Docker Desktop
2. Aguarde ficar verde (1-2 min)
3. Execute o script novamente

### Porta ocupada
```powershell
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### Resetar tudo (Docker)
```powershell
docker-compose down -v
.\start-docker.ps1
```

---

## 🎓 Próximos Passos

1. ✅ Login no sistema
2. 📊 Explorar o Dashboard
3. 👨‍⚕️ Cadastrar doutores
4. 👤 Cadastrar pacientes
5. 📅 Agendar consultas

---

## 📞 Suporte

- Logs Backend: No terminal do backend
- Logs Frontend: Console do navegador (F12)
- Logs Docker: `docker-compose logs -f`

---

**🎉 Desenvolvido com ❤️ por OdontoX Team**
