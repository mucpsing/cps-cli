# -*- coding: utf-8 -*-
#
# @Author: CPS
# @email: 373704015@qq.com
# @Date: 2022-05-08 07:52:37.666466
# @Last Modified by: CPS
# @Last Modified time: 2022-05-08 07:52:37.666466
# @file_path "D:\CPS\MyProject\test"
# @Filename "replace.py"
# @Description: 功能描述
#
import os, re
from typing import *

img_patten = r"!\[.*?\]\((.*?)\)|<img.*?src=[\'\"](.*?)[\'\"].*?>"
img_match = re.compile(img_patten)


def replace_md_img(md_file_path: str, old: str | list[str], new: str) -> str:
    md_data_new = ""
    with open(md_file_path, "r", encoding="utf-8") as f:
        for each_line in f.readlines():
            is_replace = False

            res = img_match.findall(each_line)
            if res and len(res) > 0:
                if isinstance(old, list):
                    for each_old in old:
                        if each_line.find(each_old) > 0:
                            md_data_new += each_line.replace(each_old, new)
                            is_replace = True
                            break

                if isinstance(old, str):
                    md_data_new += each_line.replace(old, new)
                    is_replace = True

            if not is_replace:
                md_data_new += each_line

    with open(md_file_path, "w", encoding="utf-8") as f:
        f.write(md_data_new)

    return md_data_new


def list_dir(target: str):
    for dir_path, dir_list, file_list in os.walk(target):
        print(f"当前文件夹: {dir_path}")

        for file_name in file_list:
            print(file_name)


def match_file(dir_path: str, exp: str = "**/*.py") -> list[str]:
    print("dir_path: ", dir_path)
    os.chdir(dir_path)

    import glob

    return [os.path.join(dir_path, name) for name in glob.glob(exp, recursive=True)]


def main(dir_path: str, match_str: str | list[str], replace_str: str):
    file_list = match_file(dir_path, "**/*.md")

    for each_file in file_list:
        replace_md_img(each_file, match_str, replace_str)


if __name__ == "__main__":
    target = r"D:\CPS\MyProject\gitee\cps\NoteBooks\【03】运维相关\Cmd"
    match = [
        "https://gitee.com/capsion-images/notebook/raw/master/image/",
        "https://gitee.com/capsion/markdown-image/raw/master/image/",
    ]
    replace = "http://localhost:45462/image/"

    main(target, match, replace)
