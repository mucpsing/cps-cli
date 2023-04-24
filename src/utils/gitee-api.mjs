import axios from 'axios';
export const parserOrgInfo = (res) => {
    const { data } = res;
    const result = {};
    for (let repo_info of data) {
        result[repo_info.name] = repo_info;
    }
    return result;
};
export const getOrgInfo = async (org_name) => {
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
    }
    catch (err) {
        console.log('gitee-api: 网络请求错误');
        // console.log(err);
        return { success: false, data: err };
    }
};
