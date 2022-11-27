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

import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';

// 最大文件尺寸
const FILE_MAX_SIZE = 20;

function Exit(code) {
  return process.exit(code);
}

/**
 * @Description - 复制图片到 upload.local.path
 */
async function copyImg(imgList, destPath) {
  const result = [];
  for (let imgPath of imgList) {
    let srcImg = path.resolve(imgPath);
    let destImg = path.resolve(destPath, path.basename(imgPath));

    if (fse.existsSync(srcImg)) {
      await fse.copy(srcImg, destImg);
      result.push(destImg);
    }
  }

  return result;
}

/**
 * @Description - 打印符合Typora格式的结果
 *
 * @param {params} imgList  - {description}
 *
 * ```text
 * Upload Success:
 * http://localhost:3000/ccvb/test.png
 * file:///c:/ccvb/test.png
 * ```
 */
function printTyporaResult(imgList, msg = 'Upload Success:') {
  if (imgList.length > 0) {
    console.log(msg);
    for (let each of imgList) {
      console.log(`${each}`);
    }
  }
}

function convertHttpProtocol(contextList, url) {
  const result = [];
  contextList.forEach(item => {
    const filename = path.basename(item);
    const staticRoute = path.basename(path.dirname(item));

    result.push(`${url}/${staticRoute}/${filename}`);
  });
  return result;
}

function convertFileProtocol(contextList) {
  const result = [];
  let prefix = `file:///`;
  contextList.forEach(item => {
    result.push(`${prefix}${item}`);
  });
  return result;
}

function fileChecker(filePath) {
  let fileInfo = fs.statSync();

  // 文件大小检查
  if (fileInfo.size >= FILE_MAX_SIZE) {
    console.log(`当前文件太大，超过配置: ${FILE_MAX_SIZE}`);
    return false;
  }

  return true;
}

export default async ctx => {
  const imgPathList = ctx.argv;
  const config = ctx.configManager.getConfig('upload');
  const cwd = config['path'];

  // 目录校验
  if (!fse.existsSync(cwd)) return Exit(0);

  // 文件校验
  if (!fileChecker) return Exit(0);

  // 更新仓库（可能需要强制同步）
  let pullRes = await ctx.utils.gitPull(cwd);

  // 复制文件到新仓库
  const result = await copyImg(imgPathList, cwd);

  if (!result.length > 0) return Exit(0);

  // 上传仓库
  if (config['auto_push']) await ctx.utils.gitPushSync(cwd);

  let imgList = [];
  if (config.server['enable']) {
    const port = config.server['port'] || ctx.pkg.config['port'];
    const url = `http://localhost:${port}`;
    const hasLocalServer = await ctx.utils.checkUrl(url);
    console.log('hasLocalServer: ', hasLocalServer);

    // 独立子进程开启服务器
    if (!hasLocalServer) ctx.utils.runCommandAlone('cps -s');

    imgList = convertHttpProtocol(result, url);
  } else {
    imgList = convertFileProtocol(reslut);
  }

  printTyporaResult(imgList);
  Exit(0);
};
