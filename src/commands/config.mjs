export function format(target, keywordsList) {
  let reg = /\{\}/g;
  let keywordIndex = 0;
  let newString = target.replace(
    reg,
    () => keywordsList[keywordIndex++]
  );

  return newString;
}

export default {
  github: {},
  gitee: {
    token: "fac3356de9e6a546668dabb0a4b5897c",
    orgName: "learn-gitee",
    api: {
      repo:
        "https://gitee.com/api/v5/orgs/{}/repos?access_token={}&type=all&page=1&per_page=100",
    },
  },
};