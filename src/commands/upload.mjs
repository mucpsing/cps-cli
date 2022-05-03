/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-05-02 08:05:22.433389
 * @Last Modified by: CPS
 * @Last Modified time: 2022-05-02 08:05:22.433389
 * @Projectname
 * @file_path "D:\CPS\MyProject\demo\cps-cli\cps-cli\src\commands"
 * @Filename "upload.mjs"
 * @Description: 功能描述
 */

import { resolve, basename } from "path";
import { log } from "console";

import fse from "fs-extra";

function Exit(code) {
  return process.exit(code);
}

export default async ctx => {
  const temp_path = "d:\\@cps-cli.log";
  const imgPathList = ctx.argv;
  const config = ctx.configManager.config["upload"];

  // await fse.ensureFile(temp_path);
  // await fse.writeFile(temp_path, imgPathList.toString());
  switch (config["handler"]) {
    case "local":
      // statements_1

      const uploadConfig = config["local"];
      const cwd = uploadConfig["path"];
      if (!fse.lstatSync(cwd)) Exit(0);

      let shellResult;
      shellResult = await ctx.shell(["git", "pull", "origin", "master"], { cwd });
      console.log("git pull: ", shellResult);
      if (!shellResult.success) Exit(0);

      // imgPathList.forEach(imgPath => {
      //   const src = resolve(imgPath);
      //   const dest = resolve(cwd, basename(imgPath));

      //   if (fse.lstatSync(src)) fse.copySync(src, dest);
      //   console.log(dest);
      // });

      shellResult = await ctx.shell(["git", "add", "."], { cwd });
      console.log("git add: ", shellResult);
      shellResult = await ctx.shell(["git", "commit", "-m", "cps-cli-upload"], { cwd });
      console.log("git commit: ", shellResult);
      shellResult = await ctx.shell(["git", "push", "origin", "master"], { cwd });
      console.log("git push: ", shellResult);

      Exit(0);
      break;
    case "picgo":

    default:
      return;
      break;
  }

  // 复制图片到本地路径

  return imgPathList;
};
