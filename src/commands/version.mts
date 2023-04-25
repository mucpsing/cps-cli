/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-11-07 16:17:29.562967
 * @Last Modified by: CPS
 * @Last Modified time: 2022-11-07 16:17:29.562967
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\commands"
 * @Filename "version.mjs"
 * @Description: 管理当前插件的版本号，如果版本低于源，进行升级提示
 */

import path from 'path';
import fse from 'fs-extra';

import { shell } from '../utils/index.mjs';

const main = async ctx => {
  const pkgPath = path.resolve(path.dirname(process.argv[1]), '../../package.json');
  const pkgJson = fse.readJSONSync(pkgPath);

  const currtVersion = pkgJson.version;

  const command = ['npm', 'list', '-g', '@mucpsing/cli'];

  const latestVersion = await shell(command);

  console.log('latestVersion: ', latestVersion);
};

(async () => {
  await main();
})();

export default main;
