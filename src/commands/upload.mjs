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

import path from "path";

import fse from "fs-extra";

import { checkUrl, runServerAlone } from "../utils/index.mjs";

function Exit(code) {
  return process.exit(code);
}

async function gitPush(ctx) {
  const cwd = config["local"]["path"];

  const commands = [
    ["git", "add", "."],
    ["git", "commit", "-m", "cps-cli-upload"],
    ["git", "push", "origin", "master"],
  ];

  for (let command of commands) {
    await ctx.shell(command, { cwd });
  }
}

/**
 * @Description - 复制图片到 upload.local.path
 */
async function copyImg(imgList, destPath) {
  const result = [];
  for (let imgPath of imgList) {
    let srcImg = path.resolve(imgPath);
    let destImg = path.resolve(destPath, path.basename(imgPath));

    if (fse.lstatSync(srcImg)) {
      await fse.copy(srcImg, destImg);
      result.push(destImg);
    }
  }

  return result;
}

/**
 * @Description - 打印符合Typora格式的结果
 *
 * @param {params} imgList  - {description}
 *
 * ```text
 * Upload Success:
 * http://localhost:3000/ccvb/test.png
 * file:///c:/ccvb/test.png
 * ```
 */
function printTyporaResult(imgList, msg = "Upload Success:") {
  if (imgList.length > 0) {
    console.log(msg);
    for (let each of imgList) {
      console.log(`${each}`);
    }
  }
}

function convertHttpProtocol(contextList, url, protocol = "http") {
  const result = [];
  contextList.forEach(item => {
    const filename = path.basename(item);
    const staticRoute = path.basename(path.dirname(item));

    result.push(`${protocol}://${url}/${staticRoute}/${filename}`);
  });
  return result;
}

function convertFileProtocol(contextList) {
  const result = [];
  let prefix = `file:///`;
  contextList.forEach(item => {
    result.push(`${prefix}${item}`);
  });
  return result;
}

export default async ctx => {
  const imgPathList = ctx.argv;
  const config = ctx.configManager.getConfig("upload");
  const cwd = config["local"]["path"];

  // 目录校验
  if (!fse.existsSync(cwd)) return Exit(0);

  // 更新仓库（可能需要强制同步）
  await ctx.shell(["git", "pull", "origin", "master"], { cwd });

  // 文件复制
  const result = await copyImg(imgPathList, cwd);
  if (!result.length > 0) return Exit(0);

  // 上传仓库
  if (config["auto_push"]) await gitPush(ctx);

  let imgList = [];
  if (config["server"].enable) {
    const port = config.server["port"] || ctx.pkg.config["port"];
    const url = `localhost:${port}`;
    const hasLocalServer = await checkUrl(`http://${url}`);

    // start server with alone
    if (!hasLocalServer) await runServerAlone();

    imgList = convertHttpProtocol(result, url);
  } else {
    imgList = convertFileProtocol(reslut);
  }

  printTyporaResult(imgList);
  Exit(0);
};
