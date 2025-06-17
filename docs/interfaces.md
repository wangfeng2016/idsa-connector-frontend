# IDSA数据空间连接器 - 后端接口设计文档

## 概述

本文档详细描述了IDSA数据空间连接器前端系统所需的后端RESTful API接口设计。基于对前端页面和组件的分析，识别出以下主要功能模块的接口需求。

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

## 2. 数据资源管理模块

### 2.1 获取资源列表

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

### 2.2 获取单个资源详情

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

### 2.3 创建数据资源

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
    "accessLevel": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["name", "description", "type", "domain", "accessLevel"]
}
```

### 2.4 更新数据资源

**接口名称**: 更新数据资源  
**对应页面**: provider/resources/ResourceEdit.tsx  
**接口描述**: 更新现有数据资源信息  
**接口报文格式**: PUT /api/resources/{id}  

### 2.5 删除数据资源

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

### 2.6 切换资源收藏状态

**接口名称**: 切换资源收藏状态  
**对应页面**: provider/resources/ResourceList.tsx  
**接口描述**: 添加或移除资源收藏  
**接口报文格式**: POST /api/resources/{id}/favorite  

## 3. 策略管理模块

### 3.1 获取策略列表

**接口名称**: 获取策略列表  
**对应页面**: provider/policies/PolicyList.tsx  
**接口描述**: 分页获取数据使用策略列表  
**接口报文格式**: GET /api/policies  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "policies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "name": {"type": "string"},
              "type": {"type": "string"},
              "target": {"type": "string"},
              "status": {"type": "string", "enum": ["active", "inactive", "pending"]},
              "createdAt": {"type": "string", "format": "date-time"},
              "updatedAt": {"type": "string", "format": "date-time"},
              "description": {"type": "string"},
              "createdBy": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

### 3.2 创建策略

**接口名称**: 创建数据使用策略  
**对应页面**: provider/policies/PolicyEdit.tsx  
**接口描述**: 创建新的数据使用策略  
**接口报文格式**: POST /api/policies  

### 3.3 更新策略

**接口名称**: 更新数据使用策略  
**对应页面**: provider/policies/PolicyEdit.tsx  
**接口描述**: 更新现有策略  
**接口报文格式**: PUT /api/policies/{id}  

### 3.4 删除策略

**接口名称**: 删除数据使用策略  
**对应页面**: provider/policies/PolicyList.tsx  
**接口描述**: 删除策略  
**接口报文格式**: DELETE /api/policies/{id}  

## 4. 连接器管理模块

### 4.1 获取连接器状态

**接口名称**: 获取连接器状态列表  
**对应页面**: provider/connections/ConnectorStatus.tsx  
**接口描述**: 获取所有连接器的状态信息  
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

### 4.2 获取数据交换记录

**接口名称**: 获取数据交换记录  
**对应页面**: provider/connections/DataExchange.tsx  
**接口描述**: 分页获取数据交换历史记录  
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

### 4.3 启动数据交换

**接口名称**: 启动数据交换  
**对应页面**: provider/connections/DataExchange.tsx  
**接口描述**: 手动启动数据交换任务  
**接口报文格式**: POST /api/data-exchange/start  

## 5. 生态系统模块

### 5.1 获取市场数据

**接口名称**: 获取数据市场列表  
**对应页面**: provider/ecosystem/Marketplace.tsx  
**接口描述**: 获取数据市场中的可用数据集和服务  
**接口报文格式**: GET /api/marketplace/items  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "title": {"type": "string"},
              "description": {"type": "string"},
              "type": {"type": "string", "enum": ["data", "service", "app"]},
              "provider": {"type": "string"},
              "price": {"type": "number"},
              "rating": {"type": "number"},
              "reviews": {"type": "integer"},
              "tags": {"type": "array", "items": {"type": "string"}},
              "imageUrl": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

### 5.2 获取参与方列表

**接口名称**: 获取数据空间参与方  
**对应页面**: provider/ecosystem/Participants.tsx  
**接口描述**: 获取数据空间中的所有参与方信息  
**接口报文格式**: GET /api/participants  

### 5.3 获取交易记录

**接口名称**: 获取交易记录  
**对应页面**: provider/ecosystem/Transactions.tsx  
**接口描述**: 获取数据交易历史记录  
**接口报文格式**: GET /api/transactions  

## 6. 分析报表模块

### 6.1 获取数据集使用分析

**接口名称**: 获取数据集使用统计  
**对应页面**: provider/analytics/DatasetUsageAnalysis.tsx  
**接口描述**: 获取数据集的使用统计和分析数据  
**接口报文格式**: GET /api/analytics/dataset-usage  

**查询参数**:
- timePeriod: 时间段 (week/month/quarter)

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "overallStats": {
          "type": "object",
          "properties": {
            "totalDatasets": {"type": "integer"},
            "totalDownloads": {"type": "integer"},
            "totalConsumers": {"type": "integer"},
            "totalRevenue": {"type": "number"},
            "platformCommission": {"type": "number"},
            "netRevenue": {"type": "number"}
          }
        },
        "datasetUsages": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "category": {"type": "string"},
              "downloadCount": {"type": "integer"},
              "consumerCount": {"type": "integer"},
              "revenue": {"type": "number"},
              "lastAccessed": {"type": "string", "format": "date"},
              "popularityTrend": {"type": "string", "enum": ["up", "down", "stable"]},
              "description": {"type": "string"}
            }
          }
        }
      }
    }
  }
}
```

