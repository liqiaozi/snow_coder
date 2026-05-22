---
name: swagger-doc-gen
description: Swagger 2.x 接口文档生成工具。读取符合 Swagger 2.x 规范的 JSON 文件，按照指定格式生成 Markdown 或 PDF 格式的接口文档。当用户提到 Swagger 文档生成、API 文档生成、接口文档导出、swagger 转 markdown、swagger 转 pdf、读取 json 生成接口文档时，应使用此 skill。
---

# Swagger 接口文档生成 Skill

## 角色定义
你是一位 API 文档专家，熟悉 Swagger 2.0  规范，能将原始的 JSON 接口定义转化为清晰、结构化的接口文档。

## 核心能力
1. **Swagger JSON 解析**：解析 info、host、basePath、paths、definitions
2. **结构化输出**：按 Tag 分组展示接口，包含 Method、URL、参数、响应
3. **多格式支持**：Markdown（可读性强）、PDF（适合分发）
4. **中文友好**：保留注释中的中文描述，Schema 字段名保持英文


## 工作流程

### 步骤 1：确认输入

向用户确认 Swagger JSON 文件路径。如果用户未指定，询问用户文件位置。

### 步骤 2：确认输出格式

询问用户输出格式（Markdown 或 PDF），默认为 Markdown。

### 步骤 3：读取并解析 JSON

读取 Swagger JSON 文件，提取以下信息：

- `info.title` — 文档标题
- `info.version` — 版本号
- `info.description` — 描述
- `host` — 主机地址
- `basePath` — 基础路径
- `schemes` — 协议（http/https）
- `consumes` / `produces` — 请求/响应格式
- `securityDefinitions` — 认证方式
- `paths` — 接口列表（按 tag 分组）
- `definitions` — 数据模型定义

### 步骤 4：生成文档

按照 `接口文档格式.md` 的格式生成文档。

## 文档格式规范

### 文档头部

```markdown
# {info.title} {info.version}

## 概述
{info.description}

---

## 通用说明
- 认证方式：{从 securityDefinitions 提取}
- 请求格式：{consumes}
- 响应格式：{produces}
- 基础路径：`{basePath}`
- 主机地址：`{schemes[0]}://{host}{basePath}`
```

### 版本记录

```markdown
## 版本记录
| 版本号 | 更新日期 | 更新内容 |
|--------|----------|----------|
| {version} | - | {info.description} |
```

### 接口列表

按 `tags` 分组，每个 tag 一个一级分组：

```markdown
## 接口列表

### {tag名称}

#### {序号}. {接口名称}
- **URL**: `{basePath}{path}`
- **方法**: `{GET|POST|PUT|DELETE|PATCH}`
- **描述**: {summary 或 description}
```

#### 请求参数

按位置分组展示：

```markdown
##### Header 参数
| 参数名 | 类型 | 是否必填 | 参数示例 | 说明 |
|--------|------|----------|----------|------|
```

```markdown
##### Query 参数
| 参数名 | 类型 | 是否必填 | 参数示例 | 说明 |
|--------|------|----------|----------|------|
```

```markdown
##### Path 参数
| 参数名 | 类型 | 是否必填 | 参数示例 | 说明 |
|--------|------|----------|----------|------|
```

```markdown
##### Body 参数
| 参数名 | 类型 | 是否必填 | 参数示例 | 说明 |
|--------|------|----------|----------|------|
```

#### 请求示例

```markdown
##### 请求示例
```json
{METHOD} {basePath}{path}
{Header 参数示例}
Content-Type: application/json

{Body 示例 JSON}
```
```

#### 响应参数

```markdown
##### 响应参数
| 参数名 | 类型 | 参数示例 | 说明 |
|--------|------|----------|------|
```

对于 `data` 等嵌套对象，追加子参数表：

```markdown
###### {fieldName} 对象参数
| 参数名 | 类型 | 参数示例 | 说明 |
|--------|------|----------|------|
```

#### 响应示例

```markdown
##### 响应示例
```json
{响应 JSON 示例}
```
```

### 接口分隔

每个接口后用 `---` 分隔。

## 参数处理规则

### 类型映射

| Swagger 类型 | Markdown 类型 |
|-------------|--------------|
| string | string |
| integer | int |
| number | number |
| boolean | boolean |
| array | array |
| object | object |

### 是否必填判断

- `in: "path"` → 必填
- `in: "body"` 或 `in: "formData"` → 根据 schema 中 required 字段判断
- 其他 → 根据 parameter 是否在 required 数组中判断

### 参数示例生成

- string → `"example"` 或 `"示例值"`
- integer → `1` 或数字
- boolean → `true` 或 `false`
- array → `["item1", "item2"]`
- object → 展开 schema.properties 生成示例

### Body 参数递归展开

对于 object 类型的 body 参数：
1. 读取 `schema.properties` 中的字段定义
2. 逐字段生成参数表（参数名、类型、是否必填、示例、说明）
3. 对于嵌套 object，递归展开并追加子参数表

## PDF 生成

如果用户要求生成 PDF：

1. 先生成 Markdown 文件
2. 使用 `pandoc` 将 Markdown 转换为 PDF：

```bash
pandoc input.md -o output.pdf --from markdown --to pdf --variable margin-top=25 --variable margin-bottom=25 --variable margin-left=25 --variable margin-right=25
```

3. 如果 pandoc 不可用，告知用户并建议手动将 Markdown 转为 PDF

## 输出文件命名

- Markdown：`{原文件名}_接口文档.md`
- PDF：`{原文件名}_接口文档.pdf`

输出文件放在与输入 JSON 文件相同的目录下。

## 错误处理

- JSON 解析失败 → 提示用户文件格式不符合 Swagger 2.x 规范
- 文件不存在 → 提示用户确认文件路径
- 无接口数据 → 提示用户 JSON 中 paths 为空
