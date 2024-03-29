import path from 'path';
import child_process from 'child_process';
import { log } from 'console';

import fse from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import moment from 'moment';
import axios from 'axios';

export * from './shell.mjs';

export const delay = (time = 1000) => new Promise(resolve => setTimeout(resolve, time));

export const __dirname = () => path.dirname(import.meta.url);

export const __filename = () => path.basename(import.meta.url);

export const currtTime = () => moment().format('YYYY-MM-DD');

export const ifDirExists = async (filePath: string) => {
  if (fse.existsSync(filePath)) {
    const basename = path.basename(filePath);
    const { overwrite } = await inquirer.prompt([
      {
        name: 'overwrite',
        type: 'confirm',
        message: chalk.yellow.bold(`目标目录./${basename}/已存在，是否覆盖？`),
        default: false,
      },
    ]);

    if (overwrite) {
      try {
        await fse.remove(filePath);
        delay(500);
      } catch (err) {
        log(chalk.red.bold(`sorry, 删除目录${basename}失败：`));
        console.error(err);
        process.exit(0);
      }
    }
  }
};

export const Confirm = async (msg: string, defaultRes = false) => {
  const { res } = await inquirer.prompt([
    {
      name: 'res',
      type: 'confirm',
      message: msg,
      default: defaultRes,
    },
  ]);
  return res;
};

export const Input = async (msg: string, defaultRes = '') => {
  const { res } = await inquirer.prompt([
    {
      name: 'res',
      type: 'input',
      message: msg,
      default: defaultRes,
    },
  ]);
  return res;
};

/**
 * @Description - 检查一个url
 *
 * @param {params} baseURL  - {description}
 *
 * ```js
 * const canUse = await checkUrl('http://localhost:3000'):boolean
 * ```
 *
 */
export const checkUrl = async (url: string, data?: any) => {
  console.log('url: ', url);
  try {
    const http = axios.create({
      baseURL: url,
      timeout: 1000,
    });
    const res = await http.get('/');
    if (res) return true;
    return false;
  } catch (e) {
    return false;
  }
};

type R = 'number' | 'string' | 'symbol' | 'bigint' | 'unll' | 'undefined' | 'boolean';
function check_type_by_prototype(target: any): 'number' | 'string' | 'symbol' | 'bigint' | 'unll' | 'undefined' | 'boolean' {
  return Object.prototype.toString.call(target).toLowerCase().replace('[object ', '').replace(']', '') as R;
}

function check_type_by_typeof(target: any) {
  return typeof target;
}

export const copyToPaste = (data: any) => {
  switch (process.platform) {
    case 'darwin':
      //unix 系统内核
      child_process.exec('pbcopy').stdin?.end(data);
      break;
    case 'win32':
      //windows 系统内核
      child_process.exec('clip').stdin?.end(data);
      break;
    default:
      // Linux
      child_process.exec('xclip').stdin?.end(data);
  }
};

// export const inputSelect = async selection => {
//   const title = "template";
//   const answer = await inquirer.prompt([
//     {
//       type: "list",
//       name: title,
//       message: chalk.bgCyan("选择需要的项目模板："),
//       choices: selection,
//       default: 0,
//     },
//   ]);

//   return answer[title];
// };

// export default {
//   ...shell,
// };
