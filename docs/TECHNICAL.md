# 📖 Documentação Técnica - OdontoX

## Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Banco de Dados](#banco-de-dados)
4. [Autenticação](#autenticação)
5. [Módulos](#módulos)
6. [Boas Práticas](#boas-práticas)

## Visão Geral

O OdontoX é um sistema SaaS completo para gestão de clínicas odontológicas que segue os princípios SOLID e Clean Architecture.

### Princípios Aplicados

**SOLID:**
- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Subtipos devem ser substituíveis
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependa de abstrações

**Clean Architecture:**
- Separação de camadas (Controllers, Services, Repositories)
- Independência de frameworks
- Testabilidade
- Independência de UI e Database

## Arquitetura

### Backend (NestJS)

```
┌─────────────────────────────────────────┐
│           Controllers                    │  ← HTTP Layer
│  (Recebe requests, valida, retorna)     │
├─────────────────────────────────────────┤
│             Services                     │  ← Business Logic
│    (Lógica de negócio, orquestração)    │
├─────────────────────────────────────────┤
│            Repositories                  │  ← Data Access
│      (Prisma - acesso ao banco)          │
├─────────────────────────────────────────┤
│            Database                      │  ← PostgreSQL
│         (Armazenamento)                  │
└─────────────────────────────────────────┘
```

### Frontend (Next.js 14)

```
┌─────────────────────────────────────────┐
│          Pages/Routes                    │  ← App Router
│    (Páginas e rotas da aplicação)       │
├─────────────────────────────────────────┤
│          Components                      │  ← UI Components
│     (Componentes reutilizáveis)         │
├─────────────────────────────────────────┤
│         Store (Zustand)                  │  ← State Management
│      (Estado global da aplicação)       │
├─────────────────────────────────────────┤
│        API Client (Axios)                │  ← HTTP Client
│    (Comunicação com o backend)          │
└─────────────────────────────────────────┘
```

## Banco de Dados

### Schema Prisma

#### User
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  name         String
  role         UserRole @default(RECEPTIONIST)
  isActive     Boolean  @default(true)
  refreshToken String?
}
```

#### Doctor
```prisma
model Doctor {
  id           String   @id @default(cuid())
  userId       String   @unique
  cro          String   @unique
  specialty    String
  photoUrl     String?
  workSchedule Json
  isActive     Boolean  @default(true)
}
```

#### Patient
```prisma
model Patient {
  id            String       @id @default(cuid())
  name          String
  cpf           String       @unique
  phone         String
  email         String?
  dateOfBirth   DateTime?
  address       String?
  dentalHistory String?      @db.Text
  tags          PatientTag[] @default([REGULAR])
  isActive      Boolean      @default(true)
}
```

#### Appointment
```prisma
model Appointment {
  id          String            @id @default(cuid())
  patientId   String
  doctorId    String
  scheduledAt DateTime
  duration    Int               @default(60)
  status      AppointmentStatus @default(SCHEDULED)
  notes       String?           @db.Text
  diagnosis   String?           @db.Text
  treatment   String?           @db.Text
}
```

### Relacionamentos

```
User 1─────1 Doctor
Doctor 1─────N Appointment
Patient 1─────N Appointment
Patient 1─────N Attachment
User 1─────N Notification
```

## Autenticação

### Fluxo JWT

```
1. Cliente envia email/senha
2. Backend valida credenciais
3. Backend gera accessToken (15min) e refreshToken (7 dias)
4. Cliente armazena tokens
5. Cliente usa accessToken em requests
6. Quando accessToken expira, usa refreshToken
7. Backend valida refreshToken e gera novo accessToken
```

### Guards e Strategies

**JwtAuthGuard:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async getProtectedData(@Req() req) {
  return req.user; // Usuário autenticado
}
```

**RolesGuard:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Post('admin-only')
async adminAction() {
  // Apenas admins acessam
}
```

## Módulos

### 1. Auth Module

**Responsabilidades:**
- Login/Logout
- Registro de usuários
- Refresh de tokens
- Validação de autenticação

**Principais arquivos:**
- `auth.controller.ts` - Rotas de autenticação
- `auth.service.ts` - Lógica de autenticação
- `jwt.strategy.ts` - Estratégia JWT Passport
- `jwt-auth.guard.ts` - Guard de autenticação

### 2. Doctors Module

**Responsabilidades:**
- CRUD de doutores
- Gestão de horários
- Listagem com filtros

**Endpoints:**
```typescript
POST   /doctors      - Criar (Admin)
GET    /doctors      - Listar todos
GET    /doctors/:id  - Buscar um
PATCH  /doctors/:id  - Atualizar (Admin/Doctor)
DELETE /doctors/:id  - Deletar (Admin)
```

### 3. Patients Module

**Responsabilidades:**
- CRUD de pacientes
- Busca e filtros
- Gestão de etiquetas
- Anexos

**Características:**
- Busca por nome, CPF, telefone, email
- Filtro por tags
- Histórico completo
- Anexos de documentos

### 4. Appointments Module

**Responsabilidades:**
- CRUD de agendamentos
- Verificação de conflitos
- Filtros por doutor/paciente/data
- Listagem de próximos

**Validações:**
- Não permite conflito de horários
- Verifica existência de doutor e paciente
- Duração mínima de 15 minutos

### 5. Dashboard Module

**Responsabilidades:**
- Estatísticas em tempo real
- Visão geral do dia
- Dados semanais/mensais
- Atividades recentes

**Métricas:**
- Atendimentos do dia
- Consultas em andamento
- Total de pacientes
- Doutores ativos

### 6. Notifications Module

**Responsabilidades:**
- Notificações internas
- Contador de não lidas
- Marcação como lida

## Boas Práticas

### Backend

**1. DTOs (Data Transfer Objects)**
```typescript
export class CreatePatientDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  cpf: string;
}
```

**2. Validation Pipes**
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

**3. Exception Handling**
```typescript
if (!patient) {
  throw new NotFoundException('Patient not found');
}
```

**4. Swagger Documentation**
```typescript
@ApiTags('Patients')
@ApiOperation({ summary: 'Get all patients' })
@ApiBearerAuth()
@Get()
async findAll() { }
```

### Frontend

**1. Custom Hooks**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['patients'],
  queryFn: () => api.get('/patients'),
});
```

**2. Estado Global (Zustand)**
```typescript
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => { },
  logout: () => { },
}));
```

**3. Componentes Reutilizáveis**
```typescript
<Button variant="primary" size="lg">
  Salvar
</Button>
```

**4. Type Safety**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST';
}
```

## Performance

### Backend
- Indexação de campos frequentemente buscados
- Eager loading de relacionamentos quando necessário
- Paginação em listas grandes
- Cache de dados estáticos

### Frontend
- React Query para cache de requisições
- Lazy loading de componentes
- Otimização de imagens
- Code splitting

## Segurança

### Implementações
- ✅ Hash de senhas com bcrypt
- ✅ JWT com expiração curta
- ✅ Refresh tokens
- ✅ CORS configurado
- ✅ Validação de inputs
- ✅ Guards de autenticação
- ✅ Guards de autorização (roles)

### Recomendações para Produção
- Implementar rate limiting
- HTTPS obrigatório
- Logs de auditoria
- Sanitização de inputs
- Proteção contra SQL Injection (Prisma já protege)
- Proteção contra XSS
- CSRF tokens

## Testes

### Backend
```bash
# Unitários
npm run test

# E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

### Frontend
```bash
npm run test
```

## Monitoramento

### Logs
- Winston para logs estruturados
- Diferentes níveis (error, warn, info, debug)
- Rotação de logs

### Métricas
- Tempo de resposta de APIs
- Taxa de erro
- Uso de recursos
- Requisições por segundo

---

Para mais informações, consulte o README.md principal.
