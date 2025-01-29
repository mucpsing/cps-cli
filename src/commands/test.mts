// import child_process from "child_process";
import { log } from 'console';
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';

import type { Ctx } from '../globaltype.mjs';


export default async (ctx: Ctx) => {
  const [dirname, ...rest] = process.argv[1].split('dist');
  const pngquantPath = path.resolve(dirname, 'tools/pngquant/pngquant.exe');

  log(chalk.bold.green(`pngquantPath: ${fs.existsSync(pngquantPath)}`));

  log(`${chalk.red('当前未设置静态服务器的图片目录')}`);
};
