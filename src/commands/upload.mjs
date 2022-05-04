/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-05-02 08:05:22.433389
 * @Last Modified by: CPS
 * @Last Modified time: 2022-05-02 08:05:22.433389
 * @Projectname
 * @file_path "D:\CPS\MyProject\demo\cps-cli\cps-cli\src\commands"
 * @Filename "upload.mjs"
 * @Description: 功能描述
 */

import { resolve, basename } from "path";
import { log } from "console";

import fse from "fs-extra";

function Exit(code) {
  return process.exit(code);
}

async function gitUploadImg(shell, options) {
  const commands = [
    ["git", "add", "."],
    ["git", "commit", "-m", "cps-cli-upload"],
    ["git", "push", "origin", "master"],
  ];

  for (let command of commands) {
    await shell(command, options);
  }
}

function TyporaResult(imgList, protocol = "file") {
  let prefix;
  switch (protocol) {
    case "file":
      prefix = `file:///`;
      break;
    default:
      prefix = `file:///`;
      break;
  }

  console.log("Upload Success:");
  for (let each of imgList) {
    console.log(`${prefix}${each}`);
  }
}

async function copyImg(imgList, destPath) {
  const result = [];
  for (let imgPath of imgList) {
    let srcImg = resolve(imgPath);
    let destImg = resolve(destPath, basename(imgPath));

    if (fse.lstatSync(srcImg)) {
      await fse.copy(srcImg, destImg);
      result.push(destImg);
    }
  }

  return result;
}

export default async ctx => {
  const imgPathList = ctx.argv;
  const config = ctx.configManager.config["upload"];
  const cwd = config["local"]["path"];

  // 目录校验
  if (!fse.lstatSync(cwd)) return Exit(0);

  // 更新仓库（可能需要强制同步）
  await ctx.shell(["git", "pull", "origin", "master"], { cwd });

  // 文件复制
  let result = await copyImg(imgPathList, cwd);

  // 上传仓库
  await gitUploadImg(ctx.shell, { cwd });

  // 打印结果给 Typora
  await TyporaResult(result);
};
