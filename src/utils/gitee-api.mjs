import axios from "axios";

export const parserOrgInfo = async res => {
  const { data } = res;
  const orgCount = res.data.length;
  const result = {};

  for (let repo_info of data) {
    result[repo_info.name] = repo_info;
  }

  return result;
};

export const getOrgInfo = async url => {
  try {
    const res = await axios(url);
    const ret = await parserOrgInfo(res);
    return { res: true, data: ret };
  } catch (err) {
    console.log("发生错误了： ");
    return { res: false, data: err };
  }
};

// (async () => {
//   const res = await getOrgInfo(URL_GET_ORG);

//   console.log("res: ", res);
// })();
