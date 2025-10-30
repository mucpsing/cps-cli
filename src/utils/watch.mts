/*!
 * @Author: CPS
 * @email: 373704015@qq.com
 * @Date:
 * @Last Modified by: CPS
 * @Last Modified time: 2023-11-08 10:45:51.694671
 * @Projectname
 * @file_path "W:\CPS\MyProject\demo\cps-cli\cps-cli\src\utils"
 * @Filename "watch.mts"
 * @Description: 监听模块，监听目录、文件的变化，目前仅提供目录
 */
import * as fs from 'fs';

type ChangeCallback = (eventType: string | null, filename: string | null) => void;

export function watchDirectory(directoryPath: string, callback: ChangeCallback): void {
  fs.watch(directoryPath, { recursive: false }, (eventType, filename) => {
    // The callback will be called when a file or directory within the specified directory changes
    if (eventType && filename) {
      callback(eventType, filename);
    }
  });

  console.log(`Watching directory: ${directoryPath}`);
}

// Example usage:
const directoryToWatch = '/path/to/your/directory';
const callbackFunction: ChangeCallback = (eventType, filename) => {
  if (eventType && filename) {
    console.log(`File ${filename} has been ${eventType}ed`);
    // Your custom logic here
  }
};

// watchDirectory(directoryToWatch, callbackFunction);
