@echo off
setlocal enabledelayedexpansion
set /p "e=�������ļ���׺��:"
echo ����˳����������ļ�������:
dir /b /o:n "*!e!"
set /p "n=������������:"
set /p "i=���������ֵ�λ��:"
set /p "subffix=���������ֺ�׺:"
set "num=100000"
for /f "delims=" %%i in ('dir /b /o:n "*!e!"') do (
ren "%%i" "!n!0!num:~-%i%!%subffix%!%%~xi"
set /a num+=1
)
pause
exit /b