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

const DIR_SUFFIX = "├─";
const FILE_SUFFIX = "|--";
const FILE_SUFFIX_LAST = "`--";

const TREE_LIST = [];

function createTree(target_dir, indent = 1, exclude = ["node_modules", ".git"], maxRecursiveDeep = 100, currtDeep = 1) {
  if (currtDeep >= maxRecursiveDeep) return console.log("超过最大递归深度");

  const preIdent = new Array(indent).join("   |");

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

  if (currtDeep == 1) {
    let title = `【Root】`;
    console.log(title);
    TREE_LIST.push(`${title}`);
  }

  for (let i = 0; i < dirs.length; i++) {
    const dirName = `${preIdent}   ${DIR_SUFFIX} ${dirs[i]}/`;
    console.log(dirName);
    TREE_LIST.push(`${dirName}`);

    // 递归
    let nextPath = path.join(target_dir, dirs[i]);
    let nextIdent = indent + 1;

    // 递归调用
    createTree(nextPath, nextIdent, exclude, maxRecursiveDeep, (currtDeep += 1));
  }

  // 下一级的 文件目录 以及层级
  for (let i = files.length - 1; i >= 0; i--) {
    let fileSTR;
    if (i === 0) {
      fileSTR = `${preIdent}   ${FILE_SUFFIX_LAST} ${files[i]}`;
    } else {
      fileSTR = `${preIdent}   ${FILE_SUFFIX} ${files[i]}`;
    }

    console.log(fileSTR);
    TREE_LIST.push(fileSTR);
  }
}

function toFile(output_path = "", indent = "    ") {
  output_path = output_path ? output_path : "tree.txt";

  let max = Math.max(...TREE_LIST.map(item => item.length));
  let res = "";

  TREE_LIST.map(line => {
    if (line.length < max) {
      res = res + line + " ".repeat(max - line.length) + "\n";
    }
  });

  fs.writeFileSync(output_path, res);

  return res;
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
