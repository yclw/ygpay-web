# Pure-Admin 动态菜单说明

## 后端返回的数据格式

### 基本返回结构

```typescript
{
  "success": true,
  "data": [
    // 路由数组
  ]
}
```

## 完整的菜单/目录字段说明

id // 菜单id（主键id）



type // 分类（目录/菜单/外链）



共有：

path // 路径（必要，唯一）

name // 名称（必要，唯一）

title // 标题（必要）

icon // 图标（非必要）

rank // 排序（默认10）

showParent // 是否显示父级菜单（当父级菜单只有唯一子菜单时生效，默认false）

keepAlive // 是否缓存（默认false）

showLink // 是否显示该菜单（默认ture）



目录：

redirect // 重定向到其他path（非必要）

children // 子菜单（必要）



菜单：

component // 页面路径（必要）



外链：

外部链接：name为地址

内嵌：frameSrc为地址 



目录时：

path // 路径（必要）

name // 名称（必要）

title // 标题（必要）

icon // 图标（非必要）

rank // 排序（必要，默认10）

showParent // 是否显示父级菜单（必要，默认false）

keepAlive // 是否缓存（必要，默认false）

showLink // 是否显示该菜单（必要，默认ture）

redirect // 重定向到其他path（非必要）



菜单时：

path // 路径（必要）

name // 名称（必要）

title // 标题（必要）

icon // 图标（非必要）

rank // 排序（必要，默认10）

showParent // 是否显示父级菜单（必要，默认false）

keepAlive // 是否缓存（必要，默认false）

showLink // 是否显示该菜单（必要，默认ture）

component // 页面路径（必要）



外链时：

path // 路径（必要）

name // 外链地址（必要）

title // 标题（必要）

icon // 图标（非必要）

rank // 排序（必要，默认10）

showParent // 是否显示父级菜单（必要，默认false）

keepAlive // 是否缓存（必要，默认false）

showLink // 是否显示该菜单（必要，默认ture）

frameSrc // 内嵌地址 



### 1. **目录配置** (有children的父级菜单)

```typescript
{
  "path": "/permission",           // 路由路径 【必填】
  "name": "PermissionParent",      // 路由名称 【可选，框架会自动生成】
  "redirect": "/permission/page",  // 重定向路径 【可选，框架会自动设置为第一个子路由】
  "meta": {
    "title": "权限管理",          // 菜单标题 【必填】
    "icon": "ep:lollipop",        // 菜单图标 【可选】
    "rank": 10,                   // 排序权重 【可选】
    "showLink": true,             // 是否显示 【可选，默认true】
    "showParent": false,          // 是否显示父级 【可选】
    "roles": ["admin"],           // 页面权限 【可选】
    "keepAlive": false,           // 缓存设置 【可选】
    "extraIcon": "string"         // 额外图标 【可选】
  },
  "children": [...]              // 子路由数组 【目录必须有】
}
```

### 2. **菜单项配置** (具体页面)

```typescript
{
  "path": "/permission/page/index",    // 路由路径 【必填】
  "name": "PermissionPage",            // 路由名称 【必填】
  "component": "permission/page/index", // 组件路径 【菜单必填】
  "meta": {
    "title": "页面权限",              // 菜单标题 【必填】
    "icon": "ep:user",               // 菜单图标 【可选】
    "roles": ["admin", "common"],    // 页面权限 【可选】
    "auths": [                       // 按钮权限 【可选】
      "permission:btn:add",
      "permission:btn:edit"
    ],
    "keepAlive": true,               // 页面缓存 【可选】
    "showLink": true,                // 是否显示 【可选】
    "hiddenTag": false,              // 隐藏标签页 【可选】
    "fixedTag": false,               // 固定标签页 【可选】
    "activePath": "/permission/page", // 激活路径 【可选】
    "frameSrc": "https://example.com", // iframe链接 【可选】
    "frameLoading": true,            // iframe加载动画 【可选】
    "transition": {                  // 页面动画 【可选】
      "name": "fade",
      "enterTransition": "fadeInLeft",
      "leaveTransition": "fadeOutRight"
    },
    "dynamicLevel": 3,               // 动态路由层级 【可选】
    "extraIcon": "string"            // 额外图标 【可选】
  }
}
```

### 3. **iframe外链配置**

```typescript
{
  "path": "/external",
  "name": "External",
  "meta": {
    "title": "外部链接",
    "icon": "ep:link",
    "frameSrc": "https://pure-admin.cn"  // 配置了frameSrc就是iframe
  }
}
```

## 字段详细说明

### 必填字段

#### 所有类型通用必填

