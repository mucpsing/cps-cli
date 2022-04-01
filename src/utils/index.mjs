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

export const delay = (time = 1000) => new Promise(resolve => setTimeout(resolve, time));

export const __dirname = () => path.dirname(import.meta.url);

export const __filename = () => path.basename(import.meta.url);
