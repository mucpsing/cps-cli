import axios from "axios";
import config from "./config.mjs";

function format(target, keywordsList) {
  let reg = /\{\}/g;
  let keywordIndex = 0;
  let newString = target.replace(
    reg,
    () => keywordsList[keywordIndex++]
  );

  return newString;
}

export function getOrgInfo(target, token = TOKEN) {
  console.log("token: ", API);
}

// getOrgInfo("ccvb");
