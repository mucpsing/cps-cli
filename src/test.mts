import child_process from "child_process";

export const copyToPaste = data => {
  switch (process.platform) {
    case "darwin":
      //unix 系统内核
      child_process.exec("pbcopy").stdin.end(data);
      break;
    case "win32":
      //windows 系统内核
      child_process.exec("clip").stdin.end(data);
      break;
    default:
      // Linux
      child_process.exec("xclip").stdin.end(data);
  }
};

copyToPaste("ccvvbbbb");
