/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-28 21:18:04.173157
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-28 21:18:04.173157
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\commands"
 * @Filename "compress.mts"
 * @Description: 图片压缩功能：cps -c | --comporess
 */

import fs from 'fs';
import path from 'path';
import { log } from 'console';

import chalk from 'chalk';

import type { Ctx } from '../globaltype.mjs';
import Pngquant, { getPngQuantPath } from '../utils/pngquant.mjs';

export default async (ctx: Ctx) => {
  console.clear();

  let imgInput = ctx.argv[0] || '';
  let imgOutput = ctx.argv[1] || '';

  // 检查入参
  if (!imgInput) return log(chalk.red.bold('请输入目标图片'));

  // 没有传入输出路径，默认为覆盖原文件
  if (!imgOutput) return log(chalk.red.bold('请输输出位置，支持文件或者目录'));

  // 输出检查
  const inputInfo = fs.statSync(imgInput);
  if (!inputInfo || !inputInfo.isFile()) return log(chalk.red.bold('文件不存在或者不合法。'));

  // 判断为目录
  if (!imgOutput.endsWith('.png') && fs.existsSync(imgOutput)) {
    imgOutput = path.join(imgOutput, path.basename(imgInput));
  }

  // 最终执行
  const exePath = await getPngQuantPath();
  if (!exePath) return log(`${chalk.red.bold('pngquant文件不存在，无法执行压缩')}`);

  const PNG = new Pngquant({ exePath });
  const res = await PNG.compress(imgInput, imgOutput);
  console.log('res: ', res);
};
