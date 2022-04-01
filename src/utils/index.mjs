import path from "path";

export const delay = (time = 1000) =>
  new Promise(resolve => setTimeout(resolve, time));

export const __dirname = () => path.dirname(import.meta.url);

export const __filename = () => path.basename(import.meta.url);

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
