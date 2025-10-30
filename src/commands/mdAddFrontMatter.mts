/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2025-10-30 16:14:01.092905
 * @Last Modified by: CPS
 * @Last Modified time: 2025-10-30 16:14:01.092905
 * @Projectname
 * @file_path "W:\CPS\MyProject\projsect_persional\cps-cli\cps-cli\src\commands"
 * @Filename "mdFrontMatter.mts"
 * @Description: 处理md文件，对md文件头部进行扫描，添加默认的文件头
 */

import fse from 'fs-extra';
import path from 'path';
import type { Ctx } from '../globaltype.mjs';

export interface BaseFrontMatterT {
  ['{title}']: string;
  ['{description}']: string;
}

export interface DocusarursV2FrontMatterT extends BaseFrontMatterT {
  ['{update_time}']: string;
}

export interface MdFileInfoT {
  file_base_name: string;
  update_time: string; // 使用格式2025-10-30 12:00:00
}

const DEFAULT_FRONT_MATTER = {};

async function getFileInfoFromMd(mdFileFullPath: string) {
  mdFileFullPath = path.resolve(mdFileFullPath);

  if (!fse.existsSync(mdFileFullPath)) return false;

  const fileInfo = await fse.stat(mdFileFullPath);

  console.log(fileInfo);
}

(async ()=>{
  console.log('tettttttt')

  await getFileInfoFromMd("W:/CPS/MyProject/cps/cps-blog/docs/【02】后端开发/ffmpeg")
})()

export default async (ctx:Ctx)=>{
  const targetpath = ctx.argv

  // 判断是文件夹还是文件
  console.log({targetpath})
}


