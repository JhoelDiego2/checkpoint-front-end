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

**Project Type**: Aplicação web front-end (SPA)

**Performance Goals**: Feedback imediato para ações locais (adicionar/alterar status) e mensagens claras de carregamento/erro/vazio; metas numéricas formais PENDENTES

**Constraints**:
- Respeitar estrutura `src/api`, `src/components`, `src/pages`
- Sem login
- Sem recursos sociais
- Sem avaliações
- Sem recomendações avançadas
- Não versionar credenciais reais; a chave RAWG do MVP será exposta no cliente
- Incluir paginação na listagem de jogos
- Tratar explicitamente estados de carregamento, erro, sem resultados e duplicidade
- Diferenciar erro recuperável (rede/servidor/timeout com retry) de erro `401` por chave inválida (mensagem de configuração)
- Manter mapeamento explícito de status: rótulos UI (`quero jogar`, `jogando`, `jogado`) e valores canônicos (`quero-jogar`, `jogando`, `jogado`)

**Decisão de integração externa (RAWG + front-end direto)**:
- A RAWG exige `key` na query string.
- Em Vite, qualquer variável `VITE_*` é embutida no bundle e enviada ao navegador (não é segredo).
- O grupo escolheu a integração direta para este MVP e aceita o risco de exposição e uso da quota.
- Configurar `VITE_RAWG_API_KEY` em `.env` local; não versionar credenciais reais.
- Backend/proxy para ocultar a chave não faz parte do escopo escolhido.

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

**Structure Decision**: Front-end único com separação por API, componentes reutilizáveis e páginas, aderente à constituição e ao escopo aprovado.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma | N/A | N/A |
