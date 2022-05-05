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
import axios from "axios";
import { log } from "console";

import fse from "fs-extra";

function Exit(code) {
  return process.exit(code);
}

async function gitPush(shell, options) {
  const commands = [
    ["git", "add", "."],
    ["git", "commit", "-m", "cps-cli-upload"],
    ["git", "push", "origin", "master"],
  ];

  for (let command of commands) {
    await shell(command, options);
  }
}

/**
 * @Description - 给图片最终结果添加协议
 *
 * @param {string[]} imgList      {description}
 * @param {string} protocol='file'  {description}
 *
 * @returns {string[]} 123123123
 * ```js
 * //input: c:/ccvb/test.png
 *
 * //output: file:///c:/ccvb/test.png
 * ```
 */
function printTyporaResultFormat(imgList, protocol = "file") {
  let prefix;
  switch (protocol) {
    case "file":
      prefix = `file:///`;
      break;
    case "https":
      prefix = `https:///`;
      break;
    case "http":
      prefix = `http:///`;
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

/**
 * @Description - 复制图片到 upload.local.path
 *
 * @param {params} imgList   - {description}
 * @param {params} destPath  - {description}
 *
 * @returns {} - {description}
 *
 */
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

async function checkServer(ctx) {
  // 测试服务器是否已经开启
  const port = config.server.port || ctx.pkg.config.port;
  const url = `localhost:${port}`;

  try {
    const res = await axios.get(url);
    console.log("res: ", res);
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    // statements
    return false;
  }
}

async function localServer(imgList) {
  res = [];
  imgList.forEach(item => {
    const dirname = path.dirname(item);
  });
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
  const result = await copyImg(imgPathList, cwd);
  if (!result.length > 0) return Exit(0);

  // 上传仓库
  if (config["auto_push"]) await gitPush(ctx.shell, { cwd });

  // 打印结果给 Typora
  if (config["server"].enable) {
    protocol = "http";
  } else {
    protocol = "file";
  }

  await printTyporaResultFormat(result, "file");
};
