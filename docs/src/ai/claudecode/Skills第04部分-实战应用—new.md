# Skills 实战应用

> 前3篇文档解决了"Skills 是什么"、"怎么工作的"、"怎么创建"。这一篇聚焦**怎么用到实际工作中** — 用 3 个完整的实战案例，覆盖代码质量（审查）+ 测试（单元测试）+ 运维（JMeter），让你看到 Skills 在生产环境中的真实价值。

---

## 一、实战案例 1：Go 代码审查 Skill

### 1.1 痛点

- 代码 Review 靠人工，低级错误（命名不规范、缺少错误处理）反复出现
- 团队成员水平参差不齐，Review 标准不统一
- Review 慢了阻塞合流，快了质量下降

### 1.2 Skill 设计

**能力范围**：
- 命名规范（驼峰 vs 下划线、缩写规则）
- 错误处理（`if err != nil` 是否遗漏）
- 并发安全（goroutine 泄漏检测、Mutex 使用）
- 性能问题（不必要的内存分配、JSON 序列化优化）

```yaml
---
name: go-code-reviewer
description: >
  当用户要求"审查 Go 代码"、"code review"或"检查代码质量"时，
  对 Go 代码进行结构化审查，输出带有严重级别的审查报告
user-invocable: true
---
```

### 1.3 审查维度

```
go-code-reviewer 的 6 个审查维度：

1. 命名规范（naming）
   - 导出类型/函数是否有 Godoc 注释
   - 变量命名是否简洁且有含义
   - 包名是否小写、无下划线

2. 错误处理（errors）
   - err != nil 是否有遗漏
   - 是否有用 _ 吞掉错误
   - 错误信息是否包含上下文

3. 并发安全（concurrency）
   - goroutine 是否有退出机制
   - Mutex/Lock 范围是否合理
   - channel 是否有关闭处理

4. 代码可测性（testability）
   - 函数是否过度耦合
   - 是否依赖全局状态
   - 接口设计是否便于 mock

5. 性能问题（performance）
   - 不必要的 fmt.Sprintf → 用 strconv
   - 大对象是否用指针传递
   - map/slice 是否预分配

6. 代码风格（style）
   - gofmt 格式
   - 不使用 deprecated 函数
```

### 1.4 审查报告格式

```text
## 代码审查报告

### 🔴 严重（P0）
- [第 42 行] goroutine 没有退出机制，可能导致泄漏
  - 建议：使用 select + context.Done() 控制生命周期

### 🟡 警告（P1）
- [第 15 行] 函数命名 UserGetInfo → GetUserInfo
  - 建议：Go 命名规范，避免不必要的冗余

### 🔵 建议（P2）
- [第 88 行] map 未预分配大小
  - 建议：make(map[string]int, expectedSize) 减少 rehash
```

### 1.5 实际收益

| 指标 | 之前 | 之后 |
|------|------|------|
| 单次 Code Review 时间 | 20~30 min | 5~10 min |
| 低级错误流入主干 | 每 PR ~3 个 | 几乎为 0 |
| Review 标准一致性 | 因人而异 | 统一输出 |

---

## 二、实战案例 2：Go 单元测试 Skill

### 2.1 痛点

- 开发"写完代码 = 完事了"，回头看补测试的成本极高
- 测试覆盖率上不去，重构没有安全感
- 团队没有统一的测试风格（有人用 `httptest`、有人 mock 满天飞）

### 2.2 Skill 设计

```yaml
---
name: go-test-generator
description: >
  当用户要求"生成测试"、"写单元测试"或"添加 test"时，
  为 Go 代码生成符合团队规范的 Table-Driven 单元测试
---
```

**测试生成策略**：

```
函数类型        → 测试重点
────────────────────────────────────────
HTTP Handler   → httptest.NewRecorder + 断言状态码/响应体
Service 层      → mock repo + 测试业务逻辑
DB 操作         → 用 sqlmock 或真实内存 DB
Utils/工具函数  → 纯函数测试，断言返回值
```

### 2.3 生成的测试示例

**输入函数**：

```go
func GetUser(db *sql.DB, id int64) (*User, error) {
    row := db.QueryRow("SELECT id, name, email FROM users WHERE id = ?", id)
    u := &User{}
    err := row.Scan(&u.ID, &u.Name, &u.Email)
    if err != nil {
        return nil, fmt.Errorf("get user %d: %w", id, err)
    }
    return u, nil
}
```

**Skill 输出**：

```go
func TestGetUser(t *testing.T) {
    type args struct {
        id int64
    }
    tests := []struct {
        name    string
        args    args
        want    *User
        wantErr bool
    }{
        {
            name:    "正常获取用户",
            args:    args{id: 1},
            want:    &User{ID: 1, Name: "Alice", Email: "alice@ex.com"},
            wantErr: false,
        },
        {
            name:    "用户不存在",
            args:    args{id: 999},
            want:    nil,
            wantErr: true,
        },
        {
            name: "ID <=0",
            args: args{id: 0},
            want:    nil,
            wantErr: true,
        },
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // 注意：这里需要注入 mock DB
            got, err := GetUser(mockDB, tt.args.id)
            if (err != nil) != tt.wantErr {
                t.Errorf("GetUser() error = %v, wantErr %v", err, tt.wantErr)
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("GetUser() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

> **注意**：命令所示 Skill 本身**不需要**写 bug 测试。它的产出是测试框架 + 边界，开发者只需补充 mock 数据。这已经把 80%「不想写测试」的阻力打掉了。

### 2.4 收益

| 以前 | 以后 |
|------|------|
| "我不知道测试怎么写" | Skill 自动输出 Table-Driven 模板 |
| "补测试太它烦了" | 写一行 mock → 得到 100 行测试 |
| "这个边界我没想到" | Skill 自动识别 3~5 个边界案例 |

---

## 三、实战案例 3：Swagger → JMeter 脚本 Skill

### 3.1 痛点

- 接口测试要手动配 JMeter，20 个接口配 1 小时
- 接口文档和 JMeter 脚本不一致
- 每次接口变了，JMeter 脚本没有同步更新

### 3.2 Skill 设计

```yaml
---
name: swagger-to-jmeter
description: >
  当用户要求"生成 JMeter 脚本"、"接口转 JMeter"或"压力测试脚本"时，
  读取 Swagger JSON，自动生成 JMeter .jmx 脚本文件
