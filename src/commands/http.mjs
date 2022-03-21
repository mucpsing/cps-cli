import axios from "axios";

const TOKEN = "fac3356de9e6a546668dabb0a4b5897c";
const orgName = "cps-cli";

const API = {
  org: {
    gitee: "https://gitee.com/api/v5/orgs/{}/repos?access_token={}&type=all&page=1&per_page=20",
    github: "https://api.github.com/orgs/{org}/reposs",
  },
};

function format(target, keywordsList) {
  let reg = /\{\}/g;
  let keywordIndex = 0;
  let newString = target.replace(reg, () => keywordsList[keywordIndex++]);

  return newString;
}

export function getOrgInfo(orgName, token = TOKEN) {
  console.log("token: ", API);
}

// getOrgInfo("ccvb");
