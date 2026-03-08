# Painel de Gestão Omie - Aplicação React.js vite

## 1. Visão Geral

Esta é uma aplicação web de página única (SPA - Single Page Application) desenvolvida com **React** e **Vite**. O objetivo do projeto é fornecer uma interface de usuário moderna e reativa para interagir com a API do ERP Omie, permitindo a gestão de clientes e a visualização de dados de negócios em um painel de controle.

A aplicação consome os dados da Omie para exibir informações sobre clientes, finanças, vendas e produtos, e implementa funcionalidades completas de **CRUD (Criar, Ler, Atualizar, Excluir)** para o cadastro de clientes.

---

## 2. Principais Funcionalidades

- **Dashboard Analítico:** Apresenta cartões com métricas de alto nível, como "Total a Receber" e "Vendas Realizadas".
- **Gestão Completa de Clientes (CRUD):**
    - **Criação:** Um formulário de cadastro rápido permite adicionar novos clientes.
    - **Leitura:** Lista todos os clientes em uma tabela clara e responsiva.
    - **Atualização:** Um formulário "inteligente" se adapta para editar os dados de um cliente existente.
    - **Exclusão:** Permite remover clientes do sistema.
- **Listagem de Produtos:** Exibe uma lista de produtos cadastrados.
- **Design Responsivo:** A interface se adapta para uma boa experiência de uso tanto em desktops quanto em dispositivos móveis.
- **Comunicação Segura com a API:** Utiliza um proxy configurado no Vite para evitar problemas de CORS e proteger as credenciais da API.

---

## 3. Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos

- **Node.js**: Versão 18.x ou superior.
- **npm** (ou um gerenciador de pacotes similar como Yarn ou pnpm).
- **Credenciais da API Omie**: Você precisará de um `APP_KEY` e `APP_SECRET`.

### Passos para Instalação

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>
    ```

2.  **Instale as Dependências:**
    Execute o comando abaixo para instalar as bibliotecas necessárias (React, Vite, etc.).
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env.local` na raiz do projeto. Este arquivo guardará suas credenciais de forma segura. Adicione o seguinte conteúdo a ele, substituindo pelos seus valores reais:
    ```env
    VITE_OMIE_APP_KEY="SUA_APP_KEY_AQUI"
    VITE_OMIE_APP_SECRET="SUA_APP_SECRET_AQUI"
    ```
    > **Importante:** O arquivo `.env.local` não deve ser enviado para o controle de versão (Git), pois contém informações sensíveis.

4.  **Rode o Servidor de Desenvolvimento:**
    Este comando iniciará a aplicação em modo de desenvolvimento, geralmente em `http://localhost:5173`. O servidor possui Hot-Reload, atualizando a página automaticamente quando você salva um arquivo.
    ```bash
    npm run dev
    ```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila e otimiza a aplicação para produção, gerando os arquivos na pasta `dist/`.
- `npm run preview`: Inicia um servidor local para visualizar a versão de produção (após o `build`).

---

## 4. Arquitetura e Estrutura do Código

O projeto utiliza uma arquitetura baseada em componentes, onde cada parte da interface é um bloco de construção reutilizável.

```
/
├── dist/               # Pasta com os arquivos de produção (gerada pelo `npm run build`)
├── public/             # Arquivos estáticos (ícones, etc.)
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── ClientList/
│   │   ├── Dashboard/
│   │   ├── NewClientForm/
│   │   └── ProductList/
│   ├── services/
│   │   └── omieApi.js  # Módulo central para toda a comunicação com a API Omie
│   ├── App.jsx         # Componente principal que organiza a aplicação
│   ├── App.module.css  # Estilos específicos do App.jsx
│   ├── index.css       # Estilos globais e variáveis de CSS
│   └── main.jsx        # Ponto de entrada da aplicação React
├── .env.local          # Arquivo local com as credenciais da API (NÃO VERSIONADO)
├── index.html          # Template HTML principal
├── package.json        # Dependências e scripts do projeto
├── README.md           # Esta documentação
└── vite.config.js      # Arquivo de configuração do Vite (incluindo o proxy)
```

