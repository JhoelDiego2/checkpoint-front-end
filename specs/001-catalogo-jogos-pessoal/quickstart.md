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

## Fora de escopo (deve continuar ausente)

- Login/autenticação
- Recursos sociais
- Avaliações
- Recomendações avançadas
