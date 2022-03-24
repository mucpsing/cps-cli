@echo off & @chcp 65001
@set commit="fast default msg"
git add .
git commit -m %commit%
git push origin master
pause
