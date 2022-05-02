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
import { log } from "console";

import fse from "fs-extra";

export default async msg => {
  const temp_path = "d:\\@cps-cli.log";

  await fse.ensureFile(temp_path);
  await fse.writeFile(temp_path, msg.toString());

  log("upload done !");
  return msg;
};
