# Tasks: Catálogo pessoal de jogos

**Input**: Design documents from `/specs/001-catalogo-jogos-pessoal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não há exigência explícita de TDD na spec; foco em implementação e validação via `quickstart.md`.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: User story associada (`[US1]`, `[US2]`, `[US3]`)

## Phase 0: Decisão da integração (registrada)

**Purpose**: Registrar a decisão do grupo pela integração direta no navegador, com a chave configurada localmente em `.env`.

- [x] T000 Registrar decisão do grupo pela Opção A (cliente direto com `VITE_RAWG_API_KEY` em `.env`) em `specs/001-catalogo-jogos-pessoal/research.md` e `specs/001-catalogo-jogos-pessoal/plan.md` — Responsável: Jhoel Diego Mamani Mita

**Decisão**: Opção A escolhida. T006 é a integração aplicável; T007 (proxy/backend) não faz parte deste MVP.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estrutura obrigatória do projeto e base de configuração.

- [x] T001 Criar pastas base `src/api`, `src/components` e `src/pages` conforme constituição em `src/` — Responsável: Kheyla Thais Quispe Puacara
- [x] T002 Criar arquivo de configuração de ambiente em `/.env.example` com `VITE_RAWG_API_KEY=` e observação de não versionar credenciais reais — Responsável: Kheyla Thais Quispe Puacara
- [x] T003 [P] Criar mapeamento explícito de status em `src/components/statusOptions.js` com rótulos de interface (`quero jogar`, `jogando`, `jogado`) e valores canônicos armazenados (`quero-jogar`, `jogando`, `jogado`) — Responsável: Renan Daher Franceschelli
- [x] T004 [P] Criar utilitário de mensagens em português para estados de loading/erro/vazio/sucesso em `src/components/uiMessages.js` — Responsável: Renan Daher Franceschelli

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura bloqueante para catálogo RAWG e persistência local.

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase. A integração escolhida em T000 é a direta (T006).

- [x] T005 Definir interface de cliente de catálogo independente da estratégia (direto/proxy) em `src/api/catalogClient.js` — Responsável: Catarina Gimenes Pires
- [x] T006 Implementar integração RAWG direta no navegador (somente se T000 = Opção A) em `src/api/catalogClient.js` com `key`, `search`, `page`, `page_size` — Responsável: Catarina Gimenes Pires
- [x] T007 Integração via proxy/backend (Opção B) encerrada como não aplicável, pois a Opção A foi escolhida; não implementar neste MVP.
- [x] T008 Implementar mapeador RAWG→app em `src/api/catalogMapper.js` garantindo constraints verbatim de `CatalogGame`: `id (number, obrigatório, único na origem)`, `title (string, obrigatório)`, `thumbnail (string URL, opcional)`, `shortDescription (string, opcional)`, `description (string, opcional; detalhe)`, `genre (string, opcional)`, `platform (string, opcional)`, `releaseDate (string data, opcional)`, `publisher (string, opcional; detalhe)`, `developer (string, opcional; detalhe)`, `screenshots (lista de URLs, opcional; detalhe)` e regra `Aceitar campos ausentes sem quebrar UI` — Responsável: Catarina Gimenes Pires
- [ ] T019 Implementar serviço de lista pessoal em `src/api/personalListStorage.js` com `localStorage` e constraints verbatim de `PersonalListItem`: `gameId (number, obrigatório, único)`, `title (string, obrigatório)`, `thumbnail (string URL, opcional)`, `status (enum obrigatório)`, `savedAt (string datetime ISO, obrigatório)`, `updatedAt (string datetime ISO, obrigatório)` — Responsável: Lukas Farias de Oliveira
- [ ] T020 Implementar validações de domínio em `src/api/personalListStorage.js` com regras verbatim: `Não permitir dois itens com o mesmo gameId`, `Alteração de status aceita apenas valores do enum`, `Em tentativa de duplicidade, lista não é alterada e deve haver mensagem clara`, `Transição inválida (valor fora do enum) deve ser rejeitada sem perda do estado anterior` — Responsável: Lukas Farias de Oliveira
- [x] T009 Criar componentes reutilizáveis de estado `LoadingState`, `ErrorState` e `EmptyState` em `src/components/LoadingState.jsx`, `src/components/ErrorState.jsx` e `src/components/EmptyState.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T027 Criar roteamento base e navegação entre páginas em `src/App.jsx` e `src/main.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T022 Criar nota de conformidade RAWG (atribuição + risco de exposição de `VITE_*`) em `specs/001-catalogo-jogos-pessoal/contracts/catalog-api-contract.md` — Responsável: Rafael Fratini Dal Corso

**Checkpoint**: Fundação pronta para desenvolver stories independentemente.

---

## Phase 3: User Story 1 - Descobrir jogos no catálogo (Priority: P1) 🎯 MVP

**Goal**: Permitir busca/listagem paginada de jogos, detalhe do jogo e estados de carregamento/erro/vazio.

**Independent Test**: Buscar termo válido, navegar páginas, abrir detalhe e validar mensagens de erro/vazio sem depender da lista pessoal.

- [x] T010 [US1] Implementar `SearchBar` com input e submit de busca em `src/components/SearchBar.jsx` — Responsável: Jhoel Diego Mamani Mita
- [x] T011 [US1] Implementar `GameCard` com dados mínimos (`title`, `thumbnail`, `platform`, `releaseDate`) em `src/components/GameCard.jsx` — Responsável: Jhoel Diego Mamani Mita
- [x] T012 [US1] Implementar página de descoberta com consulta RAWG, renderização dos resultados, estado de carregamento e mensagem genérica para falhas (sem retry, diferenciação de erros, paginação ou estado vazio nesta tarefa) em `src/pages/DescobrirJogosPage.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T013 [US1] Implementar controles e navegação de paginação (`page`, `count`, `next`, `previous`) em `src/pages/DescobrirJogosPage.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T024 [US1] Implementar página de detalhe com dados disponíveis do jogo e fallback para campos ausentes em `src/pages/DetalheJogoPage.jsx` — Responsável: Rafael Fratini Dal Corso
- [ ] T014 [US1] Tratar erros recuperáveis (rede/servidor `5xx`/timeout com retry) e erro de chave inválida (`401` sem retry) na descoberta em `src/pages/DescobrirJogosPage.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T025 [US1] Tratar erros recuperáveis (rede/servidor `5xx`/timeout com retry) e erro de chave inválida (`401` sem retry) nos detalhes em `src/pages/DetalheJogoPage.jsx` — Responsável: Rafael Fratini Dal Corso
- [ ] T015 [US1] Implementar estado "nenhum jogo encontrado" quando `results` vier vazio em `src/pages/DescobrirJogosPage.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T016 [US1] Exibir atribuição obrigatória à RAWG com hyperlink ativo no catálogo em `src/pages/DescobrirJogosPage.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T026 [US1] Exibir atribuição obrigatória à RAWG com hyperlink ativo nos detalhes em `src/pages/DetalheJogoPage.jsx` — Responsável: Rafael Fratini Dal Corso

