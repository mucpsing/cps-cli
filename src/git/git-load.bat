@echo off
@chcp 936
git fetch --all
git reset --hard origin/master
git pull origin master
pause
