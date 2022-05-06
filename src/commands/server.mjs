import { log } from "console";
import chalk from "chalk";
import { serverStart } from "../utils/server.mjs";

export default async ctx => {
  const config = ctx.configManager.getConfig("upload");
  const port = config.server["port"] || ctx.pkg.config["port"];
  const cwd = config["path"];

  log(chalk.bold.green(`start local server at port:${port}`));
  await serverStart({ staticPath: cwd, port });
};
