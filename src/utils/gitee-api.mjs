import axios from "axios";

axios.defaults.timeout = 50000;

export const parserOrgInfo = async res => {
  const { data } = res;
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
    const orgUrl = res.data[0].namespace.html_url;

    return { success: true, data: ret, url: orgUrl };
  } catch (err) {
    console.log("网络请求错误： ");
    console.error(err);
    return { success: false, data: err };
  }
};

// 测试函数
// (async () => {
//   const ORG_NAME = "cps-cli-template";
//   const res = await getOrgInfo(ORG_NAME);

//   console.log("res: ", res);
// })();
