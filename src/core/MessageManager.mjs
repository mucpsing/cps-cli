import { EventEmitter } from "events";

import ora from "ora";

class MessageManager extends EventEmitter {
  constructor() {
    super();
    this.loadingMsg = ora("获取组织数据中...").start();

    this.on("msg:msg", this._show);
  }

  async _displayMsg() {}

  async _loadingMsg() {}
}
