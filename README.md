<div align="center">
   
   <img src="./components/laite-kaban-title.png" alt="Laite Kaban" width="550" />

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

  <p align="center">
    Uma aplicação de gerenciamento de tarefas baseada na metodologia Kanban.
    <br />
    Desenvolvido como um projeto individual para demonstrar habilidades em React e arquitetura de software.
  </p>
</div>

---

## 📖 Sobre o Projeto

Este projeto é um **Quadro Kanban** interativo e moderno, desenvolvido para facilitar a organização e o acompanhamento de atividades. O foco da aplicação é oferecer uma experiência de usuário fluida para criar, mover e gerenciar tarefas através de diferentes estados de progresso.

A aplicação foi construída com foco em componentização, performance e boas práticas de desenvolvimento web moderno.

## ✨ Funcionalidades

* **Gerenciamento Visual (Drag & Drop):** Interface intuitiva que permite arrastar tarefas entre as colunas (Pendente, Realizando, Concluída) usando a biblioteca `@dnd-kit`.
* **CRUD de Tarefas:**
    * Adicionar novas tarefas com título, descrição, prioridade e status inicial.
    * Visualizar detalhes completos de uma tarefa em uma rota dedicada.
    * Editar informações e deletar tarefas existentes.
* **Organização por Prioridade:** As tarefas possuem indicadores visuais de prioridade (High, Medium, Low).
* **Filtros de Busca:** Barra de pesquisa em tempo real para localizar tarefas pelo título ou conteúdo.
* **Persistência Local:** Os dados são salvos automaticamente no `localStorage`, mantendo o estado das tarefas mesmo após recarregar a página.
* **Interface Responsiva:** Layout adaptável que funciona em diferentes tamanhos de tela, com tema escuro (Dark Mode).

## 🛠️ Tecnologias Utilizadas

* **[React](https://react.dev/) (v19)**: Biblioteca principal para a interface do usuário.
* **[TypeScript](https://www.typescriptlang.org/)**: Superconjunto de JavaScript que adiciona tipagem estática.
* **[Vite](https://vitejs.dev/)**: Ferramenta de build rápida e leve.
* **[Tailwind CSS](https://tailwindcss.com/)**: Framework para estilização utilitária.
* **[@dnd-kit](https://dndkit.com/)**: Conjunto de utilitários para interfaces de arrastar e soltar.
* **[React Router](https://reactrouter.com/)**: Gerenciamento de rotas e navegação da SPA.
* **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones.

## 🚀 Como Executar

### Pré-requisitos

* Node.js (versão 18 ou superior recomendada)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/krosct/kanban-ess-desafio.git](https://github.com/krosct/kanban-ess-desafio.git)
    cd kanban-ess-desafio
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run build
    npm run dev
    ```

4.  Acesse a aplicação no seu navegador (geralmente em `http://localhost:3000` ou `http://localhost:5173`).

## 🎨 Status e Cores

A aplicação utiliza cores semânticas para indicar o estado das tarefas:
* 🔴 **Pendente**
* 🔵 **Realizando**
* 🟢 **Concluída**

## 🤝 Contribuição

Este é um projeto individual, mas sugestões e feedbacks são bem-vindos! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

<div align="center">
  Desenvolvido para o desafio de Engenharia de Software.
</div>
