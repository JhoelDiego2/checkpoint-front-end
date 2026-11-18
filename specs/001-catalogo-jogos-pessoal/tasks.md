# Tasks: Catálogo pessoal de jogos

**Input**: Design documents from `/specs/001-catalogo-jogos-pessoal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não há exigência explícita de TDD na spec; foco em implementação e validação via `quickstart.md`.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: User story associada (`[US1]`, `[US2]`, `[US3]`)

## Phase 0: Decisão pendente do grupo (bloqueante)

**Purpose**: Resolver a pendência do plano entre integração direta com chave exposta no navegador ou proxy/backend.

- [ ] T000 Registrar decisão do grupo (Opção A: cliente direto com `VITE_RAWG_API_KEY`; Opção B: proxy/backend) em `specs/001-catalogo-jogos-pessoal/research.md` e `specs/001-catalogo-jogos-pessoal/plan.md` — Responsáveis: todos os integrantes

**⚠️ CRITICAL**: As tarefas T006 e T007 são mutuamente exclusivas e só podem iniciar após T000.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estrutura obrigatória do projeto e base de configuração.

- [x] T001 Criar pastas base `src/api`, `src/components` e `src/pages` conforme constituição em `src/` — Responsável: Kheyla Thais Quispe Puacara
- [x] T002 Criar arquivo de configuração de ambiente em `/.env.example` sem fixar estratégia antes de T000; se T000 = Opção A (cliente direto), incluir `VITE_RAWG_API_KEY=` com observação de não commitar credenciais reais — Responsável: Kheyla Thais Quispe Puacara
- [x] T003 [P] Criar mapeamento explícito de status em `src/components/statusOptions.js` com rótulos de interface (`quero jogar`, `jogando`, `jogado`) e valores canônicos armazenados (`quero-jogar`, `jogando`, `jogado`) — Responsável: Renan Daher Franceschelli
- [x] T004 [P] Criar utilitário de mensagens em português para estados de loading/erro/vazio/sucesso em `src/components/uiMessages.js` — Responsável: Renan Daher Franceschelli

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura bloqueante para catálogo RAWG e persistência local.

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase. T006/T007 dependem de T000.

- [x] T005 Definir interface de cliente de catálogo independente da estratégia (direto/proxy) em `src/api/catalogClient.js` — Responsável: Catarina Gimenes Pires
- [x] T006 Implementar integração RAWG direta no navegador (somente se T000 = Opção A) em `src/api/catalogClient.js` com `key`, `search`, `page`, `page_size` — Responsável: Catarina Gimenes Pires
- [x] T007 Implementar integração via proxy/backend (somente se T000 = Opção B) em `src/api/catalogClient.js` sem expor chave RAWG no cliente — Responsável: Catarina Gimenes Pires
- [x] T008 Implementar mapeador RAWG→app em `src/api/catalogMapper.js` garantindo constraints verbatim de `CatalogGame`: `id (number, obrigatório, único na origem)`, `title (string, obrigatório)`, `thumbnail (string URL, opcional)`, `shortDescription (string, opcional)`, `description (string, opcional; detalhe)`, `genre (string, opcional)`, `platform (string, opcional)`, `releaseDate (string data, opcional)`, `publisher (string, opcional; detalhe)`, `developer (string, opcional; detalhe)`, `screenshots (lista de URLs, opcional; detalhe)` e regra `Aceitar campos ausentes sem quebrar UI` — Responsável: Catarina Gimenes Pires
- [ ] T009 [P] Implementar serviço de lista pessoal em `src/api/personalListStorage.js` com `localStorage` e constraints verbatim de `PersonalListItem`: `gameId (number, obrigatório, único)`, `title (string, obrigatório)`, `thumbnail (string URL, opcional)`, `status (enum obrigatório)`, `savedAt (string datetime ISO, obrigatório)`, `updatedAt (string datetime ISO, obrigatório)` — Responsável: Lukas Farias de Oliveira
- [ ] T010 Implementar validações de domínio em `src/api/personalListStorage.js` com regras verbatim: `Não permitir dois itens com o mesmo gameId`, `Alteração de status aceita apenas valores do enum`, `Em tentativa de duplicidade, lista não é alterada e deve haver mensagem clara`, `Transição inválida (valor fora do enum) deve ser rejeitada sem perda do estado anterior` — Responsável: Lukas Farias de Oliveira
- [ ] T011 [P] Criar componentes reutilizáveis de estado `LoadingState`, `ErrorState` e `EmptyState` em `src/components/LoadingState.jsx`, `src/components/ErrorState.jsx` e `src/components/EmptyState.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T012 Criar roteamento base e navegação entre páginas em `src/App.jsx` e `src/main.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T013 Criar nota de conformidade RAWG (atribuição + risco de exposição de `VITE_*`) em `specs/001-catalogo-jogos-pessoal/contracts/catalog-api-contract.md` — Responsável: Rafael Fratini Dal Corso

**Checkpoint**: Fundação pronta para desenvolver stories independentemente.

---

## Phase 3: User Story 1 - Descobrir jogos no catálogo (Priority: P1) 🎯 MVP

**Goal**: Permitir busca/listagem paginada de jogos, detalhe do jogo e estados de carregamento/erro/vazio.

**Independent Test**: Buscar termo válido, navegar páginas, abrir detalhe e validar mensagens de erro/vazio sem depender da lista pessoal.

- [ ] T014 [US1] Implementar `SearchBar` com input e submit de busca em `src/components/SearchBar.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T015 [P] [US1] Implementar `GameCard` com dados mínimos (`title`, `thumbnail`, `platform`, `releaseDate`) em `src/components/GameCard.jsx` — Responsável: Rafael Fratini Dal Corso
- [ ] T016 [US1] Implementar página de descoberta com consulta RAWG, renderização de resultados e estados de loading/erro/vazio (sem controles de paginação nesta tarefa) em `src/pages/DescobrirJogosPage.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T017 [US1] Implementar controles e navegação de paginação (`page`, `count`, `next`, `previous`) em `src/pages/DescobrirJogosPage.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T018 [US1] Implementar página de detalhe com dados disponíveis do jogo e fallback para campos ausentes em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T019 [US1] Diferenciar tratamento de erro recuperável (rede/servidor `5xx`/timeout: mostrar retry) e erro de chave inválida (`401`: mostrar erro de configuração/integração sem fluxo de retry automático) em `src/pages/DescobrirJogosPage.jsx` e `src/pages/DetalheJogoPage.jsx` — Responsáveis: Jhoel Diego Mamani Mita (descoberta) e Kheyla Thais Quispe Puacara (detalhe)
- [ ] T020 [US1] Implementar estado "nenhum jogo encontrado" quando `results` vier vazio em `src/pages/DescobrirJogosPage.jsx` — Responsável: Jhoel Diego Mamani Mita
- [ ] T021 [US1] Exibir atribuição obrigatória à RAWG com hyperlink ativo nas páginas de catálogo/detalhe em `src/pages/DescobrirJogosPage.jsx` e `src/pages/DetalheJogoPage.jsx` — Responsáveis: Jhoel Diego Mamani Mita (catálogo) e Kheyla Thais Quispe Puacara (detalhe)

