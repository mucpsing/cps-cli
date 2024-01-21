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
import net from 'net';

export interface ServerParams {
  staticPath: string; // 静态目录绝对路径
  port?: number; // 服务器端口
}

/**
 * 检查指定端口是否被占用
 * @param port 待检查的端口
 * @returns 如果端口被占用，返回 true；否则返回 false
 */
async function isPortTaken(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const tester = net
      .createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester.once('close', () => resolve(false)).close();
      })
      .listen(port);
  });
}

/**
 * 查找可用的端口
 * @param port 起始端口
 * @returns 可用的端口
 * @throws 如果找不到可用端口，抛出异常
 */
async function findAvailablePort(port: number): Promise<number> {
  const maxPort = 65535; // 计算机可用端口的最大值

  while (port <= maxPort) {
    if (!(await isPortTaken(port))) {
      return port;
    }

    console.log(`端口 ${port} 已被占用，尝试下一个端口`);
    port++;
  }

  throw new Error(`无法找到可用端口。`);
}

export const serverStart = async ({ staticPath, port = 3000 }: ServerParams) => {
  const staticRoute = `/${path.basename(staticPath)}`;

  const freePort = await findAvailablePort(port);

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
    .listen(freePort);

  return freePort;
};

// serverStart({ staticPath: 'W:/CPS/MyProject/markdown-image/image', port: 45462 });

export default serverStart;
