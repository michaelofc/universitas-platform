# Checklist de Domínio — Módulo 1: Webhook Receiver

## Objetivo

Este checklist determina se você **realmente dominou** o módulo. Não é sobre "assistiu aulas" ou "fez exercícios". É sobre **capacidade real**.

**Critério de aprovação:** ✅ em TODOS os itens.

**Se falhar 1 item:** Você ainda não dominou. Estude e pratique mais.

---

## 1. Conceitual (Explicar Sem Código)

### 1.1 Webhooks

- [ ] **Consigo explicar** o que é webhook para um desenvolvedor júnior em <3min
- [ ] **Consigo explicar** a diferença entre webhook, API e polling para um leigo
- [ ] **Sei justificar** por que webhook é melhor que polling em automações
- [ ] **Consigo desenhar** o fluxo completo (origem → rede → seu servidor → resposta)
- [ ] **Sei identificar** quando usar webhook vs quando não usar

**Teste:**  
Grave vídeo de 3min explicando webhooks. Se um amigo entender, ✅.

---

### 1.2 HTTP

- [ ] **Sei explicar** cada status code: 200, 201, 400, 401, 404, 500, 503
- [ ] **Consigo descrever** quando usar GET vs POST vs PUT vs DELETE
- [ ] **Entendo** o que são headers e por que existem
- [ ] **Sei explicar** Content-Type, Authorization, Cache-Control
- [ ] **Consigo debugar** requisição HTTP olhando logs brutos

**Teste:**  
Dado log HTTP com erro, identificar problema em <2min.

---

### 1.3 Segurança

- [ ] **Sei explicar** o que é HMAC e por que é necessário
- [ ] **Consigo desenhar** processo de validação de signature
- [ ] **Entendo** timing attack e como prevenir
- [ ] **Sei justificar** por que timestamp check é importante
- [ ] **Consigo explicar** idempotência e por que mátera

**Teste:**  
Cliente pergunta "por que não usar só API key?". Você consegue responder convincentemente?

---

### 1.4 Banco de Dados

- [ ] **Sei explicar** diferença entre SQL e NoSQL
- [ ] **Consigo desenhar** schema de tabela para webhooks
- [ ] **Entendo** PRIMARY KEY, FOREIGN KEY, INDEX
- [ ] **Sei justificar** quando usar índice e quando não
- [ ] **Consigo explicar** SQL injection e como prevenir

**Teste:**  
Modelar schema para e-commerce (produtos, pedidos, clientes) em 15min.

---

## 2. Prático (Implementar Do Zero)

### 2.1 Servidor Básico

- [ ] **Consigo criar** servidor Express do zero (sem copiar)
- [ ] **Sei configurar** middleware (json, logging, etc)
- [ ] **Consigo estruturar** rotas profissionalmente (separar arquivos)
- [ ] **Sei implementar** error handler centralizado
- [ ] **Consigo usar** variáveis de ambiente (.env)

**Teste:**  
Em 30min, criar servidor com 3 rotas e middleware de log. Sem consultar código anterior.

---

### 2.2 Validação HMAC

- [ ] **Consigo implementar** geração de HMAC em Node.js
- [ ] **Sei validar** signature de webhook recebido
- [ ] **Consigo usar** timing-safe comparison
- [ ] **Sei implementar** verificação de timestamp
- [ ] **Consigo debugar** falha de signature

**Teste:**  
Implementar validação HMAC completa em 45min sem copiar código.

---

### 2.3 Persistência

- [ ] **Consigo criar** tabela SQLite do zero
- [ ] **Sei fazer** INSERT, SELECT, WHERE, ORDER BY, LIMIT
- [ ] **Consigo implementar** idempotência com PRIMARY KEY
- [ ] **Sei criar** índice em colunas relevantes
- [ ] **Consigo fazer** queries de estatísticas (COUNT, GROUP BY)

**Teste:**  
Salvar 100 webhooks, criar query que lista top 5 tipos, em 20min.

---

## 3. Arquitetural (Saber Onde Quebra)

### 3.1 Performance

- [ ] **Sei identificar** gargalos (DB lento, processamento síncrono)
- [ ] **Consigo estimar** quantos webhooks/segundo aguenta
- [ ] **Sei quando** usar fila (Redis, RabbitMQ)
- [ ] **Entendo** connection pooling
- [ ] **Consigo medir** latência de resposta

**Teste:**  
Analisar código e apontar 3 problemas de performance.

---

### 3.2 Segurança

- [ ] **Consigo listar** 5 vetores de ataque em webhook
- [ ] **Sei implementar** rate limiting
- [ ] **Consigo configurar** HTTPS (conceito)
- [ ] **Entendo** CORS e quando habilitar
- [ ] **Sei logar** tentativas suspeitas

**Teste:**  
Código com 3 vulnerabilidades. Você identifica todas?

---

### 3.3 Escalabilidade

- [ ] **Sei explicar** por que SQLite não escala infinitamente
- [ ] **Consigo propor** migração para PostgreSQL
- [ ] **Entendo** horizontal vs vertical scaling
- [ ] **Sei quando** usar load balancer
- [ ] **Consigo arquitetar** sistema para 10k webhooks/s

**Teste:**  
Cliente quer processar 50k webhooks/dia. Você desenha arquitetura?

