# 一、Skills 概述

## 什么是 Skills？

Skills是 Claude Code 中扩展机制，用于扩展 AI 代理的能力。通过将指令、脚本和资源组织到文件夹中，实现把特定领域的知识、规则、工具打包成可复用的模块，让 Claude 在需要时自动加载和使用。

Skills 的核心是一个简单的文件夹结构，包含一个必需的 `SKILL.md` 文件。这个文件使用 YAML 前置元数据和 Markdown 指令来定义 Skill 的功能和使用方式。

## 为什么需要 Skills？

传统的提示词（Prompt）能解决一次性问题，但存在明显局限：

- **不可复用**：每次对话都需要重新描述需求和规则
- **难以维护**：提示词分散在各个对话中，难以系统化管理
- **团队协作困难**：无法在团队间共享和标准化 AI 能力
- **缺乏结构化**：没有统一的格式和规范，难以规模化应用

Claude Skills 的出现解决了这些问题，实现将AI能力模块化、标准化。

| 对比维度     | 没有Skills  | 有Skills后     |
| -------- | --------- | ------------ |
| **知识积累** | 每次对话从零开始  | 领域知识预置，即用即专业 |
| **团队协作** | 每人都要教AI一遍 | 配置一次，全员共享    |
| **质量一致** | 输出质量随机    | 标准化流程，质量稳定   |
| **效率**   | 大量时间在沟通需求 | 直接进入核心任务     |
| **可维护性** | 知识散落在聊天记录 | 集中管理，版本可控    |

Skills具有以下优势：

- 知识封装：将专业知识打包成可复用的组件，实现固化经验、标准化工作流程、促进团队知识共享。
- 高效上下文管理：通过渐进式披露优化性能，减少初始上下文占用、按需加载详细信息。
- 灵活扩展：支持多种扩展方式，引用外部文档和脚本、集成可执行代码、支持模板和资源文件。
- 标准化格式：作为开放标准，具有跨平台兼容性、易于版本控制和便于分享和协作。

## Skills vs Commands

| 对比维度     | Commands（斜杠命令）  | Skills（能力包）        |
| -------- | --------------- | ------------------ |
| **定位**   | 触发器/入口点         | 能力包/知识库            |
| **复杂度**  | 单个Markdown文件    | 多文件目录结构            |
| **触发方式** | 显式调用 `/command` | 自动识别 + 显式调用        |
| **状态管理** | 无状态             | 可以维护状态和配置          |
| **工具集成** | 有限（直接写在md里）     | 强大（可集成Python/JS脚本） |
| **知识容量** | 几百到几千字          | 可达数万字              |
| **可维护性** | 简单直接            | 模块化分层              |
| **适用场景** | 单一任务            | 复杂工作流              |


# 二、Skill 目录结构

## Skill 的三种存放位置

Claude Code按照以下顺序查找并加载Skill（越具体的位置优先级越高）：

| 级别  | 路径                                      | 生效范围     |
| --- | --------------------------------------- | -------- |
| 个人级 | ~/.claude/skills/[skill-name]/SKILL.md  | 自己所有的项目  |
| 项目级 | ./.claude/skills/[skill-name]/SKILL.md  | 仅当前项目    |
| 插件级 | ~/.claude/plugins/[skill-name]/SKILL.md | 启用该插件的环境 |

## 标准目录结构
```text
skill-name/
├── SKILL.md                        # 必需：YAML frontmatter（元数据）+ Markdown 内容（指令）
├── scripts/                        # 可选：存放可执行的辅助脚本
│   ├── script1.py
│   └── script2.sh
├── references/                     # 可选：存放供 AI 参考的外部文档、Schema 等
│   ├── api_docs.md
│   └── schema.md
└── assets/                         # 可选：存放报告模板、图片等静态资源
    ├── template.html
    └── logo.png

```

## SKILL.md 配置详解

SKILL.md是Skill的核心定义文件，由两部分组成：YAML Frontmatter（元数据）和Markdown Body（指令主体）。

### YAML 前置元数据

位于SKILL.md文件最顶端，用于定义Skill的基本信息、依赖和配置。


| 字段              | 是否必需   | 说明                                                                           |
|-----------------|--------|------------------------------------------------------------------------------|
| name            | 必需     | Skill名称，唯一标识。约束：<br/>长度不超过 64 字符；仅允许使用小写字母、数字和连字符 -，不能以 - 开头或结尾；必须与所在文件夹名一致。 |
| description     | 必需     | 描述Skill做什么和什么时候用。约束：<br/>长度不超过1024字符，不能为空；应该包含AI可以识别任务的关键词。                  |
| license         | 可选     | 许可证信息或指向许可证文件路径。                                                             |
| metadata        | 可选     | 扩展元数据（如作者、版本号等）；                                                             |
| model           | 可选     | 指定运行模型（如opus、sonnet、haiku）                                                   |
| allowed-tools   | 可选     | 限制该技能可使用的工具。约束：<br/>使用逗号分隔，如Read, Grep, Glob                                      |
| disable-model-invocation | 可选     | 设为true时禁止Claude自动激活，只能手动/调用                                                  |
| user-invocable        | 可选     | 是否允许用户通过/命令手动调用，设为 false 时技能仅可由 Claude 自动调用，不暴露为用户命令                         |


