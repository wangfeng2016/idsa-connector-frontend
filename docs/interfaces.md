# IDSA数据空间连接器 - 后端接口设计文档

## 概述

本文档详细描述了IDSA数据空间连接器前端系统所需的后端RESTful API接口设计。下面示意图展示了相关实体和全生命周期逻辑。

Data Resource → Dataset → Dataset Policy → Data Sharing
     ↑            ↑           ↑              ↑
  数据发现      数据集管理    策略配置      数据共享

## 1. 用户认证与授权模块

### 1.1 用户登录

**接口名称**: 用户登录  
**对应页面**: Login.tsx  
**接口描述**: 用户身份验证，返回访问令牌和用户信息  
**接口报文格式**: POST /api/auth/login  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "description": "用户名"
    },
    "password": {
      "type": "string",
      "description": "密码"
    }
  },
  "required": ["username", "password"]
}
```
**参数说明**

| 参数名 | 参数类型 | 参数描述 |
| --- | --- | --- |
| username | string | 用户名 |
| password | string | 密码 |

**请求体示例**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "登录是否成功"
    },
    "token": {
      "type": "string",
      "description": "访问令牌"
    },
    "user": {
      "type": "object",
      "properties": {
        "username": {"type": "string"},
        "role": {
          "type": "object",
          "properties": {
            "type": {"type": "string", "enum": ["enterprise"]},
            "name": {"type": "string"},
            "permissions": {"type": "array", "items": {"type": "string"}},
            "organizationId": {"type": "string"}
          }
        }
      }
    },
    "message": {
      "type": "string",
      "description": "响应消息"
    }
  }
}
```

**参数说明**
| 参数名 | 参数类型 | 参数说明 |
| --- | --- | --- |
| success | boolean | 登录是否成功 |
| token | string | 访问令牌 |
| user | object | 用户信息对象 |
| user.username | string | 用户名 |
| user.role | object | 用户角色信息 |
| user.role.type | string | 角色类型，如"enterprise" |
| user.role.name | string | 角色名称 |
| user.role.permissions | array | 权限列表 |
| user.role.organizationId | string | 所属组织ID |
| message | string | 响应消息 |

**响应体成功示例**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "username": "admin",
    "role": {
      "type": "enterprise",
      "name": "系统管理员",
      "permissions": [
        "read:users",
        "write:users",
        "delete:users",
        "manage:system",
        "access:dashboard"
      ],
      "organizationId": "org_12345678"
    }
  },
  "message": "登录成功"
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "token": null,
  "user": null,
  "message": "用户名或密码错误"
}
```

### 1.2 用户登出

**接口名称**: 用户登出  
**对应页面**: MainLayout.tsx (Topbar组件)  
**接口描述**: 用户登出，清除会话  
**接口报文格式**: POST /api/auth/logout  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"}
  }
}
```
**参数说明**
| 参数名 | 参数类型 | 参数说明 |
| --- | --- | --- |
| success | boolean | 操作是否成功 |
| message | string | 响应消息 |

**响应体成功示例**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "会话已过期"
}
```

## 2. 数据发现模块

### 2.1 测试数据源连接

**接口名称**: 设置数据源
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 在保存数据源配置前测试连接是否成功  
**接口报文格式**: POST /api/data-discovery/test-connection  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["database", "filesystem"],
      "description": "数据源类型"
    },
    "database": {
      "type": "object",
      "properties": {
        "host": {"type": "string", "description": "主机地址"},
        "port": {"type": "integer", "description": "端口号"},
        "database": {"type": "string", "description": "数据库名"},
        "username": {"type": "string", "description": "用户名"},
        "password": {"type": "string", "description": "密码"}
      },
      "required": ["host", "port", "database", "username", "password"]
    },
    "filesystem": {
      "type": "object",
      "properties": {
        "path": {"type": "string", "description": "文件路径"},
        "recursive": {"type": "boolean", "description": "是否递归扫描"},
        "filePattern": {"type": "string", "description": "文件过滤规则"}
      },
      "required": ["path"]
    }
  },
  "required": ["type"]
}
```
**参数说明**
| 参数名 | 参数类型 | 参数描述 |
| --- | --- | --- |
| type | string | 数据源类型 |
| database | object | 数据库配置信息 |
| database.host | string | 主机地址 |
| database.port | integer | 端口号 |
| database.database | string | 数据库名 |
| database.username | string | 用户名 |
| database.password | string | 密码 |
| filesystem | object | 文件系统配置信息 |
| filesystem.path | string | 文件路径 |
| filesystem.recursive | boolean | 是否递归扫描 |
| filesystem.filePattern | string | 文件过滤规则 |

**请求体示例（数据库类型）**:
```json
{
  "type": "database",
  "database": {
    "host": "localhost",
    "port": 3306,
    "database": "sales_db",
    "username": "db_user",
    "password": "db_password"
  }
}
```

**请求体示例（文件系统类型）**:
```json
{
  "type": "filesystem",
  "filesystem": {
    "path": "/data/csv_files",
    "recursive": true,
    "filePattern": "*.csv"
  }
}
```


**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "connected": {"type": "boolean", "description": "连接是否成功"},
    "message": {"type": "string", "description": "连接结果消息"},
    "details": {
      "type": "object",
      "properties": {
        "responseTime": {"type": "number", "description": "响应时间(ms)"},
        "version": {"type": "string", "description": "数据库版本或文件系统信息"},
        "availableSchemas": {"type": "array", "items": {"type": "string"}, "description": "可用的数据库模式(仅数据库)"},
        "fileCount": {"type": "integer", "description": "文件数量(仅文件系统)"}
      }
    }
  }
}
```
**参数说明**
| 参数名 | 参数类型 | 参数描述 |
|--------|----------|----------|
| success | boolean | 操作是否成功 |
| connected | boolean | 连接是否成功 |
| message | string | 连接结果消息 |
| details | object | 详细信息对象 |
| details.responseTime | number | 响应时间(ms) |
| details.version | string | 数据库版本或文件系统信息 |
| details.availableSchemas | array | 可用的数据库模式(仅数据库) |
| details.fileCount | integer | 文件数量(仅文件系统) |

**响应体成功示例（数据库）**:
```json
{
  "success": true,
  "connected": true,
  "message": "数据库连接成功",
  "details": {
    "responseTime": 125,
    "version": "MySQL 8.0.25",
    "availableSchemas": ["sales_db", "inventory_db", "user_db"]
  }
}
```

**响应体成功示例（文件系统）**:
```json
{
  "success": true,
  "connected": true,
  "message": "文件系统连接成功",
  "details": {
    "responseTime": 45,
    "version": "Linux ext4",
    "fileCount": 156
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "connected": false,
  "message": "连接失败：无法连接到数据库服务器",
  "details": {
    "responseTime": 5000
  }
}
```

### 2.2 保存数据源配置

**接口名称**: 保存数据源配置  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 保存数据源连接配置信息  
**接口报文格式**: POST /api/data-discovery/data-sources  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string", "description": "数据源名称"},
    "type": {
      "type": "string",
      "enum": ["database", "filesystem"],
      "description": "数据源类型"
    },
    "config": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "host": {"type": "string"},
            "port": {"type": "integer"},
            "database": {"type": "string"},
            "username": {"type": "string"},
            "password": {"type": "string"}
          },
          "required": ["host", "port", "database", "username", "password"]
        },
        {
          "properties": {
            "path": {"type": "string"},
            "recursive": {"type": "boolean"},
            "filePattern": {"type": "string"}
          },
          "required": ["path"]
        }
      ]
    }
  },
  "required": ["name", "type", "config"]
}
```

**参数说明**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| name | string | 数据源名称 |
| type | string | 数据源类型，可选值：database（数据库）、filesystem（文件系统） |
| config | object | 配置对象，根据数据源类型不同而不同 |
| config.host | string | 数据库主机地址（仅数据库类型） |
| config.port | integer | 数据库端口号（仅数据库类型） |
| config.database | string | 数据库名称（仅数据库类型） |
| config.username | string | 数据库用户名（仅数据库类型） |
| config.password | string | 数据库密码（仅数据库类型） |
| config.path | string | 文件系统路径（仅文件系统类型） |
| config.recursive | boolean | 是否递归扫描子目录（仅文件系统类型） |
| config.filePattern | string | 文件匹配模式（仅文件系统类型） |

**请求体示例（数据库类型）**:
```json
{
  "name": "销售数据库",
  "type": "database",
  "config": {
    "host": "localhost",
    "port": 3306,
    "database": "sales_db",
    "username": "db_user",
    "password": "db_password"
  }
}
```

**请求体示例（文件系统类型）**:
```json
{
  "name": "CSV文件数据源",
  "type": "filesystem",
  "config": {
    "path": "/data/csv_files",
    "recursive": true,
    "filePattern": "*.csv"
  }
}
```


**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string", "description": "数据源ID"},
        "name": {"type": "string"},
        "type": {"type": "string"},
        "createdAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | string | 数据源ID |
| data.name | string | 数据源名称 |
| data.type | string | 数据源类型 |
| data.createdAt | string | 创建时间（ISO 8601格式） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "id": "ds_001",
    "name": "销售数据库",
    "type": "database",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "数据源名称已存在"
}
```

### 2.3 获取数据源列表

**接口名称**: 获取数据源列表  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 获取已配置的数据源列表  
**接口报文格式**: GET /api/data-discovery/data-sources  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "type": {"type": "string", "enum": ["database", "filesystem"]},
          "config": {"type": "object"},
          "status": {"type": "string", "enum": ["active", "inactive", "error"]},
          "lastTested": {"type": "string", "format": "date-time"},
          "createdAt": {"type": "string", "format": "date-time"}
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | array | 数据源列表数组 |
| data[].id | string | 数据源唯一标识符 |
| data[].name | string | 数据源名称 |
| data[].type | string | 数据源类型，可选值：database（数据库）、filesystem（文件系统） |
| data[].config | object | 数据源配置信息 |
| data[].status | string | 数据源状态，可选值：active（活跃）、inactive（非活跃）、error（错误） |
| data[].lastTested | string | 最后测试时间（ISO 8601格式） |
| data[].createdAt | string | 创建时间（ISO 8601格式） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ds_001",
      "name": "销售数据库",
      "type": "database",
      "config": {
        "host": "localhost",
        "port": 3306,
        "database": "sales_db"
      },
      "status": "active",
      "lastTested": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-10T08:00:00Z"
    },
    {
      "id": "ds_002",
      "name": "CSV文件数据源",
      "type": "filesystem",
      "config": {
        "path": "/data/csv_files",
        "recursive": true
      },
      "status": "inactive",
      "lastTested": "2024-01-14T15:20:00Z",
      "createdAt": "2024-01-12T09:15:00Z"
    }
  ]
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "获取数据源列表失败"
}
```

