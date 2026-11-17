# Doce Cupcake — PIT 2026/2 (versão corrigida)

## Correção
Removida a dependência nativa `better-sqlite3` que exigia ferramentas de compilação do Visual Studio no Windows. O aplicativo agora usa `node:sqlite`, incluído no Node.js 22.13+ (recomendado Node.js 24 LTS ou superior). Mantido o SQLite e o catálogo, carrinho, pedidos e consulta de pedidos.

## Windows
1. Instale Node.js 24 LTS ou superior em https://nodejs.org/ (Node.js 26 também é compatível).
2. Extraia o ZIP em uma pasta nova.
3. Dê dois cliques em `INICIAR_WINDOWS.bat`.
4. Abra http://localhost:3000 no navegador.
5. Mantenha a janela do servidor aberta.

## Manual
Abra o terminal na pasta `cupcakes_pit` e execute `npm install` e `npm start`.

## Banco de dados
O arquivo `cupcakes.db` é criado automaticamente na primeira execução. Faça cópia de segurança desse arquivo se quiser conservar pedidos. Não exclua o banco ao atualizar o aplicativo.

## PIT
Back-end: JavaScript (Node.js + Express); banco de dados: SQLite (`node:sqlite`); hospedagem: localhost; plataforma: web responsiva; codificação: tradicional. Repositório, vídeo e testes devem ser realizados e documentados efetivamente.
