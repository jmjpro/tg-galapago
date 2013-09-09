@echo off
set CONFIG_DIR=%~dp0
set PROJECT_DIR=%~dp0\..
set TOOLS_DIR=%PROJECT_DIR%\tools

pushd %PROJECT_DIR%
"%TOOLS_DIR%\nodejs\node.exe" "%TOOLS_DIR%\jake\bin\cli.js" -f "%CONFIG_DIR%\jakefile.js" release
popd

exit %ERRORLEVEL%