"use strict";
/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 18:05:49.091977
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\commands"
 * @Filename "config.mts"
 * @Description: 配置管理对象，管理整个脚手架的所有配置
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
var path = require("path");
var console_1 = require("console");
var chalk_1 = require("chalk");
var inquirer_1 = require("inquirer");
var fs_extra_1 = require("fs-extra");
var ora_1 = require("ora");
var env_mjs_1 = require("../env.mjs");
var gitee_api_mjs_1 = require("../utils/gitee-api.mjs");
var index_mjs_1 = require("../utils/index.mjs");
console.log(process.env.USERPROFILE ? process.env.USERPROFILE : 'no');
if (!process.env.USERPROFILE)
    process.env.USERPROFILE = '.';
var DEFAULT_ORG_NAME = 'cps-cli-template';
var DEFAULT_ORG_FILE_PATH = "".concat(path.join(process.env.USERPROFILE, '.cpsrc.org_info'));
var DEFAULT_CONFIG_FILE_PATH = "".concat(path.join(process.env.USERPROFILE, '.cpsrc'));
var ConfigManager = /** @class */ (function () {
    function ConfigManager(orgName) {
        if (orgName === void 0) { orgName = env_mjs_1.EMPTY_STRING; }
        this.configFilePath = DEFAULT_CONFIG_FILE_PATH;
        this.orgName = orgName || DEFAULT_ORG_NAME;
        this.ctime = (0, index_mjs_1.currtTime)();
        this.display = (0, ora_1.default)();
        this.defaultConfig = {
            template: {
                org_name: this.orgName,
                org_url: '',
                org_path: '',
                org_add_time: this.ctime,
                org_modify_time: this.ctime,
                org_info: {},
            },
            upload: {
                path: '',
                compress: true,
                auto_push: true,
                mode: 'server',
                server: {
                    port: 45462,
                    enable: false,
                },
            },
        };
        this.config = Object.assign({}, this.defaultConfig);
    }
    ConfigManager.prototype.parser = function (ctx) {
        console.clear();
        var key = ctx.argv[0] || undefined;
        var newKey = ctx.argv[1] || undefined;
        if (newKey) {
            console.log('修改参数');
        }
        else if (key) {
            console.log('读取参数');
        }
        else {
            console.log('打印所有参数123123');
        }
    };
    ConfigManager.prototype.getConfig = function (key) {
        if (this.config.hasOwnProperty(key)) {
            return this.config[key];
        }
    };
    ConfigManager.prototype.setConfig = function (key, newData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.hasOwnProperty(key)) return [3 /*break*/, 2];
                        Object.assign(this.config[key], newData);
                        return [4 /*yield*/, this._createFile()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ConfigManager.prototype.showConfig = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(this.config);
                return [2 /*return*/];
            });
        });
    };
    ConfigManager.prototype.init = function (_a) {
        var _b = _a.showLog, showLog = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!showLog) return [3 /*break*/, 5];
                        this.display.start("\u8BFB\u53D6".concat(DEFAULT_CONFIG_FILE_PATH, "\u914D\u7F6E\u6587\u4EF6..."));
                        return [4 /*yield*/, (0, index_mjs_1.delay)(600)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this._readFile()];
                    case 2:
                        _c.sent();
                        this.display.succeed("\u8BFB\u53D6".concat(DEFAULT_CONFIG_FILE_PATH, "\u914D\u7F6E\u6587\u4EF6 \u5B8C\u6210\uFF01"));
                        this.display.start('正在读取缓存数据...');
                        return [4 /*yield*/, (0, index_mjs_1.delay)(600)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this._readOrgFile()];
                    case 4:
                        _c.sent();
                        this.display.succeed('读取缓存数据 完成！');
                        this.display.clear();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this._readFile()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this._readOrgFile()];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ConfigManager.prototype._readFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!fs_extra_1.default.existsSync(this.configFilePath)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, fs_extra_1.default.readJson(this.configFilePath)];
                    case 1:
                        _a.config = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, this._createFile()];
                    case 3:
                        _b.config = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConfigManager.prototype._createFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var file, display, message, anwser, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = this.configFilePath;
                        display = this.display;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!!this.defaultConfig.upload.path) return [3 /*break*/, 3];
                        display.clear();
                        display.stop();
                        (0, console_1.log)("".concat(chalk_1.default.yellow.bgCyan('当前未设置静态服务器的图片目录')));
                        message = "\u8BF7\u8F93\u5165\u9759\u6001\u56FE\u7247\u670D\u52A1\u5668\u7684\u76EE\u5F55\u8DEF\u5F84";
                        return [4 /*yield*/, inquirer_1.default.prompt({ name: 'path', type: 'input', message: message })];
                    case 2:
                        anwser = _a.sent();
                        if (anwser.path)
                            this.defaultConfig.upload.path = anwser.path;
                        _a.label = 3;
                    case 3:
                        display.start("\u521B\u5EFA\u914D\u7F6E\u6587\u4EF6...");
                        return [4 /*yield*/, fs_extra_1.default.writeJson(file, this.defaultConfig, { spaces: '  ' })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        // display.fail('.cpsrc 写入失败');
                        console.error(err_1);
                        process.exit(0);
                        return [3 /*break*/, 6];
                    case 6:
                        display.succeed('文件创建完成');
                        return [4 /*yield*/, (0, index_mjs_1.delay)(600)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, this.defaultConfig];
                }
            });
        });
    };
    ConfigManager.prototype._getOrgInfo = function (orgName) {
        if (orgName === void 0) { orgName = env_mjs_1.EMPTY_STRING; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, success, data, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orgName = orgName || this.config['template']['org_name'] || DEFAULT_ORG_NAME;
                        return [4 /*yield*/, (0, gitee_api_mjs_1.getOrgInfo)(this.orgName)];
                    case 1:
                        _a = _b.sent(), success = _a.success, data = _a.data, url = _a.url;
                        if (!success) {
                            // console.error(err);
                            this.display.fail('获取组织信息失败');
                            return [2 /*return*/, false];
                        }
                        // this.display.succeed(`拉取组织${orgName}成功！`);
                        return [2 /*return*/, { data: data, url: url }];
                }
            });
        });
    };
    ConfigManager.prototype._readOrgFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orgInfoFileExist, isSameModifyTime, needUpdate, res, url, org_info_new, config_new, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        orgInfoFileExist = fs_extra_1.default.existsSync(DEFAULT_ORG_FILE_PATH);
                        if (!!orgInfoFileExist) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs_extra_1.default.ensureFile(DEFAULT_ORG_FILE_PATH)];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        isSameModifyTime = this.config['template']['org_modify_time'] == this.ctime;
                        needUpdate = !orgInfoFileExist || !isSameModifyTime;
                        if (!needUpdate) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._getOrgInfo()];
                    case 3:
                        res = _c.sent();
                        if (!res) return [3 /*break*/, 6];
                        url = res.url, org_info_new = res.data;
                        // this.config['template']['org_info'] = org_info_new;
                        return [4 /*yield*/, fs_extra_1.default.writeJson(DEFAULT_ORG_FILE_PATH, org_info_new, { spaces: '  ' })];
                    case 4:
                        // this.config['template']['org_info'] = org_info_new;
                        _c.sent();
                        this.config['template']['org_modify_time'] = this.ctime;
                        this.config['template']['org_url'] = url;
                        config_new = Object.assign({}, this.config);
                        // 离线仓库的数据太多，需要独立存放，提高配置文件可读性
                        Reflect.deleteProperty(config_new['template'], 'org_info');
                        return [4 /*yield*/, fs_extra_1.default.writeJson(this.configFilePath, config_new, { spaces: '  ' })];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        (0, console_1.log)('读取本地缓存');
                        _a = this.config['template'];
                        _b = 'org_info';
                        return [4 /*yield*/, fs_extra_1.default.readJson(DEFAULT_ORG_FILE_PATH)];
                    case 7:
                        _a[_b] = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ConfigManager;
}());
exports.ConfigManager = ConfigManager;
exports.default = ConfigManager;
