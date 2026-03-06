
# Omie Enterprise Control

Este é um painel de controle (`dashboard`) desenvolvido em React para interagir com a API da Omie. A aplicação permite visualizar clientes, contas a receber e vendas, além de oferecer um formulário para o cadastro rápido de novos clientes. A interface é moderna, responsiva e construída com uma abordagem *mobile-first*.

## ✨ Funcionalidades Principais

- **Dashboard Financeiro:** Exibe um resumo das contas a receber e o total de vendas dos últimos 30 dias.
- **Cadastro Rápido de Clientes:** Um formulário para adicionar novos clientes diretamente na plataforma Omie, com validação de campos e tratamento de erros da API.
- **Listagem de Clientes:** Apresenta uma tabela com os clientes cadastrados, incluindo nome e CNPJ/CPF.
- **Relatório de Vendas:** Mostra uma lista com os pedidos de venda realizados nos últimos 30 dias.
- **Design Responsivo:** A interface se adapta perfeitamente a celulares, tablets e desktops.
- **Comunicação Segura com a API:** Utiliza um proxy configurado no Vite para proteger as chaves da API e evitar problemas com CORS.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - [**React**](https://reactjs.org/) (v18)
  - [**Vite**](https://vitejs.dev/) como ambiente de desenvolvimento e build
- **Estilização:**
  - **CSS Modules:** Para criar estilos escopados por componente.
  - **CSS Variables:** Para um sistema de design consistente (cores, fontes, etc.).
  - **Mobile-First:** Abordagem que prioriza a experiência em telas menores.
- **Integração com API:**
  - `fetch` API para as requisições HTTP.

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- `npm` ou `yarn` (gerenciador de pacotes)

### 2. Instalação

**a. Clone o repositório:**

```bash
# Se estiver usando git
git clone https://github.com/Henrique-Ramos29/api-omie.git
cd seu-repositorio
```

**b. Instale as dependências:**

```bash
npm install
```

### 3. Configuração do Ambiente

**a. Crie um arquivo `.env`:**

Na raiz do projeto, crie um arquivo chamado `.env`. Ele guardará suas chaves da API da Omie de forma segura.

**b. Adicione suas chaves da API:**

Abra o arquivo `.env` e adicione as suas credenciais, conforme o exemplo abaixo:

```env
VITE_OMIE_APP_KEY="SUA_APP_KEY"
VITE_OMIE_APP_SECRET="SUA_APP_SECRET"
```

> ⚠️ **Importante:** O prefixo `VITE_` é obrigatório para que o Vite exponha essas variáveis de ambiente para a sua aplicação no frontend.

### 4. Executando a Aplicação

Com tudo instalado e configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após executar o comando, o terminal mostrará a URL para acessar a aplicação (geralmente `http://localhost:5173`).

---

## 📂 Estrutura do Projeto

A organização dos arquivos e pastas segue um padrão modular para facilitar a manutenção:

```
/src
├── /components         # Componentes React reutilizáveis
│   ├── /ClientList
│   ├── /Dashboard
│   ├── /NewClientForm
│   └── /RelatorioVendas
├── /services           # Lógica de comunicação com a API Omie
│   └── omieApi.js
├── App.jsx             # Componente principal que organiza o layout
├── App.module.css      # Estilos do layout principal
├── main.jsx            # Ponto de entrada da aplicação React
└── index.css           # Estilos globais e variáveis de CSS (cores, fontes)

/vite.config.js         # Arquivo de configuração do Vite, incluindo o proxy da API
/README.md              # Este arquivo
```

- **`/components`**: Cada componente possui sua própria pasta com um arquivo `index.jsx` (lógica e estrutura) e um `*.module.css` (estilos escopados).
- **`/services/omieApi.js`**: Centraliza todas as funções que fazem chamadas para a API Omie, abstraindo a complexidade para os componentes.
- **`vite.config.js`**: Contém a configuração do proxy que redireciona as chamadas de `/api` para a URL da API da Omie. Isso é crucial para a segurança e para evitar erros de CORS.
