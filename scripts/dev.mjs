import chalk from "chalk";
import { builtinModules } from "module";
import { defineConfig } from "vite";
import pkg from "../package.json";
import path from "path";

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/main"),
});