### 2.4 启动数据发现扫描

**接口名称**: 启动数据发现扫描  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 对配置的数据源启动自动化数据发现扫描  
**接口报文格式**: POST /api/data-discovery/scan  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "dataSourceIds": {
      "type": "array",
      "items": {"type": "string"},
      "description": "要扫描的数据源ID列表"
    },
    "scanOptions": {
      "type": "object",
      "properties": {
        "includeMetadata": {"type": "boolean", "description": "是否提取元数据"},
        "detectSensitiveData": {"type": "boolean", "description": "是否识别敏感数据"},
        "analyzeDataQuality": {"type": "boolean", "description": "是否分析数据质量"},
        "maxSampleRows": {"type": "integer", "description": "最大采样行数"}
      }
    }
  },
  "required": ["dataSourceIds"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| dataSourceIds | array | 要扫描的数据源ID列表（必填） |
| scanOptions | object | 扫描选项配置（可选） |
| scanOptions.includeMetadata | boolean | 是否提取元数据 |
| scanOptions.detectSensitiveData | boolean | 是否识别敏感数据 |
| scanOptions.analyzeDataQuality | boolean | 是否分析数据质量 |
| scanOptions.maxSampleRows | integer | 最大采样行数 |

**请求体示例**:
```json
{
  "dataSourceIds": ["ds_001", "ds_002"],
  "scanOptions": {
    "includeMetadata": true,
    "detectSensitiveData": true,
    "analyzeDataQuality": false,
    "maxSampleRows": 1000
  }
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "taskId": {"type": "string", "description": "扫描任务ID"},
        "status": {"type": "string", "enum": ["started", "running"]},
        "estimatedDuration": {"type": "integer", "description": "预估完成时间(秒)"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.taskId | string | 扫描任务ID |
| data.status | string | 任务状态，可选值：started（已启动）、running（运行中） |
| data.estimatedDuration | integer | 预估完成时间（秒） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "taskId": "scan_task_001",
    "status": "started",
    "estimatedDuration": 300
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "数据源不存在或无法访问"
}
```

### 2.5 查询扫描进度

**接口名称**: 查询扫描进度  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 查询数据发现扫描任务的进度和状态  
**接口报文格式**: GET /api/data-discovery/scan/{taskId}/progress  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "taskId": {"type": "string"},
        "status": {"type": "string", "enum": ["running", "completed", "failed", "cancelled"]},
        "progress": {"type": "number", "minimum": 0, "maximum": 100, "description": "完成百分比"},
        "currentStep": {"type": "string", "description": "当前执行步骤"},
        "steps": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "status": {"type": "string", "enum": ["pending", "running", "completed", "failed"]},
              "progress": {"type": "number"}
            }
          }
        },
        "statistics": {
          "type": "object",
          "properties": {
            "dataSourcesScanned": {"type": "integer"},
            "tablesFound": {"type": "integer"},
            "filesFound": {"type": "integer"},
            "metadataExtracted": {"type": "integer"},
            "sensitiveDataDetected": {"type": "integer"}
          }
        },
        "startTime": {"type": "string", "format": "date-time"},
        "estimatedEndTime": {"type": "string", "format": "date-time"},
        "errorMessage": {"type": "string"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.taskId | string | 扫描任务ID |
| data.status | string | 任务状态，可选值：running（运行中）、completed（已完成）、failed（失败）、cancelled（已取消） |
| data.progress | number | 完成百分比（0-100） |
| data.currentStep | string | 当前执行步骤 |
| data.steps | array | 执行步骤列表 |
| data.steps[].name | string | 步骤名称 |
| data.steps[].status | string | 步骤状态，可选值：pending（待执行）、running（运行中）、completed（已完成）、failed（失败） |
| data.steps[].progress | number | 步骤进度 |
| data.statistics | object | 统计信息 |
| data.statistics.dataSourcesScanned | integer | 已扫描的数据源数量 |
| data.statistics.tablesFound | integer | 发现的表数量 |
| data.statistics.filesFound | integer | 发现的文件数量 |
| data.statistics.metadataExtracted | integer | 提取的元数据数量 |
| data.statistics.sensitiveDataDetected | integer | 检测到的敏感数据数量 |
| data.startTime | string | 开始时间（ISO 8601格式） |
| data.estimatedEndTime | string | 预计结束时间（ISO 8601格式） |
| data.errorMessage | string | 错误信息（如有） |

**响应体成功示例（运行中）**:
```json
{
  "success": true,
  "data": {
    "taskId": "scan_task_001",
    "status": "running",
    "progress": 65,
    "currentStep": "扫描数据库表结构",
    "steps": [
      {
        "name": "连接数据源",
        "status": "completed",
        "progress": 100
      },
      {
        "name": "扫描数据库表结构",
        "status": "running",
        "progress": 65
      },
      {
        "name": "提取元数据",
        "status": "pending",
        "progress": 0
      }
    ],
    "statistics": {
      "dataSourcesScanned": 1,
      "tablesFound": 15,
      "filesFound": 0,
      "metadataExtracted": 10,
      "sensitiveDataDetected": 3
    },
    "startTime": "2024-01-15T10:30:00Z",
    "estimatedEndTime": "2024-01-15T10:35:00Z"
  }
}
```

**响应体成功示例（已完成）**:
```json
{
  "success": true,
  "data": {
    "taskId": "scan_task_001",
    "status": "completed",
    "progress": 100,
    "currentStep": "扫描完成",
    "statistics": {
      "dataSourcesScanned": 2,
      "tablesFound": 25,
      "filesFound": 156,
      "metadataExtracted": 181,
      "sensitiveDataDetected": 8
    },
    "startTime": "2024-01-15T10:30:00Z",
    "estimatedEndTime": "2024-01-15T10:35:00Z"
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "扫描任务不存在或已过期"
}
```

### 2.6 获取发现结果

**接口名称**: 获取数据发现结果  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 获取扫描完成后的数据发现结果  
**接口报文格式**: GET /api/data-discovery/scan/{taskId}/results  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "taskId": {"type": "string"},
        "summary": {
          "type": "object",
          "properties": {
            "totalDatasets": {"type": "integer"},
            "totalRecords": {"type": "integer"},
            "totalFileSize": {"type": "integer", "description": "总文件大小(字节)"}
          }
        },
        "discoveredAssets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "type": {"type": "string", "enum": ["table", "view", "file", "dataset"]},
              "source": {"type": "string", "description": "来源数据源名称"},
              "schema": {"type": "string", "description": "数据库模式(仅数据库)"},
              "path": {"type": "string", "description": "文件路径(仅文件系统)"},
              "recordCount": {"type": "integer", "description": "记录数量"},
              "columnCount": {"type": "integer", "description": "字段数量"},
              "dataVolume": {
                "type": "object",
                "properties": {
                  "recordCount": {"type": "integer", "description": "记录数"},
                  "fileSize": {"type": "integer", "description": "文件大小(字节)"},
                  "estimatedSize": {"type": "string", "description": "预估大小(如1.2MB, 500KB)"}
                }
              },
              "metadata": {
                "type": "object",
                "properties": {
                  "columns": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": {"type": "string"},
                        "type": {"type": "string"},
                        "nullable": {"type": "boolean"},
                        "primaryKey": {"type": "boolean"}
                      }
                    }
                  },
                  "lastModified": {"type": "string", "format": "date-time"},
                  "encoding": {"type": "string", "description": "文件编码"}
                }
              },
              "sampleData": {
                "type": "array",
                "description": "样本数据(前几行)",
                "items": {"type": "object"}
              }
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.taskId | string | 扫描任务ID |
| data.summary | object | 发现结果汇总信息 |
| data.summary.totalDatasets | integer | 发现的数据集总数 |
| data.summary.totalRecords | integer | 发现的记录总数 |
| data.summary.totalFileSize | integer | 总文件大小（字节） |
| data.discoveredAssets | array | 发现的资产列表 |
| data.discoveredAssets[].id | string | 资产唯一标识 |
| data.discoveredAssets[].name | string | 资产名称 |
| data.discoveredAssets[].type | string | 资产类型，可选值：table（表）、view（视图）、file（文件）、dataset（数据集） |
| data.discoveredAssets[].source | string | 来源数据源名称 |
| data.discoveredAssets[].schema | string | 数据库模式（仅数据库） |
| data.discoveredAssets[].path | string | 文件路径（仅文件系统） |
| data.discoveredAssets[].recordCount | integer | 记录数量 |
| data.discoveredAssets[].columnCount | integer | 字段数量 |
| data.discoveredAssets[].dataVolume | object | 数据量信息 |
| data.discoveredAssets[].dataVolume.recordCount | integer | 记录数 |
| data.discoveredAssets[].dataVolume.fileSize | integer | 文件大小（字节） |
| data.discoveredAssets[].dataVolume.estimatedSize | string | 预估大小（如1.2MB, 500KB） |
| data.discoveredAssets[].metadata | object | 元数据信息 |
| data.discoveredAssets[].metadata.columns | array | 字段列表 |
| data.discoveredAssets[].metadata.columns[].name | string | 字段名称 |
| data.discoveredAssets[].metadata.columns[].type | string | 字段类型 |
| data.discoveredAssets[].metadata.columns[].nullable | boolean | 是否可为空 |
| data.discoveredAssets[].metadata.columns[].primaryKey | boolean | 是否为主键 |
| data.discoveredAssets[].metadata.lastModified | string | 最后修改时间（ISO 8601格式） |
| data.discoveredAssets[].metadata.encoding | string | 文件编码 |
| data.discoveredAssets[].sampleData | array | 样本数据（前几行） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "taskId": "scan_task_001",
    "summary": {
      "totalDatasets": 25,
      "totalRecords": 1250000,
      "totalFileSize": 524288000
    },
    "discoveredAssets": [
      {
        "id": "asset_001",
        "name": "customers",
        "type": "table",
        "source": "销售数据库",
        "schema": "sales_db",
        "recordCount": 50000,
        "columnCount": 8,
        "dataVolume": {
          "recordCount": 50000,
          "fileSize": 10485760,
          "estimatedSize": "10MB"
        },
        "metadata": {
          "columns": [
            {
              "name": "customer_id",
              "type": "int",
              "nullable": false,
              "primaryKey": true
            },
            {
              "name": "customer_name",
              "type": "varchar(100)",
              "nullable": false,
              "primaryKey": false
            }
          ],
          "lastModified": "2024-01-15T09:30:00Z"
        },
        "sampleData": [
          {"customer_id": 1, "customer_name": "张三"},
          {"customer_id": 2, "customer_name": "李四"}
        ]
      }
    ]
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "扫描任务未完成或结果已过期"
}
```

### 2.7 确认发现结果

**接口名称**: 确认数据发现结果  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 确认发现的数据资产，进入资源信息完善步骤  
**接口报文格式**: POST /api/data-discovery/confirm-results  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "taskId": {"type": "string"},
    "confirmedAssets": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "assetId": {"type": "string"},
          "confirmed": {"type": "boolean"},
          "customName": {"type": "string", "description": "自定义名称"}
        },
        "required": ["assetId", "confirmed"]
      }
    }
  },
  "required": ["taskId", "confirmedAssets"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| taskId | string | 扫描任务ID |
| confirmedAssets | array | 确认的资产列表 |
| confirmedAssets[].assetId | string | 资产ID |
| confirmedAssets[].confirmed | boolean | 是否确认该资产 |
| confirmedAssets[].customName | string | 自定义名称（可选） |

**请求体示例**:
```json
{
  "taskId": "scan_task_001",
  "confirmedAssets": [
    {
      "assetId": "asset_001",
      "confirmed": true,
      "customName": "客户信息表"
    },
    {
      "assetId": "asset_002",
      "confirmed": true
    },
    {
      "assetId": "asset_003",
      "confirmed": false
    }
  ]
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "confirmedCount": {"type": "integer"},
        "sessionId": {"type": "string", "description": "资源完善会话ID"},
        "confirmedAssets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "assetId": {"type": "string"},
              "name": {"type": "string"},
              "type": {"type": "string"},
              "dataVolume": {
                "type": "object",
                "properties": {
                  "recordCount": {"type": "integer"},
                  "fileSize": {"type": "integer"},
                  "estimatedSize": {"type": "string"}
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.confirmedCount | integer | 确认的资产数量 |
| data.sessionId | string | 资源完善会话ID |
| data.confirmedAssets | array | 确认的资产列表 |
| data.confirmedAssets[].assetId | string | 资产ID |
| data.confirmedAssets[].name | string | 资产名称 |
| data.confirmedAssets[].type | string | 资产类型 |
| data.confirmedAssets[].dataVolume | object | 数据量信息 |
| data.confirmedAssets[].dataVolume.recordCount | integer | 记录数量 |
| data.confirmedAssets[].dataVolume.fileSize | integer | 文件大小（字节） |
| data.confirmedAssets[].dataVolume.estimatedSize | string | 预估大小 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "confirmedCount": 2,
    "sessionId": "session_001",
    "confirmedAssets": [
      {
        "assetId": "asset_001",
        "name": "客户信息表",
        "type": "table",
        "dataVolume": {
          "recordCount": 50000,
          "fileSize": 10485760,
          "estimatedSize": "10MB"
        }
      },
      {
        "assetId": "asset_002",
        "name": "orders",
        "type": "table",
        "dataVolume": {
          "recordCount": 120000,
          "fileSize": 25165824,
          "estimatedSize": "24MB"
        }
      }
    ]
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "扫描任务不存在或已过期"
}
```

### 2.8 资源信息完善

**接口名称**: 完善资源信息  
**对应页面**: provider/resources/DataDiscovery.tsx  
**接口描述**: 为确认的数据资产补充业务信息，然后添加到数据资源列表  
**接口报文格式**: POST /api/data-discovery/complete-resource-info  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "sessionId": {"type": "string", "description": "资源完善会话ID"},
    "resourcesInfo": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "assetId": {"type": "string"},
          "businessDomain": {"type": "string", "description": "业务域"},
          "owner": {"type": "string", "description": "数据所有者"},
          "accessLevel": {
            "type": "string",
            "enum": ["public", "internal", "confidential"],
            "description": "访问级别"
          },
          "tags": {
            "type": "array",
            "items": {"type": "string"},
            "description": "标签列表"
          },
          "description": {"type": "string", "description": "资源描述"},
          "category": {"type": "string", "description": "资源分类"}
        },
        "required": ["assetId", "businessDomain", "owner", "accessLevel"]
      }
    }
  },
  "required": ["sessionId", "resourcesInfo"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| sessionId | string | 资源完善会话ID |
| resourcesInfo | array | 资源信息列表 |
| resourcesInfo[].assetId | string | 资产ID |
| resourcesInfo[].businessDomain | string | 业务域 |
| resourcesInfo[].owner | string | 数据所有者 |
| resourcesInfo[].accessLevel | string | 访问级别，可选值：public（公开）、internal（内部）、confidential（机密） |
| resourcesInfo[].tags | array | 标签列表 |
| resourcesInfo[].description | string | 资源描述 |
| resourcesInfo[].category | string | 资源分类 |

**请求体示例**:
```json
{
  "sessionId": "session_001",
  "resourcesInfo": [
    {
      "assetId": "asset_001",
      "businessDomain": "销售管理",
      "owner": "张三",
      "accessLevel": "internal",
      "tags": ["客户数据", "CRM", "销售"],
      "description": "客户基本信息表，包含客户姓名、联系方式等",
      "category": "业务数据"
    },
    {
      "assetId": "asset_002",
      "businessDomain": "订单管理",
      "owner": "李四",
      "accessLevel": "confidential",
      "tags": ["订单数据", "交易记录"],
      "description": "订单详细信息表",
      "category": "交易数据"
    }
  ]
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "addedCount": {"type": "integer", "description": "成功添加的资源数量"},
        "resourceIds": {
          "type": "array",
          "items": {"type": "string"},
          "description": "新创建的资源ID列表"
        },
        "failedAssets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "assetId": {"type": "string"},
              "error": {"type": "string", "description": "失败原因"}
            }
          },
          "description": "添加失败的资产列表"
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.addedCount | integer | 成功添加的资源数量 |
| data.resourceIds | array | 新创建的资源ID列表 |
| data.failedAssets | array | 添加失败的资产列表 |
| data.failedAssets[].assetId | string | 失败的资产ID |
| data.failedAssets[].error | string | 失败原因 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "addedCount": 2,
    "resourceIds": ["res_001", "res_002"],
    "failedAssets": []
  }
}
```

**响应体部分失败示例**:
```json
{
  "success": true,
  "data": {
    "addedCount": 1,
    "resourceIds": ["res_001"],
    "failedAssets": [
      {
        "assetId": "asset_002",
        "error": "资源名称已存在"
      }
    ]
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "会话已过期，请重新确认发现结果"
}
```

## 3 资源列表模块
### 3.1 获取资源列表

**接口名称**: 获取数据资源列表  
**对应页面**: provider/resources/ResourceList.tsx  
**接口描述**: 分页获取数据资源列表，支持过滤和排序  
**接口报文格式**: GET /api/resources  

**查询参数**:
- page: 页码
- pageSize: 每页数量
- searchTerm: 搜索关键词
- status: 状态过滤
- domain: 领域过滤
- dataType: 数据类型过滤
- accessLevel: 访问级别过滤
- owner: 所有者过滤
- onlyFavorites: 仅收藏
- sortBy: 排序字段
- sortOrder: 排序方向

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "resources": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "name": {"type": "string"},
              "description": {"type": "string"},
              "type": {"type": "string"},
              "domain": {"type": "string"},
              "owner": {"type": "string"},
              "accessLevel": {"type": "string"},
              "status": {"type": "string"},
              "tags": {"type": "array", "items": {"type": "string"}},
              "qualityScore": {"type": "number"},
              "usageFrequency": {"type": "integer"},
              "dataVolume": {"type": "string"},
              "lastAccessed": {"type": "string", "format": "date-time"},
              "isFavorite": {"type": "boolean"}
            }
          }
        },
        "total": {"type": "integer"},
        "page": {"type": "integer"},
        "pageSize": {"type": "integer"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.resources | array | 资源列表 |
| data.resources[].id | integer | 资源ID |
| data.resources[].name | string | 资源名称 |
| data.resources[].description | string | 资源描述 |
| data.resources[].type | string | 资源类型 |
| data.resources[].domain | string | 业务域 |
| data.resources[].owner | string | 资源所有者 |
| data.resources[].accessLevel | string | 访问级别 |
| data.resources[].status | string | 资源状态 |
| data.resources[].tags | array | 标签列表 |
| data.resources[].qualityScore | number | 质量评分 |
| data.resources[].usageFrequency | integer | 使用频次 |
| data.resources[].dataVolume | string | 数据量 |
| data.resources[].lastAccessed | string | 最后访问时间（ISO 8601格式） |
| data.resources[].isFavorite | boolean | 是否收藏 |
| data.total | integer | 总记录数 |
| data.page | integer | 当前页码 |
| data.pageSize | integer | 每页数量 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": 1,
        "name": "客户信息表",
        "description": "包含客户基本信息的数据表",
        "type": "数据库表",
        "domain": "销售管理",
        "owner": "张三",
        "accessLevel": "internal",
        "status": "active",
        "tags": ["客户数据", "CRM"],
        "qualityScore": 85.5,
        "usageFrequency": 120,
        "dataVolume": "10MB",
        "lastAccessed": "2024-01-15T14:30:00Z",
        "isFavorite": true
      },
      {
        "id": 2,
        "name": "订单数据",
        "description": "订单交易记录",
        "type": "数据库表",
        "domain": "订单管理",
        "owner": "李四",
        "accessLevel": "confidential",
        "status": "active",
        "tags": ["订单", "交易"],
        "qualityScore": 92.0,
        "usageFrequency": 85,
        "dataVolume": "24MB",
        "lastAccessed": "2024-01-15T16:20:00Z",
        "isFavorite": false
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "获取资源列表失败"
}
```

### 3.2 获取单个资源详情

**接口名称**: 获取数据资源详情  
**对应页面**: provider/resources/ResourceEdit.tsx  
**接口描述**: 根据ID获取单个数据资源的详细信息  
**接口报文格式**: GET /api/resources/{id}  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "integer"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string"},
        "domain": {"type": "string"},
        "owner": {"type": "string"},
        "accessLevel": {"type": "string"},
        "status": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "qualityScore": {"type": "number"},
        "usageFrequency": {"type": "integer"},
        "dataVolume": {"type": "string"},
        "lastAccessed": {"type": "string", "format": "date-time"},
        "isFavorite": {"type": "boolean"},
        "createdAt": {"type": "string", "format": "date-time"},
        "updatedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | integer | 资源ID |
| data.name | string | 资源名称 |
| data.description | string | 资源描述 |
| data.type | string | 资源类型 |
| data.domain | string | 业务域 |
| data.owner | string | 资源所有者 |
| data.accessLevel | string | 访问级别 |
| data.status | string | 资源状态 |
| data.tags | array | 标签列表 |
| data.qualityScore | number | 质量评分 |
| data.usageFrequency | integer | 使用频次 |
| data.dataVolume | string | 数据量 |
| data.lastAccessed | string | 最后访问时间（ISO 8601格式） |
| data.isFavorite | boolean | 是否收藏 |
| data.createdAt | string | 创建时间（ISO 8601格式） |
| data.updatedAt | string | 更新时间（ISO 8601格式） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "客户信息表",
    "description": "包含客户基本信息的数据表，包括姓名、联系方式、地址等",
    "type": "数据库表",
    "domain": "销售管理",
    "owner": "张三",
    "accessLevel": "internal",
    "status": "active",
    "tags": ["客户数据", "CRM", "销售"],
    "qualityScore": 85.5,
    "usageFrequency": 120,
    "dataVolume": "10MB",
    "lastAccessed": "2024-01-15T14:30:00Z",
    "isFavorite": true,
    "createdAt": "2024-01-10T08:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "资源不存在或已被删除"
}
```

### 3.3 创建数据资源

**接口名称**: 创建数据资源  
**对应页面**: provider/resources/ResourceEdit.tsx  
**接口描述**: 创建新的数据资源  
**接口报文格式**: POST /api/resources  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "description": {"type": "string"},
    "type": {"type": "string"},
    "domain": {"type": "string"},
    "owner": {"type": "string"},
    "accessLevel": {"type": "string"},
    "status": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "dataVolume": {"type": "string"}
  },
  "required": ["name", "description", "type", "domain", "owner", "accessLevel", "status"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| name | string | 资源名称（必填） |
| description | string | 资源描述（必填） |
| type | string | 资源类型（必填） |
| domain | string | 业务域（必填） |
| owner | string | 资源所有者（必填） |
| accessLevel | string | 访问级别（必填） |
| status | string | 资源状态（必填） |
| tags | array | 标签列表 |
| dataVolume | string | 数据量 |

**请求体示例**:
```json
{
  "name": "产品库存表",
  "description": "产品库存信息，包含产品编号、库存数量、仓库位置等",
  "type": "结构化数据",
  "domain": "供应链",
  "owner": "张三",
  "accessLevel": "内部",
  "status": "草稿",
  "tags": ["库存", "产品", "仓储"],
  "dataVolume": "2.3 GB"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "操作是否成功"
    },
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "integer", "description": "资源ID"},
        "name": {"type": "string", "description": "资源名称"},
        "description": {"type": "string", "description": "资源描述"},
        "type": {"type": "string", "description": "资源类型"},
        "domain": {"type": "string", "description": "业务域"},
        "owner": {"type": "string", "description": "资源所有者"},
        "accessLevel": {"type": "string", "description": "访问级别"},
        "status": {"type": "string", "description": "资源状态"},
        "tags": {"type": "array", "items": {"type": "string"}, "description": "标签列表"},
        "qualityScore": {"type": "integer", "description": "质量评分"},
        "usageFrequency": {"type": "integer", "description": "使用频率"},
        "dataVolume": {"type": "string", "description": "数据量"},
        "lastAccessed": {"type": "string", "description": "最后访问时间"},
        "isFavorite": {"type": "boolean", "description": "是否收藏"}
      }
    },
    "message": {
      "type": "string",
      "description": "响应消息"
    }
  }
}
```

**参数说明表格**

|参数名称 |参数类型 |参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | integer | 资源ID |
| data.name | string | 资源名称 |
| data.description | string | 资源描述 |
| data.type | string | 资源类型 |
| data.domain | string | 业务域 |
| data.owner | string | 资源所有者 |
| data.accessLevel | string | 访问级别 |
| data.status | string | 资源状态 |
| data.tags | array | 标签列表 |
| data.qualityScore | integer | 质量评分 |
| data.usageFrequency | integer | 使用频率 |
| data.dataVolume | string | 数据量 |
| data.lastAccessed | string | 最后访问时间 |
| data.isFavorite | boolean | 是否收藏 |
| message | string | 响应消息 |


**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "产品库存表",
    "description": "产品库存信息，包含产品编号、库存数量、仓库位置等",
    "type": "结构化数据",
    "domain": "供应链",
    "owner": "张三",
    "accessLevel": "内部",
    "status": "草稿",
    "tags": ["库存", "产品", "仓储"],
    "qualityScore": 0,
    "usageFrequency": 0,
    "dataVolume": "2.3 GB",
    "lastAccessed": "2024-01-15",
    "isFavorite": false
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "资源名称已存在"
}
```

