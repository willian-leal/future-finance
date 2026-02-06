# FutureFinance

MVP de gestão financeira com:
- controle de contas/carteiras e transações
- regras recorrentes
- metas financeiras
- motor de projeção de saldo
- simulador de impacto de gasto/receita

## Stack
- **Frontend**: Angular 17 standalone + RxJS + Router + SCSS
- **Backend**: .NET 8 Web API + EF Core
- **Banco**: SQLite

## Arquitetura
Estrutura em camadas "clean-ish":
- `Domain`: entidades e enums
- `DTOs`: contratos de entrada/saída
- `Services`: `ForecastEngine` (puro), `ForecastService` (orquestração)
- `Controllers`: REST endpoints
- `Data`: `AppDbContext`

## Estrutura de pastas
- `backend/FutureFinance.Api`: API + EF + engine
- `backend/FutureFinance.Tests`: testes unitários xUnit
- `frontend`: aplicação Angular

## Registry npm (corrigido)
O projeto foi ajustado para usar **somente registry público**:
- `.npmrc` (raiz)
- `frontend/.npmrc`

Ambos fixam:
- `registry=https://registry.npmjs.org/`
- escopos `@angular` e `@types` no registry público

Todas as dependências do `frontend/package.json` são públicas no npm.

## Rodar backend
Pré-requisito: SDK .NET 8.

```bash
cd backend/FutureFinance.Api
dotnet restore
dotnet ef database update
dotnet run
```

API disponível (default): `https://localhost:5001` / `http://localhost:5000`

## Rodar frontend
Pré-requisito: Node 20+.

```bash
cd frontend
npm install
npm run start
```

App: `http://localhost:4200`

### Se aparecer erro de proxy/403 no npm
Esse erro normalmente vem de variáveis de ambiente de proxy corporativo (`npm_config_http_proxy`, `npm_config_https_proxy`, etc.) e **não** de dependência privada.

No terminal local, execute:

```bash
unset npm_config_http_proxy
unset npm_config_https_proxy
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY
npm config set registry https://registry.npmjs.org/
cd frontend && npm install
```

## Aplicar migrations
Já existe migration inicial em `backend/FutureFinance.Api/Migrations`.

```bash
cd backend/FutureFinance.Api
dotnet ef database update
```

## Testes
Backend:
```bash
cd backend
dotnet test
```

Frontend:
```bash
cd frontend
npm test
```

## Endpoints do MVP
- `GET/POST/PUT/DELETE /api/accounts`
- `GET/POST/PUT/DELETE /api/transactions` (+ filtros `from`, `to`, `accountId`, `category`)
- `GET/POST/PUT/DELETE /api/recurrings`
- `GET/POST/PUT/DELETE /api/goals`
- `GET /api/forecast?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/simulate?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Exemplos curl
Criar conta:
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"Dinheiro","initialBalance":800}'
```

Criar transação:
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"type":"Expense","amount":120.5,"date":"2026-01-10","description":"Restaurante","category":"Lazer","accountId":"<ACCOUNT_ID>"}'
```

Projeção:
```bash
curl "http://localhost:5000/api/forecast?from=2026-01-01&to=2026-12-31"
```

Simulação:
```bash
curl -X POST "http://localhost:5000/api/simulate?from=2026-01-01&to=2026-12-31" \
  -H "Content-Type: application/json" \
  -d '{"amount":300,"date":"2026-01-15","type":"Expense"}'
```

## Notas de segurança e evolução
- Frontend está preparado para uso local-first e sincronização posterior.
- Backend mantém desenho compatível para adição de autenticação JWT/Identity sem quebra de contrato.
- Tratamento de erros com `ProblemDetails` e middleware global.
