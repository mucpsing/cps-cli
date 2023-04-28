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
import { spawnSync } from 'child_process';

import { glob } from 'glob';

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
  overwrite: false,
};

export default class Pngquant {
  private default_options: PngQuantOptions = DEFAULT_OPTIONS;
  private options: PngQuantOptions;
  private pngquant: string = '';
  private params: string[];

  /**
   * @example
   * ```ts
   *  // 初始化实例
   *  const pngquant = path.resolve('../../tools/pngquant/pngquant.exe');
   *  const PNG = new Pngquant({ exePath: pngquant }, { ext: '.1.png' });
   * 
   *  // 单文件压缩
   *  const imgInput = 'D:/temp/test(2).png';
   *  const imgOutput = 'd:/temp/img/testtt(2).png';
   *  const res = await PNG.compress(imgInput, imgOutput);
   
   *  // 文件夹压缩
   *  const imgDirInput = 'D:/temp/png';
   *  const imgDirOutput = 'd:/temp/img/';
   *  const res = await PNG.compresses(imgDirInput, imgDirOutput);
   * 
   * ```
   *
   */
  constructor(config: PngquantConfig, options?: PngQuantOptions) {
    this._check(config.exePath);

    this.options = Object.assign(this.default_options, options);
    this.params = this.createParams(this.options);
  }

  private _check = (pngquantPath: string) => {
    if (!fs.existsSync(pngquantPath)) throw `二进制文件：${pngquantPath} 不存在，请检查路径`;

    const res = spawnSync(pngquantPath, ['-V']);

    if (res.status == 0) {
      this.pngquant = pngquantPath;
      return true;
    }

    throw '调用 pngquant 失败，请确检查该程序';
  };

  /**
   * @description 合法检测，如：存在空格，图片文件是否真的存在
   */
  private _imgNameIsLegal = (imgPath: string) => {
    if (!fs.existsSync(imgPath)) {
      console.log('图片不存在，请检查图片路径');
      return imgPath;
    }

    if (imgPath.includes(' ')) {
      console.log('文件名称中存在空格或者特殊字符，无法进行处理');
      return imgPath;
    }

    return '';
  };

  /**
   * @description 压缩图片
   *
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
  public compress = async (imgPath: string, outputImgPath?: string) => {
    let res = { success: false };
    if (this._imgNameIsLegal(imgPath)) return imgPath;

    if (outputImgPath && !outputImgPath.endsWith('.png')) {
      console.log('图片输出路径无效，必须是.png后缀结尾的字符串');
      return imgPath;
    }

    const basename = path.basename(imgPath);
    const dirname = path.dirname(imgPath);
    const params = [imgPath, ...this.params];

    //指定了输出文件名，此处ext不再适用
    if (outputImgPath) {
      params.forEach((flag, i) => {
        if (flag.startsWith('--ext')) params[i] = '';
      });
      params.push(`--output=${outputImgPath}`);
    }

    try {
      const { status, stderr, stdout } = spawnSync(this.pngquant, params, { shell: true, windowsVerbatimArguments: false });

      switch (status) {
        case 98:
          console.log('图片可能属于已压缩，无任何操作');
          return imgPath;

        case 0:
          if (outputImgPath) return outputImgPath;

          let outName = basename;
          let outDir = dirname;

          if (this.options.ext) {
            let [name, ...__] = basename.split('.png');
            outName = `${name}${this.options.ext}`;
          } else {
            outName = `${outName}-fs8.png`;
          }
          return path.join(outDir, outName);

        default:
          console.log(`code[${status}]: `, imgPath);
          console.log({ status, stderr: stderr.toString(), stdout });
          console.log('commands: ');
          console.log([this.pngquant, ...params].join(' '));
      }
    } catch (err) {
      console.log('err: ', err);
      console.log('commands: ');
      console.log([this.pngquant, ...params].join(' '));
      return imgPath;
    }

    return imgPath;
  };

  public compresses = async (imgDirInput: string, imgDirOutput: string) => {
    if (!fs.existsSync(imgDirOutput)) fs.mkdirSync(imgDirOutput);

    const imgList = (await glob('**/*.png', { cwd: imgDirInput, ignore: 'node_modules/**' })).map(file => path.join(imgDirInput, file));

    if (imgList.length == 0) return console.log('没有找到任何图片');

    let res: string[] = [];
    imgList.forEach(async (imgPath: string) => {
      const basename = path.basename(imgPath);

      const output = path.join(imgDirOutput, basename);

      res.push(await this.compress(imgPath, output));
    });

    return res;
  };

  public createParams = (opts: PngQuantOptions) => {
    let params: string[] = ['--force'];

    params.push(`--quality=${opts.qualityMin}-${opts.qualityMax}`);
    if (opts['speed']) params.push(`--speed=${opts.speed}`);
    if (opts['skipIfLarger']) params.push('--skip-if-larger');

    // 覆盖源文件
    if (opts['overwrite']) {
      params.push(`--ext=.png`);
    } else {
      if (opts.ext) params.push(`--ext=${opts.ext}`);
    }

    return params;
  };
}

(async () => {
  /* 初始化实例 */
  const pngquant = path.resolve('../../tools/pngquant/pngquant.exe');
  const PNG = new Pngquant({ exePath: pngquant }, { ext: '.1.png' });

  /* 文件夹压缩 */
  const imgDirInput = 'D:/temp/png';
  const imgDirOutput = 'd:/temp/img/';
  // const res = await PNG.compresses(imgDirInput, imgDirOutput);

  /* 单文件压缩 */
  const imgInput = 'D:/temp/test(2).png';
  const imgOutput = 'd:/temp/img/testtt(2).png';
  // const res = await PNG.compress(imgInput, imgOutput);
})();