**Checkpoint**: US1 funcional e validável de forma independente.

---

## Phase 4: User Story 2 - Adicionar jogo à lista pessoal (Priority: P1)

**Goal**: Adicionar jogo com status inicial permitido e bloquear duplicidade com mensagem clara.

**Independent Test**: A partir do detalhe, adicionar jogo com status e validar bloqueio ao repetir a adição.

- [ ] T022 [P] [US2] Implementar `StatusSelector` com rótulos legíveis (`quero jogar`, `jogando`, `jogado`) e emissão dos valores canônicos (`quero-jogar`, `jogando`, `jogado`) em `src/components/StatusSelector.jsx` — Responsável: Renan Daher Franceschelli
- [ ] T023 [P] [US2] Implementar `GameStatusBadge` para exibir status atual em `src/components/GameStatusBadge.jsx` — Responsável: Rafael Fratini Dal Corso
- [ ] T024 [US2] Integrar ação "Adicionar à lista" no detalhe usando `personalListStorage` em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T025 [US2] Implementar feedback de sucesso ao adicionar em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T026 [US2] Implementar prevenção de duplicidade e mensagem "jogo já está na lista" em `src/pages/DetalheJogoPage.jsx` — Responsável: Kheyla Thais Quispe Puacara

**Checkpoint**: US2 funcional e validável de forma independente.

---

## Phase 5: User Story 3 - Consultar e atualizar lista pessoal (Priority: P2)

**Goal**: Exibir lista pessoal persistida e permitir alteração de status válida.

**Independent Test**: Abrir “Minha Lista”, alterar status, recarregar página e confirmar persistência no mesmo navegador.

- [ ] T027 [US3] Implementar página da lista pessoal com leitura de `localStorage` em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T028 [US3] Implementar estado de lista vazia em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T029 [US3] Implementar alteração de status na lista usando valores canônicos permitidos (`quero-jogar`, `jogando`, `jogado`) e exibindo rótulos legíveis na interface em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara
- [ ] T030 [US3] Integrar `StatusSelector` e `GameStatusBadge` na lista em `src/pages/MinhaListaPage.jsx` — Responsáveis: Kheyla Thais Quispe Puacara e Renan Daher Franceschelli
- [ ] T031 [US3] Garantir atualização de `updatedAt (string datetime ISO, obrigatório)` ao trocar status em `src/api/personalListStorage.js` — Responsável: Lukas Farias de Oliveira
- [ ] T032 [US3] Exibir mensagem informativa sobre persistência local, ausência de sincronização entre dispositivos e risco de perda ao limpar dados em `src/pages/MinhaListaPage.jsx` — Responsável: Kheyla Thais Quispe Puacara

