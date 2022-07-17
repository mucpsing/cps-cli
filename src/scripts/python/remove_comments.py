# -*- coding: utf-8 -*-
#
# @Author: CPS
# @email: 373704015@qq.com
# @Date: 2022-07-06 22:16:38.320013
# @Last Modified by: CPS
# @Last Modified time: 2022-07-06 22:16:38.320013
# @file_path "W:\CPS\MyProject\test"
# @Filename "remove_comments.py"
# @Description: 功能描述
#
import os, sys

sys.path.append("..")
from os import path

from pydantic import BaseModel


import os


def main(dir_path: str, skip_list: list[str] = []):
    os.walk(dir_path)
    count = 0
    for dir_path, dir_list, file_list in os.walk(dir_path):
        for each in file_list:
            if each in skip_list:
                continue

            if each.endswith(".py"):
                target = os.path.join(dir_path, each)
                if os.path.exists(target):
                    clean_comments(target, True)
                    count += 1
    print(f"当前处理文件{count}个")


def clean_comments(file_path: str, overwirte=False) -> str:
    """
    @Description {description}

    - param file_path       :{str}  {description}
    - param overwirte=False :{bool} {description}

    @returns `{ str}` {description}

    """
    if overwirte:
        new_file = file_path
    else:
        new_file = os.path.join(
            os.path.dirname(file_path), f"{os.path.basename(file_path)}_str"
        )

    with open(file_path, "r", encoding="utf-8") as f:
        new_str = ""
        skip = False
        has_main = False
        for each in f.readlines():
            trim_str = each.strip()
            if trim_str.startswith('"""'):
                if skip:
                    skip = False
                    continue
                else:
                    skip = True
            elif trim_str.startswith("#"):
                continue

            elif trim_str == 'if __name__ == "__main__":':
                has_main = True

            if skip:
                continue

            if has_main:
                continue

            new_str += each

    # print(new_str)
    with open(new_file, "w", encoding="utf-8") as f:
        f.write(new_str)


if __name__ == "__main__":
    argv = sys.argv

    print(argv)
    # t = r"D:\CPS\MyProject\外接项目\PSD文件解析\打包文件\ps-tools-v1\src"
    # main(t, ["config.py", "main.py"])