### 3.4 更新数据资源

**接口名称**: 更新数据资源  
**对应页面**: provider/resources/ResourceEdit.tsx  
**接口描述**: 更新现有数据资源信息  
**接口报文格式**: PUT /api/resources/{id}  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "description": {"type": "string"},
    "type": {"type": "string"},
    "domain": {"type": "string"},
    "owner": {"type": "string"},
    "accessLevel": {"type": "string"},
    "status": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "dataVolume": {"type": "string"}
  },
  "required": ["name", "description", "type", "domain", "owner", "accessLevel", "status"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| name | string | 资源名称（必填） |
| description | string | 资源描述（必填） |
| type | string | 资源类型（必填） |
| domain | string | 业务域（必填） |
| owner | string | 资源所有者（必填） |
| accessLevel | string | 访问级别（必填） |
| status | string | 资源状态（必填） |
| tags | array | 标签列表 |
| dataVolume | string | 数据量 |

**请求体示例**:
```json
{
  "name": "产品库存表",
  "description": "产品库存信息，包含产品编号、库存数量、仓库位置等",
  "type": "结构化数据",
  "domain": "供应链",
  "owner": "张三",
  "accessLevel": "内部",
  "status": "已发布",
  "tags": ["库存", "产品", "仓储"],
  "dataVolume": "2.3 GB"
}
```
**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "操作是否成功"
    },
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "integer", "description": "资源ID"},
        "name": {"type": "string", "description": "资源名称"},
        "description": {"type": "string", "description": "资源描述"},
        "type": {"type": "string", "description": "资源类型"},
        "domain": {"type": "string", "description": "业务域"},
        "owner": {"type": "string", "description": "资源所有者"},
        "accessLevel": {"type": "string", "description": "访问级别"},
        "status": {"type": "string", "description": "资源状态"},
        "tags": {"type": "array", "items": {"type": "string"}, "description": "标签列表"},
        "qualityScore": {"type": "integer", "description": "质量评分"},
        "usageFrequency": {"type": "integer", "description": "使用频率"},
        "dataVolume": {"type": "string", "description": "数据量"},
        "lastAccessed": {"type": "string", "description": "最后访问时间"},
        "isFavorite": {"type": "boolean", "description": "是否收藏"}
      }
    },
    "message": {
      "type": "string",
      "description": "响应消息"
    }
  }
}
```

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "产品库存表",
    "description": "产品库存信息，包含产品编号、库存数量、仓库位置等",
    "type": "结构化数据",
    "domain": "供应链",
    "owner": "张三",
    "accessLevel": "内部",
    "status": "已发布",
    "tags": ["库存", "产品", "仓储"],
    "qualityScore": 85,
    "usageFrequency": 12,
    "dataVolume": "2.3 GB",
    "lastAccessed": "2024-01-15",
    "isFavorite": false
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "资源不存在或无权限修改"
}
```