**Checkpoint**: US1 funcional e validável de forma independente.

---

## Phase 4: User Story 2 - Adicionar jogo à lista pessoal (Priority: P1)

**Goal**: Adicionar jogo com status inicial permitido e bloquear duplicidade com mensagem clara.

**Independent Test**: A partir do detalhe, adicionar jogo com status e validar bloqueio ao repetir a adição.

- [ ] T017 [US2] Implementar `StatusSelector` com rótulos legíveis (`quero jogar`, `jogando`, `jogado`) e emissão dos valores canônicos (`quero-jogar`, `jogando`, `jogado`) em `src/components/StatusSelector.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T023 [US2] Implementar `GameStatusBadge` para exibir status atual em `src/components/GameStatusBadge.jsx` — Responsável: Rafael Fratini Dal Corso
- [ ] T028 [US2] Integrar ação "Adicionar à lista" no detalhe usando `personalListStorage` em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T029 [US2] Implementar feedback de sucesso ao adicionar em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T030 [US2] Implementar prevenção de duplicidade e mensagem "jogo já está na lista" em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara

**Checkpoint**: US2 funcional e validável de forma independente.

---

## Phase 5: User Story 3 - Consultar e atualizar lista pessoal (Priority: P2)

**Goal**: Exibir lista pessoal persistida e permitir alteração de status válida.

**Independent Test**: Abrir “Minha Lista”, alterar status, recarregar página e confirmar persistência no mesmo navegador.

- [ ] T031 [US3] Implementar página da lista pessoal com leitura de `localStorage` em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T034 [US3] Implementar estado de lista vazia em `src/pages/MinhaListaPage.jsx` — Responsável: Catarina Gimenes Pires
- [ ] T032 [US3] Implementar alteração de status na lista usando valores canônicos permitidos (`quero-jogar`, `jogando`, `jogado`) e exibindo rótulos legíveis na interface em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T033 [US3] Integrar `StatusSelector` e `GameStatusBadge` na lista em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T021 [US3] Garantir atualização de `updatedAt (string datetime ISO, obrigatório)` ao trocar status em `src/api/personalListStorage.js` — Responsável: Lukas Farias de Oliveira
- [ ] T035 [US3] Exibir mensagem informativa sobre persistência local, ausência de sincronização entre dispositivos e risco de perda ao limpar dados em `src/pages/MinhaListaPage.jsx` — Responsável: Catarina Gimenes Pires

**Checkpoint**: US3 funcional e validável de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finais de acessibilidade, consistência e validação fim a fim.

- [ ] T018 Revisar semântica, foco de teclado e rótulos nos formulários de `SearchBar` e `StatusSelector` — Responsável: Renan Daher Franceschelli
- [ ] T036 Revisar semântica, foco de teclado e rótulos das páginas em `src/pages/` — Responsável: Catarina Gimenes Pires
- [ ] T037 Padronizar mensagens em português para sucesso/erro/vazio/carregamento em `src/components/uiMessages.js` e uso nas páginas `src/pages/` — Responsável: Catarina Gimenes Pires
- [ ] T038 Validar conformidade de escopo (sem login, sem social, sem avaliações, sem recomendações) em `src/App.jsx`, `src/pages/` e `specs/001-catalogo-jogos-pessoal/spec.md` — Responsável: Catarina Gimenes Pires
- [ ] T039 Executar validação manual cobrindo busca, erro de rede/servidor (recuperável com retry), chave inválida `401` (não recuperável por retry de usuário), busca sem resultados, duplicidade e persistência após recarregar em `specs/001-catalogo-jogos-pessoal/quickstart.md` — Responsável: Catarina Gimenes Pires
- [ ] T040 Verificar na validação final se a atribuição RAWG com hyperlink ativo está visível e funcional nas páginas com dados do catálogo, registrando evidência em `specs/001-catalogo-jogos-pessoal/quickstart.md` — Responsável: Catarina Gimenes Pires

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia as user stories
- **T000**: decisão registrada; integração direta T006 é a escolhida
- **Phases 3–5 (US1–US3)**: dependem da Phase 2 e seguem a ordem sequencial por responsável definida abaixo
- **Phase 6 (Polish)**: depende das stories selecionadas concluídas

### User Story Dependencies

- **US1 (P1)**: começa após fundação; não depende de outras stories
- **US2 (P1)**: depende de detalhe pronto em US1 para fluxo de adição
- **US3 (P2)**: depende do armazenamento local implementado na fundação e itens adicionados pela US2

## Implementation Strategy

### MVP First

1. Concluir Phase 1
2. T000 já registrado: seguir com a integração direta T006
3. Concluir Phase 2
4. Concluir Phase 3 (US1)
5. Validar US1 independentemente

### Incremental Delivery

1. US1 (descoberta + detalhe)
2. US2 (adição + duplicidade)
3. US3 (minha lista + alteração de status + persistência)
4. Polish e validação quickstart

### Team Sequential Strategy

As tarefas ainda pendentes serão executadas em blocos, nesta ordem, para que cada integrante conclua sua etapa antes da próxima pessoa começar. Tarefas já marcadas como concluídas não entram nesta sequência.

1. **Jhoel Diego Mamani Mita**: T009 estados reutilizáveis; T010 SearchBar; T011 GameCard; T012 base da página de descoberta.
2. **Renan Daher Franceschelli**: T013 paginação; T014 erros da descoberta; T015 estado sem resultados; T016 atribuição no catálogo; T017 StatusSelector; T018 acessibilidade dos formulários.
3. **Lukas Farias de Oliveira**: T019 armazenamento pessoal; T020 validações; T021 atualização de `updatedAt`.
4. **Rafael Fratini Dal Corso**: T022 nota de conformidade RAWG; T023 GameStatusBadge; T024 página de detalhe; T025 erros nos detalhes; T026 atribuição nos detalhes.
5. **Kheyla Thais Quispe Puacara**: T027 roteamento; T028–T030 adicionar jogo; T031 página da lista; T032 alteração de status; T033 integração dos componentes.
6. **Catarina Gimenes Pires**: T034 estado de lista vazia; T035 aviso de persistência local; T036 acessibilidade das páginas; T037 padronização de mensagens; T038 conformidade de escopo; T039–T040 validação final.

T000 já está registrado como decisão concluída. A Opção A usa a chave `VITE_RAWG_API_KEY` em `.env`; a exposição da variável no navegador é aceita para este MVP e a chave real não deve ser versionada.
