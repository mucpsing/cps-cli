/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-25 00:03:53.415160
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 23:47:20.497465
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\commands"
 * @Filename "server.mts"
 * @Description: 静态服务器功能，主要是绑定本地图片目录
 */

import chalk from 'chalk';
import ora from 'ora';

import { serverStart } from '../utils/server.mjs';

import type { Ctx } from '../globaltype.mjs';
import type { ConfigUpload } from './config.mjs';

export default async (ctx: Ctx) => {
  const config = ctx.configManager.getConfig('upload') as ConfigUpload;

  if (!config) return console.log('读取config失败');

  const port = config.server['port'] || ctx.pkg.config['port'];
  const cwd = config['path'];
  const display = ora();

  display.start(chalk.bold.red('获取仓库最新数据...\n'));
  await ctx.utils.shell(['git', 'add', '.', '&', 'git', 'commit', '-m', 'cps-cli-pull'], { cwd });
  await ctx.utils.shell(['git', 'pull', 'origin', 'master'], { cwd });

  display.start(chalk.bold.red('上传仓库最新数据...\n'));
  await ctx.utils.shell(['git', 'push', 'origin', 'master'], { cwd });

  const serverPort = await serverStart({ staticPath: cwd, port });
  display.succeed(chalk.bold.green(`server start succeed`));
  display.info(chalk.bold.yellow(`start local server at port:${serverPort}`));
  display.info(chalk.bold.yellow(`start local server at path:${cwd}`));
};
