"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.copyToPaste = exports.checkUrl = exports.Input = exports.Confirm = exports.ifDirExists = exports.currtTime = exports.__filename = exports.__dirname = exports.delay = void 0;
var path_1 = require("path");
var child_process_1 = require("child_process");
var console_1 = require("console");
var fs_extra_1 = require("fs-extra");
var chalk_1 = require("chalk");
var inquirer_1 = require("inquirer");
var moment_1 = require("moment");
var axios_1 = require("axios");
__exportStar(require("./shell.mjs"), exports);
var delay = function (time) {
    if (time === void 0) { time = 1000; }
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
};
exports.delay = delay;
var __dirname = function () { return path_1.default.dirname(import.meta.url); };
exports.__dirname = __dirname;
var __filename = function () { return path_1.default.basename(import.meta.url); };
exports.__filename = __filename;
var currtTime = function () { return (0, moment_1.default)().format('YYYY-MM-DD'); };
exports.currtTime = currtTime;
var ifDirExists = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var basename, overwrite, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs_extra_1.default.existsSync(filePath)) return [3 /*break*/, 5];
                basename = path_1.default.basename(filePath);
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            name: 'overwrite',
                            type: 'confirm',
                            message: chalk_1.default.yellow.bold("\u76EE\u6807\u76EE\u5F55./".concat(basename, "/\u5DF2\u5B58\u5728\uFF0C\u662F\u5426\u8986\u76D6\uFF1F")),
                            default: false,
                        },
                    ])];
            case 1:
                overwrite = (_a.sent()).overwrite;
                if (!overwrite) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, fs_extra_1.default.remove(filePath)];
            case 3:
                _a.sent();
                (0, exports.delay)(500);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                (0, console_1.log)(chalk_1.default.red.bold("sorry, \u5220\u9664\u76EE\u5F55".concat(basename, "\u5931\u8D25\uFF1A")));
                console.error(err_1);
                process.exit(0);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.ifDirExists = ifDirExists;
var Confirm = function (msg, defaultRes) {
    if (defaultRes === void 0) { defaultRes = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            name: 'res',
                            type: 'confirm',
                            message: msg,
                            default: defaultRes,
                        },
                    ])];
                case 1:
                    res = (_a.sent()).res;
                    return [2 /*return*/, res];
            }
        });
    });
};
exports.Confirm = Confirm;
var Input = function (msg, defaultRes) {
    if (defaultRes === void 0) { defaultRes = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            name: 'res',
                            type: 'input',
                            message: msg,
                            default: defaultRes,
                        },
                    ])];
                case 1:
                    res = (_a.sent()).res;
                    return [2 /*return*/, res];
            }
        });
    });
};
exports.Input = Input;
/**
 * @Description - 检查一个url
 *
 * @param {params} baseURL  - {description}
 *
 * ```js
 * const canUse = await checkUrl('http://localhost:3000'):boolean
 * ```
 *
 */
var checkUrl = function (url, data) { return __awaiter(void 0, void 0, void 0, function () {
    var http, res, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('url: ', url);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                http = axios_1.default.create({
                    baseURL: url,
                    timeout: 1000,
                });
                return [4 /*yield*/, http.get('/')];
            case 2:
                res = _a.sent();
                if (res)
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
            case 3:
                e_1 = _a.sent();
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkUrl = checkUrl;
function check_type_by_prototype(target) {
    return Object.prototype.toString.call(target).toLowerCase().replace('[object ', '').replace(']', '');
}
function check_type_by_typeof(target) {
    return typeof target;
}
var copyToPaste = function (data) {
    var _a, _b, _c;
    switch (process.platform) {
        case 'darwin':
            //unix 系统内核
            (_a = child_process_1.default.exec('pbcopy').stdin) === null || _a === void 0 ? void 0 : _a.end(data);
            break;
        case 'win32':
            //windows 系统内核
            (_b = child_process_1.default.exec('clip').stdin) === null || _b === void 0 ? void 0 : _b.end(data);
            break;
        default:
            // Linux
            (_c = child_process_1.default.exec('xclip').stdin) === null || _c === void 0 ? void 0 : _c.end(data);
    }
};
exports.copyToPaste = copyToPaste;
// export const inputSelect = async selection => {
//   const title = "template";
//   const answer = await inquirer.prompt([
//     {
//       type: "list",
//       name: title,
//       message: chalk.bgCyan("选择需要的项目模板："),
//       choices: selection,
//       default: 0,
//     },
//   ]);
//   return answer[title];
// };
// export default {
//   ...shell,
// };
