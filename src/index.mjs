#!/usr/bin/env node
//@ts-check
import path from "path";
import { log } from "console";

import chalk from "chalk";
import fse from "fs-extra";

import Config from "./commands/config.mjs";
import template from "./commands/template.mjs";

// import CommandsHandler from "./commandsHandler.mjs";
import Wellcome from "./wellcome.mjs";
import { delay } from "./utils/index.mjs";
import { Command } from "commander/esm.mjs";

const program = new Command();
program
  .option("-t, --template [tempaletName]", "下载常用模板")
  .option("-a, --add <script>", "添加常用工具函数")
  .option(
    "-u, --upload <[img1, img2]>",
    "上传图片到gitee/github仓库,必须使用数组形式[]"
  )
  .parse();

const options = program.opts();

(async () => {
  const pkgPath = path.resolve(
    path.dirname(process.argv[1]),
    "../package.json"
  );

  const pkg = fse.readJSONSync(pkgPath);
  const ConfigManager = await Config();

  // 清除 Config 的打印信息
  console.clear();
  log(
    chalk.cyan.bold(`${pkg.name}@${pkg.version}`),
    " --- ",
    chalk.yellow.bold(`最后更新: ${ConfigManager.config.modify_time}`)
  );

  if (JSON.stringify(options) == "{}") {
    return Wellcome();
  }

  if (options.template) {
    log("options.template: ", options.template);
    return template(options.template);
  }
})();
