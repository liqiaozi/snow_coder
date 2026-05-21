# Skills 基础介绍

## 什么是 Skills？

Skills 是 Claude Code 中的**可复用能力包** — 将特定领域的知识、规则、工具和脚本打包成一个标准化的模块，让 Claude 在需要时自动加载并使用。

Skills 的本质就是一个**标准化的文件夹结构**，核心是一个 `SKILL.md` 文件，通过 YAML 前置元数据 + Markdown 指令来定义 AI 的行为方式。

简单来说：**Prompt 是口头交代，Skills 是写入基因**。

---

## 为什么需要 Skills？

### 传统 Prompt 的四大痛点

| 问题 | 具体表现 |
|------|----------|
| **不可复用** | 每次对话都要重新描述"请你扮演XX，按照XX步骤"，大量重复劳动 |
| **难以维护** | 好的 Prompt 散落在各个聊天记录里，想找出来比重新写还费劲 |
| **团队无法共享** | 每个人都在"调教"自己的 AI，能力输出因人而异，没有统一标准 |
| **缺乏规范** | 大家都是自由发挥的"野生 Prompt"，无法规模化管理和迭代 |

### Skills 的核心价值

```
传统方式：
  新人来了 →
    口头传一遍规范 →
    自己调 Prompt →
    质量看个人悟性

用 Skills：
  新人来了 →
    安装 Skill →
    直接进入高质量工作
```

### Skills vs Commands（斜杠命令）

很多初学者容易混淆这两个概念，这里做一个清晰的对比：

| 对比维度 | Commands（斜杠命令） | Skills（能力包） |
|---------|---------------------|-----------------|
| **定位** | 快捷入口 / 触发器 | 能力包 / 知识库 |
| **复杂度** | 单个 Markdown 文件 | 多文件目录结构（可带脚本、文档、资源） |
| **触发方式** | 手动输入 `/command` | 自动匹配 + 手动调用 |
| **状态管理** | 无状态，用完即走 | 可维护状态和持久配置 |
| **工具集成** | 有限（直接在 md 中描述） | 强大（可集成 Python、Bash、JS 脚本） |
| **知识容量** | 几百 ~ 几千字 | 可达数万字（通过渐进式加载） |
| **适用场景** | 单一、简单任务 | 复杂、多步骤工作流 |

**类比理解**：
- Commands 就像**手持吸尘器** — 拿出来就用，用完放回去
- Skills 就像**全屋中央吸尘系统** — 需要安装配置，但一劳永逸，能力强大

---

## Skill 目录结构

### 三种存放位置（优先级从高到低）

| 级别 | 路径 | 生效范围 | 适用场景 |
|------|------|----------|----------|
| **个人级** | `~/.claude/skills/<skill-name>/SKILL.md` | 该用户所有项目 | 个人常用工具链 |
| **项目级** | `./.claude/skills/<skill-name>/SKILL.md` | 仅当前项目 | 项目特定规范、团队共享 |
| **插件级** | `~/.claude/plugins/<skill-name>/SKILL.md` | 启用插件的环境 | 通过市场安装的第三方能力包 |

**查找优先级**：个人级 > 项目级 > 插件级。同名的 Skill，越具体的路径优先级越高。

### 标准目录结构

```
my-skill/
├── SKILL.md                    # 必需：核心指令文件（YAML 元数据 + Markdown 指令）
├── scripts/                    # 可选：可执行的辅助脚本
│   ├── analyze.py
│   └── format.sh
├── references/                 # 可选：参考文档（API 文档、Schema、规范等）
│   ├── api-docs.md
│   └── coding-standards.md
└── assets/                     # 可选：模板、图片等静态资源
    ├── report-template.html
    └── logo.png
```

**SKILL.md** 是整个 Skill 的**灵魂文件**，其他目录都是辅助。一个 Skill 完全可以只有一个 `SKILL.md`，其他按需添加。

---

## SKILL.md 配置详解

### YAML 前置元数据

SKILL.md 文件最顶端的 `---` 包裹区域，用于定义 Skill 的基本信息：

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

**关键字段速查表**：

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | 是 | 长度 ≤64 字符，仅限小写字母、数字、连字符 `-`，不能以 `-` 开头/结尾，必须与文件夹名一致 |
| `description` | 是 | 长度 ≤1024 字符，**包含关键词**以便 Claude 自动匹配 |
| `allowed-tools` | 否 | 限制 Skill 可调用的工具，多个用逗号分隔 |
| `user-invocable` | 否 | `true` 时用户可通过 `/skill-name` 手动调用；`false` 时仅由 Claude 自动匹配 |
| `disable-model-invocation` | 否 | `true` 时禁止 Claude 自动激活，只能手动调用|

> **💡 最佳实践**：`description` 一定要包含用户可能使用的自然语言关键词。比如一个代码审查 Skill，description 里应有"审查代码"、"代码审核"、"code review"等，提高自动匹配命中率。

### Markdown Body（指令主体）

这是 Skill 的**核心内容**，包含所有操作指令。正文没有硬性格式限制，但推荐遵循以下结构以保持一致性：

```
# [Skill 名称]

## 一、角色定义
AI 的角色定位和专业背景

## 二、核心能力
列出 3~5 个核心能力

## 三、工作流程
### 步骤 1：XXX
### 步骤 2：XXX

## 四、规则约束
必须遵守的边界条件

## 五、输出格式
定义输出的结构和格式

## 六、示例展示
好 / 坏示例对比
```

**编写技巧**：
- **层次清晰**：用多级标题组织内容，每段只讲一个要点
- **可操作性强**：提供具体步骤而不是抽象概念
- **示例驱动**：用具体例子说明抽象规则，好/坏对比最有效
- **控制篇幅**：正文建议控制在 500 行以内，详细的参考资料拆分到 `references/` 目录

### 文件引用机制

在 SKILL.md 中引用外部文件，使用相对于 Skill 根目录的路径：

```markdown
详情请参考 [API 文档](references/api.md)。
运行示例脚本：scripts/demo.py
```

---

## 管理 Skill（生命周期管理）

### 安装

将完整的 Skill 目录放到 Claude Code 会扫描的位置即可：

```bash
# 手动安装（复制到个人技能库）
cp -r ~/downloads/code-reviewer ~/.claude/skills/

# 通过插件市场安装
claude plugin install document-skills@anthropic-agent-skills
```

### 触发

**自动触发**：Claude 根据请求内容与 Skill 的 `description` 自动匹配。当你的请求关键词命中 Skill 描述时，Claude 自动加载该 Skill。

**手动触发**：在对话中直接点名：

```
请使用 code-reviewer 技能审查这段代码
```

---

## 关键设计原则（吃透这 3 点）

1. **渐进式披露**：元数据 → 指令 → 资源，分层加载，按需消耗 Token（详见第02部分）
2. **约定优于配置**：目录结构、文件命名、YAML 元数据都有标准规范，遵循即可
3. **可组合性**：多个 Skill 可以协同工作，一个工作流可以涉及多个 Skill 的接力

---

## 小结

| 你需要记住什么 |
|----------------|
| Skills = 标准化的 AI 能力包，本质是文件夹 + SKILL.md |
| 三层位置：个人级 > 项目级 > 插件级 |
| YAML 元数据 | Markdown 指令 = 身份证 + 操作手册 |
| `description` 写得好，自动匹配就准 |
| 可以不带脚本，但不能没有 SKILL.md |