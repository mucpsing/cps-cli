/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-07-14 17:00:29.610740
 * @Last Modified by: CPS
 * @Last Modified time: 2023-07-14 17:00:29.610740
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "gifsicle.mts"
 * @Description: 调用gifsicle.exe来压缩gif文件，核心命令格式
 * gifsicle -O3 --lossy=200 .\input.gif -o output.gif - 【不好用，失真严重】
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { promisify } from 'util';

import { glob } from 'glob';

const exists = promisify(fs.exists);

export interface GifsicleOptions {
  compressMode?: 'lossy' | 'lossless'; // 有损|无损
  output?: string;
  colors?: 64 | 128 | 256; // gif 的颜色模式
  quality?: Number; // 有损压缩范围: 0-200
  overwrite?: boolean; // 覆盖原文件
}

const DEFAULT_OPTIONS: GifsicleOptions = {
  compressMode: 'lossy',
};

export default class GifCompress {
  private default_options: GifsicleOptions = DEFAULT_OPTIONS;
  // private options: GifsicleOptions;
  private bin: string = '';
  // private params: string[];
}