user-invocable: true
---
```

### 3.3 核心逻辑

```
Swagger JSON → 解析 paths → 生成 JMeter Thread Group
                                        │
            ┌───────────────────────────┼───────────────────┐
            ▼                           ▼                   ▼
    HTTP Request Defaults          每个接口一个          CSV Data Set Config
  (protocol + host + port)        HTTP Sampler          (参数化)
            │                           │                   │
            └───────────────────────────┼───────────────────┘
                                        ▼
                                    Test Fragment
                                    ＋
                                    Listeners
                                    (聚合报告 + 结果树)
```

**生成的 .jmx 脚本特征**：
- **线程组**：可配置（默认 10 线程 × 1 循环）
- **HTTP 请求默认值**：从 `host` + `basePath` 提取
- **每个接口一个 Sampler**：Method, Path, Parameters
- **断言**：自动添加 Response Code 200 断言
- **监听器**：聚合报告 + 查看结果树
- **参数化**：通过 CSV Data Set Config 驱动不同输入

### 3.4 收益

| 操作 | 手动 | Skill |
|------|------|-------|
| 20 个接口的 JMeter 配置 | ~40 分钟 | 30 秒 |
| 接口更新后同步 | 全量重做 | 重新生成即可 |
| 一致性 | 容易配错 Method/Path | 100% 和 Swagger 一致 |

---

## 四、集成到工作流

Skills 不应该单独使用，而是嵌入到团队的**日常开发流程**：

### 流程示例：新功能开发的 Skills 流水线

```
开发者提交 PR
    │
    ▼
go-code-reviewer    ─── 自动审查代码质量
    │
    ▼
go-test-generator   ─── 生成单元测试
    │
    ▼
swagger-to-jmeter   ─── 从接口文档生成测试脚本
    │
    ▼
人工 Review         ─── 重点关注 Skill 无法判断的逻辑和架构
```

### 团队内部推广 Checklist

| 阶段 | 行动 | 预期效果 |
|------|------|----------|
| **第 1 周** | 搭建 1 个 Skill（优先级最高的问题），在小组内试用 | 看到效果，建立信心 |
| **第 2 周** | 收集反馈，迭代 Skill 规则 | 适配团队风格 |
| **第 3 周** | 整理 Best Practice，输出团队 Skill 开发规范 | 团队成员都能创建 |
| **第 4 周** | Skills 库沉淀到项目 `.claude/skills/` | 全员共享，项目级落地 |

---

## 五、效果评估

### 5.1 量化指标

| 指标 | 估算提升 | 说明 |
|------|---------|------|
| Code Review 速度 | 3~5x | AI 处理 80% 机械检查 |
| 单元测试覆盖率 | +20~30% | 消除"写测试"的心理门槛 |
| 接口压测准备时间 | 从 ~40min 到 ~30s | 自动化程度最高的场景 |
| 新手 onboarding | 从 1 周 → 2 天 | Skills 封装了团队规范和最佳实践 |

### 5.2 持续优化

```
Skill 不是"写完即弃"的：

1. 使用 → 发现问题 → 更新 SKILL.md → 团队同步
2. 每季度 Review 一次 Skill 库 → 废弃过时的、补充新的
3. Skill 代码放在 Git 仓库 → 有版本、有 Review、有 CHANGELOG
```

---

## 六、团队协作规范

### 6.1 Skill 仓库结构

```text
team-skils/
├── go/                   # Go 技术栈 Skill
│   ├── code-reviewer/
│   └── test-generator/
├── api/                   # API 相关 Skill
│   └── swager-to-jeter/
├── devops/                 # 运维/部署 Skill
│   └── jmeter-generator/
├── DOCS.md                # 团队 Skill 使用文档
└── CONTRIBUTING.md        # 如何贡献新 Skill 的指南```

### 6.2 团队规范建议

1. **SKILL.md 必须包含**：角色定义 + 工作流程 + 输出格式 + 示例
2. **版本控制**：Skill 和代码一起纳入 Git 管理
3. **Code Review for Skills**：Skill 的变化也需要 Review
4. **定期迭代**：每季度清理废弃 Skill，优化活跃 Skill

---

## 总结

| 如果你... | 从哪个 Skill 开始 |
|-----------|-----------------|
| 后端开发 | code-reviewer + test-generator |
| QA / 测试 | swagger-to-jmeter |
| 前端开发 | 创建自己的 ESLint / 组件审查 Skill |
| DevOps | 命令审计/脚本生成 Skill |
| Tech Lead | 先搭建团队 Code Review 规范 Skill |

Skills 不是一个"锦上添花"的特性 — **它是将 AI 从"一时好用"变成"持续可靠"** 的核心基础设施。1 个 Skill 可能只是省了点时间，但当团队积累了 10 个、20 个 Skill 时，你得到的是一支**自带组织经验和最佳实践的 AI 团队**。