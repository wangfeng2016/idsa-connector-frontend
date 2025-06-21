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

## 3 数据列表模块
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

### 3.6 切换资源收藏状态

**接口名称**: 切换资源收藏状态  
**对应页面**: provider/resources/ResourceList.tsx  
**接口描述**: 添加或移除资源收藏  
**接口报文格式**: POST /api/resources/{id}/favorite  

## 4. 数据集管理模块

### 4.1 获取数据集列表

**接口名称**: 获取数据集列表  
**对应页面**: provider/datasets/DatasetList.tsx  
**接口描述**: 分页获取数据集列表，支持过滤和排序  
**接口报文格式**: GET /api/datasets  

**查询参数**:
- page: 页码，默认为1
- pageSize: 每页数量，默认为10
- searchTerm: 搜索关键词
- type: 数据集类型过滤 (uploaded/transformed)
- category: 分类过滤
- status: 状态过滤
- accessLevel: 访问级别过滤
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
              "recordCount": {"type": "number"},
              "status": {"type": "string", "enum": ["active", "processing", "error", "archived"]},
              "category": {"type": "string"},
              "accessLevel": {"type": "string", "enum": ["public", "private", "restricted"]},
              "tags": {"type": "array", "items": {"type": "string"}},
              "createdAt": {"type": "string", "format": "date-time"},
              "updatedAt": {"type": "string", "format": "date-time"}
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
