@echo off
@chcp 936
git add .
git commit -m "fast: before pull"
git pull origin master
pause