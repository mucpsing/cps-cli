import { promisify } from "util";
import child_process from "child_process";

const exec = promisify(child_process.exec);

const Commands = ["npm", "-v"];

export const Shell = async (commands, options = { encoding: "utf-8", windowsHide: true, cwd: undefined }) => {
  commands = commands.join(" ");
  try {
    const { stdout, stderr } = await exec(commands, options);

    if (stdout) return { success: true, res: stdout.trim() };

    if (stderr) return { success: true, res: stderr.toString().trim() };
  } catch (e) {
    return { success: false, err: e.toString().trim() };
  }
};

export default Shell;
