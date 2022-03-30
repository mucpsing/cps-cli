@echo off & @chcp 65001
@set "commit=fast:push"
git add .
git commit -m %commit%
git push origin master
pause
