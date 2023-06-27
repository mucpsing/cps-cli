let config = {
  template: {
    org_name: 'cps-cli-template',
    org_url: 'https://gitee.com/cps-cli-template',
    org_path: 'C:\\Users\\Administrator\\.cpsrc.org_info',
    org_add_time: '2022-04-05',
    org_modify_time: '2023-06-26',
  },
  upload: {
    auto_push: true,
    path: 'W:/CPS/MyProject/markdown-image/im1age/',
    server: {
      enable: true,
      port: '45462',
    },
  },
};

import fs from 'fs';

function test(target: string) {
  try {
    const res = fs.statSync(target);
    return res;
  } catch (err) {
    return false;
  }
}

const t = test(config.upload.path);

console.log('t: ', t);
