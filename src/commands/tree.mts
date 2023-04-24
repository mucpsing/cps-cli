/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-24 23:37:18.687811
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 23:36:05.335575
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\commands"
 * @Filename "tree.mts"
 * @Description: 生成目录树
 */

import fs from 'fs';
import path from 'path';
import { log } from 'console';

import chalk from 'chalk';
// import { StringDecoder } from 'string_decoder';

import { copyToPaste } from '../utils/index.mjs';

const DIR_PREFIX = '|--';
const FILE_PREFIX = '|--';
const FILE_PREFIX_LAST = '`--';
const BASE_PREFIX = '   |';
const LINE_SUFFIX = ' #';
// const FLODER_LIST = [];

const SUFFIX_REG = /\s(\w+)\//;
const TREE_LIST: string[] = [];
let CURRT_DEEP = 1;

export function createTree(
  target_dir: string,
  indent: number = 1,
  exclude: string[] = ['node_modules', '.git'],
  maxRecursiveDeep: number = 100
) {
  // 防止无限递归
  if (CURRT_DEEP >= maxRecursiveDeep) return console.log('超过最大递归深度');

  const preIdent = new Array(indent).join(BASE_PREFIX);

  // 前面的字符
  const dirinfo = fs.readdirSync(target_dir);
  const files = [];
  const dirs = [];

  // 区分文件夹或者文件
  for (let i = 0; i < dirinfo.length; i++) {
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

    log(chalk.greenBright.bold(title));
    TREE_LIST.push(`${title}`);
  }

  for (let i = 0; i < dirs.length; i++) {
    const dirName = `${preIdent}   ${DIR_PREFIX} ${dirs[i]}/`;

    // console.log(dirName);
    log(dirName.replace('|', chalk.red.bold('|')));
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

    // console.log(fileSTR);
    log(fileSTR.replace('|', chalk.blue.bold('|')));
    TREE_LIST.push(fileSTR);
  }
}

function toFile(output_path = '', indent = '    ') {
  output_path = output_path ? output_path : 'tree.txt';

  // 获取最大长度
  let maxLineLen = Math.max(...TREE_LIST.map(item => item.length));
  let resStr = '';

  // 填充空格
  TREE_LIST.map(line => {
    if (line.indexOf(path.basename(output_path)) < 0 && line.length <= maxLineLen) {
      let reg_res = line.split(SUFFIX_REG);
      if (reg_res && reg_res.length == 3) {
        resStr +=
          line + ' '.repeat(maxLineLen - line.length) + LINE_SUFFIX + ` 「${reg_res[1]}」` + '\n';
      } else {
        resStr += line + ' '.repeat(maxLineLen - line.length) + LINE_SUFFIX + ' \n';
      }
    }
  });

  fs.writeFileSync(output_path, resStr, { encoding: 'utf8' });

  return Buffer.from(resStr, 'utf-8').toString();
}

export default async (ctx: any) => {
  const target = process.cwd();
  const output_path = process.argv.length >= 4 ? process.argv[3] : '';

  // 读取目录并打印
  createTree(target);

  // 保存文件
  const resultStr = toFile(output_path);

  // 复制到粘贴板
  copyToPaste(resultStr);

  log(`\n🙋${chalk.yellow.bold('结果已复制到粘贴板！！')}`);
  // 这个会阻碍复制命令
  // process.exit(0);
};
