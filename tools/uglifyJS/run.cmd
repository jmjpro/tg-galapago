set TOOL_DIR=%~dp0\
set NODEJS_DIR=%TOOL_DIR%..\nodejs\

pushd ..\..

del appMerged.js
del appMerged.js.map
del solitaireVoyage.min.js
del solitaireVoyage.js
call "%TOOL_DIR%merge.cmd"

if x%CHEAT_ON%x == xCHEAT_ONx (
	type src\controller\dialogs\CheatMenuDialog.js>>appMerged.js
	type frameWork\debug\profiler.js>>appMerged.js
)

rem "%NODEJS_DIR%node.exe" "%TOOL_DIR%bin\uglifyjs.js" -nc -mt -c --unsafe --lift-vars -o solitaireVoyage.min.js appMerged.js
"%NODEJS_DIR%node.exe" "%TOOL_DIR%bin\uglifyjs.js" -nc -mt --unsafe --lift-vars -o solitaireVoyage.min.js appMerged.js
del appMerged.js solitaireVoyage.js /F
move /Y solitaireVoyage.min.js src/

rem echo ^/^/^@ sourceMappingURL=appMerged.js.map>>appMerged.min.js

popd