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

## Decision 3: Segurança da chave no front-end

- **Decision**: usar integração direta com a RAWG no navegador para o MVP (Opção A), configurando a chave localmente em `.env` como `VITE_RAWG_API_KEY`.
- **Rationale (confirmado)**:
  - RAWG exige API key (`key`) nas requisições.
  - Em Vite, variáveis `VITE_*` são expostas no bundle/browser e **não são secretas**.
  - O grupo aceita o risco de exposição e possível uso da quota da chave no contexto do MVP acadêmico.
- **Política de projeto**:
  - Usar `.env` local e não versionar credenciais reais.
  - A variável `VITE_RAWG_API_KEY` não deve ser tratada como segredo; ela pode ser extraída do cliente.
  - Backend/proxy não faz parte do escopo escolhido para este MVP.

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