### 6.2 获取合规报表

**接口名称**: 获取合规报表数据  
**对应页面**: provider/analytics/ComplianceReports.tsx  
**接口描述**: 获取数据合规性检查报表  
**接口报文格式**: GET /api/analytics/compliance  

### 6.3 获取仪表盘数据

**接口名称**: 获取仪表盘数据  
**对应页面**: provider/analytics/Dashboards.tsx  
**接口描述**: 获取自定义仪表盘的数据  
**接口报文格式**: GET /api/analytics/dashboard  

## 7. 系统管理模块

### 7.1 获取系统配置

**接口名称**: 获取系统配置  
**对应页面**: provider/system/SystemConfig.tsx  
**接口描述**: 获取系统配置参数  
**接口报文格式**: GET /api/system/config  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "general": {
          "type": "object",
          "properties": {
            "systemName": {"type": "string"},
            "adminEmail": {"type": "string"},
            "language": {"type": "string"},
            "timezone": {"type": "string"},
            "autoUpdate": {"type": "boolean"},
            "telemetry": {"type": "boolean"}
          }
        },
        "network": {
          "type": "object",
          "properties": {
            "hostAddress": {"type": "string"},
            "port": {"type": "integer"},
            "useHttps": {"type": "boolean"},
            "proxyEnabled": {"type": "boolean"},
            "proxyAddress": {"type": "string"},
            "proxyPort": {"type": "string"}
          }
        },
        "security": {
          "type": "object",
          "properties": {
            "sessionTimeout": {"type": "integer"},
            "maxLoginAttempts": {"type": "integer"},
            "passwordPolicy": {"type": "string"},
            "twoFactorAuth": {"type": "boolean"},
            "allowedIPs": {"type": "string"}
          }
        },
        "storage": {
          "type": "object",
          "properties": {
            "dataPath": {"type": "string"},
            "tempPath": {"type": "string"},
            "maxUploadSize": {"type": "integer"},
            "backupEnabled": {"type": "boolean"},
            "backupSchedule": {"type": "string"},
            "retentionDays": {"type": "integer"}
          }
        },
        "api": {
          "type": "object",
          "properties": {
            "enableREST": {"type": "boolean"},
            "enableGraphQL": {"type": "boolean"},
            "rateLimitPerMinute": {"type": "integer"},
            "tokenExpiration": {"type": "integer"}
          }
        }
      }
    }
  }
}
```

### 7.2 更新系统配置

**接口名称**: 更新系统配置  
**对应页面**: provider/system/SystemConfig.tsx  
**接口描述**: 更新系统配置参数  
**接口报文格式**: PUT /api/system/config  

### 7.3 获取系统备份列表

**接口名称**: 获取系统备份列表  
**对应页面**: provider/system/Backup.tsx  
**接口描述**: 获取系统备份文件列表  
**接口报文格式**: GET /api/system/backups  

### 7.4 创建系统备份

**接口名称**: 创建系统备份  
**对应页面**: provider/system/Backup.tsx  
**接口描述**: 手动创建系统备份  
**接口报文格式**: POST /api/system/backups  

## 8. 身份认证管理模块

### 8.1 获取用户列表

**接口名称**: 获取用户列表  
**对应页面**: provider/identity/Authentication.tsx  
**接口描述**: 获取系统用户列表  
**接口报文格式**: GET /api/identity/users  

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "users": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "username": {"type": "string"},
              "email": {"type": "string"},
              "fullName": {"type": "string"},
              "role": {"type": "string"},
              "status": {"type": "string", "enum": ["active", "inactive", "locked", "pending"]},
              "lastLogin": {"type": "string", "format": "date-time"},
              "createdAt": {"type": "string", "format": "date-time"},
              "permissions": {"type": "array", "items": {"type": "string"}},
              "avatar": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

### 8.2 获取证书列表

**接口名称**: 获取证书列表  
**对应页面**: provider/identity/CertificateManagement.tsx  
**接口描述**: 获取系统证书列表  
**接口报文格式**: GET /api/identity/certificates  

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
          "type": {"type": "string", "enum": ["x509", "jwt", "oauth"]},
          "issuer": {"type": "string"},
          "subject": {"type": "string"},
          "validFrom": {"type": "string", "format": "date-time"},
          "validTo": {"type": "string", "format": "date-time"},
          "status": {"type": "string", "enum": ["valid", "expired", "revoked", "pending"]},
          "fingerprint": {"type": "string"}
        }
      }
    }
  }
}
```

