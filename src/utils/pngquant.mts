/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-24 15:50:09.393197
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 15:50:09.393197
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "pngquant.mjs"
 * @Description: 调用pngquant来压缩png图片
 *
 */
import path from 'path';
import fs from 'fs';
import child_process, { spawnSync } from 'child_process';

import * as shell from './shell.mjs';
import { resolve } from 'dns';

export interface PngQuantOptions {
  ext?: string;
  output?: string;
  qualityMin?: number;
  qualityMax?: number;
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  posterize?: 'ARGB444';
  skipIfLarger?: boolean;
  verbose?: boolean;
  force?: boolean;
}

export interface PngquantConfig {
  exePath: string;
}

const DEFAULT_OPTIONS: PngQuantOptions = {
  ext: '-pq.png',
  qualityMin: 65,
  qualityMax: 90,
  speed: 1,
  skipIfLarger: true,
  force: true,
};

export default class Pngquant {
  private default_options: PngQuantOptions = {};
  private options: PngQuantOptions;
  private pngquant: string = '';

  constructor(config: PngquantConfig, options?: PngQuantOptions) {
    this._check(config.exePath);

    this.options = Object.assign(this.default_options, options);
  }

  private _check = (pngquantPath: string) => {
    if (!fs.existsSync(pngquantPath)) throw 'pngquant.exe 不存在，请检查路径';

    const res = spawnSync(pngquantPath, ['-V']);

    if (res.status == 0) {
      this.pngquant = pngquantPath;
      return true;
    }

    throw '调用pngquant失败，请确检查该程序';
  };

  public compress = async (imgPath: string, outputDir?: string, outputName?: string) => {
    const basename = path.basename(imgPath);

    if (!fs.existsSync(imgPath)) return;

    const commands = [];
  };
}

(() => {
  const target = 'W:/CPS/MyProject/test/capsion.top_proview_1.png';
  const pngquant = path.resolve('../../tools/pngquant/pngquant.exe');
  const PNG = new Pngquant({ exePath: pngquant });

  PNG.compress(target);
})();
