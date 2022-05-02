# 简介|Introductions

因为组内的项目都是我搭建的，特意写一个脚手架，可以快速生成一些项目结构，快速添加一些常用脚本到项目中。

<div>
    <img flex="left" src="https://img.shields.io/badge/npm-%3E%3D6.x-blue"/>
    <img flex="left" src="https://img.shields.io/badge/node-%3E%3D16.11-brightgreen"/>
  	<img flex="left" src="https://img.shields.io/github/license/caoxiemeihao/electron-vite-vue?style=flat"/>
  	<img flex="left" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white"/>
  	<img flex="left" src="https://img.shields.io/badge/Sublime%20Text-FF9800?style=flat&logo=Sublime%20Text&logoColor=white"/>
</div>
[English](./README.en.md) | 简体中文



## 目录|Index

1. [简介|Introductions](#简介|Introductions)
2. [基础功能|Base](##基础功能|Base)
3. [安装|Install](#安装|Install)
4. [使用|Usage](#使用|Usage)
5. [配置|Settings](#配置|Settings)
6. [联系方式|contact](#联系方式|contact)



## 主要功能|Base

- 一键下载仓库组织里面的项目
  - [x] 当前默认的仓库组织：https://gitee.com/cps-cli-template
  - [x] 通过配置文件修改关联自己的仓库组织
  - [ ] 添加强制拉取线上数据功能（默认每天首次获取线上，后续采用本地缓存）
- 下载常用的脚本到当前目录
  - [ ] 关联指定仓库，下载自己的工具函数文件
- 支持定义自己的组织仓库
  - [x] gitee
  - [ ] github
  - [ ] gitlab
  - [ ] bitbucket

- 支持Typora上传图片
  - [x] picgo引擎上传
  - [ ] 搭建本地图片服务器
  - [ ] 一键批量替换`md`文件内图片链接





# 安装|Install

```bash
npm i -g @mucpsing/cps-cli
```



# 使用|Usage

```bash
$ cps -h
Usage: index [options]

Options:
  -t, --template [tempaletName]  快速下载关联的仓库组织内的项目
  															(配置：~/.cpsrc["template"])
  															
  -a, --add <script>             添加常用工具函数 .cpsrc.add
  -u, --upload <imgPath>         上传图片到gitee/github仓库, 对应配置 .cpsrc.upload
  -h, --help                     display help for command
```



## -t --templates

### **only Command**

```bash
$ cps
```

![](screenshot/cps.gif)



### **with Flag:**

```bash
$ cps <flag>

cps --template
#or
cps -t
```

![](screenshot/cps@template.gif)





### **with Flag And Options:**

```bash
$ cps <flag> [<option1>, [<option2>]]

cps --template <仓库名称[可选]> <本地保存路径[可选]>
# or
cps -t
# or
cps --template node-ts myProjectName
```

![](screenshot/cps@template@projectName.gif)





## -a --add

未完待续（有空再写）



## -u --upload

未完待续（有空再写）



# 配置|Settings

- `~/.cpsrc`

  默认核心配置文件，插件自动创建

  ```js
  {
    "template": {
      "org_name": "cps-cli-template",
      "org_url": "https://gitee.com/cps-cli-template",
      "org_path": "C:\\Users\\M2-WIN10\\.cpsrc.org_info",
      "org_add_time": "2022-04-05",
      "org_modify_time": "2022-05-02"
    },
    
    // 上传配置，这里的 gitee-local 是修改自 picgo-gitee-plugin
    // 配置跟picgo上一样
    "upload": {
      "picgo": {
        "picBed": {
          "uploader": "gitee-local",
          "current": "gitee-local",
          "gitee-local": { // 对应 picgo-gitee-plugin 的配置
            "owner": "capsion",	
            "repo": "markdown-image",
            "path": "image",
            "token": "{your gitee token}",
            "message": "cps-cli upload"
          }
        }
      }
    }
  }
  ```

  

- `~/.cpsrc.org_info`

  仓库组织的离线数据缓存，因为**gitee**获取组织仓库的**Api**有每日请求次数限制，所以每天只拉取一次线上数据，然后缓存到本地，以`json`格式存储。
  
  
  
  ```js
  // https://gitee.com/api/v5/orgs/${org_name}/repos
  {...org_info}
  ```
  
  

# 联系方式|Contact

- **373704015 (qq、wechat、email)**
