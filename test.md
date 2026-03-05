PROVA TÉCNICA – DESENVOLVEDOR
FULLSTACK
Objetivo Geral
Esta prova tem como objetivo avaliar sua capacidade de estruturar, implementar e manter um
projeto FullStack moderno utilizando .NET, PostgreSQL e Next.js. O foco está na qualidade do
código, organização, clareza de arquitetura, boas práticas e capacidade de justificar decisões
técnicas.
Cenário do Projeto
Você deverá desenvolver uma aplicação chamada 'User Management System'. A aplicação será
composta por backend em .NET (C#), banco de dados PostgreSQL e frontend em Next.js com
TypeScript.
Parte 1 – Backend (.NET + PostgreSQL)
• Criar API REST em .NET.
• Implementar entidade User com os seguintes campos: Id (GUID), Name, Email, UserType
(GUID), CreatedAt, UpdatedAt, DeletedAt.
• Criar endpoint POST /users para cadastro de usuário.
• Garantir que Email não possa ser duplicado para usuários ativos (DeletedAt nulo).
• Criar endpoint GET /users/{id}.
• Criar endpoint DELETE /users/{id} implementando soft delete (preenchendo DeletedAt).
• Padronizar respostas HTTP (400, 404, 409, 500).
• Criar ao menos dois testes automatizados validando regra de duplicidade e soft delete.
• Criar script de migração SQL garantindo unicidade de email para usuários ativos (índice único
parcial).
Parte 2 – Frontend (Next.js + TypeScript)
• Criar página principal com formulário para cadastro de usuário.
• Integrar formulário com endpoint POST /users.
• Exibir mensagens de erro apropriadas (email duplicado, erro de validação etc.).
• Permitir busca de usuário por ID utilizando GET /users/{id}.
• Organizar estrutura do projeto de forma clara e escalável.
Parte 3 – Documentação
• Criar README.md explicando como rodar backend, frontend e banco.
• Descrever variáveis de ambiente necessárias.
• Explicar decisões técnicas adotadas.
• Apontar possíveis melhorias e riscos técnicos identificados.
Critérios de Avaliação
• Organização e clareza do código.
• Aplicação correta de boas práticas (Clean Code, SOLID quando aplicável).
• Consistência da API e tratamento de erros.
• Qualidade dos testes automatizados.
• Qualidade da documentação.
• Capacidade de estruturar solução escalável e manutenível.
Entrega: disponibilizar repositório público ou privado com acesso liberado, contendo histórico de
commits e instruções completas de execução