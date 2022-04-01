import axios from "axios";

axios.defaults.timeout = 50000;

export const parserOrgInfo = async res => {
  const { data } = res;
  const orgCount = res.data.length;
  const result = {};

  for (let repo_info of data) {
    result[repo_info.name] = repo_info;
  }

  return result;
};

export const getOrgInfo = async org_name => {
  const url = `https://gitee.com/api/v5/orgs/${org_name}/repos`;

  try {
    const res = await axios(url);
    const ret = await parserOrgInfo(res);
    return { success: true, data: ret };
  } catch (err) {
    console.log("发生错误了： ");
    return { success: false, data: err };
  }
};

// (async () => {
//   const ORG_NAME = "cps-cli-template";
//   const res = await getOrgInfo(ORG_NAME);

//   console.log("res: ", res);
// })();
