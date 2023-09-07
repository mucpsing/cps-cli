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
import child_process from 'child_process';
import { promisify } from 'util';
import { glob, globSync } from 'glob';

const spawn = promisify(child_process.spawn);

export interface GifsicleOptions {
  compressMode?: 'lossy' | 'lossless'; // 有损|无损
  output?: string;
  colors?: 64 | 128 | 256; // gif 的颜色模式
  quality?: Number; // 有损压缩范围: 0-200
  overwrite?: boolean; // 覆盖原文件
}

export interface GifsicleConfig {
  bin?: string; // git
}

export default class Gif {
  private bin: string = 'gifsicle';
  private config: GifsicleConfig = {};
  private options: GifsicleOptions = {
    compressMode: 'lossy',
    quality: 100,
  };

  constructor(config: GifsicleConfig = {}, options?: GifsicleOptions) {
    if (options) this.options = Object.assign(this.options, options);

    if (config) this.config = config;

    this._check();
  }

  private _check = () => {
    // 检查配置
    if (this.config.bin) {
      this.config.bin = path.resolve(this.config.bin);
      if (fs.existsSync(this.config.bin)) {
        this.bin = this.config.bin;
      }
    }

    // 检查gitsicle指令是否能正确运行
    const checkGlobal = child_process.spawnSync(this.bin, ['-h']);
    if (checkGlobal.status != 0) {
      console.log('local check fail: ', checkGlobal);
      console.log('local check fail: ', this.bin);
      throw '初始化失败，请检查gifsicle二进制文件路径';
    }
  };

  private _gifCompress = async (inputGif: string, outputGif: string) => {
    try {
      let res;
      let params: string[] = [];
      switch (this.options.compressMode) {
        case 'lossy':
          params = ['-O3', `--lossy=${(this.options.quality as number) * 2}`, '-o', outputGif, inputGif];
          break;

        case 'lossless':
          params = ['-O3', '-o', outputGif, inputGif];
          break;

        default:
          console.log('没有指定模式或者其他地方出错了。');
          return '';
      }

      res = await spawn(this.bin, params, {});

      return outputGif;
    } catch (err) {
      console.log('_gifCompress fail: ', inputGif);
      console.log(err);
      return '';
    }
  };

  public compress = async (inputGifPath: string, outputGifPath: string = '') => {
    try {
      inputGifPath = path.resolve(inputGifPath);

      if (!fs.existsSync(inputGifPath)) {
        console.log(`${inputGifPath}，文件或者目录不存在。`);
        return '';
      }

      const inputInfo = fs.statSync(inputGifPath);
      if (inputInfo.isFile()) {
        if (!outputGifPath) outputGifPath = path.dirname(inputGifPath);

        return await this._gifCompress(inputGifPath, outputGifPath);
      } else if (inputInfo.isDirectory()) {
        if (!outputGifPath) outputGifPath = inputGifPath;

        if (!fs.statSync(outputGifPath).isDirectory()) throw '当输入是目录时，输出必须也是目录';

        const res = (await glob('**/*.gif', { cwd: inputGifPath, ignore: 'node_modules/**' })).map(async eachGif => {
          let inputGif = path.join(inputGifPath, eachGif);

          let output = path.join(outputGifPath, path.basename(eachGif));

          return await this._gifCompress(inputGif, output);
        });

        return res;
      } else {
        console.log('nothing to doing');
        return '';
      }
    } catch {
      console.log('请检查输入和输出位置是否合法');
      return '';
    }
  };
}

/**
 * @Description - 测试结果，有损压缩率大概为56%，无损压缩率大概为
 */
async function test() {
  const gif = new Gif({ bin: '../../tools/gif/gifsicle.exe' }, { compressMode: 'lossy' });

  // const target = 'D:/temp/gif1';
  const target = 'D:/CPS/MyProject/markdown-image';
  const output = 'D:/temp/gif2';
  // console.log('output: ', outtargetput);

  const res = await gif.compress(target, output);

  console.log('res: ', res);
}

// test();
