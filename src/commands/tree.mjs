/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-08-04 16:39:19.539432
 * @Last Modified by: CPS
 * @Last Modified time: 2022-08-04 16:37:21.437360
 * @Projectname
 * @file_path "W:\CPS\MyProject\test"
 * @Filename "tree.ts"
 * @Description: 功能描述
 */

import fs from "fs";
import path from "path";
import { copyToPaste } from "../utils/index.mjs";

const DIR_PREFIX = "|--";
const FILE_PREFIX = "|--";
const FILE_PREFIX_LAST = "`--";
const BASE_PREFIX = "   |";
const LINE_SUFFIX = " #";
const FLODER_LIST = [];

const SUFFIX_REG = /\s(\w+)\//;

const TREE_LIST = [];
let CURRT_DEEP = 1;

function createTree(target_dir, indent = 1, exclude = ["node_modules", ".git"], maxRecursiveDeep = 100) {
  if (CURRT_DEEP >= maxRecursiveDeep) return console.log("超过最大递归深度");

  const preIdent = new Array(indent).join(BASE_PREFIX);

  // 前面的字符
  const dirinfo = fs.readdirSync(target_dir);
  const files = [];
  const dirs = [];

  // 区分文件夹或者文件
  for (let i = 0; i < dirinfo.length; i++) {
    // console.log(path.join(target, dirinfo[i]))
    let state = fs.statSync(path.join(target_dir, dirinfo[i]));
    if (state.isFile()) {
      files.push(dirinfo[i]);
    } else {
      if (!exclude.includes(dirinfo[i])) dirs.push(dirinfo[i]);
    }
  }

  // 文件夹操作
  if (CURRT_DEEP == 1) {
    let dirname = path.basename(target_dir);
    let title = `DIR:${dirname}`;
    console.log(title);
    TREE_LIST.push(`${title}`);
  }

  for (let i = 0; i < dirs.length; i++) {
    const dirName = `${preIdent}   ${DIR_PREFIX} ${dirs[i]}/`;
    console.log(dirName);
    TREE_LIST.push(`${dirName}`);

    // 递归
    let nextPath = path.join(target_dir, dirs[i]);
    let nextIdent = indent + 1;

    // 递归调用
    CURRT_DEEP += 1;
    createTree(nextPath, nextIdent, exclude, maxRecursiveDeep);
  }

  // 下一级的 文件目录 以及层级
  for (let i = files.length - 1; i >= 0; i--) {
    let fileSTR;
    if (i === 0) {
      fileSTR = `${preIdent}   ${FILE_PREFIX_LAST} ${files[i]}`;
    } else {
      fileSTR = `${preIdent}   ${FILE_PREFIX} ${files[i]}`;
    }

    console.log(fileSTR);
    TREE_LIST.push(fileSTR);
  }
}

function toFile(output_path = "", indent = "    ") {
  output_path = output_path ? output_path : "tree.txt";

  // 获取最大长度
  let maxLineLen = Math.max(...TREE_LIST.map(item => item.length));
  let resStr = "";

  // 填充空格
  TREE_LIST.map(line => {
    if (line.indexOf(path.basename(output_path)) < 0 && line.length <= maxLineLen) {
      let reg_res = line.split(SUFFIX_REG);
      console.log("reg_res: ", reg_res, reg_res.length);
      if (reg_res && reg_res.length == 3) {
        resStr += line + " ".repeat(maxLineLen - line.length) + LINE_SUFFIX + ` 「${reg_res[1]}」` + "\n";
      } else {
        resStr += line + " ".repeat(maxLineLen - line.length) + LINE_SUFFIX + " \n";
      }
    }
  });

  fs.writeFileSync(output_path, resStr);

  return resStr;
}

// test
// const target = path.resolve(".");
// createTree(target);

export default async ctx => {
  const target = process.cwd();
  const output_path = process.argv.length >= 4 ? process.argv[3] : "";

  // 读取目录并打印
  createTree(target);

  // 保存文件
  const resultStr = toFile(output_path);

  // 复制到粘贴板
  copyToPaste(resultStr);

  // 这个会阻碍复制命令
  // process.exit(0);
};