---

## 4. Comercial (Vender e Precificar)

### 4.1 Comunicação

- [ ] **Consigo explicar** webhook para cliente leigo (não-técnico)
- [ ] **Sei traduzir** benefícios técnicos em valor de negócio
- [ ] **Consigo criar** proposta de venda
- [ ] **Sei calcular** ROI para o cliente
- [ ] **Consigo responder** objeções ("está caro", "não preciso")

**Teste:**  
Pitch de 5min para "dono de e-commerce". Ele entende e vê valor?

---

### 4.2 Precificação

- [ ] **Sei estimar** tempo de desenvolvimento
- [ ] **Consigo calcular** custo (horas × valor/hora)
- [ ] **Sei precificar** baseado em valor entregue
- [ ] **Consigo justificar** preço para cliente
- [ ] **Sei quando** cobrar setup vs recorrente

**Teste:**  
Cliente quer integração Stripe → CRM. Você precifica corretamente?

---

### 4.3 Entrega

- [ ] **Consigo documentar** para cliente usar sozinho
- [ ] **Sei criar** README profissional
- [ ] **Consigo gravar** vídeo de demonstração
- [ ] **Sei fazer** deploy em produção
- [ ] **Consigo dar** suporte pós-venda

**Teste:**  
Entregar produto para cliente que nunca viu antes. Ele consegue usar?

---

## 5. Ensino (Transferir Conhecimento)

### 5.1 Explicação

- [ ] **Consigo ensinar** webhook para outro dev
- [ ] **Sei criar** analogias que facilitam entendimento
- [ ] **Consigo responder** perguntas difíceis
- [ ] **Sei identificar** onde aluno está travado
- [ ] **Consigo corrigir** código de terceiros

**Teste:**  
Ensinar webhook para amigo. Ele cria um servidor functional sozinho depois?

---

### 5.2 Documentação

- [ ] **Consigo escrever** README que qualquer dev entende
- [ ] **Sei documentar** decisões arquiteturais
- [ ] **Consigo criar** exemplos claros
- [ ] **Sei explicar** "por quês" (não só "comos")
- [ ] **Consigo revisar** código de outro e dar feedback construtivo

**Teste:**  
Seu README: outro dev faz setup em <10min?

---

## 6. Produto (Entregar Valor Real)

### 6.1 Código Funcional

- [ ] **Tenho** repositório público com webhook receiver
- [ ] **Código roda** sem erros (npm install && npm start)
- [ ] **Testes** passam (mínimo: validação, persistência)
- [ ] **Não tem** secrets commitados
- [ ] **Estrutura** é profissional (pastas organizadas)

**Checklist técnico:**
```bash
git clone seu-repo
cd seu-repo
npm install
npm start
# Funciona? ✅
```

---

### 6.2 Documentação Completa

- [ ] **README** explica o que é, como usar, como testar
- [ ] **`.env.example`** com todas variáveis necessárias
- [ ] **Comentários** em partes complexas do código
- [ ] **Exemplos** de curl para testar
- [ ] **Troubleshooting** de erros comuns

---

### 6.3 Deploy Funcional

- [ ] **Sistema rodando** em produção (URL pública)
- [ ] **HTTPS** configurado
- [ ] **Logs** funcionando
- [ ] **Uptime** >95% por 7 dias
- [ ] **Você sabe restartar** se cair

---

## 7. Autoavaliação Honesta

Responda SIM/NÃO:

1. **Você conseguiria ser contratado como júnior** para trabalhar com webhooks? [ ]
2. **Você cobraria R$ 1.000+** por uma integração webhook com confiança? [ ]
3. **Você debugaria** webhook quebrado de produção sozinho? [ ]
4. **Você ensinaria** este módulo para outro dev? [ ]
5. **Você refaria** tudo do zero em <8h se o código sumisse? [ ]

**Se 1 NÃO:** Você ainda não dominou.

---

## Critério Final de Aprovação

### Você dominou o Módulo 1 se:

✅ Todos checkboxes acima estão marcados  
✅ Tem repositório público funcional  
✅ Consegue explicar sem roteiro  
✅ Venderia seu trabalho com segurança  
✅ Ensinaria para outro dev

### Se falhou em qualquer item:

1. Identifique o gap
2. Estude especificamente aquilo
3. Pratique até dominar
4. Refaça checklist

**Não passe para Módulo 2 sem dominar Módulo 1.**

---

## Prova Final (Opcional mas Recomendada)

**Desafio dos 60 minutos:**

Do zero, sem consultar código anterior:
1. Criar servidor Express
2. Endpoint POST /webhook com validação HMAC
3. Salvar eventos em SQLite
4. Endpoint GET /events (últimos 10)
5. Rate limiting (50 req/min)
6. README funcional

**Se conseguir em <60min:** Você dominou.  
**Se travar:** Identifique onde e estude mais.

---

**Assinatura de Conclusão:**

Eu, _________________, confirmo que:
- Marquei ✅ em TODOS os itens honestamente
- Tenho produto funcional entregue
- Domino o conteúdo suficiente para ensinar
- Estou pronto para Módulo 2

Data: ___/___/2026

---

**Próximo passo:** Módulo 2 - Event Dispatcher
