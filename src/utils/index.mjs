import path from "path";
import { log } from "console";

import fse from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import moment from "moment";

export const delay = (time = 1000) => new Promise(resolve => setTimeout(resolve, time));

export const __dirname = () => path.dirname(import.meta.url);

export const __filename = () => path.basename(import.meta.url);

export const recodeTime = () => {
  moment.locale();
  return moment.format("L");
};

export const ifDirExists = async filePath => {
  if (fse.existsSync(filePath)) {
    const basename = path.basename(filePath);
    const { overwrite } = await inquirer.prompt([
      {
        name: "overwrite",
        type: "confirm",
        message: chalk.yellow.bold(`目标目录./${basename}/已存在，是否覆盖？`),
        default: false,
      },
    ]);

    if (overwrite) {
      try {
        await fse.removeSync(filePath);
        delay(500);
      } catch (err) {
        log(chalk.red.bold(`sorry, 删除目录${basename}失败：`));
        console.error(err);
        process.exit(0);
      }
    }
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
