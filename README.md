# Remix: Lardospeludos & Pocket Knowledge 🐾📚

Este projeto é uma plataforma integrada de impacto social que une o **Lardospeludos** (um portal de adoção e demonstrativos de recursos para abrigos animais) e a suite de utilidade pública **Pocket Knowledge** (ferramenta que inclui fomento cooperativo, sustentabilidade e calculadoras de dados fiscais/orçamentos).

Criado com **React 19**, **TypeScript**, **Tailwind CSS** e **Motion** para animações fluidas, este projeto foi totalmente estruturado e otimizado para funcionar perfeitamente no seu ambiente local utilizando o **Visual Studio Code (VS Code)**.

---

## 🚀 Como Executar o Projeto no VS Code

Siga as etapas abaixo para configurar, instalar as dependências e rodar o projeto localmente na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter instalado em seu computador:
* [Node.js](https://nodejs.org/) (Recomendado: Versão 18 LTS ou superior)
* [Visual Studio Code (VS Code)](https://code.visualstudio.com/)

---

### 2. Passo a Passo de Execução

1. **Abra o Projeto no VS Code**:
   * Abra o VS Code.
   * Vá em `File` (Arquivo) -> `Open Folder...` (Abrir Pasta...) e selecione a pasta raiz deste projeto.

2. **Instale as Dependências**:
   * Abra o terminal integrado do VS Code (`Ctrl + "` no Windows/Linux ou `Cmd + "` no macOS ou via menu superior `Terminal` -> `New Terminal`).
   * No terminal do projeto, execute o seguinte comando para instalar todas as dependências:
     ```bash
     npm install
     ```

3. **Inicie o Servidor de Desenvolvimento**:
   * No terminal integrado do VS Code, inicie o Vite executando:
     ```bash
     npm run dev
     ```
   * O servidor iniciará na porta `3000`. Acesse em seu navegador:
     [http://localhost:3000](http://localhost:3000)

4. **Variáveis de Ambiente (Opcional)**:
   * O arquivo `.env` já foi automaticamente criado na raiz do seu projeto a partir do `.env.example`.
   * Caso queira utilizar as funcionalidades inteligentes com base no modelo do Gemini, insira sua chave de API nele:
     ```env
     GEMINI_API_KEY="SUA_CHAVE_AQUI"
     ```

---

## 🛠️ Recursos Integrados para o VS Code

Este repositório conta com configurações nativas na pasta `.vscode/` que facilitam o desenvolvimento e mantêm a integridade do código:

* **Extensões Recomendadas**: Ao abrir o projeto, o VS Code sugerirá instalar extensões essenciais como:
  * *Tailwind CSS IntelliSense* (Para autocompletar classes CSS de forma ágil)
  * *ESLint* e *Prettier* (Para manter o estilo de código padronizado)
* **Formatação Automática ao Salvar**: O arquivo `.vscode/settings.json` já habilita a formatação do código (`Format on Save`) para organizar os arquivos TypeScript e React automaticamente após cada modificação.
* **Depuração Integrada**: O arquivo `.vscode/launch.json` permite depurar a aplicação simplesmente pressionando a tecla `F5` no VS Code para iniciar o servidor de desenvolvimento automaticamente.

---

## 🗃️ Estrutura de Pastas Úteis

* `src/App.tsx`: Gerenciador principal de estado e alternador entre as sub-plataformas.
* `src/components/LardospeludosPortal.tsx`: Interface completa do abrigo de animais, contendo a galeria de adoção e a aba de demonstrativos financeiros de doações e despesas.
* `src/components/PocketKnowledgePortal.tsx`: Suite do cidadão responsável que contém o gerenciamento de lixo eletrônico, mapa simulado e a calculadora de orçamentos fiscais comunitários.
* `src/types.ts`: Definições fortes com TypeScript para máxima consistência de dados (modelos de dados).
* `src/mockData.ts`: Dados fictícios preenchidos para visualização e demonstração imediata do dashboard.

---

## 📜 Scripts do Projeto (Disponíveis em package.json)

No terminal, você pode rodar os seguintes comandos:

* `npm run dev`: Inicializa o servidor de desenvolvimento na porta `3000` com suporte ágil a recarga de alterações.
* `npm run build`: Compila o projeto otimizado e minificado pronto para produção dentro da pasta `dist/`.
* `npm run preview`: Inicializa um servidor local estático para testar temporariamente o resultado gerado no compilador do `npm run build`.
* `npm run lint`: Executa a verificação estática do Typescript (`tsc`) buscando possíveis inconsistências ou erros de tipo antes do build.

---

Aproveite o desenvolvimento deste projeto voltado ao impacto social e fomento universitário! 💚
