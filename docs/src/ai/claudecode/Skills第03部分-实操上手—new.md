# Skills 实操上手

---

## 一、创建 Skill 的 4 步法

之前你可能看过 7 步流程，但实际生产中**核心只需 4 步**：

```
规划 → 建目录 → 写 SKILL.md → 测试
```

### 第 1 步：规划 Skill

想清楚 4 个问题即可开始：

| 问题 | 示例 |
|------|------|
| **解决什么问题**？ | 读取 Swagger JSON 生成接口文档 |
| **什么时候用**？ | "把这个 json 生成接口文档" |
| **产出什么**？ | Markdown / PDF 格式的结构化文档 |
| **边界在哪**？ | 仅支持 Swagger 2.0，暂不支持 OpenAPI 3.0 |

### 第 2 步：建目录

```bash
mkdir -p ~/.claude/skills/api-doc-generator/{scripts,references,assets}
touch ~/.claude/skills/api-doc-generator/SKILL.md
```

**命名铁律**：
- 仅限小写字母、数字、连字符 `-`
- 长度 ≤ 64 字符
- 目录名必须与 SKILL.md 中的 `name` 字段一致

### 第 3 步：编写 SKILL.md

```yaml
---
name: api-doc-generator
description: >
  当用户要求"生成接口文档"或"将swagger json转为文档"时，
  读取Swagger 2.0规范的JSON文件，生成Markdown或PDF格式的接口文档
---
```

完整的 Markdown Body 结构见下面的"完整示例"。

### 第 4 步：测试

```bash
# 验证 Skill 是否被加载
claude --skill api-doc-generator —version

# 实际测试
"请使用 api-doc-generator 帮我生成接口文档"
```

---

## 二、完整示例：Swagger → 接口文档 Skill

这是一个**生产级** Skill 示例，涵盖从规划到实现的完整过程。

### 2.1 需求定义

```text
## 需求描述
- 功能目标：读取 Swagger 2.0 JSON → 生成结构化接口文档
- 使用场景：
   - "请将该 json 接口文件生成 Markdown 格式的接口文档"
   - "读取 xx.json 生成 PDF 接口文档"
- 输出要求：
   - 保留中文内容
   - 按 Tag 分组展示接口
   - 文件名：原文件名_接口文档.md / 原文件名_接口文档.pdf
```

### 2.2 SKILL.md 完整内容

```yaml
---
name: api-doc-generator
description: >
  当用户要求"生成接口文档"、"swagger"、"openapi"或
  "将json转为文档"时，读取 Swagger 2.0 JSON 文件，
  生成结构化 Markdown 或 PDF 接口文档
user-invocable: true
---
```

```markdown
# API 接口文档生成 Skill

## 一、角色定义
你是一位 API 文档专家，熟悉 Swagger 2.0 / OpenAPI 规范，
能将原始的 JSON 接口定义转化为清晰、结构化的接口文档。

## 二、核心能力
1. **Swagger JSON 解析**：解析 info、host、basePath、paths、definitions
2. **结构化输出**：按 Tag 分组展示接口，包含 Method、URL、参数、响应
3. **多格式支持**：Markdown（可读性强）、PDF（适合分发）
4. **中文友好**：保留注释中的中文描述，Schema 字段名保持英文

## 三、工作流程

### 步骤 1：读取 Swagger JSON
- 读取用户指定的 `.json` 文件
- 校验是否满足 Swagger 2.0 规范（必须有 `swagger: "2.0"` 字段）

### 步骤 2：提取文档信息
```
基本信息 → info.title / info.version / host / basePath
分组信息 → tags[].name / tags[].description
接口列表 → paths 下的所有路径和方法
数据模型 → definitions 中的所有 Schema
```

### 步骤 3：生成 Markdown 文档
- 头部：API 名称、版本、Base URL
- 每个 Tag 一个二级标题
- 每个接口一个三级标题：`{Method} {Path}`
- 每个接口包含：参数列表、请求示例、响应格式

### 步骤 4：可选转换为 PDF
- 使用工具（如 pandoc）将 Markdown 转换为 PDF

## 四、输出格式

```markdown
# {API 名称}
> 版本：{version} | Base URL：{baseUrl}

