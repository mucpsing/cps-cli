/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-01-11 10:23:42.345866
 * @Last Modified by: CPS
 * @Last Modified time: 2022-01-11 10:23:42.348858
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\lib"
 * @Filename "utils.mjs"
 * @Description: 功能描述
 */
import path from "path";

export function get__dirname() {
  return path.dirname(import.meta.url);
}

export function get__filename() {
  return path.basename(import.meta.url);
}

process.env.__dirname = "ccvb";