```shell
---
# 最简单的SKILL.md（只有2个必填字段）
name: code-commenter
description: 当用户要求"添加注释"或"代码注释"时自动为代码添加清晰的中文注释
---

# 这里开始是Markdown Body部分
(详细指令内容...)
```


### Markdown Body（指令主体）

Markdown Body是SKILL.md的核心部分，包含所有详细指令。对正文格式没有硬性限制，只要能帮助 AI 有效执行任务即可。

建议正文控制在 500 行以内，如果内容较多，可以把详细的参考资料拆分到单独的文件中。

推荐遵循以下结构：

```shell
# [Skill名称]

## 一、角色定义
[AI的角色定位和专业背景]

## 二、核心能力
[列出3-5个核心能力]

## 三、工作流程
### 步骤1：[步骤名称]
[详细说明]

### 步骤2：[步骤名称]
[详细说明]

## 四、规则约束
[必须遵守的规则]

## 五、输出格式
[定义输出结构和格式]

## 六、示例展示
[好/坏示例对比]
```
- 层次清晰：使用多级标题组织内容

- 简洁明确：每段只讲一个要点

- 可操作性强：提供具体步骤而非抽象概念

- 示例驱动：用具体例子说明抽象规则

实际示例：

```shell
---
name: title-generator
description: 当用户需要生成公众号标题时，自动应用5大爆款公式
---

# 标题生成Skill

## 一、角色定义
你是一位爆款标题专家，擅长创作高点击率的公众号标题，精通5大爆款公式。

## 二、核心能力
1. **工具推荐型**：品牌词+数字+推荐词
2. **教程型**：动作词+品牌词+场景
3. **问题解决型**：痛点+解决方案
4. **数据型**：数据+洞察
5. **案例型**：真实案例+收获

## 三、工作流程
### 步骤1：分析主题
- 提取核心关键词
- 确定目标受众
- 识别品牌词

### 步骤2：应用公式
为每个公式生成1-2个标题

### 步骤3：评分排序
按以下标准评分：
- 吸引力（30分）
- 相关性（30分）
- 可信度（20分）
- 可行动性（20分）

## 四、规则约束
1. 标题字数：15-30字
2. 必须包含品牌词（如Claude、Cursor）
3. 使用数字增加可信度
4. 避免标题党和虚假承诺

## 五、示例展示

**✅ 好的标题**：
- "Claude Code 3个隐藏技巧，让你的开发效率翻倍"（工具推荐型）
- "手把手教你用Cursor，从入门到精通只需2小时"（教程型）

**❌ 差的标题**：
- "这个工具太厉害了！"（没有具体信息）
- "99%的人不知道的秘密"（标题党）

## 六、输出格式
【推荐标题1】标题内容
公式：使用的标题公式
评分：XX分
推荐理由：为什么这个标题好

【备选标题2-5】...
```

### 文件引用机制

在 SKILL.md 中引用其他文件时，采用相对于Skill根目录的路径。例如：

```text
详情请参考 [API 文档](references/api.md)。

运行示例脚本：scripts/demo.py

```
建议文件引用保持在一层深度，避免深层嵌套的引用链。

### 可选的目录结构

> script/ 目录

存放 可以运行的可执行代码。脚本应该是自包含的或明确说明依赖关系，包含有用的错误提示信息，并能妥善处理边界情况。

常见支持的语言包括 Python、Bash 和 JavaScript。


> references/ 目录

存放可以读取的补充文档，例如：REFERENCE.md（详细技术参考）、OpenApi.md（接口规范）等。

建议每个参考文件保持聚焦，因为按需加载文件，文件越小，消耗的上下文越少。

> assets/ 目录

存放静态资源文件，包括：模板文件（文档模板、配置模板）、图片（示意图、示例图）、数据文件（查找表、Schema 定义）。


# 三、管理 Skill

本部分涵盖从获取到维护的全过程，适合团队 SOP（标准作业程序）参考。

## 安装

Skill 本质上就是一个目录，所以“安装”的核心很简单：把完整的 Skill 目录放到 Claude Code 会扫描的位置。

（1）手动复制：将别人的Skill目录拷贝到自己个人/项目的技能库：

（2）通过插件市场安装： 对于官方或社区发布的插件包，可以通过插件市场安装：

```text
# 安装插件（包含多个 Skills）
claude plugin install <plugin>@<marketplace>

# 示例
claude plugin install document-skills@anthropic-agent-skills

```
插件安装后，Skills 会出现在 ~/.claude/plugins/cache/ 目录下，并被 Claude Code 自动识别。实际使用时，通常直接在提示里点名 Skill 即可，例如 “Use the PDF skill...”。

查看已安装的插件验证：

```shell
claude plugin list
```


**Skill查找及推荐:**

TODO

## 触发

### 自动触发

Claude 会根据你的请求和 Skill 的 description 自动匹配。当请求与某个 Skill 的描述相符时，Claude 会自动加载该 Skill。比如：一个 Skill 的描述是”解释代码工作原理”，当你问：这段代码是怎么工作的？Claude 就可能调用这个 Skill 来完成任务。