### 3.5 删除数据资源

**接口名称**: 删除数据资源  
**对应页面**: provider/resources/ResourceList.tsx  
**接口描述**: 删除一个或多个数据资源  
**接口报文格式**: DELETE /api/resources  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "items": {"type": "integer"}
    }
  },
  "required": ["ids"]
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| ids | array | 要删除的资源ID列表（必填） |

### 3.6 切换资源收藏状态

**接口名称**: 切换资源收藏状态  
**对应页面**: provider/resources/ResourceList.tsx  
**接口描述**: 添加或移除资源收藏  
**接口报文格式**: POST /api/resources/{id}/favorite  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "isFavorite": {
      "type": "boolean",
      "description": "收藏状态，true表示收藏，false表示取消收藏"
    }
  },
  "required": ["isFavorite"]
}
```

**参数说明表格**

|参数名称 |参数类型 |参数描述 |
|----------|----------|----------|
| isFavorite | boolean | 收藏状态，true表示收藏，false表示取消收藏（必填） |

**请求体示例**
```json
{
  "isFavorite": true
}
```

**响应体json schema**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "操作是否成功"
    },
    "data": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "description": "资源ID"
        },
        "isFavorite": {
          "type": "boolean",
          "description": "更新后的收藏状态"
        }
      },
      "required": ["id", "isFavorite"]
    },
    "message": {
      "type": "string",
      "description": "操作结果消息"
    }
  },
  "required": ["success"]
}
```

**参数说明表格**

|参数名称 |参数类型 |参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功（必填） |
| data | object | 响应数据对象（必填） |
| data.id | integer | 资源ID（必填） |
| data.isFavorite | boolean | 更新后的收藏状态（必填） |
| message | string | 操作结果消息（必填） |

