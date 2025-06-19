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

**接口名称**: 设置数据源
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

## 3. 数据集策略管理模块

### 3.1 获取数据集策略配置

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

### 3.2 设置数据集策略配置

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

### 3.3 更新数据集策略配置

**接口名称**: 更新数据集策略配置  
**对应页面**: provider/dataset-policy-edit/DatasetPolicyEdit.tsx  
**接口描述**: 更新指定数据集的策略配置  
**接口报文格式**: PUT /api/datasets/{datasetId}/policy  

**请求体 JSON Schema**: 与3.2接口相同

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

### 3.4 删除数据集策略配置

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
