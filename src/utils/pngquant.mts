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

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';

import { spawnSync, spawn, exec } from 'child_process';

const execp = promisify(exec);
const spawnp = promisify(spawn);

export interface PngQuantOptions {
  ext?: string;
  output?: string;
  qualityMin?: number;
  qualityMax?: number;
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  posterize?: 'ARGB444';
  skipIfLarger?: boolean;
  verbose?: boolean;
  overwrite?: boolean; // 覆盖原文件
}

export interface PngquantConfig {
  exePath: string;
}

const DEFAULT_OPTIONS: PngQuantOptions = {
  ext: '-pq.png', // 默认是fs8.png 如果使用 .png 则可以保留原名称
  qualityMin: 65,
  qualityMax: 90,
  speed: 1,
  skipIfLarger: true,
  overwrite: true,
};

export default class Pngquant {
  private default_options: PngQuantOptions = DEFAULT_OPTIONS;
  private options: PngQuantOptions;
  private pngquant: string = '';

  constructor(config: PngquantConfig, options?: PngQuantOptions) {
    this._check(config.exePath);

    this.options = Object.assign(this.default_options, options);
  }

  private _check = (pngquantPath: string) => {
    if (!fs.existsSync(pngquantPath)) throw `二进制文件：${pngquantPath} 不存在，请检查路径`;

    const res = spawnSync(pngquantPath, ['-V']);

    if (res.status == 0) {
      this.pngquant = pngquantPath;
      return true;
    }

    throw '调用pngquant失败，请确检查该程序';
  };

  /**
   * @description 压缩图片唯一暴露函数
   * @example
   * ```js
   * // ext 设置.png 则保留原文件名
   * const PNG = new Pngquant({ exePath: pngquant }, { ext: '.png' });
   *
   * const res = await PNG.compress(target);
   *
   * console.log('图片压缩结果: ', res);
   * ```
   */
  public compress = async (
    imgPath: string,
    opts: { outputDir?: string; outputName?: string } = {}
  ) => {
    if (!fs.existsSync(imgPath)) {
      console.log('图片不存在，请检查图片路径');
      return imgPath;
    }

    const params = this.createParams(imgPath);
    const basename = path.basename(imgPath);
    const dirname = path.dirname(imgPath);

    if (opts.outputDir) console.log({ outputDir: opts.outputDir });

    try {
      const commands_str = [this.pngquant, ...params].join(' ');
      const res = await execp(commands_str, { encoding: 'utf-8', windowsHide: true });

      console.log('res: ', res);

      // console.log(1);
      // console.log('stderr: ', stderr);
      // console.log('stdout: ', stdout);
      // if (stdout) {
      //   let outName = basename;
      //   let outDir = dirname;

      //   if (opts.outputDir) outDir = opts.outputDir;
      //   console.log(2);

      //   if (opts.outputName) {
      //     let name, rest;
      //     if (opts.outputName) {
      //       [name, ...rest] = opts.outputName.split('.png');
      //     } else {
      //       [name, ...rest] = basename.split('.png');
      //     }
      //     outName = name;
      //   }

      //   console.log(3);

      //   if (this.options.ext) {
      //     outName = `${outName}${this.options.ext}`;
      //   } else {
      //     outName = `${outName}-fs8.png`;
      //   }
      //   console.log('this.options.ext: ', this.options.ext);

      //   return path.join(outDir, outName);
      // } else {
      //   if (stderr) {
      //     console.log('stderr: ', stderr);
      //     return imgPath;
      //   }
      // }
    } catch (err) {
      console.log('err: ', err);
      return imgPath;
    }

    return imgPath;
  };

  public compresses = async (imgDir: string, outputDir: string) => {
    if (fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const imgList = (await glob('**/*.png', { cwd: imgDir, ignore: 'node_modules/**' })).map(file =>
      path.join(imgDir, file)
    );

    if (imgList.length == 0) return console.log('没有找到任何图片');

    let res: string[] = [];
    imgList.forEach(async (imgPath: string) => {
      res.push(await this.compress(imgPath, { outputDir: outputDir }));
    });
  };

  public createParams = (imgPath: string, opts?: { output?: string }) => {
    let params: string[] = [imgPath];

    params.push(`--ext=${this.options.ext}`);
    params.push(`--quality=${this.options.qualityMin}-${this.options.qualityMax}`);

    if (this.options['speed']) params.push(`--speed=${this.options.speed}`);
    if (this.options['skipIfLarger']) params.push('--skip-if-larger');
    if (this.options['overwrite']) params.push('--force');

    if (opts) {
      if (opts.output) params.push(`--output=${opts.output}`);
    }

    return params;
  };
}

(async () => {
  const imgDir = 'D:/CPS/MyProject/markdown-image/image';
  const target = 'D:/temp/nodejs-pngquant/test-old.png';
  const outputDir = 'd:/temp/nodejs-pngquant';

  const pngquant = path.resolve('../../tools/pngquant/pngquant.exe');
  const PNG = new Pngquant({ exePath: pngquant }, { ext: '.1.png', overwrite: true });

  // const res = await PNG.compresses(imgDir, { outputDir });
  const res = await PNG.compress(target, { outputDir });

  console.log('图片压缩结果: ', res);
})();
