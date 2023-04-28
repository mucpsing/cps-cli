/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-28 17:07:35.645298
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "gitee-api.mts"
 * @Description: gitee的api模块
 */
import axios from 'axios';

interface OrgInfo {
  data: any;
}

export const parserOrgInfo = (res: OrgInfo) => {
  const { data } = res;
  const result: any = {};

  for (let repo_info of data) {
    result[repo_info.name] = repo_info;
  }

  return result;
};

export const getOrgInfo = async (org_name: string) => {
  const giteeAxios = axios.create({
    timeout: 10000,
    baseURL: `https://gitee.com`,
  });

  try {
    // const res = await axios(url);
    const res = await giteeAxios.get(`/api/v5/orgs/${org_name}/repos`);
    const ret = parserOrgInfo(res);
    const orgUrl = res.data[0].namespace.html_url;

    return { success: true, data: ret, url: orgUrl };
  } catch (err) {
    console.log('gitee-api: 网络请求错误');
    // console.log(err);
    return { success: false, data: err };
  }
};
