#!/usr/bin/env node
//@ts-check
import path from "path";

import fse from "fs-extra";
import { Command } from "commander/esm.mjs";

import Config from "./commands/config.mjs";
import WellcomeCommand from "./commands/wellcome.mjs";
import TemplateCommand from "./commands/template.mjs";
import UploadCommand from "./commands/upload.mjs";
import ServerCommand from "./commands/Server.mjs";
import TestCommand from "./commands/test.mjs";

import * as utils from "./utils/index.mjs";

// 解析参数;
const options = new Command()
  .option("-t, --template [tempaletName]", "下载常用模板 .cpsrc.template")
  .option("-a, --add <script>", "添加常用工具函数 .cpsrc.add")
  .option("-u, --upload <imgPath>", "上传图片到gitee/github仓库, 对应配置 .cpsrc.upload")
  .option("-s, --server [port]", "对应配置 .cpsrc.upload.server")
  .option("--test [any]", "测试命令")
  .parse()
  .opts();

(async () => {
  const pkgPath = path.resolve(path.dirname(process.argv[1]), "../package.json");
  const configManager = new Config();

  const ctx = {
    configManager, // 根据入参有不同的初始化选项
    pkg: fse.readJSONSync(pkgPath),
    utils,
    argv: process.argv.slice(3, process.argv.length), // {string[]} 对应命令所需要的参数
  };

  let RunCommand;
  let configInitOptions = { showLog: true };

  if (JSON.stringify(options) == "{}") {
    // 默认入口
    RunCommand = WellcomeCommand;
  } else if (options.template) {
    // template 入口
    RunCommand = TemplateCommand;
  } else if (options.upload) {
    // 上传插件不需要显示输出
    configInitOptions.showLog = false;
    RunCommand = UploadCommand;
  } else if (options.test) {
    // 测试入口
    configInitOptions.showLog = false;
    RunCommand = TestCommand;
  } else if (options.server) {
    // cps -s
    // 本地静态服务器入口
    RunCommand = ServerCommand;
  } else {
    // 默认入口
    RunCommand = WellcomeCommand;
  }

  await ctx.configManager.init(configInitOptions);
  await RunCommand(ctx);
})();
