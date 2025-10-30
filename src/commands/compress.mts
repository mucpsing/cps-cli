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
  let imgOutput = ctx.argv[1] || undefined;

  // 检查入参
  if (!imgInput) return log(chalk.red.bold('请输入目标图片'));

  // 没有传入输出路径，默认为覆盖原文件
  if (imgOutput) {
    if (!fs.existsSync(imgInput)) return log(chalk.red.bold('输入不正确'));

    // 输出检查
    if (!imgOutput.endsWith('.png') && fs.existsSync(imgOutput)) {
      imgOutput = path.join(imgOutput, path.basename(imgInput));
    }

    imgOutput = path.resolve(imgOutput);
  }

  // 输入检查
  // 最终执行
  const exePath = await getPngQuantPath();
  if (!exePath) return log(`${chalk.red.bold('pngquant文件不存在，无法执行压缩')}`);
  const PNG = new Pngquant({ exePath }, { ext: '.png' });
  const inputInfo = fs.statSync(imgInput);

  imgInput = path.resolve(imgInput);
  if (inputInfo.isFile() && imgInput.endsWith('.png')) {
    console.log('输入是一个文件: ', imgInput);

    const res = PNG.compress(imgInput);
    console.log('res: ', res);
  } else if (inputInfo.isDirectory()) {
    console.log(chalk.blue.bold('将进行批量处理:'));
    console.log('✍输入目录: ', imgInput);
    console.log('🚪输出目录: ', imgOutput ? imgOutput : imgInput);
    ctx.configManager.display.start('图片压缩开始: \n');

    const resList = await PNG.compresses(imgInput, imgOutput);
    ctx.configManager.display.succeed(`图片压缩完成，处理图片: ${resList.length}个`);
  }
};