### 8.3 获取活动会话

**接口名称**: 获取活动会话列表  
**对应页面**: provider/identity/Authentication.tsx  
**接口描述**: 获取当前活动的用户会话  
**接口报文格式**: GET /api/identity/sessions  

## 9. 安全管理模块

### 9.1 获取审计日志

**接口名称**: 获取审计日志  
**对应页面**: provider/security/AuditLogs.tsx  
**接口描述**: 分页获取系统审计日志  
**接口报文格式**: GET /api/security/audit-logs  

**查询参数**:
- page: 页码
- pageSize: 每页数量
- startDate: 开始日期
- endDate: 结束日期
- user: 用户过滤
- action: 操作过滤
- status: 状态过滤

**响应体 JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "logs": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {"type": "integer"},
              "timestamp": {"type": "string", "format": "date-time"},
              "user": {"type": "string"},
              "action": {"type": "string"},
              "resource": {"type": "string"},
              "details": {"type": "string"},
              "status": {"type": "string", "enum": ["success", "failure", "warning"]},
              "ipAddress": {"type": "string"}
            }
          }
        },
        "total": {"type": "integer"}
      }
    }
  }
}
```

### 9.2 获取访问控制规则

**接口名称**: 获取访问控制规则  
**对应页面**: provider/security/AccessControl.tsx  
**接口描述**: 获取系统访问控制规则  
**接口报文格式**: GET /api/security/access-control  

### 9.3 获取合规检查结果

**接口名称**: 获取合规检查结果  
**对应页面**: provider/security/Compliance.tsx  
**接口描述**: 获取系统合规性检查结果  
**接口报文格式**: GET /api/security/compliance  

## 10. 通用接口

### 10.1 获取过滤选项

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

### 10.2 文件上传

**接口名称**: 文件上传  
**对应页面**: 多个编辑页面  
**接口描述**: 通用文件上传接口  
**接口报文格式**: POST /api/common/upload  

### 10.3 文件下载

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
