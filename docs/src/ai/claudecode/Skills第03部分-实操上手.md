# 一、创建Skill流程

Skills 的创建是一个结构化的过程，遵循标准的目录结构和文件格式。本节将详细介绍创建 Skills 的完整流程。

## 1.规划 Skills

**定义目标和范围**

在创建 Skills 之前，需要明确定义其目标和适用范围：

```text
- 功能描述：Skills 解决的具体问题
- 适用场景：何时应该使用这个 Skills
- 预期输出：使用后的结果和价值
- 限制条件：Skills 的局限性和边界
```

**分析需求**

```text
- 用户需求：目标用户的使用场景
- 技术需求：所需的工具和资源
- 性能需求：响应时间和资源消耗要求
- 兼容性需求：支持的平台和环境
```

## 2.创建目录结构

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

## 3.编写 SKILL.md 文件
SKILL.md 是 Skills 的核心文件，必须遵循特定的格式：
```yaml
---
name: my-skill
description: Brief description of what this skill does and when to use it
---

```

## 4.编写指令内容
```markdown

# My Skill Name

## 概述

[简要介绍 Skills 的功能和价值]

## 使用时机

[明确说明何时应该使用这个 Skills]
- 场景1：具体的使用情况
- 场景2：另一种使用情况

## 详细说明

### 步骤1：准备工作
[具体的执行步骤]

### 步骤2：主要处理
[核心处理逻辑]

### 步骤3：结果验证
[验证和确认结果]

## 示例

### 示例1：基本用法
**输入：**
用户请求示例

**执行步骤：**
1. 解析输入
2. 处理数据
3. 生成输出

**输出：**
预期结果


### 示例2：高级用法
[更复杂的示例]

## 注意事项

### 限制条件
- [已知限制]
- [不支持的场景]

### 错误处理
- [常见错误及解决方法]

### 性能考虑
- [性能特征和优化建议]

## 相关资源
- [API 文档](references/api_reference.md)
- [配置模板](assets/config_template.json)
```

## 5.添加支持文件（可选）

**脚本文件 (scripts/)**

**参考文档 (references/)**

**静态资源 (assets/)**

## 6.测试和验证

## 7.部署和发布


# 二、创建自己的第一个skill

## 规划Skill

我要创建这样一个示例：
```text
## 需求描述
- **功能目标**：读取满足swagger2.x规范的指定json文件，生成指定内容格式的markdown或pdf接口文档。
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







## 使用skill-creator辅助创建

skill-creator 是 Anthropic 官方提供的 Skills，专门用于指导和辅助创建其他 Skills。它的主要功能包括：

- 理解需求：通过分析具体示例来理解 Skills 应该实现的功能 
- 规划内容：识别可重用的脚本、参考文档和资源文件 
- 生成结构：自动创建 Skills 的标准目录结构 
- 编写文档：帮助编写 SKILL.md 和相关文档 
- 打包验证：验证并打包 Skills 
- 迭代优化：基于实际使用改进 Skills

**调用 skill-creator**

```text
# 直接使用 skill-creator
claude --skill skill-creator

# 或在对话中使用
"请使用 skill-creator 帮助我创建一个处理 PDF 文件的 Skills"
```

然后提供我们需要创建的Skill需求信息，并跟随指导逐步创建。