**响应体成功示例**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isFavorite": true
  },
  "message": "收藏状态更新成功"
}
```

## 4. 数据集管理模块

### 4.1 获取数据集列表
todo 目前接口是不准确的，该页面没有实现分页功能

**接口名称**: 获取数据集列表  
**对应页面**: provider/datasets/DatasetList.tsx  
**接口描述**: 分页获取数据集列表，支持过滤和排序  
**接口报文格式**: GET /api/datasets  

**查询参数**:
- page: 页码，默认为1
- pageSize: 每页数量，默认为10
- searchTerm: 搜索关键词
- type: 数据集类型过滤 (uploaded/transformed)
- sourceType: 来源类型过滤 (file/database/api)
- status: 状态过滤 (active/processing/error/archived)
- sortBy: 排序字段 (name/size/recordCount/createdAt/updatedAt)
- sortOrder: 排序方向 (asc/desc)

**参数说明表格**

|参数名 |类型 |说明 |
|----------|----------|----------|
|page |integer |页码，默认为1 |
|pageSize |integer |每页数量，默认为10，最大100 |
|searchTerm |string |搜索关键词，匹配名称和描述 |
|type |string |数据集类型：uploaded（上传）、transformed（转换） |
|sourceType |string |来源类型：file（文件）、database（数据库）、api（API） |
|status |string |状态：active（活跃）、processing（处理中）、error（错误）、archived（已归档） |
|sortBy |string |排序字段 |
|sortOrder |string |排序方向，默认为desc |

**请求示例**

GET /api/datasets?page=1&pageSize=10&searchTerm=客户&type=transformed&status=active&sortBy=updatedAt&sortOrder=desc

**响应体 JSON Schema**:

```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "datasets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "description": {"type": "string"},
              "type": {"type": "string", "enum": ["uploaded", "transformed"]},
              "sourceType": {"type": "string", "enum": ["file", "database", "api"]},
              "sourceResourceId": {"type": "string"},
              "sourceResourceName": {"type": "string"},
              "format": {"type": "string"},
              "size": {"type": "string"},
              "recordCount": {"type": "integer"},
              "status": {"type": "string", "enum": ["active", "processing", "error", "archived"]},
              "tags": {"type": "array", "items": {"type": "string"}},
              "createdAt": {"type": "string", "format": "date"},
              "updatedAt": {"type": "string", "format": "date"}
            }
          }
        },
        "total": {"type": "integer"},
        "page": {"type": "integer"},
        "pageSize": {"type": "integer"},
        "totalPages": {"type": "integer"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | array | 数据资源数组 |
| data[].id | string | 资源ID |
| data[].name | string | 资源名称 |
| data[].description | string | 资源描述 |
| data[].type | string | 资源类型 |
| data[].size | string | 资源大小 |
| data[].format | string | 资源格式 |
| data[].lastUpdated | string | 最后更新时间（ISO 8601格式） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "datasets": [
      {
        "id": "ds_001",
        "name": "客户数据集",
        "description": "包含客户基本信息的数据集",
        "type": "transformed",
        "sourceType": "database",
        "sourceResourceId": "res_001",
        "sourceResourceName": "客户信息表",
        "format": "CSV",
        "size": "2.5MB",
        "recordCount": 10000,
        "status": "active",
        "category": "客户管理",
        "accessLevel": "private",
        "tags": ["客户", "CRM"],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10
  }
}
```

### 4.2 获取单个数据集详情
todo 这个接口有问题，现在页面上根本没有实现view 数据集的功能，怎么可能有这个接口结构？可能是从mockdata分析得来的。

**接口名称**: 获取数据集详情  
**对应页面**: provider/datasets/DatasetList.tsx (查看详情)  
**接口描述**: 根据ID获取单个数据集的详细信息  
**接口报文格式**: GET /api/datasets/{id}  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string", "enum": ["uploaded", "transformed"]},
        "sourceType": {"type": "string", "enum": ["file", "database", "api"]},
        "sourceResourceId": {"type": "string"},
        "sourceResourceName": {"type": "string"},
        "format": {"type": "string"},
        "size": {"type": "string"},
        "recordCount": {"type": "number"},
        "status": {"type": "string", "enum": ["active", "processing", "error", "archived"]},
        "category": {"type": "string"},
        "accessLevel": {"type": "string", "enum": ["public", "private", "restricted"]},
        "tags": {"type": "array", "items": {"type": "string"}},
        "createdAt": {"type": "string", "format": "date-time"},
        "updatedAt": {"type": "string", "format": "date-time"},
        "metadata": {
          "type": "object",
          "properties": {
            "schema": {
              "type": "object",
              "properties": {
                "fields": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {"type": "string"},
                      "type": {"type": "string"},
                      "nullable": {"type": "boolean"},
                      "description": {"type": "string"}
                    }
                  }
                }
              }
            },
            "transformConfig": {
              "type": "object",
              "properties": {
                "selectedFields": {"type": "array", "items": {"type": "string"}},
                "filters": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "field": {"type": "string"},
                      "operator": {"type": "string"},
                      "value": {"type": "string"}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | string | 数据集ID |
| data.name | string | 数据集名称 |
| data.description | string | 数据集描述 |
| data.type | string | 数据集类型，可选值：uploaded（上传）、transformed（转换） |
| data.sourceType | string | 源类型，可选值：file（文件）、database（数据库）、api（API） |
| data.sourceResourceId | string | 源资源ID |
| data.sourceResourceName | string | 源资源名称 |
| data.format | string | 数据格式 |
| data.size | string | 数据大小 |
| data.recordCount | number | 记录数量 |
| data.status | string | 状态，可选值：active（活跃）、processing（处理中）、error（错误）、archived（已归档） |
| data.category | string | 分类 |
| data.accessLevel | string | 访问级别，可选值：public（公开）、private（私有）、restricted（受限） |
| data.tags | array | 标签列表 |
| data.createdAt | string | 创建时间（ISO 8601格式） |
| data.updatedAt | string | 更新时间（ISO 8601格式） |
| data.metadata | object | 元数据信息 |
| data.metadata.schema | object | 数据模式 |
| data.metadata.schema.fields | array | 字段列表 |
| data.metadata.schema.fields[].name | string | 字段名称 |
| data.metadata.schema.fields[].type | string | 字段类型 |
| data.metadata.schema.fields[].nullable | boolean | 是否可为空 |
| data.metadata.schema.fields[].description | string | 字段描述 |
| data.metadata.transformConfig | object | 转换配置 |
| data.metadata.transformConfig.selectedFields | array | 选中的字段列表 |
| data.metadata.transformConfig.filters | array | 过滤条件列表 |
| data.metadata.transformConfig.filters[].field | string | 过滤字段 |
| data.metadata.transformConfig.filters[].operator | string | 操作符 |
| data.metadata.transformConfig.filters[].value | string | 过滤值 |

### 4.3 创建数据集（文件上传）

**接口名称**: 创建数据集（文件上传）  
**对应页面**: provider/datasets/DatasetUpload.tsx  
**接口描述**: 通过文件上传创建新的数据集  
**接口报文格式**: POST /api/datasets/upload  

**请求体**: multipart/form-data
- file: 上传的文件
- metadata: JSON字符串，包含数据集元数据

**metadata JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "description": {"type": "string"},
    "category": {"type": "string"},
    "accessLevel": {"type": "string", "enum": ["public", "private", "restricted"]},
    "tags": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["name"]
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "status": {"type": "string"},
        "uploadProgress": {"type": "number"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | string | 数据集ID |
| data.name | string | 数据集名称 |
| data.status | string | 数据集状态 |
| data.uploadProgress | number | 上传进度 |

### 4.4 创建数据集（资源转换）

**接口名称**: 创建数据集（资源转换）  
**对应页面**: provider/datasets/DatasetTransform.tsx  
**接口描述**: 从现有数据资源转换生成新的数据集  
**接口报文格式**: POST /api/datasets/transform  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "sourceResourceId": {"type": "string"},
    "transformConfig": {
      "type": "object",
      "properties": {
        "selectedFields": {"type": "array", "items": {"type": "string"}},
        "filters": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "field": {"type": "string"},
              "operator": {"type": "string", "enum": ["equals", "not_equals", "greater_than", "less_than", "contains", "not_contains"]},
              "value": {"type": "string"}
            },
            "required": ["field", "operator", "value"]
          }
        },
        "limit": {"type": "number"}
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
        "category": {"type": "string"},
        "accessLevel": {"type": "string", "enum": ["public", "private", "restricted"]},
        "tags": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["name"]
    }
  },
  "required": ["sourceResourceId", "metadata"]
}
```

**请求体参数说明表格 :**

|参数名称 |参数类型 |是否必填 |参数描述 |
|----------|----------|----------|----------|
|sourceResourceId |string |是 |源数据资源ID |
|transformConfig |object |否 |转换配置对象 |
|transformConfig.selectedFields |array |否 |选择的字段列表 |
|transformConfig.filters |array |否 |过滤条件数组 |
|transformConfig.filters[].field |string |是 |过滤字段名 |
|transformConfig.filters[].operator |string |是 |过滤操作符（equals/not_equals/greater_than/less_than/contains/not_contains） |
|transformConfig.filters[].value |string |是 |过滤值 |
|transformConfig.limit |number |否 |限制记录数 |
|metadata |object |是 |数据集元数据 |
|metadata.name |string |是 |数据集名称 |
|metadata.description |string |否 |数据集描述 |
|metadata.category |string |否 |数据集分类 |

**请求体示例**
```json
{
  "sourceResourceId": "res-001",
  "transformConfig": {
    "selectedFields": ["customer_id", "customer_name", "email", "city", "total_orders"],
    "filters": [
      {
        "field": "city",
        "operator": "equals",
        "value": "北京"
      },
      {
        "field": "total_orders",
        "operator": "greater_than",
        "value": "10"
      }
    ],
    "limit": 1000
  },
  "metadata": {
    "name": "北京高价值客户数据集",
    "description": "筛选出北京地区订单数超过10的高价值客户数据",
    "category": "客户分析",
    "accessLevel": "private",
    "tags": ["客户分析", "北京", "高价值"]
  }
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "status": {"type": "string"},
        "estimatedRecords": {"type": "number"},
        "estimatedSize": {"type": "string"}
      }
    }
  }
}
```

**响应体示例**

成功响应
```json
{
  "success": true,
  "data": {
    "id": "ds-004",
    "name": "北京高价值客户数据集",
    "status": "processing",
    "estimatedRecords": 156,
    "estimatedSize": "45.2 KB"
  }
}
```

**失败响应**
```json
{
  "success": false,
  "error": {
    "code": "TRANSFORM_ERROR",
    "message": "数据转换失败：源资源不存在或无法访问"
  }
}
```

### 4.5 更新数据集

**接口名称**: 更新数据集  
**对应页面**: provider/datasets/DatasetList.tsx (编辑功能)  
**接口描述**: 更新数据集的元数据信息  
**接口报文格式**: PUT /api/datasets/{id}  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "description": {"type": "string"},
    "category": {"type": "string"},
    "accessLevel": {"type": "string", "enum": ["public", "private", "restricted"]},
    "tags": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["name", "description", "category"]
}
```

**参数说明表格**:

|参数名称 |参数类型 |是否必填 |参数描述 |
|----------|----------|----------|----------|
|name |string |是 数据集名称，为数据集指定一个有意义的名称 |
|description |string |是 数据集描述，详细描述数据集的内容和用途 |
|category |string |是 分类，可选值：customer（客户数据）、sales（销售数据）、product（产品数据）、financial（财务数据）、operational（运营数据）、other（其他） |
|accessLevel |string |否 访问级别，可选值：public（公开）、private（私有）、restricted（受限） |
|tags |array |否 标签列表，用于数据集的分类和检索 |

**请求体示例**
```json
{
  "name": "客户交易数据集",
  "description": "包含客户基本信息和历史交易记录的综合数据集，用于客户行为分析和营销决策支持",
  "category": "customer",
  "accessLevel": "private",
  "tags": ["客户分析", "交易记录", "营销"]
}
```

**响应体schema**
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "category": {"type": "string"},
        "accessLevel": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "updatedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**响应体参数说明表格 :**

|参数名称 |参数类型 |参数描述 |
|----------|----------|----------|
|success |boolean |操作是否成功 |
|message |string |响应消息 |
|data |object |更新后的数据集信息 |
|data.id |string |数据集唯一标识符 |
|data.name |string |更新后的数据集名称 |
|data.description |string |更新后的数据集描述 |
|data.category |string |更新后的数据集分类 |
|data.accessLevel |string |更新后的访问级别 |
|data.tags |array |更新后的标签列表 |
|data.updatedAt |string |更新时间（ISO 8601格式） |

**响应体示例**
```json
{
  "success": true,
  "message": "数据集更新成功",
  "data": {
    "id": "dataset-001",
    "name": "客户交易数据集",
    "description": "包含客户基本信息和历史交易记录的综合数据集，用于客户行为分析和营销决策支持",
    "category": "customer",
    "accessLevel": "private",
    "tags": ["客户分析", "交易记录", "营销"],
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```


### 4.6 删除数据集

**接口名称**: 删除数据集  
**对应页面**: provider/datasets/DatasetList.tsx  
**接口描述**: 删除指定的数据集  
**接口报文格式**: DELETE /api/datasets/{id}  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "id": {"type": "string"},
        "deleted": {"type": "boolean"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.id | string | 数据集ID |
| data.deleted | boolean | 是否已删除 |

### 4.7 获取数据集预览

**接口名称**: 获取数据集预览  
**对应页面**: provider/datasets/DatasetList.tsx, DatasetTransform.tsx  
**接口描述**: 获取数据集的数据预览  
**接口报文格式**: GET /api/datasets/{id}/preview  

**查询参数**:
- limit: 预览行数，默认为10

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "headers": {"type": "array", "items": {"type": "string"}},
        "rows": {"type": "array", "items": {"type": "array", "items": {"type": "string"}}},
        "totalRows": {"type": "number"},
        "previewRows": {"type": "number"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.headers | array | 表头列表 |
| data.rows | array | 数据行列表 |
| data.totalRows | number | 总行数 |
| data.previewRows | number | 预览行数 |

### 4.8 获取资源字段信息

**接口名称**: 获取资源字段信息  
**对应页面**: provider/datasets/DatasetTransform.tsx  
**接口描述**: 获取数据资源的字段信息，用于转换配置  
**接口报文格式**: GET /api/resources/{id}/fields  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "type": {"type": "string"},
              "nullable": {"type": "boolean"},
              "description": {"type": "string"}
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.fields | array | 字段列表 |
| data.fields[].name | string | 字段名称 |
| data.fields[].type | string | 字段类型 |
| data.fields[].nullable | boolean | 是否可为空 |
| data.fields[].description | string | 字段描述 |

## 5. 数据集策略管理模块

### 5.1 获取数据集策略配置

**接口名称**: 获取数据集策略配置  
**对应页面**: provider/dataset-policy-edit/DatasetPolicyEdit.tsx  
**接口描述**: 获取指定数据集的策略配置信息  
**接口报文格式**: GET /api/datasets/{datasetId}/policy  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "datasetId": {"type": "integer"},
        "datasetName": {"type": "string"},
        "policyConfig": {
          "type": "object",
          "properties": {
            "restrict_consumer": {
              "type": "object",
              "properties": {
                "enabled": {"type": "boolean"},
                "allowedConsumers": {
                  "type": "array",
                  "items": {"type": "string"}
                }
              }
            },
            "restrict_connector": {
              "type": "object",
              "properties": {
                "enabled": {"type": "boolean"},
                "allowedConnectors": {
                  "type": "array",
                  "items": {"type": "string"}
                }
              }
            },
            "time_limit": {
              "type": "object",
              "properties": {
                "enabled": {"type": "boolean"},
                "startTime": {"type": "string", "format": "date-time"},
                "endTime": {"type": "string", "format": "date-time"}
              }
            },
            "usage_count": {
              "type": "object",
              "properties": {
                "enabled": {"type": "boolean"},
                "maxCount": {"type": "integer"}
              }
            }
          }
        },
        "odrlSpec": {"type": "object"},
        "idsSpec": {"type": "object"},
        "createdAt": {"type": "string", "format": "date-time"},
        "updatedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.datasetId | integer | 数据集ID |
| data.datasetName | string | 数据集名称 |
| data.policyConfig | object | 策略配置对象 |
| data.policyConfig.restrict_consumer | object | 消费者限制配置 |
| data.policyConfig.restrict_consumer.enabled | boolean | 是否启用消费者限制 |
| data.policyConfig.restrict_consumer.allowedConsumers | array | 允许的消费者列表 |
| data.policyConfig.restrict_connector | object | 连接器限制配置 |
| data.policyConfig.restrict_connector.enabled | boolean | 是否启用连接器限制 |
| data.policyConfig.restrict_connector.allowedConnectors | array | 允许的连接器列表 |
| data.policyConfig.time_limit | object | 时间限制配置 |
| data.policyConfig.time_limit.enabled | boolean | 是否启用时间限制 |
| data.policyConfig.time_limit.startTime | string | 开始时间（ISO 8601格式） |
| data.policyConfig.time_limit.endTime | string | 结束时间（ISO 8601格式） |
| data.policyConfig.usage_count | object | 使用次数限制配置 |
| data.policyConfig.usage_count.enabled | boolean | 是否启用使用次数限制 |
| data.policyConfig.usage_count.maxCount | integer | 最大使用次数 |
| data.odrlSpec | object | ODRL规范对象 |
| data.idsSpec | object | IDS规范对象 |
| data.createdAt | string | 创建时间（ISO 8601格式） |
| data.updatedAt | string | 更新时间（ISO 8601格式） |

### 5.2 设置数据集策略配置

**接口名称**: 设置数据集策略配置  
**对应页面**: provider/dataset-policy-edit/DatasetPolicyEdit.tsx  
**接口描述**: 为指定数据集设置策略配置，包括组合策略配置和生成的ODRL/IDS规范  
**接口报文格式**: POST /api/datasets/{datasetId}/policy  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "policyConfig": {
      "type": "object",
      "properties": {
        "restrict_consumer": {
          "type": "object",
          "properties": {
            "enabled": {"type": "boolean"},
            "allowedConsumers": {
              "type": "array",
              "items": {"type": "string"}
            }
          },
          "required": ["enabled"]
        },
        "restrict_connector": {
          "type": "object",
          "properties": {
            "enabled": {"type": "boolean"},
            "allowedConnectors": {
              "type": "array",
              "items": {"type": "string"}
            }
          },
          "required": ["enabled"]
        },
        "time_limit": {
          "type": "object",
          "properties": {
            "enabled": {"type": "boolean"},
            "startTime": {"type": "string", "format": "date-time"},
            "endTime": {"type": "string", "format": "date-time"}
          },
          "required": ["enabled"]
        },
        "usage_count": {
          "type": "object",
          "properties": {
            "enabled": {"type": "boolean"},
            "maxCount": {"type": "integer"}
          },
          "required": ["enabled"]
        }
      },
      "required": ["restrict_consumer", "restrict_connector", "time_limit", "usage_count"]
    },
    "odrlSpec": {
      "type": "object",
      "description": "生成的ODRL策略规范"
    },
    "idsSpec": {
      "type": "object",
      "description": "生成的IDS策略规范"
    }
  },
  "required": ["policyConfig", "odrlSpec", "idsSpec"]
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "policyId": {"type": "integer"},
        "datasetId": {"type": "integer"},
        "createdAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| message | string | 响应消息 |
| data | object | 响应数据 |
| data.policyId | integer | 策略ID |
| data.datasetId | integer | 数据集ID |
| data.createdAt | string | 创建时间（ISO 8601格式） |

### 5.3 更新数据集策略配置

**接口名称**: 更新数据集策略配置  
**对应页面**: provider/dataset-policy-edit/DatasetPolicyEdit.tsx  
**接口描述**: 更新指定数据集的策略配置  
**接口报文格式**: PUT /api/datasets/{datasetId}/policy  

**请求体 JSON Schema**: 与4.2接口相同

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"},
    "data": {
      "type": "object",
      "properties": {
        "policyId": {"type": "integer"},
        "datasetId": {"type": "integer"},
        "updatedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| message | string | 响应消息 |
| data | object | 响应数据 |
| data.policyId | integer | 策略ID |
| data.datasetId | integer | 数据集ID |
| data.updatedAt | string | 更新时间（ISO 8601格式） |

### 5.4 删除数据集策略配置

**接口名称**: 删除数据集策略配置  
**对应页面**: provider/dataset-policy-edit/DatasetPolicyEdit.tsx  
**接口描述**: 删除指定数据集的策略配置  
**接口报文格式**: DELETE /api/datasets/{datasetId}/policy  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "message": {"type": "string"}
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| message | string | 响应消息 |

## 6. 提供者连接器管理模块

### 6.1 获取提供者连接器状态

**接口名称**: 获取提供者连接器状态列表  
**对应页面**: provider/connections/ConnectorStatus.tsx  
**接口描述**: 获取所有提供者连接器的状态信息  
**接口报文格式**: GET /api/connectors/status  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "integer"},
          "name": {"type": "string"},
          "type": {"type": "string"},
          "endpoint": {"type": "string"},
          "status": {"type": "string", "enum": ["online", "offline", "warning", "error"]},
          "uptime": {"type": "string"},
          "lastConnection": {"type": "string"},
          "dataTransferred": {"type": "string"},
          "cpuUsage": {"type": "number"},
          "memoryUsage": {"type": "number"},
          "description": {"type": "string"},
          "logs": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "timestamp": {"type": "string", "format": "date-time"},
                "level": {"type": "string", "enum": ["info", "warning", "error"]},
                "message": {"type": "string"}
              }
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | array | 连接器状态数据数组 |
| data[].id | integer | 连接器ID |
| data[].name | string | 连接器名称 |
| data[].type | string | 连接器类型 |
| data[].endpoint | string | 连接器端点 |
| data[].status | string | 连接器状态（online/offline/warning/error） |
| data[].uptime | string | 运行时间 |
| data[].lastConnection | string | 最后连接时间 |
| data[].dataTransferred | string | 数据传输量 |
| data[].cpuUsage | number | CPU使用率 |
| data[].memoryUsage | number | 内存使用率 |
| data[].description | string | 连接器描述 |
| data[].logs | array | 日志记录数组 |
| data[].logs[].timestamp | string | 日志时间戳（ISO 8601格式） |
| data[].logs[].level | string | 日志级别（info/warning/error） |
| data[].logs[].message | string | 日志消息 |

### 6.2 获取提供者数据交换记录

**接口名称**: 获取提供者数据交换记录  
**对应页面**: provider/connections/DataExchange.tsx  
**接口描述**: 分页获取提供者数据交换历史记录  
**接口报文格式**: GET /api/data-exchange/records  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "records": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "sourceConnector": {"type": "string"},
              "targetConnector": {"type": "string"},
              "resourceName": {"type": "string"},
              "resourceType": {"type": "string"},
              "exchangeType": {"type": "string", "enum": ["push", "pull"]},
              "status": {"type": "string", "enum": ["completed", "failed", "in_progress", "pending"]},
              "startTime": {"type": "string", "format": "date-time"},
              "endTime": {"type": "string", "format": "date-time"},
              "dataSize": {"type": "string"},
              "transferRate": {"type": "string"},
              "errorMessage": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.records | array | 数据交换记录数组 |
| data.records[].id | integer | 记录ID |
| data.records[].sourceConnector | string | 源连接器 |
| data.records[].targetConnector | string | 目标连接器 |
| data.records[].resourceName | string | 资源名称 |
| data.records[].resourceType | string | 资源类型 |
| data.records[].exchangeType | string | 交换类型（push/pull） |
| data.records[].status | string | 状态（completed/failed/in_progress/pending） |
| data.records[].startTime | string | 开始时间（ISO 8601格式） |
| data.records[].endTime | string | 结束时间（ISO 8601格式） |
| data.records[].dataSize | string | 数据大小 |
| data.records[].transferRate | string | 传输速率 |
| data.records[].errorMessage | string | 错误消息 |
| data.total | integer | 总记录数 |

## 7. 消费者模块

### 7.1 数据订阅

#### 7.1.1 验证连接器地址

**接口名称**: 验证Provider连接器地址  
**对应页面**: consumer/subscriptions/DataSubscription.tsx  
**接口描述**: 验证输入的Provider连接器地址是否有效  
**接口报文格式**: POST /api/consumer/subscription/validate-connector  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "connectorAddress": {
      "type": "string",
      "description": "Provider连接器地址"
    }
  },
  "required": ["connectorAddress"]
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| connectorAddress | string | Provider连接器地址（必填） |

**请求体示例**:
```json
{
  "connectorAddress": "https://provider.example.com:8080/api/ids/connector"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "isValid": {"type": "boolean"},
        "connectorInfo": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "description": {"type": "string"}
          }
        }
      }
    },
    "message": {"type": "string"}
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.templateId | string | 模板ID |
| data.terms | object | 合同条款 |
| data.terms.usagePurpose | string | 使用目的 |
| data.terms.accessDuration | string | 访问期限 |
| data.terms.dataRetention | string | 数据保留政策 |
| data.terms.restrictions | array | 限制条件数组 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "connectorInfo": {
      "name": "销售部门数据连接器",
      "version": "2.1.0",
      "description": "提供销售相关数据资源的连接器"
    }
  },
  "message": "连接器验证成功"
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "data": {
    "isValid": false
  },
  "message": "连接器地址无效或无法访问"
}
```

#### 7.1.2 发现数据资源

**接口名称**: 发现Provider的数据资源  
**对应页面**: consumer/subscriptions/DataSubscription.tsx  
**接口描述**: 从指定的Provider连接器获取可用的数据资源列表  
**接口报文格式**: POST /api/consumer/subscription/discover-resources  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "connectorAddress": {
      "type": "string",
      "description": "Provider连接器地址"
    }
  },
  "required": ["connectorAddress"]
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| connectorAddress | string | Provider连接器地址（必填） |

**请求体示例**:
```json
{
  "connectorAddress": "https://provider.example.com:8080/api/ids/connector"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "description": {"type": "string"},
          "type": {"type": "string"},
          "size": {"type": "string"},
          "format": {"type": "string"},
          "lastUpdated": {"type": "string", "format": "date-time"}
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.subscriptionId | string | 订阅ID |
| data.contractId | string | 合同ID |
| data.status | string | 订阅状态 |
| data.signedAt | string | 签署时间（ISO 8601格式） |

**响应体成功示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "res_001",
      "name": "客户销售数据集",
      "description": "包含客户购买记录和销售统计的数据集",
      "type": "dataset",
      "size": "2.5GB",
      "format": "CSV",
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    {
      "id": "res_002",
      "name": "产品库存数据",
      "description": "实时产品库存信息",
      "type": "api",
      "size": "实时",
      "format": "JSON",
      "lastUpdated": "2024-01-15T14:20:00Z"
    }
  ]
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "data": [],
  "message": "无法连接到指定的连接器或连接器无可用资源"
}
```

#### 7.1.3 获取合同模板

**接口名称**: 获取数据订阅合同模板  
**对应页面**: consumer/subscriptions/DataSubscription.tsx  
**接口描述**: 获取指定资源的合同模板  
**接口报文格式**: POST /api/consumer/subscription/contract-template  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "connectorAddress": {"type": "string"},
    "resourceId": {"type": "string"}
  },
  "required": ["connectorAddress", "resourceId"]
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| connectorAddress | string | Provider连接器地址（必填） |
| resourceId | string | 资源ID（必填） |

**请求体示例**:
```json
{
  "connectorAddress": "https://provider.example.com:8080/api/ids/connector",
  "resourceId": "res_001"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "templateId": {"type": "string"},
        "terms": {
          "type": "object",
          "properties": {
            "usagePurpose": {"type": "string"},
            "accessDuration": {"type": "string"},
            "dataRetention": {"type": "string"},
            "restrictions": {"type": "array", "items": {"type": "string"}}
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.subscriptions | array | 订阅记录数组 |
| data.subscriptions[].id | string | 订阅ID |
| data.subscriptions[].datasetName | string | 数据集名称 |
| data.subscriptions[].datasetUuid | string | 数据集UUID |
| data.subscriptions[].providerName | string | 提供者名称 |
| data.subscriptions[].providerId | string | 提供者ID |
| data.subscriptions[].subscriptionDate | string | 订阅日期 |
| data.subscriptions[].expiryDate | string | 到期日期 |
| data.subscriptions[].status | string | 订阅状态（active/expired/suspended/pending） |
| data.subscriptions[].pricePerMonth | number | 月费价格 |
| data.subscriptions[].currency | string | 货币单位 |
| data.subscriptions[].dataTransferred | number | 已传输数据量 |
| data.subscriptions[].monthlyQuota | number | 月度配额 |
| data.subscriptions[].contractSummary | string | 合同摘要 |
| data.total | integer | 总记录数 |
| data.statistics | object | 统计信息 |
| data.statistics.activeCount | integer | 活跃订阅数 |
| data.statistics.expiredCount | integer | 过期订阅数 |
| data.statistics.suspendedCount | integer | 暂停订阅数 |
| data.statistics.totalMonthlyCost | number | 总月费成本 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "templateId": "template_001",
    "terms": {
      "usagePurpose": "数据分析和报告生成",
      "accessDuration": "12个月",
      "dataRetention": "合同期满后30天内删除",
      "restrictions": ["不得用于商业转售", "不得与第三方共享"]
    }
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "指定资源不存在或无可用合同模板"
}
```

#### 7.1.4 协商合同条款

**接口名称**: 协商合同条款  
**对应页面**: consumer/subscriptions/DataSubscription.tsx  
**接口描述**: 与Provider协商合同条款  
**接口报文格式**: POST /api/consumer/subscription/negotiate-contract  

#### 7.1.5 签署合同

**接口名称**: 签署订阅合同  
**对应页面**: consumer/subscriptions/DataSubscription.tsx  
**接口描述**: 签署数据订阅合同  
**接口报文格式**: POST /api/consumer/subscription/sign-contract  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "contractId": {"type": "string"},
    "accepted": {"type": "boolean"},
    "signature": {"type": "string"}
  },
  "required": ["contractId", "accepted"]
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| contractId | string | 合同ID（必填） |
| accepted | boolean | 是否接受合同（必填） |
| signature | string | 数字签名 |

**请求体示例**:
```json
{
  "contractId": "contract_12345",
  "accepted": true,
  "signature": "digital_signature_hash_value"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "subscriptionId": {"type": "string"},
        "contractId": {"type": "string"},
        "status": {"type": "string"},
        "signedAt": {"type": "string", "format": "date-time"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.exchangeId | string | 交换记录ID |
| data.status | string | 交换状态 |
| data.startTime | string | 开始时间（ISO 8601格式） |
| data.estimatedDuration | string | 预估持续时间 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_67890",
    "contractId": "contract_12345",
    "status": "active",
    "signedAt": "2024-01-15T16:30:00Z"
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "合同签署失败：合同已过期或无效"
}
```

### 7.2 订阅管理

#### 7.2.1 获取订阅列表

**接口名称**: 获取消费者订阅列表  
**对应页面**: consumer/subscriptions/ManageSubscription.tsx  
**接口描述**: 获取当前消费者的所有数据订阅记录  
**接口报文格式**: GET /api/consumer/subscriptions  

**查询参数**:
- page: 页码
- pageSize: 每页数量
- search: 搜索关键词
- status: 状态过滤 (active/expired/suspended/pending)

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "subscriptions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "datasetName": {"type": "string"},
              "datasetUuid": {"type": "string"},
              "providerName": {"type": "string"},
              "providerId": {"type": "string"},
              "subscriptionDate": {"type": "string", "format": "date"},
              "expiryDate": {"type": "string", "format": "date"},
              "status": {"type": "string", "enum": ["active", "expired", "suspended", "pending"]},
              "pricePerMonth": {"type": "number"},
              "currency": {"type": "string"},
              "dataTransferred": {"type": "number"},
              "monthlyQuota": {"type": "number"},
              "contractSummary": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"},
        "statistics": {
          "type": "object",
          "properties": {
            "activeCount": {"type": "integer"},
            "expiredCount": {"type": "integer"},
            "suspendedCount": {"type": "integer"},
            "totalMonthlyCost": {"type": "number"}
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.domains | array | 领域选项数组 |
| data.dataTypes | array | 数据类型选项数组 |
| data.accessLevels | array | 访问级别选项数组 |
| data.statuses | array | 状态选项数组 |
| data.owners | array | 所有者选项数组 |
| data.tags | array | 标签选项数组 |

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "sub_001",
        "datasetName": "客户销售数据集",
        "datasetUuid": "dataset_12345",
        "providerName": "销售部门数据连接器",
        "providerId": "provider_001",
        "subscriptionDate": "2024-01-01",
        "expiryDate": "2024-12-31",
        "status": "active",
        "pricePerMonth": 299.99,
        "currency": "CNY",
        "dataTransferred": 1024000000,
        "monthlyQuota": 5368709120,
        "contractSummary": "数据分析用途，12个月有效期"
      },
      {
        "id": "sub_002",
        "datasetName": "产品库存数据",
        "datasetUuid": "dataset_67890",
        "providerName": "库存管理连接器",
        "providerId": "provider_002",
        "subscriptionDate": "2023-12-15",
        "expiryDate": "2024-01-14",
        "status": "expired",
        "pricePerMonth": 199.99,
        "currency": "CNY",
        "dataTransferred": 512000000,
        "monthlyQuota": 2147483648,
        "contractSummary": "实时库存查询，1个月试用期"
      }
    ],
    "total": 2,
    "statistics": {
      "activeCount": 1,
      "expiredCount": 1,
      "suspendedCount": 0,
      "totalMonthlyCost": 299.99
    }
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "获取订阅列表失败"
}
```

#### 7.2.2 获取订阅详情

**接口名称**: 获取订阅详细信息  
**对应页面**: consumer/subscriptions/ManageSubscription.tsx  
**接口描述**: 获取指定订阅的详细信息  
**接口报文格式**: GET /api/consumer/subscriptions/{subscriptionId}  

#### 7.2.3 取消订阅

**接口名称**: 取消数据订阅  
**对应页面**: consumer/subscriptions/ManageSubscription.tsx  
**接口描述**: 取消指定的数据订阅  
**接口报文格式**: DELETE /api/consumer/subscriptions/{subscriptionId}  

### 7.3 消费者连接器状态管理

#### 7.3.1 获取消费者连接器状态

**接口名称**: 获取消费者连接器状态  
**对应页面**: consumer/connections/ConnectorStatus.tsx  
**接口描述**: 获取消费者连接器的运行状态和配置信息  
**接口报文格式**: GET /api/consumer/connector/status  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "connectorInfo": {
          "type": "object",
          "properties": {
            "id": {"type": "string"},
            "name": {"type": "string"},
            "version": {"type": "string"},
            "status": {"type": "string", "enum": ["online", "offline", "error"]},
            "uptime": {"type": "string"},
            "lastHeartbeat": {"type": "string", "format": "date-time"}
          }
        },
        "connections": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "providerName": {"type": "string"},
              "providerAddress": {"type": "string"},
              "status": {"type": "string"},
              "lastActivity": {"type": "string", "format": "date-time"}
            }
          }
        }
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.connectorInfo | object | 连接器信息 |
| data.connectorInfo.id | string | 连接器ID |
| data.connectorInfo.name | string | 连接器名称 |
| data.connectorInfo.version | string | 连接器版本 |
| data.connectorInfo.status | string | 连接器状态（online/offline/error） |
| data.connectorInfo.uptime | string | 运行时间 |
| data.connectorInfo.lastHeartbeat | string | 最后心跳时间（ISO 8601格式） |
| data.connections | array | 连接信息数组 |
| data.connections[].id | string | 连接ID |
| data.connections[].providerName | string | 提供者名称 |
| data.connections[].providerAddress | string | 提供者地址 |
| data.connections[].status | string | 连接状态 |
| data.connections[].lastActivity | string | 最后活动时间（ISO 8601格式） |

