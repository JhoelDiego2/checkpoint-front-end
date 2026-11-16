# Contract — Lista Pessoal no Navegador

## Objetivo

Definir o contrato funcional da lista pessoal persistida localmente no MVP.

## Meio de persistência

- `localStorage` do navegador.

## Escopo e limitações

- Sem login: dados vinculados apenas ao navegador/dispositivo atual.
- Não há sincronização entre dispositivos.
- Limpeza de dados do navegador pode apagar a lista.

## Operações funcionais

1. **Adicionar jogo à lista**
   - Entrada: jogo (`gameId`, metadados mínimos) + `status` inicial.
   - Regra: rejeitar se já existir item com mesmo `gameId`.
   - Saída esperada: sucesso com confirmação, ou bloqueio com mensagem de duplicidade.

2. **Consultar lista**
   - Saída: coleção de itens salvos com status atual.

3. **Alterar status**
   - Entrada: `gameId` + novo status.
   - Regra: status permitido apenas em {`quero-jogar`, `jogando`, `jogado`}.
   - Saída: item atualizado e refletido na lista.

## Estados de UX obrigatórios

- Sucesso ao adicionar/alterar.
- Erro para duplicidade.
- Lista vazia quando não houver itens salvos.
- Mensagem informativa sobre limitação de persistência local (mesmo navegador/dispositivo).
