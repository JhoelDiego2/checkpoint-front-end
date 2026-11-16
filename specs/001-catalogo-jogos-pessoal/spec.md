# Feature Specification: Catálogo pessoal de jogos

**Feature Branch**: `[001-catalogo-jogos-pessoal]`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Queremos um site em português para pessoas que jogam videogames descobrirem jogos e manterem um registro pessoal do que pretendem jogar, estão jogando ou já jogaram. O MVP deve permitir consultar e pesquisar jogos disponibilizados por uma API HTTP externa, ver as informações disponíveis de um jogo e adicioná-lo a uma lista pessoal com um desses três status. A pessoa deve conseguir consultar sua lista e alterar o status de um jogo. Não deve ser possível adicionar o mesmo jogo duas vezes. A lista deve continuar disponível quando a pessoa voltar ao site. Não haverá login, recursos sociais, avaliações ou recomendações avançadas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descobrir jogos no catálogo (Priority: P1)

Como pessoa usuária, quero pesquisar e consultar jogos disponíveis no catálogo externo para decidir quais jogos me interessam.

**Why this priority**: Sem descoberta e consulta de jogos, não há conteúdo para adicionar à lista pessoal.

**Independent Test**: Pode ser testada de forma independente ao realizar buscas e abrir os detalhes de um jogo, sem usar lista pessoal.

**Acceptance Scenarios**:

1. **Given** que a pessoa está na área de descoberta, **When** ela pesquisa por um termo válido, **Then** o sistema exibe jogos correspondentes da fonte externa.
2. **Given** que resultados de busca foram exibidos, **When** a pessoa seleciona um jogo, **Then** o sistema apresenta as informações disponíveis desse jogo.
3. **Given** que a fonte externa está indisponível, **When** a pessoa tenta pesquisar ou abrir jogos, **Then** o sistema exibe mensagem clara de falha e opção de tentar novamente.
4. **Given** que a pesquisa não encontra jogos, **When** a busca é concluída, **Then** o sistema exibe estado de lista vazia com mensagem clara de “nenhum jogo encontrado”.

---

### User Story 2 - Adicionar jogo à lista pessoal (Priority: P1)

Como pessoa usuária, quero adicionar um jogo à minha lista pessoal com um status inicial para começar a organizar meu progresso.

**Why this priority**: O valor central do MVP é transformar descoberta em organização pessoal.

**Independent Test**: Pode ser testada ao selecionar um jogo, escolher um status e confirmar inclusão na lista.

**Acceptance Scenarios**:

1. **Given** que a pessoa está vendo um jogo que ainda não está na lista, **When** ela escolhe um dos três status permitidos e confirma, **Then** o jogo é adicionado à lista com o status escolhido.
2. **Given** que o jogo já está na lista, **When** a pessoa tenta adicioná-lo novamente, **Then** o sistema bloqueia a duplicidade e exibe mensagem clara informando que o jogo já está na lista.
3. **Given** que a inclusão é concluída, **When** o sistema finaliza a ação, **Then** a pessoa recebe confirmação de sucesso.

---

### User Story 3 - Consultar e atualizar lista pessoal (Priority: P2)

Como pessoa usuária, quero visualizar minha lista pessoal e alterar o status dos jogos para manter meu registro atualizado ao longo do tempo.

**Why this priority**: Após incluir jogos, manter e revisar o status é essencial para utilidade contínua.

**Independent Test**: Pode ser testada com itens já presentes na lista, verificando visualização, alteração de status e persistência em retorno posterior.

**Acceptance Scenarios**:

1. **Given** que a pessoa possui jogos na lista, **When** ela acessa sua lista pessoal, **Then** o sistema exibe os jogos com seus respectivos status atuais.
2. **Given** que um jogo está na lista, **When** a pessoa altera o status para outro permitido, **Then** o novo status é salvo e exibido imediatamente.
3. **Given** que a pessoa retorna ao site posteriormente, **When** ela acessa a lista pessoal, **Then** os jogos e status previamente salvos permanecem disponíveis.

---

### Edge Cases