**Checkpoint**: US3 funcional e validável de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finais de acessibilidade, consistência e validação fim a fim.

- [ ] T033 [P] Revisar semântica, foco de teclado e rótulos dos formulários em `src/components/SearchBar.jsx`, `src/components/StatusSelector.jsx` e páginas em `src/pages/` — Responsável: Renan Daher Franceschelli
- [ ] T034 [P] Padronizar mensagens em português para sucesso/erro/vazio/carregamento em `src/components/uiMessages.js` e uso nas páginas `src/pages/` — Responsável: Renan Daher Franceschelli
- [ ] T035 Validar conformidade de escopo (sem login, sem social, sem avaliações, sem recomendações) em `src/App.jsx`, `src/pages/` e `specs/001-catalogo-jogos-pessoal/spec.md` — Responsável: Rafael Fratini Dal Corso
- [ ] T036 Executar validação manual cobrindo busca, erro de rede/servidor (recuperável com retry), chave inválida `401` (não recuperável por retry de usuário), busca sem resultados, duplicidade e persistência após recarregar em `specs/001-catalogo-jogos-pessoal/quickstart.md` — Responsável: Jhoel Diego Mamani Mita, com participação de todos os integrantes
- [ ] T037 Verificar na validação final se a atribuição RAWG com hyperlink ativo está visível e funcional nas páginas com dados do catálogo, registrando evidência em `specs/001-catalogo-jogos-pessoal/quickstart.md` — Responsável: Rafael Fratini Dal Corso

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia as user stories
- **T000 (decisão do grupo)**: bloqueia T006/T007 e qualquer implementação de consumo de API
- **Phases 3–5 (US1–US3)**: dependem da Phase 2; podem seguir em paralelo por equipe, priorizando P1
- **Phase 6 (Polish)**: depende das stories selecionadas concluídas

### User Story Dependencies

- **US1 (P1)**: começa após fundação; não depende de outras stories
- **US2 (P1)**: depende de detalhe pronto em US1 para fluxo de adição
- **US3 (P2)**: depende do armazenamento local implementado na fundação e itens adicionados pela US2

### Parallel Opportunities

- Setup paralelizável: T003, T004
- Foundational paralelizável: T009, T011
- US1 paralelizável: T015 com T014/T016
- US2 paralelizável: T022 e T023
- Polish paralelizável: T033, T034

---

## Parallel Example: User Story 2

```bash
Task: "T022 [US2] Implementar StatusSelector em src/components/StatusSelector.jsx"
Task: "T023 [US2] Implementar GameStatusBadge em src/components/GameStatusBadge.jsx"
```

---

## Implementation Strategy

### MVP First

1. Concluir Phase 1
2. Concluir T000 (decisão do grupo) e confirmar trilha T006 **ou** T007
3. Concluir Phase 2
4. Concluir Phase 3 (US1)
5. Validar US1 independentemente

### Incremental Delivery

1. US1 (descoberta + detalhe)
2. US2 (adição + duplicidade)
3. US3 (minha lista + alteração de status + persistência)
4. Polish e validação quickstart

### Team Parallel Strategy

1. A equipe decide T000 em conjunto; essa decisão bloqueia a integração da API.
2. Setup e tarefas fundacionais são realizadas pelos responsáveis indicados nas tarefas.
3. Frentes de trabalho:
   - **Catarina Gimenes Pires**: cliente e mapeador da API RAWG (T005–T008; executar T006 ou T007 conforme T000).
   - **Jhoel Diego Mamani Mita**: busca, descoberta e paginação (T014, T016–T017, T020); coordena a validação manual T036 com todos.
   - **Lukas Farias de Oliveira**: persistência e regras da lista pessoal (T009–T010, T031).
   - **Renan Daher Franceschelli**: mensagens, estados de interface, seletor de status e revisão de acessibilidade (T003–T004, T011, T022, T033–T034).
   - **Rafael Fratini Dal Corso**: cards, indicador de status, conformidade de escopo e verificação da atribuição RAWG (T013, T015, T023, T035, T037).
   - **Kheyla Thais Quispe Puacara**: estrutura e navegação, detalhes do jogo e experiência da lista pessoal (T001–T002, T012, T018, T024–T030, T032).
4. Tarefas que alteram o mesmo arquivo devem ser coordenadas entre seus responsáveis para evitar conflitos; revisões e integração são feitas em conjunto.