### Análise dos Principais Arquivos

#### `src/services/omieApi.js`

Este é o cérebro da comunicação com o back-end. Ele abstrai todas as chamadas à API Omie em funções JavaScript simples de usar.

- **Funções Exportadas:** `getClientes`, `incluirCliente`, `alterarCliente`, `excluirCliente`, `getFinancas`, etc.
- **Error Handling:** Utiliza uma função `handleResponse` para centralizar o tratamento de erros e a extração de mensagens da API.
- **Segurança:** Lê as credenciais (`APP_KEY`, `APP_SECRET`) das variáveis de ambiente (`import.meta.env`), evitando que sejam expostas no código-fonte.

#### `vite.config.js`

Este arquivo é crucial para o funcionamento da aplicação. Ele configura o **servidor proxy**.
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://app.omie.com.br/api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```
- **Por que um proxy?** Navegadores bloqueiam requisições de um site (`localhost`) para uma API em outro domínio (`app.omie.com.br`) por segurança (política de CORS). O proxy faz com que o servidor de desenvolvimento intercepte as chamadas para `/api` e as redirecione para a Omie, contornando essa restrição.

#### `src/App.jsx`

É o componente orquestrador.
- **Gerenciamento de Estado:** Usa `useState` para armazenar os dados principais (lista de clientes, dados do dashboard, estado de carregamento).
- **Busca de Dados:** A função `fetchData` (dentro de `useEffect` e `useCallback`) usa `Promise.allSettled` para carregar os dados iniciais de forma robusta, garantindo que a aplicação não trave se uma das APIs falhar.
- **Lógica de CRUD:** Contém as funções `handleSaveClient`, `handleDeleteClient` e `handleSelectClientForEdit`, que são passadas como `props` para os componentes filhos (`ClientList` e `NewClientForm`) para que eles possam executar ações.
- **Rolagem Inteligente:** Usa `useRef` para marcar a posição do formulário e rolar a tela suavemente até ele quando o modo de edição é ativado.

#### `src/components/NewClientForm/`

Um formulário "inteligente" que serve tanto para **criar** quanto para **editar** clientes.
- **Modo Dinâmico:** Verifica a `prop` `editingClient`. Se ela existir, o formulário entra em modo de edição.
- **`useEffect`:** Preenche automaticamente os campos com os dados do cliente quando o modo de edição é ativado.
- **Aparência Dinâmica:** O título ("Cadastrar" vs. "Editar") e os botões ("Salvar Alterações", "Cancelar") mudam de acordo com o modo.

#### `src/components/ClientList/`

Exibe os clientes em uma tabela.
- **Renderização:** Mapeia o array `clientes` (recebido via `props`) para criar as linhas da tabela.
- **Interatividade:** Os botões "Editar" e "Excluir" não contêm a lógica diretamente; em vez disso, eles chamam as funções `onEdit` e `onDelete` (recebidas via `props` do `App.jsx`), delegando a ação ao componente pai.

---

## 5. Estilização (Styling)

A aplicação utiliza uma abordagem híbrida para o CSS:

- **`index.css`:** Contém estilos globais, reset, a importação da fonte "Inter" e, mais importante, as **variáveis de CSS (CSS Custom Properties)**.
  ```css
  :root {
    --color-primary: #007bff;
    --color-background: #f8f9fa;
    /* ...outras variáveis */
  }
  ```
  Isso permite manter uma identidade visual consistente e facilita a mudança de temas.

- **CSS Modules (`*.module.css`):** Cada componente tem seu próprio arquivo de estilo. Essa técnica garante que as classes CSS são escopadas localmente para cada componente, evitando conflitos de nomes de classes em uma aplicação grande.
