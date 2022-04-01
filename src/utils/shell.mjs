import { promisify } from "util";
import child_process from "child_process";

const exec = promisify(child_process.exec);

const Commands = ["npm", "-v"];

export const Shell = async (
  commands,
  options = { encoding: "utf-8", windowsHide: true }
) => {
  commands = commands.join(" ");
  try {
    const { stdout, stderr } = await exec(commands, options);

    if (stdout) {
      const res = stdout.trim();
      return { sucess: true, res };
    }

    if (stderr) {
      const err = stderr.toString();
      return { sucess: false, err };
    }
  } catch (e) {
    return { success: false, err: e.toString() };
  }
};

export default Shell;
