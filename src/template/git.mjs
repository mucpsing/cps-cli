import fse from "fs-extra";

export const template = {
  "git-load": {
    filename: "git-load.bat",
    data: `@echo off
@chcp 936
git fetch --all
git reset --hard origin/master
git pull origin master
pause`,
  },
  "git-pull": {
    filename: "git-pull.bat",
    data: ``,
  },
};

async function render(target, filename) {
  await fse.outputFile(filename);
}

export default async () => {
  console.log(`git.bat`);
};
