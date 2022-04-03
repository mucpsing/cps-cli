import { EventEmitter } from "events";

import fse from "fs-extra";
import path from "path";
import ora from "ora";

import { EMPTY_STRING } from "../env.mjs";
import { getOrgInfo } from "../utils/gitee-api.mjs";

const DEFAULT_CONFIG_FILE_PATH = `${path.join(process.env.USERPROFILE, ".cpsrc")}`;
const DEFAULT_ORG_NAME = "cps-cli-template";

export class ConfigManager extends EventEmitter {
  constructor(orgName = EMPTY_STRING) {
    super();
    this.file = DEFAULT_CONFIG_FILE_PATH;
    this.orgName = orgName || DEFAULT_ORG_NAME;

    this.on("config:create", this._createFile);
    this.on("config:update", this._updateFile);
  }

  async init() {
    if (!fse.existsSync(this.file)) await this.createFile();
  }

  async _createFile() {
    const display = ora("正在创建配置文件...").start();

    fse.ensureFileSync(this.file);

    const { success, data, url, err } = await getOrgInfo(this.orgName);
    console.log("data: ", data);

    if (!success) {
      displayMsg.text = chalk.red("获取远程数据失败！");
      displayMsg.fail(err);

      display.fail();
      process.exit(0);
    }

    display.succeed("初始化完成。");
  }

  async _updateFile() {
    const display = ora("更新组织仓库信息中...").start();

    fse.ensureFileSync(this.file);
  }

  async setOrgName() {}
}

(async () => {
  console.log(DEFAULT_CONFIG_FILE_PATH);

  const config = new ConfigManager();

  config.emit("config:create");
})();
