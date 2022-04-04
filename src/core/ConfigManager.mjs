import path from "path";
import { log } from "console";
import { EventEmitter } from "events";

import fse from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";

import { EMPTY_STRING } from "../env.mjs";
import { getOrgInfo } from "../utils/gitee-api.mjs";
import { delay, currtTime } from "../utils/index.mjs";

const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cps-cli_org")}`;
const DEFAULT_ORG_NAME = "cps-cli-template";

export class ConfigManager extends EventEmitter {
  constructor(orgName = EMPTY_STRING) {
    super();
    this.configFilePath = DEFAULT_CONFIG_FILE_PATH;
    this.config = {};
    this.data = {};
    this.orgName = "";
    this.display = ora();

    // this.on("config:create", this._createFile);
    // this.on("config:update", this._updateFile);

    this.init();
  }

  async init() {
    const display = this.display;
    const ctime = currtTime();

    if (!fse.existsSync(this.configFilePath)) {
      console.log("配置文件不存在");
      await this._createFile();
    }

    // 读取本地配置文件
    this.config = await this._readFile();

    // 查看本地文件的 org_info 是否未空({})
    if (this.config.org_info == null || !fse.existsSync(this.config.org_info)) {
      log("需要更新组织仓库数据");
    }

    // 判断modify_time是否跟现在相同（一天更新一次）
  }

  async _readFile() {
    const file = this.configFilePath;

    const data = await fse.readJson(file);

    return data;
  }

  async _createFile(orgName = "") {
    const file = this.configFilePath;
    const display = this.display;

    display.start(`创建配置文件...`);
    const ctime = currtTime();
    const defaultConfig = {
      orgName: orgName || DEFAULT_ORG_NAME,
      modify_time: ctime,
      add_time: ctime,
      org_info: null,
    };

    await fse.writeJson(file, defaultConfig, { spaces: "  " });
    display.succeed("文件创建完成");
  }

  async _getOrgInfo(orgName = EMPTY_STRING) {
    org_name = orgName || DEFAULT_ORG_NAME;

    this.display.start("获取远程组织仓库信息...");
    const { success, data, url, err } = await getOrgInfo(this.orgName);
    if (!success) {
      console.error(err);
      this.display.fail("获取组织信息失败");
      return { success: false, err };
    }

    this.display.succeed("拉取组织${orgName}成功！");
    return { success: true, res: data };
  }

  async _updateFile() {
    const display = this.display;
    const file = this.configFilePath;

    await fse.writeJson(file, defaultConfig);
  }

  async setOrgName() {}
}

(async () => {
  console.log(DEFAULT_CONFIG_FILE_PATH);

  const config = new ConfigManager();
})();
