import chalk from "chalk";
import { build as viteBuild } from "vite";

process.env.NODE_ENV = "production";

const viteConfigs = {
  main: "config/cps-cli-vite.config.ts",
};