- **`path`**: 路由路径
- **`meta.title`**: 菜单标题

#### 目录额外要求

- **`children`**: 子路由数组（不能为空）

#### 菜单项额外要求

- **`name`**: 路由名称（组件缓存需要）
- **`component`**: 组件路径（具体页面组件）

### 可选字段说明

| 字段 | 类型 | 作用 | 目录可用 | 菜单可用 | 默认值 |
|------|------|------|----------|----------|--------|
| `name` | string | 路由名称 | ✅ | ✅ | 自动生成 |
| `redirect` | string | 重定向路径 | ✅ | ✅ | 自动设置 |
| `component` | string | 组件路径 | ❌ | ✅ | - |
| `meta.icon` | string | 菜单图标 | ✅ | ✅ | - |
| `meta.rank` | number | 排序权重 | ✅ | ✅ | 自动生成 |
| `meta.showLink` | boolean | 是否显示 | ✅ | ✅ | true |
| `meta.showParent` | boolean | 显示父级 | ✅ | ✅ | false |
| `meta.roles` | string[] | 页面权限 | ✅ | ✅ | - |
| `meta.auths` | string[] | 按钮权限 | ❌ | ✅ | - |
| `meta.keepAlive` | boolean | 页面缓存 | ❌ | ✅ | false |
| `meta.hiddenTag` | boolean | 隐藏标签页 | ❌ | ✅ | false |
| `meta.fixedTag` | boolean | 固定标签页 | ❌ | ✅ | false |
| `meta.activePath` | string | 激活路径 | ❌ | ✅ | - |
| `meta.frameSrc` | string | iframe链接 | ❌ | ✅ | - |
| `meta.frameLoading` | boolean | iframe动画 | ❌ | ✅ | true |
| `meta.transition` | object | 页面动画 | ❌ | ✅ | - |
| `meta.dynamicLevel` | number | 动态层级 | ❌ | ✅ | - |
| `meta.extraIcon` | string | 额外图标 | ✅ | ✅ | - |

## 核心区别总结

### 目录特征

1. **必须有`children`数组且不能为空**
2. **不配置`component`**（框架会自动设置为Layout）
3. **主要用于组织菜单结构**
4. **不能配置页面级别的功能**（如缓存、按钮权限等）

### 菜单项特征

1. **必须配置`component`组件路径**
2. **通常没有`children`或`children`为空**
3. **可以配置所有页面功能**
4. **直接对应具体的Vue组件**

## 框架自动处理逻辑

```typescript
// addAsyncRoutes函数会自动处理：
1. 为后端路由添加 backstage: true 标识
2. 目录的redirect自动设置为第一个子路由
3. 目录的name自动生成（子路由name + "Parent"）
4. component路径自动解析为实际组件
5. frameSrc会自动设置为IFrame组件
```

## 实际示例

```typescript
// 后端返回的完整示例
{
  "success": true,
  "data": [
    {
      "path": "/system",
      "meta": {
        "title": "系统管理",
        "icon": "ep:setting",
        "rank": 10
      },
      "children": [
        {
          "path": "/system/user",
          "name": "SystemUser",
          "component": "system/user/index",
          "meta": {
            "title": "用户管理",
            "roles": ["admin"],
            "auths": ["user:add", "user:edit", "user:delete"],
            "keepAlive": true
          }
        },
        {
          "path": "/system/role",
          "name": "SystemRole", 
          "component": "system/role/index",
          "meta": {
            "title": "角色管理",
            "roles": ["admin"]
          }
        }
      ]
    }
  ]
}
```

这个配置会生成一个"系统管理"目录，包含"用户管理"和"角色管理"两个子菜单。框架会自动处理路由注册、权限过滤、菜单渲染等逻辑。

## 注意事项

1. **组件路径规则**：
   - 如果后端传`component`，框架会根据路径查找对应组件
   - 如果不传`component`，框架会使用`path`作为组件路径
   - 组件路径需要对应`src/views/`目录下的实际文件

2. **权限控制**：
   - `roles`：页面级别权限，控制整个页面是否显示
   - `auths`：按钮级别权限，控制页面内具体功能是否可用

3. **缓存机制**：
   - `keepAlive: true`：页面会被缓存，切换时保持状态
   - 只对菜单项有效，目录不支持缓存

4. **iframe支持**：
   - 配置`frameSrc`后，页面会以iframe形式加载外部链接
   - 支持`frameLoading`控制加载动画

5. **菜单过滤**：
   - 框架会自动过滤`children`为空的目录
   - 会根据用户权限过滤无权限的菜单项
