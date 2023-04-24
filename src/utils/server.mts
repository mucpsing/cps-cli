/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2023-04-25 00:03:53.415160
 * @Last Modified by: CPS
 * @Last Modified time: 2023-04-24 23:47:20.497465
 * @Projectname
 * @file_path "D:\CPS\MyProject\Projects_Personal\cps-cli\cps-cli\src\utils"
 * @Filename "server.mts"
 * @Description: 通过express创建一个本地服务器实例
 */

import path from 'path';
import express from 'express';

export interface ServerParams {
  staticPath: string;
  port?: number;
}

export const serverStart = async ({ staticPath, port = 3000 }: ServerParams) => {
  const staticRoute = `/${path.basename(staticPath)}`;
  // console.log("staticRoute: ", staticRoute);
  // console.log("staticPath: ", staticPath);

  express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .get('/', (req, res) => {
      res.send('ccvb');
    })
    .post('/print', (req, res) => {
      console.log(req.body);
      res.send('done !');
    })
    .use(staticRoute, express.static(staticPath))
    .listen(port);
};

// serverStart({ staticPath: "W:/CPS/MyProject/markdown-image/image" });

export default serverStart;
