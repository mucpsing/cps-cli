import path from "path";

import fse from "fs-extra";
import ora from "ora";

import { EMPTY_STRING } from "../env.mjs";
import { getOrgInfo } from "../utils/gitee-api.mjs";
import { currtTime, delay } from "../utils/index.mjs";

const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc")}`;
const DEFAULT_ORG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc.org_info")}`;
const DEFAULT_ORG_NAME = "cps-cli-template";

export class ConfigManager {
  constructor(orgName = EMPTY_STRING) {
    this.configFilePath = DEFAULT_CONFIG_FILE_PATH;
    this.orgName = orgName || DEFAULT_ORG_NAME;
    this.ctime = currtTime();
    this.display = ora();

    this.config = {
      template: { org_info: {} },
      upload: {},
    };
  }

  getConfig(key) {
    if (this.config.hasOwnProperty(key)) {
      return this.config[key];
    }
  }

  async init({ showLog = false }) {
    // 读取本地配置文件
    // 判断是否需要更新文件
    if (showLog) {
      const display = ora();
      display.start(`读取${DEFAULT_CONFIG_FILE_PATH}配置文件...`);
      await this._readFile();
      display.succeed(`读取${DEFAULT_CONFIG_FILE_PATH}配置文件 完成！`);
      await delay(500);
      display.start("正在读取缓存数据...");
      await this._readOrgFile();
      display.succeed("读取缓存数据 完成！");
      await delay(500);
    } else {
      await this._readFile();
      await this._readOrgFile();
    }
  }

  async _readFile() {
    if (fse.existsSync(this.configFilePath)) {
      this.config = await fse.readJson(this.configFilePath);
    } else {
      this.config = await this._createFile();
    }
  }

  async _createFile() {
    const file = this.configFilePath;
    const display = this.display;

    display.start(`创建配置文件...`);
    const defaultConfig = {
      template: {
        org_name: this.orgName,
        org_url: null,
        org_path: null,
        org_add_time: this.ctime,
        org_modify_time: this.ctime,
        org_info: {},
      },
      upload: {},
    };

    try {
      await fse.writeJson(file, defaultConfig, { spaces: "  " });
    } catch (err) {
      display.fail(".cpsrc 写入失败");
      await delay(1000);
      console.error(err);
      process.exit(0);
    }

    display.succeed("文件创建完成");
    return defaultConfig;
  }

  async _getOrgInfo(orgName = EMPTY_STRING) {
    orgName = orgName || this.config["template"]["org_name"] || DEFAULT_ORG_NAME;

    // this.display.start("获取远程组织仓库信息...");
    const { success, data, err, url } = await getOrgInfo(this.orgName);
    if (!success) {
      console.error(err);
      this.display.fail("获取组织信息失败");
      return false;
    }

    // this.display.succeed(`拉取组织${orgName}成功！`);
    return { data, url };
  }

  async _readOrgFile() {
    const hasOrgInfo = this.config["template"]["org_path"] == null;
    if (hasOrgInfo) this.config.org_info_path = DEFAULT_ORG_FILE_PATH;

    const orgInfoFileExist = !fse.existsSync(this.config["template"]["org_path"]);
    if (orgInfoFileExist) await fse.ensureFile(this.config["template"]["org_path"]);

    const isSameModifyTime = this.config["template"]["org_modify_time"] == this.ctime;

    const needUpdate = hasOrgInfo || orgInfoFileExist || !isSameModifyTime;
    if (needUpdate) {
      // log("获取线上数据");
      const { url, data: org_info_new } = await this._getOrgInfo();

      this.config["template"]["org_info"] = org_info_new;
      await fse.writeJson(this.config["template"]["org_path"], org_info_new, { spaces: "  " });

      this.config["template"]["org_modify_time"] = this.ctime;
      this.config["template"]["org_url"] = url;

      const config_new = Object.assign({}, this.config);
      // 离线仓库的数据太多，需要独立存放，提高配置文件可读性
      Reflect.deleteProperty(config_new["template"], "org_info");
      await fse.writeJson(this.configFilePath, config_new, { spaces: "  " });
    } else {
      // log("读取本地缓存");
      this.config["template"]["org_info"] = await fse.readJson(this.config["template"]["org_path"]);
    }
  }
}

export default ConfigManager;

// (async () => {
//   let config = await Config();
// })();
