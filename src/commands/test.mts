// import child_process from "child_process";
import { log } from 'console';

import chalk from 'chalk';
import type { Ctx } from '../globaltype.mjs';

export default async (ctx: Ctx) => {
  log(chalk.bold.green(`test command`));
  // child_process.exec("cps -s");
};