所以为了提高触发率，需要：
- 在 description 中包含关键词； 
- 描述要具体，避免过于宽泛； 
- 清晰说明使用场景；

### 手动触发：

在命令行直接点名某个 Skill：使用PDF skill提取文档中的信息。 这种方式适合：
- 你明确知道要使用哪个 Skill；
- 想降低自动匹配带来的歧义；
- 需要更明确地约束执行流程；

## 更新

（1）手动更新:直接编辑 Skill 文件。

（2）命令更新： 如果 Skill 是从 GitHub 仓库克隆的，可以用 Git 命令更新。

```text
# 进入 Skill 目录
cd ~/.claude/skills/marketingskills

# 拉取最新代码
git pull origin main
```

（3）插件更新：使用插件更新命令下载最新版本并替换缓存中的旧版本。建议更新插件后重启 Claude Code。

```text
# 更新指定插件
claude plugin update <plugin>@<marketplace>

# 示例
claude plugin update document-skills@anthropic-agent-skills
```
插件更新会下载最新版本并替换缓存中的旧版本，但更新后通常需要重启 Claude Code 才会生效。


## 卸载

（1）卸载手动安装的Skill：直接删除对应目录即可。

（2）卸载插件：使用插件管理命令卸载。卸载插件会自动清理 ~/.claude/plugins/cache/ 下的相关文件。

```text
# 卸载插件
claude plugin uninstall <plugin>@<marketplace>

# 示例
claude plugin uninstall document-skills@anthropic-agent-skills
```


# 第四部分：实战应用 - 使用 Skills 进行编程开发

本部分通过具体场景展示价值，最能打动开发者。

## 代码质量审核 (Code Review)

固化 Checklist：错误处理、日志格式、注释规范。

自动化跑通审查流程，替代人工重复检查。

## 单元测试生成

利用 Skill 自动生成高覆盖率的测试用例模板。

## 问题排查助手

将团队的故障排查 SOP 封装成 Skill，新人也能快速定位问题。

# 第五部分：进阶技巧 - 测试、调试与安全

本部分体现技术深度，确保团队落地不踩坑。

.1 测试和调试 Skills

加载验证：检查 YAML 语法、文件路径。

功能调试：日志记录（简单日志文件）、逐步调试技巧。

性能优化：Token 消耗估算与优化（避免上下文过长）。

.2 安全使用规范（重要）

风险类型：数据泄露、恶意脚本。

审查清单：安装前检查脚本权限、审查 scripts/ 目录代码。

沙箱策略：敏感项目使用隔离环境。


# 常见问题

# 附录

Claude Code Skills 使用指南：安装、创建与管理 (掘金)

测试和调试Skills (Claude Code 深度教程)

[https://juejin.cn/post/7614451900677685263?searchId=202604292242062E7EFC93729B4229D1AD#heading-13](https://juejin.cn/post/7614451900677685263?searchId=202604292242062E7EFC93729B4229D1AD#heading-13)

[https://claudecode.tangshuang.net/tutorial/17.5%20%E6%B5%8B%E8%AF%95%E5%92%8C%E8%B0%83%E8%AF%95Skills#1.%20%E7%AE%80%E5%8D%95%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95](https://claudecode.tangshuang.net/tutorial/17.5%20%E6%B5%8B%E8%AF%95%E5%92%8C%E8%B0%83%E8%AF%95Skills#1.%20%E7%AE%80%E5%8D%95%E6%97%A5%E5%BF%97%E8%AE%B0%E5%BD%95)

[Claude Skills 完全指南：从入门到精通Claude Skills 是一种可复用的 AI 能力单元，通过结构化 - 掘金](https://juejin.cn/post/7601929765533859891?searchId=20260428110817AABBC762FDCEA5408785#heading-8)

https://github.com/KimYx0207/Claude-Code-x-OpenClaw-Guide-Zh/blob/main/docs/claude-code/07-Skills%E5%AE%9A%E5%88%B6%E5%AE%8C%E6%95%B4%E6%8C%87%E5%8D%97.md#%E5%90%84%E7%9B%AE%E5%BD%95%E7%94%A8%E9%80%94%E8%AF%B4%E6%98%8E

[Claude官方Skills-构建完全指南：从零到一打造你的AI技能包Claude官方Skills-构建完全指南：从零到 - 掘金](https://juejin.cn/post/7608953445571854336?searchId=20260428110817AABBC762FDCEA5408785#heading-10)

[Claude Code深度教程 - 100%免费从入门到精通100万字完全教程](https://claudecode.tangshuang.net/tutorial/14.1%20Skills%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5#SKILL.md%20%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F)

[Skills 基本结构 | 菜鸟教程](https://www.runoob.com/skills/skills-structure.html)


### 创建自己的 Skill

规划阶段：明确目标（如“SEO 审计”或“Dockerfile 生成”）。

初始化：使用 skill-creator 辅助创建（如有）或手动搭建骨架。

功能增强：

添加脚本和可执行文件（Shell/Python）。

添加资源文件和参考资料（外部文档引用）。
