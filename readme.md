1. 可以运行以下命令来构建文档：

```shell
npm run docs:build
```

2. 构建文档后，通过运行以下命令可以在本地预览它：

```shell
npm run docs:preview
```

preview 命令将启动一个本地静态 Web 服务 http://localhost:4173，该服务以 .vitepress/dist 作为源文件。这是检查生产版本在本地环境中是否正常的一种简单方法。

3. 可以通过传递 --port 作为参数来配置服务器的端口。

```json
{
    "scripts": {
      "docs:preview": "vitepress preview docs --port 8080"
    }
}
```

现在 docs:preview 方法将会在 http://localhost:8080 启动服务。

