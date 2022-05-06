import child_process from "child_process";

export default async () => {
  child_process.exec("cps -s");
};