## {Tag 名称}
{Tag 描述}

### {Method} {Path}
**描述**：{接口描述}

**请求参数**：
| 参数名 | 位置 | 类型 | 必需 | 描述 |
|--------|------|------|------|------|

**响应格式**：
```json
{示例响应}
```

## 数据模型
### {ModelName}
| 字段 | 类型 | 描述 |
|------|------|------|
```

## 五、规则约束
1. 仅支持 Swagger 2.0（`swagger: "2.0"`）
2. 保留 description 中的中文内容
3. 按 Tag 分组,没有 Tag 的归入"默认"
4. 文件名格式：`原文件名_接口文档.md/pdf`
5. 不对原始 JSON 做任何修改
```

### 2.3 调用效果示例

**用户输入**：

```
请使用 api-doc-generator 读取 user-service.json 生成接口文档
```

**预期产出**：

```markdown
# 用户服务 API
> 版本：1.0.0 | Base URL：http://localhost:8080/api

## 用户管理
用户相关接口

### GET /users
**描述**：获取用户列表

**请求参数**：
| 参数名 | 位置 | 类型 | 必需 | 描述 |
|--------|------|------|------|------|
| page | query | integer | 否 | 页码 |
| size | query | integer | 否 | 每页条数 |

**响应格式**：
| 字段 | 类型 | 描述 |
|------|------|------|
| code | integer | 状态码 |
| data | array | 用户列表 |
| message | string | 提示信息 |
```

---

## 三、使用 skill-creator 高效创建

Anthropic 官方提供了 **skill-creator** 工具，专门用于辅助创建 Skill：

```bash
# 命令行直接调用
claude --skill skill-creator

# 或在对话中
"请使用 skill-creator 帮助我创建一个处理 PDF 文件的 Skill"
```

**skill-creator 能帮你做什么**：
- 分析你的需求 → 输出 Skill 规划方案
- 自动生成 SKILL.md → 包含完整结构和推荐内容
- 识别可复用的脚本 → 哪些需要写到 `scripts/` 目录
- 打包验证 → 检查目录结构和 YAML 格式

---

## 四、避坑指南

以下是初学者最容易犯的 6 个错误：

| 错误 | 后果 | 正确做法 |
|------|------|----------|
| `name` 用了大写或空格 | Skill 无法被识别 | 全小写 + 连字符 |
| `description` **没有关键词** | Claude 永远不会自动匹配 | 包含用户可能说的自然语言 |
| SKILL.md **没有 YAML 元数据** | 完全无效 | 必须有 `---` 包裹的元数据 |
| 文件名写了 `SKILLS.md`**（多了一个 S）** | 完全不生效 | 必须命名为 `SKILL.md` |
| 目录里放了 5000 行**后** | 用完直接拉满上下文 | 正文 ≤ 500 行，详细内容拆分到 `references/` |
| `description` 写得太**泛** | 频繁误触发 | 精确描述使用场景 |

**典型错误案例**：

```yaml
# ❌ 错误：description 太宽泛
description: 帮助用户做各种事情

# ✅ 正确：精确描述
description: 当用户要求"审查代码"或"code review"时,
  对 Go/Python 代码进行结构化审查,生成审查报告
```

---

## 五、快速自检清单

创建完 Skill 后，逐一检查：

- [ ] 目录名 = `name` 字段 = 全小写+连字符
- [ ] SKILL.md 文件名正确（不是 SKILLS.md）
- [ ] YAML 元数据有 `name` 和 `description`
- [ ] `description` 包含触发关键词
- [ ] `description` ≤ 1024 字符
- [ ] 正文 ≤ 500 行
- [ ] 放到了正确的路径（个人级/项目级）
- [ ] 引用文件路径是相对路径