### 7.4 数据交换管理

#### 7.4.1 获取消费者数据交换记录

**接口名称**: 获取消费者数据交换记录  
**对应页面**: consumer/connections/DataExchange.tsx  
**接口描述**: 获取消费者的数据交换历史记录  
**接口报文格式**: GET /api/consumer/data-exchange  

**查询参数**:
- page: 页码
- pageSize: 每页数量
- status: 状态过滤
- dateRange: 日期范围

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "exchanges": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "providerConnector": {"type": "string"},
              "resourceName": {"type": "string"},
              "resourceType": {"type": "string"},
              "exchangeType": {"type": "string", "enum": ["pull", "push"]},
              "status": {"type": "string", "enum": ["completed", "failed", "in_progress", "pending"]},
              "startTime": {"type": "string", "format": "date-time"},
              "endTime": {"type": "string", "format": "date-time"},
              "dataSize": {"type": "string"},
              "transferRate": {"type": "string"},
              "errorMessage": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.exchanges | array | 数据交换记录数组 |
| data.exchanges[].id | string | 交换记录ID |
| data.exchanges[].providerConnector | string | 提供者连接器 |
| data.exchanges[].resourceName | string | 资源名称 |
| data.exchanges[].resourceType | string | 资源类型 |
| data.exchanges[].exchangeType | string | 交换类型（pull/push） |
| data.exchanges[].status | string | 状态（completed/failed/in_progress/pending） |
| data.exchanges[].startTime | string | 开始时间（ISO 8601格式） |
| data.exchanges[].endTime | string | 结束时间（ISO 8601格式） |
| data.exchanges[].dataSize | string | 数据大小 |
| data.exchanges[].transferRate | string | 传输速率 |
| data.exchanges[].errorMessage | string | 错误消息 |
| data.total | integer | 总记录数 |

