// import child_process from "child_process";
import { log } from 'console';
import path from 'path';

import chalk from 'chalk';
import type { Ctx } from '../globaltype.mjs';

export default async (ctx: Ctx) => {
  const pngquantPath = path.resolve('../../tools/pngquant/pngquant.exe');
  log(chalk.bold.green(`pngquantPath: ${pngquantPath}`));
};
