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
2. [主要功能|Base](##主要功能|Base)
3. [安装|Install](#安装|Install)
4. [使用|Usage](#使用|Usage)
5. [配置|Settings](#配置|Settings)
6. [联系方式|contact](#联系方式|contact)


# 安装|Install

```bash
npm i -g @mucpsing/cli
```



# 使用|Usage

```bash
$ cps -h
Usage: index [options]

Options:
  -t, --template [tempaletName]  下载常用模板 .cpsrc.template
  -a, --add <script>             添加常用工具函数 .cpsrc.add
  -u, --upload <imgPath>         上传图片到gitee/github仓库, 对应配置 .cpsrc.upload
  -s, --server [port]            对应配置 .cpsrc.upload.server.port
  -tr, --tree                    生成当前目录的文件数
  --test [any]                   测试命令

  -h, --help                     display help for command
```



## 主要功能|Base

- 下载模板
  - [x] 当前默认的仓库组织：

    - Gitee ：https://gitee.com/cps-cli-template

  - [x] 支持自定义仓库组织

  - [x] 添加强制拉取线上数据功能（默认每天首次获取线上，后续采用本地缓存）

- 关联Typora图片上传
  - [x] 通过粘贴图片自动上传
  - [x] 关联到本地仓库
  - [x] 首先复制图片到仓库，然后调用git远程同步
  
- 生成当前目录的目录结构图
  - [ ] 一键批量替换`md`文件内图片链接
  - [ ] 去除`.py`文件注释块（`#`和`"""`），去除测试部分代码（`__name__=='__main__'`）





## 1. 下载常用模板|Template

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







## 2. Typora 图片上传关联|Upload

- 配置 `.cpsrc` 的 `upload.lcoal.path`字段，绑定本地图片仓库路径

  ```js
  // ~/.cpsrc
  {
    "upload": {
      "auto_push":true, // 上传的图片的同时push到远程
  
      // 关联本地图片仓库目录，图片实际复制目录
      // 比如我的图片仓库地址是： https://gitee.com/capsion/markdown-image
      // 实际图片都是存放在 仓库的image目录下，所以本地的仓库也存在image
      "path": "D:/CPS/MyProject/markdown-image/image/",
  
      // 本地服务器配置
      // 根据path的dirname会自动生成态路由： http://localhonst:port/{image}/*.png|jpg
      "server": {
        "enable":true,
        "port": "45462"
      }
  }
  ```



- Typora > 偏好配置 > 图像
  - 插入图片时： 选择"上传图片"
  
  - 上传服务：  选择 "自定义命令" (Custom Command)
  
  - 命令处填写： `cps -u` 或者 `cps --upload`
    ![](screenshot/cps@u.png)
  
    ![](screenshot/cps@u.gif)

## 3. 生成目录树

- 示例 `tree.txt`

```yaml
【Root】                                     
   ├─ bin/                                 
   |   |-- app.mjs                         
   |   `-- app.cjs                         
   ├─ build/                                                   
   ├─ docs/                                # xxxxx
   ├─ screenshot/                          # xxxxx
   ├─ src/                                 # xxxxx
   |   ├─ core/                            
   |   |   `-- .gitkeep                    
   |   ├─ types/                           
   |   |   `-- index.ts                    
   |   ├─ utils/                           
   |   |   `-- index.ts                    
   |   |-- index.ts                        
   |   |-- custom-env.d.ts                 
   |   `-- app.ts                          
   ├─ __tests__/                           
   |   `-- .gitkeep                        
   |-- yarn.lock                           
   |-- tsconfig.json                       
   |-- tree.txt                            
   |-- rollup.config.ts                    
   |-- README.md                           
   |-- package.json                        
   |-- package-lock.json                   
   |-- LICENSE                             
   |-- git-push-fast.bat                   
   |-- git-push-costom.bat                 
   |-- git-pull.bat                        
   |-- git-load.bat                        
   |-- api-extractor.json                  
   `-- .gitignore                          

```




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
    "upload": {
      "auto_push":true,
      "path": "D:/CPS/MyProject/markdown-image/image/",
      "server":{
        "enable":true, // 开启本地服务期，返回 http://127.0.0.1/xxxx/*.png 图片格式
        "port":"45462"
      }
    }
  }
  ```



- `~/.cpsrc.org_info`

  仓库组织的离线数据缓存，因为**gitee**获取组织仓库的**Api**有每日请求次数限制，所以每天只拉取一次线上数据，然后缓存到本地，以`json`格式存储。



  ```js
  // 接口： https://gitee.com/api/v5/orgs/${org_name}/repos 返回的json数据结果：
  {
    ...each_repo_name:{ ../ }
  }
  ```

  

# 联系方式|Contact

- **373704015 (qq、wechat、email)**
