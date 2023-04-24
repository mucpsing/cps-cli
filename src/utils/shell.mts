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

import { promisify } from 'util';
import child_process from 'child_process';

const exec = promisify(child_process.exec);

const Commands = ['npm', '-v'];

interface ShellOptions {
  encoding?: string;
  windowsHide?: boolean;
  cwd?: string | undefined;
}

/**
 * @Description - 运行shell/bash等指令
 *
 * @param {string[]} commands     - 列表形式的命令
 */
export const shell = async (commands: string[], options: ShellOptions) => {
  const default_options: ShellOptions = { encoding: 'utf-8', windowsHide: true, cwd: undefined };
  options = Object.assign(default_options, options);

  const commands_str = commands.join(' ');
  try {
    const { stdout, stderr } = await exec(commands_str, { ...options });

    if (stdout) return { success: true, res: stdout.trim() };

    if (stderr) return { success: true, res: stderr.toString().trim() };
  } catch (e: any) {
    return { success: false, err: e.toString().trim() };
  }
};

export const runPyScripts = async (commands: string[], options = { python_path: '' }) => {};

export const runCommandAlone = async (commands_str: string, options: object) => {
  child_process.spawn(commands_str, [], {
    shell: true,
    detached: true,
    stdio: 'ignore',
    ...options,
  });
};

export const gitPushSync = async (cwd: string) => {
  let commands = [
    ['git', 'add', '.'],
    ['git', 'commit', '-m', 'cps-cli-push'],
    ['git', 'push', 'origin', 'master'],
  ];

  for (let command of commands) {
    await shell(command, { cwd });
  }
};

export const gitPull = async (cwd: string) => {
  let commands = ['git', 'add', '.', '&', 'git', 'commit', '-m', 'cps-cli-before-pull', '&', 'git', 'pull', 'origin', 'master'];
  return await shell(commands, { cwd });
};
