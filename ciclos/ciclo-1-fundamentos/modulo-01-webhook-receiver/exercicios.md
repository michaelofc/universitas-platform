# Exercícios Práticos — Módulo 1: Webhook Receiver

## Objetivo

Consolidar conhecimento através da prática. Estes exercícios vão de simples a complexo, forçando você a **pensar** e **construir**, não apenas copiar.

**Regras:**
- Não há gabarito detalhado
- Você deve pesquisar e resolver sozinho
- Se travar >3h, peça ajuda (ChatGPT, docs, comunidade)
- Código deve funcionar, não "quase funcionar"

---

## Exercício 1: Servidor HTTP Básico (Fundação)

**Dificuldade:** ⭐☆☆☆☆

### Requisitos

Criar um servidor Express que:
1. Rode na porta 3000
2. Tenha endpoint `GET /` que retorna `{"status":"online"}`
3. Tenha endpoint `GET /health` que retorna `{"healthy":true,"timestamp":...}`
4. Log todas requisições no formato: `[TIMESTAMP] METHOD PATH`

### Entregáveis

- Arquivo `server.js` funcional
- README com instruções de setup
- Print do terminal mostrando logs

### Validação

```bash
curl http://localhost:3000/
# Deve retornar: {"status":"online"}

curl http://localhost:3000/health
# Deve retornar: {"healthy":true,"timestamp":1234567890}
```

---

## Exercício 2: Webhook Receiver Simples

**Dificuldade:** ⭐⭐☆☆☆

### Requisitos

Criar endpoint `POST /webhook` que:
1. Aceita JSON no body
2. Extrai campos: `event`, `data`, `timestamp`
3. Valida que `event` não está vazio
4. Retorna `200` se válido, `400` se inválido
5. Loga evento recebido no console

### Entregáveis

- Código funcionalhttps://claude.site/artifacts/55e972ab-6a50-4286-9b22-d93af0fd10c1
- 3 exemplos de curl (válido, inválido, edge case)

### Validação

```bash
# Válido
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"payment","data":{"amount":100},"timestamp":123}'

# Inválido (sem event)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":{"amount":100}}'
# Deve retornar 400
```

---

## Exercício 3: Validação HMAC

**Dificuldade:** ⭐⭐⭐☆☆

### Requisitos

Implementar validação de signature:
1. Secret configurado via `.env`
2. Cliente envia signature no header `X-Signature`
3. Servidor calcula HMAC do body
4. Compara com signature recebida
5. Retorna `401` se inválida

### Entregáveis

- Código com validação funcionando
- `.env.example` com SECRET
- Script `test-webhook.js` que gera signature válida e testa

### Validação

```javascript
// test-webhook.js
const crypto = require('crypto');

const secret = 'meu_secret';
const payload = JSON.stringify({ event: 'test' });
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log(`Signature: ${signature}`);
// Usar em curl
```

**Teste:**
- Signature válida → 200
- Signature inválida → 401
- Sem signature → 401

---

## Exercício 4: Persistência em SQLite

**Dificuldade:** ⭐⭐⭐⭐☆

### Requisitos

Integrar banco de dados:
1. Criar tabela `webhooks` com: `id`, `event_type`, `payload`, `received_at`
2. Ao receber webhook válido, salvar no banco
3. Endpoint `GET /webhooks` retorna últimos 10 eventos
4. Endpoint `GET /webhooks/:id` retorna evento específico
5. Prevenir duplicatas (idempotência por `id`)

### Entregáveis

- Código completo
- Arquivo `webhooks.db` (com alguns dados de teste)
- README explicando estrutura do banco

### Validação

```bash
# Enviar 5 webhooks
for i in {1..5}; do
  curl -X POST http://localhost:3000/webhook \
    -H "Content-Type: application/json" \
    -H "X-Signature: SIGNATURE_VALIDA" \
    -d "{\"id\":\"evt_$i\",\"event\":\"test\"}"
done

# Listar
curl http://localhost:3000/webhooks
# Deve mostrar 5 eventos

# Enviar duplicata
curl -X POST http://localhost:3000/webhook \
  -d '{"id":"evt_1",...}'
# Não deve duplicar no banco
```

---

## Exercício 5: Webhook Receiver Profissional

**Dificuldade:** ⭐⭐⭐⭐⭐

