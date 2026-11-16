# Contract — Integração com RAWG Video Games Database API

## Provedor escolhido

- **Nome**: RAWG Video Games Database API
- **Documentação oficial**:
  - `https://rawg.io/apidocs`
  - `https://rawg.readme.io/reference/overview`
  - `https://rawg.readme.io/reference/get-a-list-of-games`
- **Base URL**: `https://api.rawg.io/api`

## Escopo de uso no MVP (somente)

- Buscar/listar jogos com paginação
- Ver detalhes de um jogo
- Tratar erro de integração e busca sem resultados

> Não usar no MVP: trailers, links de lojas, recomendações e outros recursos fora da spec aprovada.

## Autenticação e chave

### Confirmado
- API key é obrigatória via query string (`key`).
- Sem `key`, a API retorna `401`.

### Implicação de segurança no front-end
- Em Vite, variáveis `VITE_*` vão para o navegador (não ficam secretas).
- Portanto, chave usada diretamente no cliente pode ser exposta.
- **Não** armazenar credenciais reais no repositório.

### Alternativas para decisão do grupo
- **Integração direta no cliente (MVP acadêmico)**: simples, mas expõe chave.
- **Proxy/backend intermediário**: protege chave, porém aumenta escopo técnico.

## CORS

### Confirmado por verificação técnica (2026-11-16)
- `OPTIONS https://api.rawg.io/api/games` com `Origin` retornou `Access-Control-Allow-Origin: *`.
- `GET https://api.rawg.io/api/games?...` com `Origin` também retornou `Access-Control-Allow-Origin: *`.

### Pendente
- Garantia contratual de estabilidade de CORS para o plano/ambiente do projeto.

## Limites e termos de uso

### Confirmado
- Atribuição com hyperlink ativo para RAWG é exigida em páginas onde os dados são usados (`rawg.io/apidocs`).

### Pendente/Conflitante
- Limite de uso gratuito diverge entre fontes oficiais:
  - `rawg.io/apidocs`: até **20.000 requests/mês** (plano Free).
  - `rawg.readme.io/reference/authentication`: **50.000 requests** para chave gratuita.
- O grupo deve confirmar no painel da conta RAWG antes da implementação.

## Endpoints do MVP

1. **Listagem e busca de jogos**
   - `GET /games?key={API_KEY}&search={texto}&page={n}`
   - paginação por `count`, `next`, `previous`.
   - `page_size` foi validado em chamada real (retorno com tamanho solicitado), embora não esteja claramente descrito em todos os trechos da documentação consultada.

2. **Detalhe de jogo**
   - `GET /games/{id-ou-slug}?key={API_KEY}`

## Campos mínimos necessários (normalização no app)

### Listagem (`/games`)
- `id`
- `slug`
- `name`
- `released`
- `background_image`
- `rating`
- `platforms` (quando disponível)

### Detalhe (`/games/{id-ou-slug}`)
- todos os campos da listagem
- `description_raw` (preferencial para texto limpo)
- `genres` (quando disponível)
- `developers` (quando disponível)
- `publishers` (quando disponível)

## Erros e comportamento esperado

- `401`: chave ausente/inválida → exibir mensagem clara de erro de configuração de credencial (ação esperada: corrigir configuração/chave). Não tratar como falha recuperável por retry do usuário final.
- `404`: recurso não encontrado → exibir mensagem amigável de não encontrado.
- Falha de rede/5xx/timeout → exibir erro genérico e ação de retry.
- Busca sem itens em `results` → mostrar estado “nenhum jogo encontrado”.

## Convenção de status da lista pessoal

- **Rótulos de interface (PT-BR)**: `"quero jogar"`, `"jogando"`, `"jogado"`
- **Valores canônicos internos/armazenados**: `"quero-jogar"`, `"jogando"`, `"jogado"`
- **Mapeamento explícito**:
  - `"quero jogar"` → `"quero-jogar"`
  - `"jogando"` → `"jogando"`
  - `"jogado"` → `"jogado"`
