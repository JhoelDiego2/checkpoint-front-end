# Implementation Plan: Catálogo pessoal de jogos

**Branch**: `[001-catalogo-jogos-pessoal]` | **Date**: 2026-11-15 | **Spec**: [`specs/001-catalogo-jogos-pessoal/spec.md`](./spec.md)

**Input**: Feature specification from `/specs/001-catalogo-jogos-pessoal/spec.md`

## Summary

Implementar um MVP web em português para descoberta de jogos via API HTTP externa, com busca/listagem paginada, visualização de detalhes e gestão de lista pessoal com status ("quero jogar", "jogando", "jogado").

A lista pessoal será persistida em `localStorage` (sem login), portanto ficará disponível somente no mesmo navegador/dispositivo e poderá ser perdida ao limpar os dados do navegador.

## Technical Context

**Language/Version**: JavaScript (ES Modules) em React + Vite

**Primary Dependencies**: React, Vite, RAWG Video Games Database API (decisão detalhada em `research.md`)

**Storage**: `localStorage` do navegador para lista pessoal

**Testing**: PENDENTE (ferramenta de testes não definida na spec)

**Target Platform**: Navegadores modernos (desktop e mobile)

**Project Type**: Aplicação web com front-end (SPA) e backend/proxy para acesso à RAWG (Opção B; detalhes pendentes de T007)

**Performance Goals**: Feedback imediato para ações locais (adicionar/alterar status) e mensagens claras de carregamento/erro/vazio; metas numéricas formais PENDENTES

**Constraints**:
- Respeitar estrutura `src/api`, `src/components`, `src/pages`
- Sem login
- Sem recursos sociais
- Sem avaliações
- Sem recomendações avançadas
- Não expor a chave RAWG no front-end: acesso via backend/proxy (Opção B, decisão aprovada em T000), sem variáveis `VITE_` para a credencial
- Incluir paginação na listagem de jogos
- Tratar explicitamente estados de carregamento, erro, sem resultados e duplicidade
- Diferenciar erro recuperável (rede/servidor/timeout com retry) de erro `401` por chave inválida (mensagem de configuração)
- Manter mapeamento explícito de status: rótulos UI (`quero jogar`, `jogando`, `jogado`) e valores canônicos (`quero-jogar`, `jogando`, `jogado`)

**Estratégia e risco de integração externa (RAWG via backend/proxy — Opção B, decisão aprovada pelo grupo em T000)**:
- A RAWG exige `key` na query string.
- Em Vite, qualquer variável `VITE_*` é embutida no bundle e enviada ao navegador (não é segredo); portanto a integração direta exporia a chave ao cliente.
- Por decisão do grupo (T000, Opção B), o acesso à RAWG será feito por backend/proxy: a API key fica em configuração local do servidor e nunca chega ao navegador.
- Não versionar credenciais reais no repositório; não usar prefixo `VITE_` para a chave.
- **PENDENTE da tarefa T007 (responsável: Catarina Gimenes Pires)**: a implementação técnica detalhada do serviço/proxy e dos endpoints, incluindo tecnologia, paths, plataforma de execução e o desenho da comunicação cliente-servidor. Esta decisão não antecipa esses pontos sem base.

**Scale/Scope**: MVP acadêmico enxuto com 3 fluxos principais: descobrir (com paginação), adicionar, gerenciar status

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Propósito e Originalidade**: PASS
- **Escopo Enxuto e Viável**: PASS
- **Base Técnica Obrigatória**: PASS
- **Acessibilidade e Comunicação Clara**: PASS
- **Colaboração e Revisão em Grupo**: PASS

### Post-Design Re-check

- `research.md`, `data-model.md`, `contracts/` e `quickstart.md` mantêm escopo MVP e não introduzem itens proibidos.
- Persistência local e limitações (mesmo navegador/dispositivo; perda ao limpar dados) estão explicitadas.
- Estados de carregamento, erro, vazio e duplicidade estão cobertos nos contratos e guia de validação.
- Integração com RAWG não adiciona trailers/lojas/recursos extras ao escopo de implementação.

## Project Structure

### Documentation (this feature)

```text
specs/001-catalogo-jogos-pessoal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── catalog-api-contract.md
│   └── lista-pessoal-storage-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── catalogClient.js
│   └── catalogMapper.js
├── components/
│   ├── SearchBar.jsx
│   ├── GameCard.jsx
│   ├── GameStatusBadge.jsx
│   ├── StatusSelector.jsx
│   ├── LoadingState.jsx
│   ├── ErrorState.jsx
│   └── EmptyState.jsx
├── pages/
│   ├── DescobrirJogosPage.jsx
│   ├── DetalheJogoPage.jsx
│   └── MinhaListaPage.jsx
└── main.jsx
```

**Structure Decision**: Front-end com separação por API, componentes reutilizáveis e páginas, aderente à constituição e ao escopo aprovado, com acesso à RAWG via backend/proxy (Opção B); a estrutura do servidor, seus endpoints e a tecnologia ficam pendentes da tarefa T007 (Catarina Gimenes Pires).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | N/A |
