import path from "path";
import { EventEmitter } from "events";

import fse from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";

import { EMPTY_STRING } from "../env.mjs";
import { getOrgInfo } from "../utils/gitee-api.mjs";
import { delay, recodeTime } from "../utils/index.mjs";

const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc")}`;
const DEFAULT_ORG_NAME = "cps-cli-template";
const DISPLAY = org();

export class ConfigManager extends EventEmitter {
  constructor(orgName = EMPTY_STRING) {
    super();
    this.file = DEFAULT_CONFIG_FILE_PATH;
    this.config = {};
    this.data = {};
    this.orgName = "";

    this.on("config:create", this._createFile);
    this.on("config:update", this._updateFile);
  }

  async init() {
    if (!fse.existsSync(this.file)) await this.createFile();

    this.data = await fse.readJSON(this.file);
  }

  async _readFile() {}

  async _createFile(orgName) {
    const defaultConfig = {
      org_name: orgName,
      ModifyTime: recodeTime(),
      data: {},
    };

    display.start("初始化创建配置文件...");
    await fse.ensureFile(this.file);
    display.succeed("初始化配置文件成功！");

    display.start(`拉取组织${orgName}最新信息...`);
    const { success, data, url, err } = await getOrgInfo(this.orgName);
    if (!success) {
      display.fail(chalk.red("获取远程数据失败！"));
      console.error(err);
      process.exit(0);
    }
    display.succeed("拉取组织${orgName}成功！");

    display.start(`写入组织信息...`);
    defaultConfig.data[DEFAULT_ORG_NAME] = data;
    await fse.writeJson(this.file, defaultConfig);
    display.succeed("文件创建完成");
  }

  async _updateFile() {
    const display = ora("更新组织仓库信息中...").start();

    await fse.ensureFile(this.file);
  }

  async setOrgName() {}
}

(async () => {
  console.log(DEFAULT_CONFIG_FILE_PATH);

  const config = new ConfigManager();

  config.emit("config:create");
})();
