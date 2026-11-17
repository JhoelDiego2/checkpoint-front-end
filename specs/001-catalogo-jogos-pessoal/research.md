# Research — Catálogo pessoal de jogos (revisado para RAWG)

## Decision 1: API externa do catálogo

- **Decision**: substituir FreeToGame por **RAWG Video Games Database API**.
- **Rationale**:
  - Cobre busca textual, listagem e detalhe de jogos.
  - Fornece paginação no endpoint de listagem (`count`, `next`, `previous`, `page`).
  - Possui documentação oficial ativa em:
    - `https://rawg.io/apidocs`
    - `https://rawg.readme.io/reference/overview`
    - `https://rawg.readme.io/reference/get-a-list-of-games`

## Decision 2: Escopo técnico do MVP com RAWG

- **Decision**: manter estritamente os fluxos da spec:
  1. buscar/listar jogos (com paginação),
  2. ver detalhe do jogo,
  3. adicionar à lista pessoal,
  4. alterar status na lista local,
  5. tratar erros e vazio.
- **Rationale**: aderência ao MVP aprovado; sem ampliar escopo.
- **Fora do escopo nesta versão**: trailers, lojas, avaliações e recomendações avançadas.

## Decision 3: Segurança da chave no front-end (Opção B — decisão aprovada pelo grupo em T000)

- **Decision**: acessar a RAWG exclusivamente por backend/proxy (Opção B), de modo que a API key nunca seja enviada ao navegador.
- **Rationale (confirmado)**:
  - RAWG exige API key (`key`) nas requisições.
  - Em Vite, variáveis `VITE_*` são expostas no bundle/browser e **não são secretas**.
  - Logo, a chave no front-end pode ser copiada e abusada por terceiros: a API key **nunca** deve ir ao navegador nem ser configurada em variáveis `VITE_*`.
  - Com a Opção B, a credencial permanece em configuração local do servidor/proxy e o cliente consome a API por intermédio desse backend, sem receber a chave.
- **Política de projeto**:
  - Não recomendar commit de credenciais reais no repositório.
  - A chave RAWG fica em configuração local do servidor (fora do versionamento); não usar prefixo `VITE_` para a chave.
- **Histórico factual das alternativas consideradas (registrado antes da decisão)**:
  - **A)** integração direta no cliente para MVP acadêmico, aceitando risco de exposição e quota.
  - **B)** backend/proxy para proteger a chave (mais seguro, mas adiciona escopo arquitetural).
  - **Decisão do grupo (T000)**: Opção B aprovada; a Opção A foi descartada por expor a chave no navegador.

## Confirmado em documentação/testes

1. **Autenticação obrigatória por API key**
   - Fonte: `https://rawg.readme.io/reference/authentication`
   - Sem chave, a API responde 401.

2. **Endpoints úteis ao MVP**
   - `GET /api/games` com `search` e `page` (documentado em ReadMe OpenAPI).
   - `GET /api/games/{id-ou-slug}` (validado por chamada real em `https://api.rawg.io/api/games/3498?key=...`).

3. **Paginação**
   - Resposta de listagem inclui `count`, `next`, `previous`, `results`.
   - `page` documentado; `page_size` validado em chamada real (retornou `results` com tamanho solicitado).

4. **CORS**
   - Requisição `OPTIONS` e `GET` com header `Origin` retornaram `Access-Control-Allow-Origin: *` no momento da validação (2026-11-16).

5. **Atribuição/termos**
   - Página oficial (`rawg.io/apidocs`) exige atribuição com hyperlink ativo para páginas que usam os dados.

## Pendências e conflitos a validar com conta real

1. **Limite de uso exato do plano gratuito**
   - `rawg.io/apidocs` menciona “up to 20,000 requests/month” no plano Free.
   - `readme.io/reference/authentication` menciona “free API key with a total of 50,000 requests”.
   - **Pendente**: confirmar regra vigente no dashboard da conta do projeto antes da implementação.

2. **Requisitos de atribuição em contexto acadêmico**
   - A necessidade de backlink está explícita, mas formato/local exato da atribuição no app deve ser validado pelo grupo.

3. **Confiabilidade de CORS em produção**
   - Atualmente funcional, porém é dependência de terceiro; validar novamente no ambiente de entrega.

4. **Limites adicionais de rate limit por segundo/minuto**
   - Não identificado de forma inequívoca na documentação consultada para todos os planos.
