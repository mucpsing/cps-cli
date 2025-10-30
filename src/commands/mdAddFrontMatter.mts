/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date: 2025-10-30 16:14:01.092905
 * @Last Modified by: CPS
 * @Last Modified time: 2025-10-30 16:14:01.092905
 * @Projectname
 * @file_path "W:\CPS\MyProject\projsect_persional\cps-cli\cps-cli\src\commands"
 * @Filename "mdFrontMatter.mts"
 * @Description: 处理md文件，对md文件头部进行扫描，添加默认的文件头
 */

import fse from 'fs-extra';
import path from 'path';
import type { Ctx } from '../globaltype.mjs';
import { glob } from 'glob';
import yaml from 'yaml';
// 定义类型接口
interface FrontMatter {
  title?: string;
  last_update?: string;
  [key: string]: any;
}

interface FileContent {
  frontmatter: FrontMatter | null;
  content: string;
}

interface FileInfo {
  file_base_name: string;
  last_update: string;
  create_time: string;
  file_size: number;
  file_size_kb: number;
  file_size_mb: number;
  is_directory: boolean;
  is_file: boolean;
  file_path: string;
  file_extension: string;
  file_name_without_ext: string;
  directory_path: string;
  last_access: string;
  permissions: {
    [key: string]: any;
  };
}

const FRONT_MATTER_PATTERN = /^(?:---\s*\n([\s\S]*?)\n---\s*\n)?([\s\S]*)$/;

function parseMarkdownContent(dataStr: string): FileContent {
  const dataMatch = dataStr.match(FRONT_MATTER_PATTERN);
  if (dataMatch) {
    return {
      frontmatter: dataMatch[1] ? (yaml.parse(dataMatch[1].trim()) as FrontMatter) : null,
      content: dataMatch[2].trim(),
    };
  }

  return {
    frontmatter: null,
    content: dataStr,
  };
}

// 格式化时间为 2025-10-30 24:00:00 格式
function formatTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getFileInfo(filePath: string): Promise<FileInfo> {
  const statInfo = await fse.stat(filePath);

  return {
    file_base_name: path.basename(filePath),
    last_update: formatTime(statInfo.mtime), // 最后修改时间
    create_time: formatTime(statInfo.birthtime), // 创建时间
    last_access: formatTime(statInfo.atime), // 最后访问时间
    file_size: statInfo.size, // 文件大小（字节）
    file_size_kb: Math.round((statInfo.size / 1024) * 100) / 100, // 文件大小（KB，保留2位小数）
    file_size_mb: Math.round((statInfo.size / (1024 * 1024)) * 100) / 100, // 文件大小（MB，保留2位小数）
    is_directory: statInfo.isDirectory(),
    is_file: statInfo.isFile(),
    file_path: filePath,
    file_extension: path.extname(filePath),
    file_name_without_ext: path.basename(filePath, path.extname(filePath)),
    directory_path: path.dirname(filePath),
    permissions: {
      mode: statInfo.mode.toString(8), // 八进制权限表示
      readable: statInfo.mode & 0o444 ? true : false, // 是否可读
      writable: statInfo.mode & 0o222 ? true : false, // 是否可写
      executable: statInfo.mode & 0o111 ? true : false, // 是否可执行
    },
  };
}

/**
 * 为单个Markdown文件添加或更新frontmatter
 */
async function addFrontmaterToMdFile(mdFilePath: string): Promise<boolean> {
  try {
    if (!fse.existsSync(mdFilePath)) {
      console.log('文件不存在');
      return false;
    }

    const content = (await fse.readFile(mdFilePath, 'utf8')).toString().trim();
    const parsedContent = parseMarkdownContent(content);
    const fileInfo = await getFileInfo(mdFilePath);

    // 合并或创建frontmatter
    const frontmatter: FrontMatter = parsedContent.frontmatter || {};

    if (!frontmatter.title) frontmatter.title = fileInfo.file_name_without_ext;
    if (!parsedContent.frontmatter) frontmatter.last_update = fileInfo.last_update;

    const newContent = `---\n${yaml.stringify(frontmatter)}---\n${parsedContent.content}`;

    // 只有内容发生变化时才写入
    if (newContent !== content) {
      await fse.writeFile(mdFilePath, newContent, 'utf-8');
      return true;
    }

    console.log(`无需更新: ${mdFilePath}`);
    return true;
  } catch (err) {
    return false;
  }
}

const MD_EXTENSION = '.md';
/**
 * 获取所有需要处理的Markdown文件路径
 */
async function getMarkdownFiles(targetPath: string): Promise<string[]> {
  const resolvedPath = path.resolve(targetPath);

  if (!(await fse.pathExists(resolvedPath))) {
    throw new Error(`路径不存在: ${resolvedPath}`);
  }

  const stat = await fse.stat(resolvedPath);

  if (stat.isFile()) {
    return path.extname(resolvedPath).toLowerCase() === MD_EXTENSION ? [resolvedPath] : [];
  }

  const files = await glob('**/*.md', {
    cwd: resolvedPath,
    ignore: ['node_modules/**', '.git/**'],
  });

  return files.map(file => path.join(resolvedPath, file));
}

async function main(inputTargetPath: string) {
  // 处理绝对路径省事
  inputTargetPath = path.resolve(inputTargetPath);

  const targeState = await fse.stat(inputTargetPath);

  if (!targeState) return;

  const mdFileList = await getMarkdownFiles(inputTargetPath);

  if (mdFileList.length === 0) {
    console.log('未找到Markdown文件');
    return;
  }

  mdFileList.forEach(eachFile => addFrontmaterToMdFile(eachFile));
}

(async () => {
  await main('D:/CPS/MyProject/Projects_Personal/cps-blog/docs/【00】编程相关/MSYS/test.md');
})();

export default async (ctx: Ctx) => {
  const targetpath = ctx.argv;
};
