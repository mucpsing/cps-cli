/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-24 23:37:18.687811
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 23:36:05.335575
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\commands"
 * @Filename "wellcome.mts"
 * @Description: 交互界面
 */

import { log } from 'console';

import inquirer from 'inquirer';
import chalk from 'chalk';

import compress from './compress.mjs';
import tree from './tree.mjs';
import template from './template.mjs';
import server from './server.mjs';
import test from './test.mjs';

import type { Ctx } from '../globaltype.mjs';

const Wellcome = async (ctx: Ctx) => {
  const commands: { [key: string]: (ctx: any) => Promise<any | never> } = {
    template,
    server,
    test,
    tree,
    compress,
  };
  const config = ctx.configManager.config;

  console.clear();
  log(
    chalk.cyan.bold(`cps-cli@${ctx.pkg.version}`),
    ' --- ',
    chalk.yellow.bold(`最后更新: ${config['template']['org_modify_time']}`)
  );

  let { welcome: answers }: { welcome: string } = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'welcome',
      message: `${chalk.bgGreen('选择功能')}: (Use arrow keys)`,
      choices: [
        {
          name: '常用项目模板下载',
          value: 'template',
        },
        {
          name: '常用脚本下载',
          value: 'add',
        },
        {
          name: '开启本地静态服务器',
          value: 'server',
        },
        {
          name: '生成目录树',
          value: 'tree',
        },
        {
          name: '图片压缩(当前仅支持png)',
          value: 'compress',
        },
        {
          name: '测试',
          value: 'test',
        },
        {
          name: '帮助',
          value: 'help',
        },
      ],
      default: 0,
    },
  ]);

  if (commands[answers]) {
    commands[answers](ctx);
  } else {
    log(`${chalk.red('无效选择')}`);
  }
};

export default Wellcome;
