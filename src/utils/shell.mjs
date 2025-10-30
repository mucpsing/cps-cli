"use strict";
/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-24 18:44:40.388371
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 18:05:49.091977
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "shell.mts"
 * @Description: 主要用来处理调用各种shell命令
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.gitPull = exports.gitPushSync = exports.runCommandAlone = exports.runPyScripts = exports.shellSync = exports.shell = void 0;
var util_1 = require("util");
var child_process_1 = require("child_process");
var exec = (0, util_1.promisify)(child_process_1.default.exec);
var Commands = ['npm', '-v'];
/**
 * @Description - 异步执行运行shell/bash等指令
 *
 * @param {string[]} commands     - 列表形式的命令
 * @example
 * ```js
 *  // 单条命令
 *  let commands = ['git', 'add', '.', '&', 'git', 'commit', '-m', 'cps-cli-before-pull', '&', 'git', 'pull', 'origin', 'master']
    await shell(command, { cwd })
    
    // 多条命令
    const commands = [
      ['git', 'add', '.'],
      ['git', 'commit', '-m', 'cps-cli-push'],
      ['git', 'push', 'origin', 'master'],
    ];

    for (let command of commands) {
      await shell(command, { cwd });
    }
 * ```
 */
var shell = function (commands, options) { return __awaiter(void 0, void 0, void 0, function () {
    var default_options, commands_str, _a, stdout, stderr, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                default_options = { encoding: 'utf-8', windowsHide: true, cwd: undefined };
                options = Object.assign(default_options, options);
                commands_str = commands.join(' ');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exec(commands_str, __assign({}, options))];
            case 2:
                _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                if (stdout)
                    return [2 /*return*/, { success: true, res: stdout.trim() }];
                if (stderr)
                    return [2 /*return*/, { success: true, res: stderr.toString().trim() }];
                return [2 /*return*/, { success: false }];
            case 3:
                e_1 = _b.sent();
                return [2 /*return*/, { success: false, err: e_1.toString().trim() }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.shell = shell;
/**
 * @Description - 同步执行运行shell/bash等指令
 */
var shellSync = function (commands) {
    var commands_str = commands.join(' ');
    try {
        var _a = child_process_1.default.spawnSync(commands_str), status_1 = _a.status, stdout = _a.stdout, stderr = _a.stderr;
        if (status_1 == 0) {
            if (stdout)
                return { success: true, res: stdout.toString().trim() };
            if (stderr)
                return { success: false, err: stderr.toString().trim() };
        }
        return { success: false };
    }
    catch (e) {
        return { success: false, err: e.toString().trim() };
    }
};
exports.shellSync = shellSync;
var runPyScripts = function (commands, options) {
    if (options === void 0) { options = { python_path: '' }; }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
};
exports.runPyScripts = runPyScripts;
var runCommandAlone = function (commands_str, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        child_process_1.default.spawn(commands_str, [], __assign({ shell: true, detached: true, stdio: 'ignore' }, options));
        return [2 /*return*/];
    });
}); };
exports.runCommandAlone = runCommandAlone;
var gitPushSync = function (cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var commands, _i, commands_1, command;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commands = [
                    ['git', 'add', '.'],
                    ['git', 'commit', '-m', 'cps-cli-push'],
                    ['git', 'push', 'origin', 'master'],
                ];
                _i = 0, commands_1 = commands;
                _a.label = 1;
            case 1:
                if (!(_i < commands_1.length)) return [3 /*break*/, 4];
                command = commands_1[_i];
                return [4 /*yield*/, (0, exports.shell)(command, { cwd: cwd })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.gitPushSync = gitPushSync;
var gitPull = function (cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var commands;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commands = [
                    'git',
                    'add',
                    '.',
                    '&',
                    'git',
                    'commit',
                    '-m',
                    'cps-cli-before-pull',
                    '&',
                    'git',
                    'pull',
                    'origin',
                    'master',
                ];
                return [4 /*yield*/, (0, exports.shell)(commands, { cwd: cwd })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.gitPull = gitPull;
