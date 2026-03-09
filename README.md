
# Painel de Gestão com Integração Segura à API Omie

## 1. Visão Geral

Este projeto é um painel de gestão (dashboard) interativo, desenvolvido em React, que se conecta à API do ERP Omie. A aplicação permite visualizar clientes, produtos e dados financeiros, além de possibilitar o cadastro, edição e exclusão de clientes de forma segura e eficiente.

O principal desafio técnico superado neste projeto foi garantir a segurança das credenciais da API Omie, que não podem ser expostas no código do frontend (navegador). A solução implementada utiliza uma arquitetura de **Proxy Seguro** com Serverless Functions na plataforma Vercel.

---

## 2. Arquitetura da Solução e Fluxo de Dados

A arquitetura foi desenhada para criar uma camada de abstração entre o frontend e a API externa, garantindo a segurança das credenciais.

### Fluxo de Comunicação Segura:

1.  **Requisição do Frontend:** A aplicação React (executando no navegador do usuário) não chama a API da Omie diretamente. Em vez disso, ela faz uma requisição para um endpoint interno da nossa própria aplicação, localizado em `/api/proxy`.
2.  **Serverless Function (Proxy):** Esta requisição é interceptada por uma **Serverless Function** (arquivo `api/proxy.js`) hospedada na Vercel. Esta função atua como um intermediário seguro.
3.  **Injeção Segura de Credenciais:** Já no ambiente do servidor (Vercel), a função de proxy lê as credenciais `OMIE_APP_KEY` e `OMIE_APP_SECRET`, que estão armazenadas de forma segura como **Variáveis de Ambiente** na Vercel.
4.  **Chamada à API Omie:** A função de proxy, agora de posse das credenciais, monta a requisição final e a envia para a API oficial da Omie. Esta comunicação ocorre de servidor para servidor, longe do alcance do navegador do usuário.
5.  **Retorno da Resposta:** A resposta da Omie é recebida pela função de proxy, que simplesmente a repassa de volta para a aplicação React no frontend.

Este fluxo garante que as chaves da API nunca saiam do ambiente seguro do servidor.

---

## 3. Tecnologias e Plataformas Utilizadas

### Frontend:
*   **React:** Biblioteca para construção da interface de usuário.
*   **Vite:** Ferramenta de build para desenvolvimento rápido.
*   **CSS Modules:** Para estilização escopada dos componentes.

### Backend (Infraestrutura como Código):
*   **Serverless Function (Vercel):** Uma função JavaScript (`api/proxy.js`) que executa no lado do servidor para intermediar as chamadas à API.

### Plataforma de Hospedagem (PaaS):
*   **Vercel:** Utilizada para:
    *   **Deploy Contínuo:** Integração com o Git para deploy automático a cada `git push`.
    *   **Hospedagem do Frontend:** Distribuição global do site estático (React).
    *   **Execução da Serverless Function:** Fornece o ambiente de execução para o nosso proxy.
    *   **Gerenciamento de Segredos:** Armazenamento seguro das credenciais da API como **Variáveis de Ambiente**, acessíveis apenas pelo backend.

---

## 4. Estrutura do Projeto

```
/
├── api/
│   └── proxy.js         # Serverless Function (Backend Proxy)
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── ClientList/
│   │   ├── Dashboard/
│   │   └── ...
│   ├── services/
│   │   └── omieApi.js     # Funções que chamam o proxy (NÃO a API Omie diretamente)
│   ├── App.jsx          # Componente principal da aplicação
│   └── main.jsx         # Ponto de entrada do React
├── package.json         # Dependências e scripts do projeto
└── README.md            # Este documento
```

---

## 5. Como Executar o Projeto Localmente

1.  **Clonar o Repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_PROJETO>
    ```

2.  **Instalar as Dependências:**
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente Locais:**
    *   Crie um arquivo chamado `.env.local` na raiz do projeto.
    *   Adicione suas credenciais da Omie a este arquivo. O prefixo `VITE_` é necessário para que o Vite as exponha ao servidor de desenvolvimento local.
    ```
    VITE_OMIE_APP_KEY=SUA_APP_KEY
    VITE_OMIE_APP_SECRET=SUA_APP_SECRET
    ```

4.  **Configurar o Proxy para Desenvolvimento (vite.config.js):**
    *   Para simular o comportamento da Vercel localmente, uma configuração de proxy é necessária no arquivo `vite.config.js`. Este passo já foi feito no projeto original para redirecionar as chamadas `/api` para a API da Omie durante o desenvolvimento.

5.  **Iniciar o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.
