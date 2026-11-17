@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo ERRO: Node.js nao encontrado. Instale em https://nodejs.org/
 pause
 exit /b 1
)
echo Verificando versao do Node.js...
node -e "if(Number(process.versions.node.split('.')[0])<22){console.error('ERRO: Instale Node.js 22 ou superior.');process.exit(1)}"
if errorlevel 1 (pause & exit /b 1)
echo Instalando dependencias (sem compilacao nativa)...
call npm install
if errorlevel 1 (echo ERRO ao instalar dependencias. & pause & exit /b 1)
echo.
echo Iniciando o aplicativo. Abra http://localhost:3000 no navegador.
echo Mantenha esta janela aberta enquanto utilizar o sistema.
call npm start
if errorlevel 1 echo ERRO ao iniciar servidor.
pause
