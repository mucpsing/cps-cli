import path from "path";
import { log } from "console";

import fse from "fs-extra";

import { EMPTY_STRING } from "../env.mjs";
import { getOrgInfo } from "../utils/gitee-api.mjs";
import { currtTime } from "../utils/index.mjs";

const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc")}`;
const DEFAULT_ORG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc.org_info")}`;
const DEFAULT_ORG_NAME = "cps-cli-template";

export class ConfigManager {
  constructor(orgName = EMPTY_STRING) {
    this.configFilePath = DEFAULT_CONFIG_FILE_PATH;
    this.orgName = orgName || DEFAULT_ORG_NAME;
    this.ctime = currtTime();

    this.config = {};
    this.orgInfo = {};

    this.init();
  }

  async init() {
    // 读取本地配置文件
    await this._readFile();

    // 判断是否需要更新文件
    await this._readOrgFile();

    // 返回最终数据对象
    // log(this.config);
    // log(this.orgInfo);
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

    // display.start(`创建配置文件...`);
    const defaultConfig = {
      orgName: this.orgName,
      org_info_path: null,
      org_url: null,
      modify_time: this.ctime,
      add_time: this.ctime,
    };

    await fse.writeJson(file, defaultConfig, { spaces: "  " });
    // display.succeed("文件创建完成");

    return defaultConfig;
  }

  async _getOrgInfo(orgName = EMPTY_STRING) {
    orgName = orgName || this.config["org_name"] || DEFAULT_ORG_NAME;

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
    const isNnll = this.config.org_info_path == null;
    if (isNnll) this.config.org_info_path = DEFAULT_ORG_FILE_PATH;

    const isNotExist = !fse.existsSync(this.config["org_info_path"]);
    if (isNotExist) await fse.ensureFile(this.config["org_info_path"]);

    const isSameModifyTime = this.config["modify_time"] == this.ctime;

    const needUpdate = isNnll || isNotExist || !isSameModifyTime;
    if (needUpdate) {
      // log("获取线上数据");
      const { url, data } = await this._getOrgInfo();

      this.orgInfo = data;
      await fse.writeJson(this.config["org_info_path"], this.orgInfo, { spaces: "  " });

      this.config["modify_time"] = this.ctime;
      this.config["org_url"] = url;
      await fse.writeJson(this.configFilePath, this.config, { spaces: "  " });
    } else {
      // log("读取本地缓存");
      this.orgInfo = await fse.readJson(this.config["org_info_path"]);
    }
  }
}

// const Config = new ConfigManager()

export default new ConfigManager();

// (async () => {
//   console.log(DEFAULT_CONFIG_FILE_PATH);

//   const config = new ConfigManager();
// })();
