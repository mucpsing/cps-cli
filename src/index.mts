#!/usr/bin/env node
//@ts-check
import path from 'path';

import fse from 'fs-extra';
import { Command } from 'commander';

import Config from './commands/config.mjs';

import CompressCommand from './commands/compress.mjs';
import WellcomeCommand from './commands/wellcome.mjs';
import TemplateCommand from './commands/template.mjs';
import UploadCommand from './commands/upload.mjs';
import ServerCommand from './commands/server.mjs';
import TestCommand from './commands/test.mjs';
import TreeCommand from './commands/tree.mjs';

import * as utils from './utils/index.mjs';

import type { Ctx } from './globaltype.mjs';

(async () => {
  // 解析参数;
  const program = new Command()
    .option('-v --version', '显示当前版本号')
    .option('-t, --template [tempaletName]', '下载常用模板 .cpsrc.template')
    .option('-a, --add <script>', '添加常用工具函数 .cpsrc.add')
    .option('-c, --compress <imgFile> <output>', '图片压缩(目前仅支持.png)')
    .option('-u, --upload <imgPath>', '上传图片到gitee/github仓库, 对应配置 .cpsrc.upload')
    .option('-s, --server [port]', '对应配置 .cpsrc.upload.server')
    .option('-tr, --tree', '生成当前目录的文件数')
    .option('--test [any]', '测试命令')
    .option('--config [key] [newKey]', '查看当前配置文件信息')
    .option('--test [intputPath] <outputPath>', '测试');

  const options = program.parse().opts();
  const pkgPath = path.resolve(path.dirname(process.argv[1]), '../package.json');
  const configManager = new Config();

  const ctx: Ctx = {
    configManager, // 根据入参有不同的初始化选项
    pkg: fse.readJSONSync(pkgPath),
    utils,
    argv: process.argv.slice(3, process.argv.length), //使用-u的话，后面的所有参数都解析为图片路径 {string[]} 对应命令所需要的参数
    program,
  };

  let RunCommand;
  let configInitOptions = { showLog: true };

  if (options.template) {
    // template 入口
    RunCommand = TemplateCommand;
  } else if (options.upload) {
    // 上传插件不需要显示输出
    configInitOptions.showLog = false;
    RunCommand = UploadCommand;
  } else if (options.test) {
    // 测试入口
    console.log('options: ', options);
    console.log(options.test);
    console.log({ ctx });
    configInitOptions.showLog = true;
    RunCommand = TestCommand;
    return;
  } else if (options.server) {
    // cps -s
    // 本地静态服务器入口
    RunCommand = ServerCommand;
  } else if (options.tree) {
    // cps -tr --tree
    // 本地静态服务器入口
    RunCommand = TreeCommand;
  } else if (options.compress) {
    RunCommand = CompressCommand;
  } else if (options.config) {
    RunCommand = configManager.parser;
  } else {
    // 默认进入可选菜单
    RunCommand = WellcomeCommand;
  }

  await ctx.configManager.init(configInitOptions);
  await RunCommand(ctx);
})();
