# FlowmapBlue 本地部署指南

本项目 `FlowmapBlue` 是一个基于 Next.js、React 和 Deck.gl 的地理数据可视化应用。

以下是在本地环境部署和运行该项目的详细步骤。

## 1. 环境准备

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js**: 推荐使用 **v20** 版本（根据项目 `.nvmrc` 文件指定）。
- **Yarn**: 本项目使用 yarn 作为包管理工具。

## 2. 获取代码

如果您尚未获取代码，请克隆仓库到本地：

```bash
git clone <repository-url>
cd FlowmapBlue
```

## 3. 安装依赖

在项目根目录下，运行以下命令安装项目所需的依赖包：

```bash
yarn install
```

## 4. 配置环境变量（必须）

本项目依赖 Mapbox 进行地图渲染，因此**必须**配置 Mapbox Access Token 才能正常显示地图。

1. 在项目根目录下创建一个名为 `.env` 的文件。
2. 在文件中添加以下内容：

```env
NEXT_PUBLIC_MapboxAccessToken=您的Mapbox_Access_Token
```

> **说明**：请将 `您的Mapbox_Access_Token` 替换为您实际的 Mapbox Token。如果您还没有 Token，请前往 [Mapbox 官网](https://www.mapbox.com/) 注册并创建一个 Public Access Token。

## 5. 启动开发服务器

依赖安装和环境变量配置完成后，运行以下命令启动本地开发环境：

```bash
yarn dev
```

命令执行后，终端通常会提示服务已启动（默认端口为 3000）。请在浏览器中访问：

[http://localhost:3000](http://localhost:3000)

## 6. 构建与生产运行

如果您需要在本地模拟生产环境或进行部署构建，请执行以下命令：

1. **构建项目**：

   ```bash
   yarn build
   ```

2. **启动生产服务器**：

   ```bash
   yarn start
   ```

## 7. 常用命令速查

| 命令            | 说明                         |
| :-------------- | :--------------------------- |
| `yarn dev`      | 启动开发服务器（支持热更新） |
| `yarn build`    | 构建生产版本                 |
| `yarn start`    | 运行构建后的生产版本         |
| `yarn lint`     | 运行代码检查                 |
| `yarn prettier` | 格式化代码                   |

## 8. 故障排除

- **依赖安装失败**：请检查您的 Node.js 版本是否符合要求 (v20)，并尝试删除 `node_modules` 和 `yarn.lock` 后重新运行 `yarn install`。
- **地图无法加载**：请检查 `.env` 文件是否存在，以及 `NEXT_PUBLIC_MapboxAccessToken` 是否配置正确且有效。
