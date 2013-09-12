@echo off
set TOOL_DIR=%~dp0\
set NODEJS_DIR=%TOOL_DIR%..\nodejs\
set CSS_FOLDER=%TOOL_DIR%..\..\resources\css\

cd %TOOL_DIR%

pushd ..\..


REM ******************
REM       resources
REM ******************
pushd resources

del %CSS_FOLDER%solitaireVoyage.css /F
del %CSS_FOLDER%solitaireVoyage.min.css /F

echo /* */ > %CSS_FOLDER%solitaireVoyage.css
for /r %%i in (*.css) do (
	copy %CSS_FOLDER%solitaireVoyage.css+%%i %CSS_FOLDER%solitaireVoyage.css /b
)
popd

rem call "%TOOL_DIR%merge.cmd"
"%NODEJS_DIR%node.exe" "%TOOL_DIR%node-cssmin-master\bin\cssmin.js" %CSS_FOLDER%solitaireVoyage.css > %CSS_FOLDER%solitaireVoyage.min.css

rem del %CSS_FOLDER%solitaireVoyage.css /F

popd

