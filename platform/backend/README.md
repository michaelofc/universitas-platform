# UNIVERSITAS Backend

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Configurar banco de dados
```bash
# Criar banco PostgreSQL
createdb universitas

# Executar schema
psql -d universitas -f ../../database/schema.sql
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

API estará rodando em: `http://localhost:3001`

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/signup` — Criar conta
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Dados do usuário logado (requer token)

### Ciclos
- `GET /api/ciclos` — Listar ciclos
- `GET /api/ciclos/:id` — Detalhes + módulos
- `POST /api/ciclos/:id/inscrever` — Inscrever-se

### Módulos
- `GET /api/modulos/:id` — Detalhes + aulas + exercícios
- `GET /api/modulos/:id/aulas/:aulaId` — Conteúdo da aula

### Progresso
- `GET /api/progresso` — Meu progresso geral
- `GET /api/progresso/modulo/:moduloId` — Progresso em módulo

### Entregas
- `POST /api/entregas` — Submeter exercício/desafio
- `GET /api/entregas` — Listar minhas entregas
- `GET /api/entregas/:id` — Ver entrega + avaliações

### IA
- `POST /api/ia/chat` — Chat com IA (3 modos)

## 🔑 Autenticação

Todas as rotas protegidas requerem header:
```
Authorization: Bearer <token>
```

## ✅ Teste a API

```bash
# Health check
curl http://localhost:3001/health

# Criar usuário
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Login (salve o token retornado)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Listar ciclos (sem auth)
curl http://localhost:3001/api/ciclos

# Ver meus dados (com auth)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📦 Estrutura de Pastas

```
src/
├── config/
│   └── database.ts        # Configuração PostgreSQL
├── middleware/
│   ├── auth.middleware.ts # Autenticação JWT
│   └── error.middleware.ts # Tratamento de erros
├── routes/
│   ├── auth.routes.ts
│   ├── ciclos.routes.ts
│   ├── modulos.routes.ts
│   ├── progresso.routes.ts
│   ├── entregas.routes.ts
│   └── ia.routes.ts
├── services/
│   └── ia.service.ts      # Integração OpenAI
└── index.ts               # Entry point
```

## 🛠️ Scripts

- `npm run dev` — Desenvolvimento (hot reload)
- `npm run build` — Build para produção
- `npm start` — Rodar produção

## 🔒 Segurança

- Helmet.js configurado
- CORS configurado
- JWT para autenticação
- Bcrypt para senhas
- SQL prepared statements (anti-injection)

## 📝 Próximos Passos

- [ ] Adicionar mais rotas (mentorias, produtos vendáveis)
- [ ] Implementar rate limiting
- [ ] Adicionar testes (Jest)
- [ ] Configurar CI/CD
- [ ] Deploy (Railway/Fly.io)

---

**© 2026 UNIVERSITAS**
