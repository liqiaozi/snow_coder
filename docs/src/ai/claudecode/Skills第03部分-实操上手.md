# 一、创建Skill流程

Skills 的创建是一个结构化的过程，遵循标准的目录结构和文件格式。本节将详细介绍创建 Skills 的完整流程。

## 第1步：规划 Skill

**确定如下问题**


| 问题 | 示例 |
|------|------|
| **解决什么问题**？ | 读取 Swagger JSON 生成接口文档 |
| **什么时候用**？ | "把这个 json 生成接口文档" |
| **产出什么**？ | Markdown / PDF 格式的结构化文档 |
| **边界在哪**？ | 仅支持 Swagger 2.0，暂不支持 OpenAPI 3.0 |


## 第2步：创建目录

**标准目录结构**

```text
my-skill/
├── SKILL.md          # 必需：核心指令文件
├── scripts/          # 可选：可执行脚本
│   └── helper.py
├── references/       # 可选：参考文档
│   └── api-docs.md
├── assets/           # 可选：静态资源
│   └── template.json
└── LICENSE           # 可选：许可证文件
```

**目录命名规范**
- 使用小写字母、数字和连字符 
- 长度不超过64个字符 
- 避免连续连字符或以连字符开头/结尾 
- 目录名应与 SKILL.md 中的 name 字段一致

## 第3步：编写 SKILL.md 
SKILL.md 是 Skills 的核心文件，必须遵循特定的格式：
```yaml
---
name: api-doc-generator
description: >
  当用户要求"生成接口文档"或"将swagger json转为文档"时，读取Swagger 2.0规范的JSON文件，生成Markdown或PDF格式的接口文档
---
```
编写Markdown Body。

## 第4步：测试

```text
# 验证 Skill 是否被加载
claude --skill api-doc-generator —version

# 实际测试
"请使用 api-doc-generator 帮我生成接口文档"
```


# 二、完整示例 swagger -> 接口文档skill

## 2.1 需求定义

```text
## 需求描述
- **功能目标**：读取 swagger2.0 规范的指定json文件，生成结构化后的的markdown或pdf接口文档。
- **具体任务**：
  - 读取swagger2.x规范的指定json文件内容
  - 识别接口文档基本信息、接口分组和接口信息
  - 根据指定内容格式生成markdown或pdf格式的接口文档
  - 接口文档结构化请参考文件：接口文档格式.md
- **使用场景**：
  - "请将该json接口文件生成markdown格式的接口文档"
  - "读取xx.json生成pdf接口文档"
- **技术要求**：
  - 支持中文文本
  - 输出结构化数据
  - 文件命名为：原文件名_接口文档.pdf 或 原文件名_接口文档.md
```

## 2.2 Skill.md完整内容
 
参考【附录 swagger-api-doc-generator.md】


## 三、使用skill-creator辅助创建

skill-creator 是 Anthropic 官方提供的 Skills，专门用于指导和辅助创建其他 Skills。它的主要功能包括：

**调用 skill-creator**

```text
# 直接使用 skill-creator
claude --skill skill-creator

# 或在对话中使用
"请使用 skill-creator 帮助我创建一个处理 PDF 文件的 Skills"
```

- 理解需求：通过分析输入来理解 Skills 应该实现的功能 
- 规划内容：识别可重用的脚本、参考文档和资源文件 
- 生成结构：自动创建 Skills 的标准目录结构 
- 编写文档：帮助编写 SKILL.md 和相关文档 
- 打包验证：验证并打包 Skills
