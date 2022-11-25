import { promisify } from "util";
import child_process from "child_process";

const exec = promisify(child_process.exec);

const Commands = ["npm", "-v"];

/**
 * @Description - 运行shell/bash等指令
 *
 * @param {params} commands     - 列表或字符串形式，字符串最终会以空格转换为列表
 * @param {params} options      - {description}
 *
 * @returns {} - {description}
 *
 */
export const shell = async (commands, options = { encoding: "utf-8", windowsHide: true, cwd: undefined }) => {
  commands = commands.join(" ");
  try {
    const { stdout, stderr } = await exec(commands, { ...options });

    if (stdout) return { success: true, res: stdout.trim() };

    if (stderr) return { success: true, res: stderr.toString().trim() };
  } catch (e) {
    return { success: false, err: e.toString().trim() };
  }
};

export const runPyScripts = async (commands, options = { python_path: "" }) => {};

export const runCommandAlone = async (commands, options) => {
  child_process.spawn(commands, [], {
    shell: true,
    detached: true,
    stdio: "ignore",
    ...options,
  });
};

export const gitPush = async cwd => {
  let commands = "git add . & git commit -m cps-cli-push & git push origin master";
  return await runCommandAlone(commands, {
    cwd,
    windowsHide: true,
  });
};

export const gitPushSync = async cwd => {
  let commands = [
    ["git", "add", "."],
    ["git", "commit", "-m", "cps-cli-push"],
    ["git", "push", "origin", "master"],
  ];

  for (let command of commands) {
    await shell(command, { cwd });
  }
};

// export const gitPull = async cwd => {
//   let commands = [
//     ["git", "add", "."],
//     ["git", "commit", "-m", "cps-cli-before-pull"],
//     ["git", "pull", "origin", "master"],
//   ];
//   for (let command of commands) {
//     await shell(command, { cwd });
//   }
// };

export const gitPull = async cwd => {
  let commands = ["git", "add", ".", "&", "git", "commit", "-m", "cps-cli-before-pull", "&", "git", "pull", "origin", "master"];
  return await shell(commands, { cwd });
};

// export const runServerAlone = async () => {
//   let commands = "cps -s";

//   return await runCommandAlone(commands);
// };
