# User Management System

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat&logo=dotnet)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql)

Sistema de gerenciamento de usuários, construído com .NET, Next.js e PostgreSQL. O projeto foca em **Arquitetura Escalável**.

## 🛠️ Tecnologias

### Backend
- **.NET** (ASP.NET Core Minimal APIs)
- **Entity Framework Core** (PostgreSQL Provider)
- **Filtro de Bloom Customizado** (Processamento em Background + Cache em Memória)
- **Arquitetura:** Clean Architecture + Vertical Slices + CQRS (simplicidade e baixo acoplamento)

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS** (Framer Motion para animações)
- **React Hook Form + Zod** (Validação robusta)

---

## Como Rodar o Projeto

### 1. Banco de Dados (Docker)
O projeto utiliza Docker para subir o banco de dados PostgreSQL rapidamente.
```bash
docker-compose up -d
```
*O banco estará disponível na porta `5433` (mapeada para evitar conflitos na porta padrão).*

### 2. Backend (.NET)
Certifique-se de ter o SDK do .NET 8 instalado.
```bash
cd backend/UserManagementSystem.Api
dotnet run
```
*A API rodará em `http://localhost:5052` (ou similar conforme configurado em `launchSettings.json`).*

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Acesse `http://localhost:3000`.*

---

## ⚙️ Variáveis de Ambiente

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: URL base da API (ex: `http://localhost:5052`)

### Backend (`backend/UserManagementSystem.Api/appsettings.json`)
- `ConnectionStrings:DefaultConnection`: String de conexão com o PostgreSQL.

---

## Decisões Técnicas de Destaque

### Camada de Validação com Filtro de Bloom
Para evitar que o banco de dados receba milhares de queries de "Email já em uso" ou "ID não existe", foi implementado um **Filtro de Bloom Probabilístico**:
- **Otimização:** O backend gera um filtro de bits (1MB) que o frontend baixa. O frontend pode dizer instantaneamente se um dado NÃO existe sem fazer chamadas à API.
- **Sincronização em Tempo Real:** Ao cadastrar um novo usuário, o filtro no backend é atualizado incrementalmente e o frontend força um refresh na próxima checagem.
- **Background Worker:** Um `BackgroundService` regenera o filtro periodicamente para garantir integridade.

### Vertical Slices & Clean Architecture
Em vez do tradicional N-Tier (Controllers -> Services -> Repos), foi usado **Vertical Slices**. Cada funcionalidade (Create, Search, Delete) contém toda a lógica necessária dentro de sua própria "fatia", facilitando a manutenção e testes.

---

## Riscos e Melhorias Futuras

### Riscos Identificados
1. **Concorrência de Memória:** O `ExistenceFilterService` usa cache em memória. Para ambientes multiserver (load balancer), seria necessário migrar o armazenamento dos bits para **Redis**.

### Melhorias Sugeridas
1. **Testes de Integração e E2E:** Implementar testes de integração no backend utilizando `xUnit`, `WebApplicationFactory` e `Testcontainers` (para validar as consultas reais no PostgreSQL). No frontend, adoção de testes End-to-End com Cypress ou Playwright.
2. **Auditoria:** Implementar log de auditoria completo para alterações em campos sensíveis.
3. **Autenticação:** Adicionar JWT para proteção dos endpoints de exclusão.
4. **Docker compose unificado:** Criar Dockerfiles para o backend e frontend, orquestrando todo o ambiente (DB, API e Client) em um único `docker-compose.yml` para facilitar o deploy "one-click".

---

