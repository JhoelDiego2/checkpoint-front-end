## Projeto e integrantes
**Tema:** catálogo pessoal de jogos, inspirado no conceito de diário de jogos do Letterboxd, sem copiar sua marca ou identidade visual.

**Problema:** ajudar pessoas a descobrir jogos e organizar uma lista pessoal do que querem jogar, estão jogando ou já jogaram. No MVP, a lista será salva no navegador, sem login.

**Integrantes:**

Catarina Gimenes Pires 
Jhoel Diego Mamani Mita 
Lukas Farias de Oliveira 
Renan Daher Franceschelli 
Rafael Fratini Dal Corso 
Kheyla Thais Quispe Puacara 


## Framework utilizado
**SpecKit (Spec-Driven Development):** escolhido para definir o escopo e os critérios de aceitação antes da implementação, e gerar artefatos compartilhados de especificação, plano e tarefas. Isso ajuda o grupo a revisar decisões e dividir o trabalho.

## Como rodar
A API de jogos planejada é externa (RAWG), portanto não há um serviço de API local para iniciar. Para instalar as dependências e executar o front-end, na raiz do projeto:

```bash
npm install
npm run dev
```

### Configurar a chave da RAWG

A equipe escolheu a integração direta no navegador para este MVP. Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_RAWG_API_KEY=sua_chave_rawg
```

O Vite disponibiliza variáveis com prefixo `VITE_` no navegador; portanto, essa chave não é secreta e pode ser vista por quem acessar a aplicação. O `.env` é ignorado pelo Git: não compartilhe nem versione uma chave real. O arquivo `.env.example` contém apenas o nome da variável.

## Onde estão os artefatos
Os artefatos da funcionalidade estão em `specs/001-catalogo-jogos-pessoal/`:

- Especificação: `spec.md`
- Plano: `plan.md`
- Tarefas: `tasks.md`
- Materiais de apoio: `research.md`, `data-model.md`, `quickstart.md` e `contracts/`

Jhoel Diego Mamani Mita preparou as etapas 0, 1 e 2 (preparação, especificação e planejamento). A divisão e execução das tarefas de implementação serão definidas pelo grupo.

## Reflexão
- Que decisão o agente teria tomado sozinho e a spec evitou?
- Que inconsistência a validação encontrou? Estava na spec ou no código?
- Como o framework ajudou (ou atrapalhou) a coordenação do grupo?
- O que fariam diferente com outro framework?