#### 7.4.2 启动数据拉取

**接口名称**: 启动数据拉取  
**对应页面**: consumer/connections/DataExchange.tsx  
**接口描述**: 从Provider拉取订阅的数据  
**接口报文格式**: POST /api/consumer/data-exchange/pull  

**请求体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "subscriptionId": {"type": "string"},
    "resourceId": {"type": "string"},
    "providerAddress": {"type": "string"}
  },
  "required": ["subscriptionId", "resourceId", "providerAddress"]
}
```

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| subscriptionId | string | 订阅ID（必填） |
| resourceId | string | 资源ID（必填） |
| providerAddress | string | 提供者地址（必填） |

**请求体示例**:
```json
{
  "subscriptionId": "sub_001",
  "resourceId": "res_001",
  "providerAddress": "https://provider.example.com:8080/api/ids/connector"
}
```

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "exchangeId": {"type": "string"},
        "status": {"type": "string"},
        "startTime": {"type": "string", "format": "date-time"},
        "estimatedDuration": {"type": "string"}
      }
    }
  }
}
```

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "exchangeId": "exchange_12345",
    "status": "in_progress",
    "startTime": "2024-01-15T16:45:00Z",
    "estimatedDuration": "约5分钟"
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "数据拉取启动失败：订阅已过期或Provider连接器不可用"
}
```

## 8. 通用接口

### 8.1 获取过滤选项

**接口名称**: 获取过滤选项  
**对应页面**: 多个列表页面  
**接口描述**: 获取各种过滤条件的可选值  
**接口报文格式**: GET /api/common/filter-options  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "domains": {"type": "array", "items": {"type": "string"}},
        "dataTypes": {"type": "array", "items": {"type": "string"}},
        "accessLevels": {"type": "array", "items": {"type": "string"}},
        "statuses": {"type": "array", "items": {"type": "string"}},
        "owners": {"type": "array", "items": {"type": "string"}},
        "tags": {"type": "array", "items": {"type": "string"}}
      }
    }
  }
}
```

