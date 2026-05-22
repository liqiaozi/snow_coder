# 一、Skills 概述

## 什么是 Skills？

Skills 是 Claude Code 中的可复用能力包 — 将特定领域的知识、规则、工具和脚本打包成一个标准化的模块，让 Claude 在需要时自动加载并使用。

Skills 的本质就是一个标准化的文件夹结构，核心是一个 SKILL.md 文件，通过 YAML 前置元数据 + Markdown 指令来定义 AI 的行为方式。

## 为什么需要 Skills？

传统Prompt痛点：

- **不可复用**：每次对话都需要重新描述需求和规则
- **难以维护**：提示词分散在各个对话中，难以系统化管理
- **团队协作困难**：无法在团队间共享和标准化 AI 能力
- **缺乏结构化**：没有统一的格式和规范，难以规模化应用

Claude Skills 的出现解决了这些问题，实现将AI能力模块化、标准化。

| 对比维度     | 没有Skills         | 有Skills后               |
| ------------ | ------------------ | ------------------------ |
| **知识积累** | 每次对话从零开始   | 领域知识预置，即用即专业 |
| **团队协作** | 每人都要教AI一遍   | 配置一次，全员共享       |
| **质量一致** | 输出质量随机       | 标准化流程，质量稳定     |
| **效率**     | 大量时间在沟通需求 | 直接进入核心任务         |
| **可维护性** | 知识散落在聊天记录 | 集中管理，版本可控       |

Skills具有以下优势：

- 知识封装：将专业知识打包成可复用的组件，实现固化经验、标准化工作流程、促进团队知识共享。
- 高效上下文管理：通过渐进式披露优化性能，减少初始上下文占用、按需加载详细信息。
- 灵活扩展：支持多种扩展方式，引用外部文档和脚本、集成可执行代码、支持模板和资源文件。
- 标准化格式：作为开放标准，具有跨平台兼容性、易于版本控制和便于分享和协作。

## Skills vs Commands

| 对比维度     | Commands（斜杠命令） | Skills（能力包）                   |
| ------------ | -------------------- | ---------------------------------- |
| **定位**     | 触发器/入口点        | 能力包/知识库                      |
| **复杂度**   | 单个Markdown文件     | 多文件目录结构                     |
| **触发方式** | 显式调用`/command`   | 自动匹配 + 显示调用                |
| **状态管理** | 无状态               | 可以维护状态和持久配置             |
| **工具集成** | 有限（直接写在md里） | 强大（可集成Python、Bash、JS脚本） |
| **知识容量** | 几百--几千字         | 可达数万字                         |
| **可维护性** | 简单直接             | 模块化分层                         |
| **适用场景** | 单一任务             | 复杂工作流                         |

# 二、Skill 目录结构

## Skill 的三种存放位置

| 级别   | 路径                                    | 生效范围         | 适用场景                     |
| ------ | --------------------------------------- | ---------------- | ---------------------------- |
| 个人级 | ~/.claude/skills/[skill-name]/SKILL.md  | 自己所有的项目   | 个人常用工具链               |
| 项目级 | ./.claude/skills/[skill-name]/SKILL.md  | 仅当前项目       | 项目特定规范、团队共享       |
| 插件级 | ~/.claude/plugins/[skill-name]/SKILL.md | 启用该插件的环境 | 通过市场安装的第三方的能力包 |

**查找优先级**：个人级 > 项目级 > 插件级。同名的 Skill，越具体的路径优先级越高。

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

SKILL.md 是整个 Skill 的灵魂文件，其他目录都是辅助。一个 Skill 完全可以只有一个 SKILL.md，其他按需添加。

## SKILL.md 配置详解

SKILL.md是Skill的核心定义文件，由两部分组成：YAML Frontmatter（元数据）和Markdown Body（指令主体）。

### YAML 前置元数据

SKILL.md 文件最顶端的 --- 包裹区域，用于定义 Skill 的基本信息：

```yaml
---
name: code-reviewer          # 必需：唯一标识，与文件夹名一致
description: >               # 必需：告诉 Claude 何时使用
  当用户要求"审查代码"或"代码审核"时，
  自动对 Go/Python 代码进行结构化审查
license: MIT                  # 可选
metadata:                     # 可选：扩展信息
  author: team-arch
  version: 1.2.0
model: opus                   # 可选：指定模型（opus/sonnet/haiku）
allowed-tools: Read, Grep, Glob  # 可选：限制可用工具
user-invocable: true          # 可选：是否暴露为 / 命令
---
```

| 字段                     | 必需 | 说明                                                                                                                              |
| ------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| name                     | 必需 | Skill名称，唯一标识。约束：长度≤ 64 字符；仅允许使用小写字母、数字和连字符 -，不能以 - 开头或结尾；必须与所在文件夹名一致。 |
| description              | 必需 | 描述Skill做什么和什么时候用。约束：长度≤1024字符，不能为空；包含关键词以便Claude自动匹配。                                  |
| license                  | 可选 | 许可证信息或指向许可证文件路径。                                                                                                  |
| metadata                 | 可选 | 扩展元数据（如作者、版本号等）；                                                                                                  |
| model                    | 可选 | 指定运行模型（如opus、sonnet、haiku）                                                                                             |
| allowed-tools            | 可选 | 限制可使用的工具。约束：使用逗号分隔，如Read, Grep, Glob                                                                     |
| disable-model-invocation | 可选 | true时禁止Claude自动激活，只能手动调用                                                                                            |
| user-invocable           | 可选 | true 时用户可通过 /skill-name 手动调用；false 时仅由 Claude 自动匹配                                                              |

> 最佳实践：description 一定要包含用户可能使用的自然语言关键词。比如一个代码审查 Skill，description 里应有"审查代码"、"代码审核"、"code review"等，提高自动匹配命中率。

### Markdown Body（指令主体）

Markdown Body是SKILL.md的核心部分，包含所有操作指令。正文格式没有硬性限制，但推荐遵循以下结构：




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

编写技巧：
- 层次清晰：使用多级标题组织内容，每段只讲一个要点
- 可操作性强：提供具体步骤而非抽象概念
- 示例驱动：用具体例子说明抽象规则，好/坏对别最有效
- 控制篇幅：正文建议控制在 500 行以内，详细的参考资料拆分到 `references/` 目录。


### 文件引用机制

在 SKILL.md 中引用其他文件时，使用相对于Skill根目录的路径。例如：

```text
详情请参考 [API 文档](references/api.md)。

运行示例脚本：scripts/demo.py
```

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

## 安装

将完整的 Skill 目录放到 Claude Code 会扫描的位置即可：

```shell
# 手动安装（复制到个人技能库）
cp -r ~/downloads/code-reviewer ~/.claude/skills/

# 通过插件市场安装
claude plugin install document-skills@anthropic-agent-skills

```

## 触发

### 自动触发

Claude 会根据你的请求与Skill 的 `description` 自动匹配。当请求关键词命中Skill 的描述时，Claude 会自动加载该 Skill。

### 手动触发

在命令行直接点名某个 Skill。

```text
使用PDF skill提取文档中的信息.
```
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

