# Quickstart de Validação — Catálogo pessoal de jogos

Este guia valida o comportamento fim a fim do MVP após implementação.

## Pré-requisitos

- Projeto React + Vite configurado
- Conectividade com a API externa definida em `contracts/catalog-api-contract.md`
- Navegador com `localStorage` habilitado

## Cenário 1 — Descobrir jogos

1. Abrir a página de descoberta.
2. Confirmar estado de carregamento durante consulta ao catálogo.
3. Validar exibição de cards/lista com jogos retornados.

**Resultado esperado**:
- catálogo exibido com dados essenciais;
- ausência de falhas visuais quando campos opcionais faltarem.

## Cenário 2 — Buscar jogo

1. Informar texto de busca.
2. Validar filtragem de resultados.

**Resultado esperado**:
- resultados compatíveis com o termo;
- quando não houver correspondência, mostrar estado “nenhum jogo encontrado”.

## Cenário 3 — Ver detalhe e adicionar à lista

1. Abrir detalhe de um jogo.
2. Selecionar status inicial e adicionar à lista.

**Resultado esperado**:
- confirmação de sucesso;
- item aparece em “Minha Lista”.

## Cenário 4 — Evitar duplicidade

1. Tentar adicionar novamente o mesmo jogo.

**Resultado esperado**:
- inclusão bloqueada;
- mensagem clara de “jogo já está na lista”.

## Cenário 5 — Alterar status

1. Acessar “Minha Lista”.
2. Alterar status de um item salvo.

**Resultado esperado**:
- novo status refletido imediatamente e mantido após recarga da página.

## Cenário 6 — Persistência e limitação local

1. Fechar e reabrir o site no mesmo navegador/dispositivo.
2. Verificar que a lista permanece.
3. Limpar dados do navegador e abrir novamente.

**Resultado esperado**:
- antes da limpeza: lista preservada;
- após limpeza: lista pode desaparecer (comportamento esperado do MVP sem login).

## Cenário 7 — Falha da API externa

1. Simular indisponibilidade da API (rede indisponível ou erro de resposta).

**Resultado esperado**:
- mensagem clara de erro;
- ação de “tentar novamente”.

## Cenário 8 — Chave inválida (401)

1. Simular requisição com chave RAWG inválida.

**Resultado esperado**:
- mensagem clara indicando erro de configuração da credencial/chave;
- não tratar como erro recuperável por nova tentativa do usuário final;
- registrar orientação de correção de configuração.

## Cenário 9 — Validação do mapeamento de status (rótulo x valor)

1. Adicionar jogo com cada opção de status exibida na interface.
2. Confirmar que os rótulos visíveis são: `quero jogar`, `jogando`, `jogado`.
3. Confirmar que os valores persistidos seguem a forma canônica: `quero-jogar`, `jogando`, `jogado`.

**Resultado esperado**:
- mapeamento consistente entre interface e armazenamento;
- sem valores fora do conjunto canônico.

## Avaliação do SC-005 (roteiro e registro)

### Objetivo

Validar se “pelo menos 90% das pessoas avaliadoras do grupo conseguem pesquisar um jogo, adicioná-lo com status e atualizar esse status sem ajuda externa”.

### Decisão pendente do grupo

- Definir **quantidade de avaliadores** e registrar antes da execução.

### Roteiro de avaliação (por avaliador)

1. Pesquisar um jogo.
2. Abrir detalhe do jogo.
3. Adicionar o jogo à lista com um status inicial.
4. Acessar “Minha Lista”.
5. Alterar o status do jogo.

### Forma de registro

- Registrar em tabela no próprio documento:
  - Identificador do avaliador
  - Concluiu fluxo sem ajuda externa? (Sim/Não)
  - Observações breves (opcional)
- Calcular taxa de sucesso: `(total de Sim / total de avaliadores) x 100`.

### Critério de aprovação

- Aprovar SC-005 se a taxa calculada for `>= 90%`.

## Fora de escopo (deve continuar ausente)

- Login/autenticação
- Recursos sociais
- Avaliações
- Recomendações avançadas
