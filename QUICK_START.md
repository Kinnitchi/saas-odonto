# 🚀 Guia Rápido - OdontoX

## ✅ Configuração Completa

Todas as credenciais e configurações foram preparadas! Siga os passos abaixo:

### 1. Banco de Dados (Docker)

Os containers já estão rodando:
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`

Credenciais do Banco:
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `odontox`

### 2. Iniciar o Backend

```bash
cd backend
npm run start:dev
```

O backend estará disponível em: `http://localhost:3001`
Documentação Swagger: `http://localhost:3001/api/docs`

### 3. Iniciar o Frontend

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### 4. Credenciais de Login

Use uma das credenciais abaixo para fazer login:

#### 👨‍💼 Admin
- **Email**: `admin@odontox.com`
- **Senha**: `admin123`

#### 👨‍⚕️ Dentista
- **Email**: `dr.silva@odontox.com`
- **Senha**: `admin123`

#### 👩‍💼 Recepcionista
- **Email**: `recepcao@odontox.com`
- **Senha**: `admin123`

## 🔧 Arquivos de Configuração Criados

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odontox?schema=public"
JWT_SECRET="odontox-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="odontox-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Dados de Exemplo

O banco de dados já foi populado com:
- ✅ 3 usuários (Admin, Dentista, Recepcionista)
- ✅ 1 perfil de dentista completo
- ✅ 2 pacientes de exemplo
- ✅ 2 consultas agendadas

## 🐛 Solução de Problemas

### Erro de conexão com o banco
```bash
cd backend/infra
docker compose up -d
```

### Banco vazio
```bash
cd backend
npx prisma db push
npx prisma db seed
```

### Erro de CORS
Verifique se o backend e frontend estão rodando nas portas corretas (3001 e 3000)

## 📝 Endpoints Principais

### Autenticação
- `POST /auth/login` - Fazer login
- `POST /auth/register` - Registrar usuário
- `GET /auth/profile` - Perfil do usuário
- `POST /auth/logout` - Fazer logout

### Pacientes
- `GET /patients` - Listar pacientes
- `POST /patients` - Criar paciente
- `GET /patients/:id` - Buscar paciente
- `PATCH /patients/:id` - Atualizar paciente

### Consultas
- `GET /appointments` - Listar consultas
- `POST /appointments` - Agendar consulta
- `GET /appointments/upcoming` - Próximas consultas
- `PATCH /appointments/:id` - Atualizar consulta

### Dashboard
- `GET /dashboard/overview` - Visão geral
- `GET /dashboard/weekly` - Estatísticas semanais
- `GET /dashboard/monthly` - Estatísticas mensais

## 🎯 Próximos Passos

1. Acesse `http://localhost:3000/login`
2. Faça login com uma das credenciais acima
3. Explore o sistema:
   - **Dashboard**: `http://localhost:3000/dashboard`
   - **Pacientes**: `http://localhost:3000/dashboard/patients`
   - **Consultas**: `http://localhost:3000/dashboard/appointments`
   - **Dentistas**: `http://localhost:3000/dashboard/doctors`

## 📱 Funcionalidades Disponíveis

### Dashboard
- Visão geral de atendimentos
- Estatísticas em tempo real
- Consultas do dia
- Total de pacientes e dentistas

### Pacientes
- ✅ Listar todos os pacientes
- ✅ Cadastrar novo paciente
- ✅ Buscar pacientes
- ✅ Editar informações
- ✅ Remover paciente
- ✅ Tags e categorias (VIP, Regular, etc)

### Consultas
- ✅ Visualizar todas as consultas
- ✅ Agendar nova consulta
- ✅ Vincular paciente e dentista
- ✅ Definir data, hora e duração
- ✅ Atualizar status (Agendado, Em Andamento, Concluído, Cancelado)
- ✅ Adicionar observações

### Dentistas
- ✅ Listar todos os dentistas
- ✅ Visualizar especialidades
- ✅ Ver agenda de trabalho
- ✅ Status ativo/inativo
- ✅ Informações de contato

## 📚 Documentação

- **API Docs**: http://localhost:3001/api/docs
- **Arquitetura**: `/docs/ARCHITECTURE.md`
- **Setup**: `/docs/SETUP.md`
- **Roadmap**: `/docs/ROADMAP.md`
