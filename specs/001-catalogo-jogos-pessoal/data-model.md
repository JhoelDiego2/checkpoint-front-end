# Data Model — Catálogo pessoal de jogos

## Entidade: CatalogGame

Representa um jogo vindo da API externa.

**Campos (mínimo MVP):**
- `id` (number, obrigatório, único na origem)
- `title` (string, obrigatório)
- `thumbnail` (string URL, opcional)
- `shortDescription` (string, opcional)
- `description` (string, opcional; detalhe)
- `genre` (string, opcional)
- `platform` (string, opcional)
- `releaseDate` (string data, opcional)
- `publisher` (string, opcional; detalhe)
- `developer` (string, opcional; detalhe)
- `screenshots` (lista de URLs, opcional; detalhe)

**Regras:**
- Aceitar campos ausentes sem quebrar UI.
- `id` é a identidade primária usada para evitar duplicidade na lista pessoal.

## Entidade: PersonalListItem

Representa um jogo salvo pela pessoa usuária.

**Campos:**
- `gameId` (number, obrigatório, único)
- `title` (string, obrigatório)
- `thumbnail` (string URL, opcional)
- `status` (enum obrigatório)
- `savedAt` (string datetime ISO, obrigatório)
- `updatedAt` (string datetime ISO, obrigatório)

**Enum `status`:**
- `quero-jogar`
- `jogando`
- `jogado`

**Regras de validação:**
- Não permitir dois itens com o mesmo `gameId`.
- Alteração de status aceita apenas valores do enum.
- Em tentativa de duplicidade, lista não é alterada e deve haver mensagem clara.

## Armazenamento local

- Meio: `localStorage`.
- Estrutura lógica: coleção de `PersonalListItem`.
- Comportamento esperado:
  - Persistir entre recargas e retornos ao site no mesmo navegador/dispositivo.
  - Não sincronizar entre navegadores/dispositivos (sem login).
  - Pode ser apagado ao limpar dados do navegador.

## Transições de estado

`quero-jogar` ↔ `jogando` ↔ `jogado`

- Todas as transições entre os três estados são permitidas.
- Transição inválida (valor fora do enum) deve ser rejeitada sem perda do estado anterior.
