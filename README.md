# 🦷 OdontoX - Sistema de Gestão para Clínicas Odontológicas

Sistema SaaS moderno e completo para gestão de clínicas odontológicas, desenvolvido com as melhores práticas de arquitetura de software.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js robusto e escalável
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para TypeScript
- **JWT** - Autenticação com tokens de acesso e refresh
- **Swagger** - Documentação automática da API
- **bcrypt** - Hash seguro de senhas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TailwindCSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes reutilizáveis e acessíveis
- **React Query** - Gerenciamento de estado assíncrono
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **Recharts** - Biblioteca de gráficos
- **React Big Calendar** - Componente de calendário

## 📋 Funcionalidades

### ✅ Autenticação e Autorização
- Login com email e senha
- Refresh tokens para sessões prolongadas
- Controle de acesso por roles (Admin, Doutor, Recepcionista)
- Guards para proteção de rotas

### 👨‍⚕️ Gestão de Doutores
- Cadastro completo com CRO e especialidade
- Upload de foto de perfil
- Configuração de horários de trabalho
- Status ativo/inativo
- Listagem e busca

### 👥 Gestão de Pacientes
- Cadastro completo com dados pessoais
- CPF, telefone, endereço
- Histórico odontológico
- Sistema de etiquetas (Prioridade, Retorno, Faltou, VIP)
- Anexos (RX, fotos, PDFs)
- Busca e filtros avançados

### 📅 Gestão de Agendamentos
- Criação de consultas
- Agendamento com data e hora
- Duração configurável
- Status: Agendado, Em Andamento, Concluído, Cancelado, Faltou
- Verificação de conflitos de horário
- Notas, diagnóstico e tratamento
- Listagem por doutor, paciente ou data

### 📊 Dashboard
- Visão geral do dia
- Total de atendimentos
- Consultas em andamento
- Estatísticas semanais e mensais
- Gráficos interativos
- Atividades recentes

### 🔔 Notificações
- Sistema de notificações internas
- Contador de não lidas
- Marcação individual ou em massa como lida

## 🏗️ Arquitetura

### Backend (Clean Architecture)
```
backend/
├── prisma/
│   ├── schema.prisma       # Schema do banco
│   └── seed.ts             # Dados iniciais
├── src/
│   ├── auth/               # Módulo de autenticação
│   │   ├── decorators/     # Decorators customizados
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── guards/         # Guards de autenticação
│   │   ├── strategies/     # Estratégias Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── doctors/            # Módulo de doutores
│   ├── patients/           # Módulo de pacientes
│   ├── appointments/       # Módulo de agendamentos
│   ├── dashboard/          # Módulo de dashboard
│   ├── notifications/      # Módulo de notificações
│   ├── prisma/             # Serviço do Prisma
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

### Frontend (Next.js 14 App Router)
```
frontend/
├── src/
│   ├── app/
│   │   ├── login/          # Página de login
│   │   ├── dashboard/      # Dashboard e módulos
│   │   ├── layout.tsx      # Layout principal
│   │   ├── page.tsx        # Página inicial
│   │   └── globals.css     # Estilos globais
│   ├── components/
│   │   ├── ui/             # Componentes shadcn/ui
│   │   └── providers.tsx   # Providers React Query
│   ├── hooks/              # Custom hooks
│   ├── lib/
│   │   ├── api.ts          # Cliente Axios configurado
│   │   └── utils.ts        # Funções utilitárias
│   └── store/
│       └── auth.ts         # Store de autenticação (Zustand)
└── package.json
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- PostgreSQL 14+
- Git

### 1. Clonar o repositório
```bash
git clone <url-do-repo>
cd saas-odonto
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais
DATABASE_URL="postgresql://usuario:senha@localhost:5432/odontox?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura"
JWT_REFRESH_SECRET="sua-chave-refresh-super-segura"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco com dados iniciais
npm run prisma:seed

# Iniciar servidor de desenvolvimento
npm run start:dev
```

O backend estará rodando em `http://localhost:3001`
Documentação Swagger em `http://localhost:3001/api/docs`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env
NEXT_PUBLIC_API_URL=http://localhost:3001

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 👤 Credenciais de Teste

Após rodar o seed, você terá acesso com:

**Administrador:**
- Email: `admin@odontox.com`
- Senha: `admin123`

**Doutor:**
- Email: `dr.silva@odontox.com`
- Senha: `admin123`

**Recepcionista:**
- Email: `recepcao@odontox.com`
- Senha: `admin123`

## 📚 API Endpoints

### Autenticação
```
POST   /auth/register      - Registrar novo usuário
POST   /auth/login         - Login
POST   /auth/refresh       - Refresh token
POST   /auth/logout        - Logout
GET    /auth/profile       - Perfil do usuário
```

### Doutores
```
POST   /doctors            - Criar doutor
GET    /doctors            - Listar doutores
GET    /doctors/:id        - Buscar doutor
PATCH  /doctors/:id        - Atualizar doutor
DELETE /doctors/:id        - Deletar doutor
GET    /doctors/schedules  - Listar agendas
```

### Pacientes
```
POST   /patients           - Criar paciente
GET    /patients           - Listar pacientes
GET    /patients/:id       - Buscar paciente
PATCH  /patients/:id       - Atualizar paciente
DELETE /patients/:id       - Deletar paciente
GET    /patients/stats     - Estatísticas
```

### Agendamentos
```
POST   /appointments       - Criar agendamento
GET    /appointments       - Listar agendamentos
GET    /appointments/:id   - Buscar agendamento
PATCH  /appointments/:id   - Atualizar agendamento
DELETE /appointments/:id   - Deletar agendamento
GET    /appointments/upcoming - Próximos agendamentos
```

### Dashboard
```
GET    /dashboard/overview - Visão geral
GET    /dashboard/weekly   - Estatísticas semanais
GET    /dashboard/monthly  - Estatísticas mensais
GET    /dashboard/activity - Atividades recentes
```

### Notificações
```
GET    /notifications      - Listar notificações
PATCH  /notifications/:id/read - Marcar como lida
POST   /notifications/read-all - Marcar todas como lidas
DELETE /notifications/:id - Deletar notificação
GET    /notifications/unread-count - Contador
```

## 🧪 Testes

```bash
# Backend
cd backend
npm run test          # Testes unitários
npm run test:e2e      # Testes e2e
npm run test:cov      # Cobertura

# Frontend
cd frontend
npm run test
```

## 🚀 Deploy

### Backend (Railway / Render / Heroku)
1. Configure as variáveis de ambiente
2. Configure o banco PostgreSQL
3. Execute as migrations
4. Deploy da aplicação

### Frontend (Vercel / Netlify)
1. Configure `NEXT_PUBLIC_API_URL`
2. Build: `npm run build`
3. Deploy

## 📝 Scripts Úteis

### Backend
```bash
npm run build          # Build produção
npm run start:prod     # Iniciar produção
npm run prisma:studio  # Interface visual do banco
npm run lint           # Lint código
npm run format         # Formatar código
```

### Frontend
```bash
npm run build          # Build produção
npm run start          # Iniciar produção
npm run lint           # Lint código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👨‍💻 Desenvolvedor

OdontoX - Sistema desenvolvido com ❤️ e ☕

---

**Nota:** Este é um projeto de demonstração. Para uso em produção, implemente medidas adicionais de segurança, validações e testes.
