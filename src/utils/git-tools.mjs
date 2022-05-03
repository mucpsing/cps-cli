/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2022-05-03 23:27:39.409328
 * @Last Modified by: CPS
 * @Last Modified time: 2022-05-03 23:27:39.409328
 * @Projectname
 * @file_path "D:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "git-tools.mjs"
 * @Description: 功能描述
 */

"use strict";
import { spawn } from "child_process";

export default class GitTools {
  /**
   * @param {String} cwd 工作目录
   * */
  constructor(cwd) {
    this.cwd = cwd;
    this.remark = "nodejs run git 默认备注信息";
  }

  /**
   * git add
   * */
  add() {
    const params = ["add", "."];

    return this.startChildProcess("git", params);
  }

  /**
   * git commit
   * @param {String} remark 备注信息
   * */
  commit(remark = "") {
    const params = ["commit", "-m", remark || this.remark];

    return this.startChildProcess("git", params);
  }

  /**
   * git push
   * @param {String} branch 分支名
   * */
  push(branch) {
    if (!branch) {
      throw "please input branch name !";
    }

    const params = ["push", "origin", branch];

    return this.startChildProcess("git", params);
  }

  /**
   * git checkout
   * @param {String} branch 分支名
   * */
  checkout(branch) {
    if (!branch) {
      throw "please input branch name !";
    }

    var params = ["checkout", branch];

    return new Promise(async (resolve, reject) => {
      let branchInfo = await this.branch();

      // 当前分支不为目标分支并且存在修改跳出
      if (branch != branchInfo.current) {
        var isChange = await this.status();
        if (isChange) {
          reject("当前有修改未提交无法切换分支");
          return;
        }
        // 切分支
        await this.startChildProcess("git", params);
        resolve();
      } else {
        resolve();
      }
    });
  }

  /**
   * git pull
   * @param {String} branch 分支名
   * */
  pull(branch) {
    if (!branch) {
      throw "please input branch name !";
    }

    var params = ["pull", "origin", branch];

    return this.startChildProcess("git", params);
  }

  /**
   * git pull
   * @return {Boolean} 是否存在修改
   * */
  async status() {
    try {
      var params = ["status", "-s"];
      let result = await this.startChildProcess("git", params);
      return result ? true : false;
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  /**
   * git branch
   * @return {String} current 当前分支
   * @return {Array} branchs 当前本地所有分支
   * */
  async branch() {
    var params = ["branch"];
    var result = await this.startChildProcess("git", params);

    var current = "";
    var branchs = result
      .split("\n")
      .map(item => {
        var reg = new RegExp(/\*/g);
        if (reg.test(item)) {
          item = item.replace(reg, "");
          current = item.trim();
        }
        return item.trim();
      })
      .filter(item => item);

    return {
      current,
      branchs,
    };
  }

  /**
   * 开启子进程
   * @param {String} command  命令 (git/node...)
   * @param {Array} params 参数
   * */
  startChildProcess(command, params) {
    console.log();
    console.log(`cwd:${this.cwd}`);
    console.log(`${command} ${params.join(" ")}`);
    console.log();

    return new Promise((resolve, reject) => {
      var process = spawn(command, params, {
        cwd: this.cwd,
      });

      var logMessage = `${command} ${params[0]}`;
      var cmdMessage = "";

      process.stdout.on("data", data => {
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on("close", data => {
        if (data) {
          reject(`${logMessage} error2 ! ${data}`);
        } else {
          resolve(cmdMessage);
        }
      });
    });
  }

  /**
   * 切换分支并拉取最新代码
   * @param {String} branch 目标分支
   * */
  async switchBreach(branch) {
    try {
      // 切分支
      await this.checkout(branch);

      // 拉取最新代码
      await this.pull(branch);

      return true;
    } catch (err) {
      console.error(err);
    }

    return false;
  }

  /**
   * 自动上传
   * @param {String} remark 备注的信息
   * @param {String} branch 目标分支
   * */
  async autoUpload(remark, branch) {
    try {
      // git checkout branch
      await this.checkout(branch);

      // git pull branch
      await this.pull(branch);

      // git add .
      await this.add();

      // git status -s
      var isChange = await this.status();

      if (isChange) {
        // git commit -m remark
        await this.commit(remark);

        // git push branch
        await this.push(branch);
      } else {
        console.log("not have to upload");
      }

      console.log("auto upload success !");

      return true;
    } catch (err) {
      console.error(err);
    }

    console.log("auto upload error !");
    return false;
  }
}
