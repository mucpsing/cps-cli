// import child_process from "child_process";
import { log } from 'console';

import chalk from 'chalk';

export default async ctx => {
  log(chalk.bold.green(`test command`));
  // child_process.exec("cps -s");
};
