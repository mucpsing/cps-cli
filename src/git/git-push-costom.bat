@echo off & @chcp 65001
@set /p commit=costom commit:
git add .
git commit -m %commit%
git push origin master
pause
