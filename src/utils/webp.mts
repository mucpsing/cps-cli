/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-05-09 09:56:30.938141
 * @Last Modified by: CPS
 * @Last Modified time: 2023-05-09 09:56:30.938141
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "webp.mts"
 * @Description: 专门处理图片转换成webp
 */

import fs from 'fs';
import path from 'path';
import { spawnSync, spawn } from 'child_process';
import { promisify } from 'util';

import { glob } from 'glob';

const exists = promisify(fs.exists);
const spawnp = promisify(spawn);

export interface WebpOptions {
  output?: string;
  speed?: 1 | 2 | 3 | 4 | 5 | 6; // 最大6 越慢质量越高
  ext?: string; //自定义后缀名
  overwrite?: boolean;
}

export interface WebpConfig {
  cwebpPath?: string; // 负责将jpeg、png、tiff转换为webp的二进制文件路径
  gif2webpPath?: string; // 负责将gif转换成webp的二进制文件路径
}

const DEFAULT_OPTIONS: WebpOptions = {};

export default class Webp {
  private config?: WebpConfig;
  private options?: WebpOptions;
  private default_options?: WebpOptions = DEFAULT_OPTIONS;
  private switch: { cwebp: boolean; git2webp: boolean } = { cwebp: false, git2webp: false };

  private binPathCwebp: string = 'cwebp'; // 二进制文件执行目录，默认全局指令
  private binPathGif2webp: string = 'gif2webp'; // 二进制文件执行目录，默认全局指令

  constructor(config?: WebpConfig, options?: WebpOptions) {
    if (config) this.config = config;

    if (options) this.options = options;

    this._check();
  }

  /**
   * @description 判断实例化过程中的所有过程是否合法，参数是否合法
   */
  private _check = () => {
    // 如果在初始化实例是传入了config，表示用户需要指定某些自定义配置
    if (this.config) {
      if (this.config.cwebpPath) {
        if (fs.existsSync(this.config.cwebpPath)) {
          this.binPathCwebp = this.config.cwebpPath;
        }
      }

      if (this.config.gif2webpPath) {
        if (fs.existsSync(this.config.gif2webpPath)) {
          this.binPathGif2webp = this.config.gif2webpPath;
        }
      }
    }

    // 检查cwebp指令
    const checkGlobal = spawnSync(this.binPathCwebp, ['-h']);
    if (checkGlobal.status == 0) {
      // 通过检查，开启jpeg、png、tiff 这几个格式的转换功能
      // this.options.
      console.log('jpg、png、tiff转换功能测试通过');
      this.switch.cwebp = true;
    } else {
      console.log('checkGlobal: ', checkGlobal);
    }

    // 检查git2webp指令
    const checkGif = spawnSync(this.binPathGif2webp, ['-h']);
    if (checkGif.status == 0) {
      this.switch.git2webp = true;
      console.log('git2webp转换功能测试通过');
    } else {
      console.log('checkGif: ', checkGif);
    }

    // throw '调用 pngquant 失败，请确检查该程序';
  };

  public convert = async (imgPath: string, outputImgPath: string = '') => {
    imgPath = path.resolve(imgPath);
    const pathInfo = path.parse(imgPath);

    if (!fs.existsSync(imgPath)) {
      console.log('文件不存在: ', imgPath);
      return '';
    }

    const fileinfo = fs.statSync(imgPath);
    if (!fileinfo.isFile()) {
      console.log('目标文件不合法: ', imgPath);
      return '';
    }

    if (!outputImgPath) {
      outputImgPath = path.join(pathInfo.dir, `${pathInfo.name}.webp`);
    }

    switch (pathInfo.ext) {
      case '.png':
      case '.jpeg':
      case '.jpg':
      case '.tiff':
        console.log('使用this.cwebp处理: ');
        return await this.cwebp(imgPath, outputImgPath);

      case '.gif':
        console.log('使用this.gif2webp处理: ');

        return this.gif2webp(imgPath);
      default:
        console.log('不支持的文件格式: ', pathInfo.ext);
        return '';
    }
  };

  /**
   * @description 转换jpg、png、tiff文件
   */
  private cwebp = async (input: string, output: string) => {
    let param: string[] = ['-mt', '-m', '6', input, '-o', output];
    try {
      // const { status, stderr, stdout } = spawnSync(this.binPathCwebp, param);
      // if (status == 0) return output;
      // if (stderr) console.log(`转换${input}出错: `, stderr.toString());

      const res = await spawnp(this.binPathCwebp, param, {});
      console.log('res: ', res);

      return '';
    } catch (error) {
      console.log('【cwebp】 error: ', error);
      return '';
    }
  };

  private gif2webp = async (input: string) => {
    try {
    } catch (error) {
      console.log('【cwebp】 error: ', error);
    }
  };
}

(async () => {
  const webp = new Webp();

  const res = await webp.convert('D:/temp/png/test(2).png');

  // console.log('res: ', res);
})();