**响应体成功示例**:
```json
{
  "success": true,
  "data": {
    "domains": ["销售", "财务", "人力资源", "市场营销", "运营"],
    "dataTypes": ["数据库", "文件", "API", "流数据"],
    "accessLevels": ["公开", "内部", "机密", "绝密"],
    "statuses": ["活跃", "非活跃", "已删除", "待审核"],
    "owners": ["张三", "李四", "王五", "赵六"],
    "tags": ["客户数据", "销售报表", "财务分析", "库存管理", "用户行为"]
  }
}
```

**响应体失败示例**:
```json
{
  "success": false,
  "message": "获取过滤选项失败"
}
```

### 8.2 文件上传

**接口名称**: 文件上传  
**对应页面**: 多个编辑页面  
**接口描述**: 通用文件上传接口  
**接口报文格式**: POST /api/common/upload  

### 8.3 文件下载

**接口名称**: 文件下载  
**对应页面**: 多个列表页面  
**接口描述**: 通用文件下载接口  
**接口报文格式**: GET /api/common/download/{fileId}  


## 接口设计原则

1. **RESTful设计**: 遵循REST架构风格，使用标准HTTP方法
2. **统一响应格式**: 所有接口返回统一的JSON格式
3. **错误处理**: 提供详细的错误码和错误信息
4. **分页支持**: 列表接口支持分页、排序和过滤
5. **安全认证**: 所有接口需要JWT令牌认证
6. **版本控制**: 接口支持版本控制，如/api/v1/
7. **文档化**: 提供完整的API文档和示例

## 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息"
  }
}
```

## 认证机制

所有API接口（除登录接口外）都需要在请求头中包含JWT令牌：

```
Authorization: Bearer <JWT_TOKEN>
```
