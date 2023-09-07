/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 18:05:49.091977
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\commands"
 * @Filename "config.mts"
 * @Description: 配置管理对象，管理整个脚手架的所有配置
 */

import * as path from 'path';
import { log } from 'console';

import fse from 'fs-extra';
import ora, { type Ora } from 'ora';

import { EMPTY_STRING } from '../env.mjs';
import { getOrgInfo } from '../utils/gitee-api.mjs';
import { currtTime, delay } from '../utils/index.mjs';

import type { Ctx } from '../globaltype.mjs';

console.log(process.env.USERPROFILE ? process.env.USERPROFILE : 'no');

if (!process.env.USERPROFILE) process.env.USERPROFILE = '.';

const DEFAULT_ORG_NAME = 'cps-cli-template';
const DEFAULT_ORG_FILE_PATH = `${path.join(process.env.USERPROFILE, '.cpsrc.org_info')}`;
const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, '.cpsrc')}`;

export interface ConfigTemplate {
  org_name: string;
  org_url: string;
  org_path: string;
  org_info: object;
  org_add_time: string;
  org_modify_time: string;
}

export interface ConfigUpload {
  path: string;
  auto_push: boolean;
  compress?: boolean;
  server: {
    port: number;
    enable: boolean;
  };
}

export interface Config {
  template: ConfigTemplate;
  upload: ConfigUpload;
}

export class ConfigManager {
  public configFilePath: string;
  public orgName: string;
  public ctime: string;
  public display: Ora;
  public config: Config;
  private defaultConfig: Config;

  constructor(orgName = EMPTY_STRING) {
    this.configFilePath = DEFAULT_CONFIG_FILE_PATH;
    this.orgName = orgName || DEFAULT_ORG_NAME;
    this.ctime = currtTime();
    this.display = ora();
    this.defaultConfig = {
      template: {
        org_name: this.orgName,
        org_url: '',
        org_path: '',
        org_add_time: this.ctime,
        org_modify_time: this.ctime,
        org_info: {},
      },
      upload: {
        path: '',
        compress: true,
        auto_push: true,
        server: {
          port: 45462,
          enable: false,
        },
      },
    };

    this.config = Object.assign({}, this.defaultConfig);
  }

  parser(ctx: Ctx) {
    console.clear();

    let key = ctx.argv[0] || undefined;
    let newKey = ctx.argv[1] || undefined;

    if (newKey) {
      console.log('修改参数');
    } else if (key) {
      console.log('读取参数');
    } else {
      console.log('打印所有参数');
    }
  }

  getConfig(key: keyof Config) {
    if (this.config.hasOwnProperty(key)) {
      return this.config[key as keyof Config];
    }
  }

  setConfig(key: keyof Config, newKey?: keyof Config) {
    if (!newKey) {
      this.showConfig(key);
    }
  }

  showConfig(key?: keyof Config) {
    console.log(this.config);
  }

  async init({ showLog = false }) {
    // 读取本地配置文件
    // 判断是否需要更新文件
    if (showLog) {
      const display = ora();
      display.start(`读取${DEFAULT_CONFIG_FILE_PATH}配置文件...`);
      await this._readFile();
      display.succeed(`读取${DEFAULT_CONFIG_FILE_PATH}配置文件 完成！`);
      display.start('正在读取缓存数据...');
      await this._readOrgFile();
      display.succeed('读取缓存数据 完成！');
      console.clear();
    } else {
      await this._readFile();
      await this._readOrgFile();
    }
  }

  private async _readFile() {
    if (fse.existsSync(this.configFilePath)) {
      this.config = await fse.readJson(this.configFilePath);
    } else {
      this.config = await this._createFile();
    }
  }

  private async _createFile(): Promise<Config> {
    const file = this.configFilePath;
    const display = this.display;

    display.start(`创建配置文件...`);

    try {
      await fse.writeJson(file, this.defaultConfig, { spaces: '  ' });
    } catch (err) {
      display.fail('.cpsrc 写入失败');
      console.error(err);
      process.exit(0);
    }

    display.succeed('文件创建完成');
    return this.defaultConfig;
  }

  private async _getOrgInfo(orgName = EMPTY_STRING) {
    orgName = orgName || this.config['template']['org_name'] || DEFAULT_ORG_NAME;

    // this.display.start("获取远程组织仓库信息...");
    const { success, data, url } = await getOrgInfo(this.orgName);
    if (!success) {
      // console.error(err);
      this.display.fail('获取组织信息失败');
      return false;
    }

    // this.display.succeed(`拉取组织${orgName}成功！`);
    return { data: data as object, url: url as string };
  }

  private async _readOrgFile() {
    const orgInfoFileExist = fse.existsSync(DEFAULT_ORG_FILE_PATH);
    if (!orgInfoFileExist) await fse.ensureFile(DEFAULT_ORG_FILE_PATH);

    const isSameModifyTime = this.config['template']['org_modify_time'] == this.ctime;

    const needUpdate = !orgInfoFileExist || !isSameModifyTime;

    if (needUpdate) {
      // log("获取线上数据");
      const res = await this._getOrgInfo();
      if (res) {
        const { url, data: org_info_new } = res;

        // this.config['template']['org_info'] = org_info_new;
        await fse.writeJson(DEFAULT_ORG_FILE_PATH, org_info_new, { spaces: '  ' });

        this.config['template']['org_modify_time'] = this.ctime;
        this.config['template']['org_url'] = url;

        const config_new = Object.assign({}, this.config);

        // 离线仓库的数据太多，需要独立存放，提高配置文件可读性
        Reflect.deleteProperty(config_new['template'], 'org_info');
        await fse.writeJson(this.configFilePath, config_new, { spaces: '  ' });
      }
    }

    log('读取本地缓存');
    this.config['template']['org_info'] = await fse.readJson(DEFAULT_ORG_FILE_PATH);
  }
}

export default ConfigManager;