### Requisitos

Sistema completo de produção:
1. Validação HMAC com timing-safe comparison
2. Verificação de timestamp (rejeitar >5min antigos)
3. Idempotência (não reprocessar duplicatas)
4. Rate limiting (max 100 req/min)
5. Logging estruturado (arquivo `webhooks.log`)
6. Endpoint `/stats` com estatísticas
7. Error handling robusto
8. Variáveis de ambiente
9. Estrutura de pastas profissional
10. README detalhado

### Estrutura Esperada

```
webhook-receiver/
├── server.js           # Entrada principal
├── db.js               # Conexão banco
├── routes/
│   ├── webhooks.js     # Rotas de webhook
│   └── stats.js        # Estatísticas
├── middleware/
│   ├── validate.js     # Validação signature
│   ├── logger.js       # Logging
│   └── rateLimit.js    # Rate limiting
├── .env.example        # Template de variáveis
├── README.md           # Documentação completa
├── package.json
└── webhooks.db         # Banco (gitignore)
```

### Entregáveis

- Repositório Git público
- README com:
  - Setup instructions
  - Exemplos de uso
  - Explicação de segurança
  - Como testar localmente
- Vídeo de 5min demonstrando funcionamento

### Validação

**Checklist do avaliador:**
- [ ] Clone e `npm install` funciona
- [ ] Servidor sobe sem erros
- [ ] Webhook com signature válida salva no banco
- [ ] Webhook com signature inválida retorna 401
- [ ] Webhook duplicado não reprocessa
- [ ] Rate limit funciona (101ª requisição = 429)
- [ ] `/stats` retorna dados corretos
- [ ] Logs são criados em arquivo
- [ ] Código está bem organizado
- [ ] README é claro e completo

---

## Exercício 6: Produto Vendável

**Dificuldade:** ⭐⭐⭐⭐⭐ (Comercial)

### Requisitos

Transformar Exercício 5 em produto:
1. Dashboard HTML simples (`/dashboard`)
   - Lista últimos 50 eventos
   - Filtro por tipo
   - Refresh automático (30s)
2. Documentação de venda
   - O que é
   - Para quem vende
   - Quanto cobrar
   - ROI do cliente
3. Deploy em produção (Railway, Render, ou Heroku)
4. Video pitch de 10min

### Entregáveis

- URL pública funcionando
- Dashboard acessível
- Documento de venda (PDF ou MD)
- Vídeo pitch (YouTube, Loom, ou similar)
- Proposta de preço justificada

### Critérios de Avaliação

- **Funcionalidade** (30%): Tudo funciona perfeitamente
- **UI/UX** (20%): Dashboard é intuitivo
- **Documentação** (20%): Cliente consegue entender sozinho
- **Comercial** (30%): Pitch é convincente, preço é justificado

**Se você fizer isso bem:** Tem seu primeiro produto vendável.

---

## Desafios Extras (Opcional)

### Desafio A: Múltiplos Providers

Suportar webhooks de 3 serviços diferentes:
- Stripe (signature em `Stripe-Signature`)
- GitHub (signature em `X-Hub-Signature-256`)
- Typeform (signature em `Typeform-Signature`)

Cada um tem formato diferente. Criar middleware que detecta automaticamente.

### Desafio B: Webhook Replay

Sistema para reprocessar webhooks:
- Endpoint `POST /webhooks/:id/replay`
- Busca evento no banco
- Reprocessa (envia para fila)
- Útil quando processamento original falhou

### Desafio C: Webhook Forwarder

Receber webhook e reencaminhar para múltiplos destinos:
- Configuração de URLs destino
- Tentar entregar para todas
- Retry se falhar
- Dashboard mostrando sucessos/falhas

---

## Reflexões Finais

Após completar os exercícios, responda:

1. **Técnico:** Qual foi o bug mais difícil de resolver? Como resolveu?

2. **Arquitetura:** Se precisasse escalar para 10.000 webhooks/segundo, o que mudaria?

3. **Comercial:** Como você venderia o Exercício 6 para uma agência de marketing?

4. **Aprendizado:** O que você NÃO sabia antes deste módulo que agora domina?

5. **Ensino:** Você conseguiria ensinar webhooks para outro dev júnior agora?

---

**Próximo:** Checklist de Domínio