- O que acontece quando a fonte externa falha antes de retornar resultados: exibir erro claro e permitir nova tentativa sem apagar a lista pessoal existente.
- O que acontece quando a busca retorna zero resultados: exibir estado vazio com mensagem clara e sem erro técnico.
- O que acontece quando a pessoa tenta adicionar jogo duplicado: impedir inclusão, manter lista inalterada e informar que o jogo já existe na lista.
- O que acontece quando a pessoa tenta alterar o status para valor fora dos três permitidos: rejeitar a alteração e preservar o status atual.
- O que acontece quando um jogo listado na fonte externa possui dados incompletos: exibir apenas os campos disponíveis sem quebrar a experiência.
- O que acontece quando os dados do navegador são limpos: a lista pessoal pode ser apagada e deixar de estar disponível.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST estar disponível em português para todos os textos de interface e mensagens do fluxo do MVP.
- **FR-002**: O sistema MUST permitir pesquisar jogos a partir de uma fonte externa de catálogo.
- **FR-003**: O sistema MUST permitir consultar as informações disponíveis de um jogo retornado na busca.
- **FR-004**: O sistema MUST permitir adicionar um jogo à lista pessoal com exatamente um status inicial entre: "quero jogar", "jogando" ou "jogado".
- **FR-005**: O sistema MUST impedir a adição de um mesmo jogo mais de uma vez na lista pessoal.
- **FR-006**: O sistema MUST exibir mensagem clara quando uma tentativa de inclusão for bloqueada por duplicidade.
- **FR-007**: O sistema MUST permitir consultar a lista pessoal com os jogos já adicionados e seus status atuais.
- **FR-008**: O sistema MUST permitir alterar o status de um jogo da lista pessoal apenas entre os três status permitidos.
- **FR-009**: No MVP, o sistema MUST persistir a lista pessoal no armazenamento local do navegador.
- **FR-010**: No MVP, sem login, a lista pessoal MUST ficar disponível somente no mesmo navegador/dispositivo em que foi salva.
- **FR-011**: O sistema MUST exibir mensagem clara de falha quando a fonte externa de catálogo não puder ser consultada.
- **FR-012**: O sistema MUST oferecer ação de nova tentativa para falhas recuperáveis de consulta (ex.: rede indisponível, timeout, erro de servidor).
- **FR-013**: O sistema MUST exibir estado de "nenhum jogo encontrado" quando uma busca não retornar resultados.
- **FR-014**: O sistema MUST manter fora de escopo login, recursos sociais, avaliações e recomendações avançadas nesta versão.
- **FR-015**: O sistema MUST exibir atribuição à RAWG com hyperlink ativo nas páginas em que dados do catálogo RAWG forem exibidos.
- **FR-016**: Quando a consulta falhar por credencial inválida (`401`), o sistema MUST exibir mensagem de erro indicando necessidade de corrigir a configuração da chave, sem tratar esse caso como falha recuperável por nova tentativa do usuário final.
- **FR-017**: O sistema MUST usar mapeamento explícito de status com rótulos de interface {"quero jogar", "jogando", "jogado"} e valores canônicos internos/armazenados {"quero-jogar", "jogando", "jogado"}.

### Key Entities *(include if feature involves data)*

- **Jogo do Catálogo**: item consultado na fonte externa, identificado de forma única e com informações disponíveis (ex.: título e demais dados retornados).
- **Item da Lista Pessoal**: vínculo entre uma pessoa usuária e um jogo do catálogo, contendo status atual e referência única ao jogo.
- **Status de Jogo**: conjunto fechado de estados permitidos com mapeamento explícito entre rótulo e valor canônico: "quero jogar" → `quero-jogar`, "jogando" → `jogando`, "jogado" → `jogado`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste de validação, 100% das tentativas de adicionar jogo duplicado são bloqueadas com mensagem clara ao usuário.
- **SC-002**: Em teste de cenário com falha da fonte externa, 100% dos fluxos de erro recuperável (rede, timeout e erro de servidor) exibem mensagem compreensível e opção de nova tentativa; e 100% dos fluxos com erro `401` por chave inválida exibem orientação para correção da configuração da credencial, sem exigir retry.
- **SC-003**: Em teste de busca sem correspondência, 100% das execuções exibem estado de "nenhum jogo encontrado" sem interromper o uso da aplicação.
- **SC-004**: Em teste de retorno ao site, 100% dos itens previamente adicionados permanecem disponíveis com seus status salvos.
- **SC-005**: Pelo menos 90% das pessoas avaliadoras do grupo conseguem pesquisar um jogo, adicioná-lo com status e atualizar esse status sem ajuda externa.

## Assumptions

- O MVP atende uma única pessoa por dispositivo/navegador, já que não haverá login nesta fase.
- Persistência entre visitas significa reabrir o site posteriormente no mesmo contexto de uso.
- A lista pessoal depende do armazenamento local do navegador; limpar os dados do navegador pode apagar a lista.
- As informações exibidas de cada jogo são limitadas ao que a fonte externa disponibilizar.
- Não há necessidade de remover jogos da lista no MVP inicial, apenas adicionar, consultar e alterar status.
