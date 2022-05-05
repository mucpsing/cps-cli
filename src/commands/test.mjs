import { log } from "console";

import axios from "axios";
import chalk from "chalk";

async function checkServer(ctx) {
  const config = ctx.configManager.config["upload"];
  const port = config.server.port || ctx.pkg.config.port;
  const baseURL = `localhost:${port}`;

  axios.defaults.baseURL = baseURL;

  try {
    const res = await axios.get("/", { timeout: 2000 });
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    // statements
    log(e);
    return false;
  }
}

async function startServer(config) {}

export default async ctx => {
  log(chalk.bold.green("TEST DEBUG: "));
  const res = await checkServer(ctx);
  console.log("res: ", res);
};
