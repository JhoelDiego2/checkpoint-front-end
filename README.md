# Checkpoint — Catálogo pessoal de jogos

Aplicação web em React e Vite para descobrir jogos, consultar detalhes e organizar uma lista pessoal sem login.

O projeto usa dados da RAWG Video Games Database e foi desenvolvido com base no SpecKit, mantendo o MVP restrito a:

- busca e listagem paginada de jogos;
- página de detalhes;
- adição de jogos com status;
- alteração e persistência de status;
- estados de carregamento, erro, vazio e duplicidade.

Não estão incluídos login, recursos sociais, avaliações ou recomendações avançadas.

## Integrantes

- Catarina Gimenes Pires
- Jhoel Diego Mamani Mita
- Lukas Farias de Oliveira
- Renan Daher Franceschelli
- Rafael Fratini Dal Corso
- Kheyla Thais Quispe Puacara

## Tecnologias

- React 19
- Vite 8
- JavaScript com ES Modules
- RAWG Video Games Database API
- `localStorage` do navegador

## Funcionalidades

- busca de jogos por nome;
- paginação do catálogo;
- detalhes, descrição, plataformas, gênero, lançamento e capturas de tela;
- atribuição ativa à RAWG;
- seleção de status entre `quero jogar`, `jogando` e `jogado`;
- prevenção de duplicidade na lista pessoal;
- persistência da lista no mesmo navegador;
- navegação por hash entre descoberta, detalhes e “Minha Lista”.

## Persistência local

Os itens são armazenados em `localStorage` na chave `checkpoint:personal-list`.

A lista não é sincronizada entre navegadores ou dispositivos. Limpar os dados do navegador pode apagar permanentemente os itens cadastrados.

Os status exibidos na interface são convertidos para valores canônicos:

| Interface | Valor armazenado |
| --- | --- |
| quero jogar | `quero-jogar` |
| jogando | `jogando` |
| jogado | `jogado` |

## Instalação e execução

Pré-requisitos:

- Node.js;
- npm;
- chave válida da RAWG.

Na raiz do projeto:

```bash
npm install
```

Crie um arquivo `.env` com:

```env
VITE_RAWG_API_KEY=sua_chave_rawg
```

Não compartilhe nem versione uma chave real. O arquivo `.env` já está protegido pelo `.gitignore`, e o `.env.example` contém apenas o nome da variável.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Validação

O build e o lint podem ser verificados com:

```bash
npm run build
npm run lint
```

O roteiro de validação manual está em [`specs/001-catalogo-jogos-pessoal/quickstart.md`](specs/001-catalogo-jogos-pessoal/quickstart.md).

Os testes automatizados atualmente cobrem build e lint. O fluxo com dados reais da RAWG deve ser validado manualmente em um ambiente com chave configurada.

## Integração com a RAWG

A opção selecionada pelo grupo foi a integração direta no navegador com `VITE_RAWG_API_KEY`.

Variáveis com o prefixo `VITE_` são incluídas no bundle do cliente e não são secretas. Por isso, a chave real não deve ser publicada no repositório.

O cliente consulta:

- `games?search=&page=&page_size=20` para busca e paginação;
- `games/{id}` para detalhes.

Erros de chave inválida ou ausente são exibidos como erro de configuração e não oferecem retry automático. Falhas de rede e respostas `5xx` oferecem a ação “Tentar novamente”.

## Estrutura do projeto

```text
src/
├── api/
│   ├── catalogClient.js
│   ├── catalogMapper.js
│   └── personalListStorage.js
├── components/
├── pages/
├── App.jsx
└── main.jsx

specs/001-catalogo-jogos-pessoal/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

## Decisões e artefatos

Os artefatos da funcionalidade estão em [`specs/001-catalogo-jogos-pessoal/`](specs/001-catalogo-jogos-pessoal/):

- [`spec.md`](specs/001-catalogo-jogos-pessoal/spec.md): especificação e requisitos;
- [`plan.md`](specs/001-catalogo-jogos-pessoal/plan.md): plano técnico;
- [`research.md`](specs/001-catalogo-jogos-pessoal/research.md): pesquisa e decisão da integração;
- [`data-model.md`](specs/001-catalogo-jogos-pessoal/data-model.md): modelos de dados;
- [`tasks.md`](specs/001-catalogo-jogos-pessoal/tasks.md): divisão e acompanhamento das tarefas;
- [`contracts/`](specs/001-catalogo-jogos-pessoal/contracts/): contratos da API e da lista pessoal;
- [`quickstart.md`](specs/001-catalogo-jogos-pessoal/quickstart.md): roteiro de validação.

Cada integrante participou de uma etapa definida do projeto:

- Jhoel Diego Mamani Mita preparou a preparação inicial, a especificação, o planejamento e a busca com descoberta e paginação.
- Renan Daher Franceschelli implementou status, mensagens, componentes de estado, paginação, tratamento de erros e melhorias de acessibilidade.
- Lukas Farias de Oliveira implementou o armazenamento local, as validações da lista pessoal e a atualização de updatedAt.
- Rafael Fratini Dal Corso implementou cards, GameStatusBadge, página de detalhes, conformidade RAWG e atribuição.
- Kheyla Thais Quispe Puacara implementou a estrutura inicial, navegação, fluxo de adicionar jogos, página da lista pessoal e alteração de status.
- Catarina Gimenes Pires implementou o cliente e o mapeador do catálogo RAWG, além dos estados da lista vazia, persistência, acessibilidade, mensagens e validação final.

## Reflexão

- A especificação definiu antes da implementação que a chave não deveria ser exposta e, após a decisão do grupo, registrou a integração direta aceita para este MVP.
- O maior risco identificado foi confundir status e tarefas concluídas apenas pela presença de arquivos semelhantes.
- O SpecKit ajudou a dividir responsabilidades e registrar critérios de aceitação.
- Para uma próxima versão, um backend/proxy seria uma alternativa mais segura para proteger a chave da RAWG.