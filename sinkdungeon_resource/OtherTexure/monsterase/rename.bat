@echo off
setlocal enabledelayedexpansion
set /p "e=请输入文件后缀名:"
echo 将按顺序更改以下文件的名称:
dir /b /o:n "*!e!"
set /p "n=请输入新名称:"
set /p "i=请输入数字的位数:"
set /p "subffix=请输入名字后缀:"
set "num=100000"
for /f "delims=" %%i in ('dir /b /o:n "*!e!"') do (
ren "%%i" "!n!0!num:~-%i%!%subffix%!%%~xi"
set /a num+=1
)
pause
exit /b