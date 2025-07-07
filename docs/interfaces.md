# IDSA数据空间连接器 - 后端接口设计文档

## 资源管理接口 (Resource Management APIs)

### 1. 获取资源列表

**接口描述**: 获取当前用户的所有资源列表，支持分页、筛选和排序

**请求方式**: `GET /api/resources`

**请求参数**:
```typescript
interface GetResourcesParams {
  page?: number;          // 页码，默认1
  pageSize?: number;      // 每页数量，默认10
  status?: 'private' | 'offered' | 'subscribed'; // 状态筛选
  type?: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型筛选
  keyword?: string;       // 关键词搜索
  sortBy?: 'created' | 'title' | 'status'; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
}
```

**响应数据**:
```typescript
interface GetResourcesResponse {
  code: number;
  message: string;
  data: {
    resources: Resource[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

interface Resource {
  id: string;
  title: string;          // 名称
  description: string;    // 描述
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型
  format: string;         // 格式（CSV、TXT、JSON等）
  keywords: string[];     // 关键词
  created: string;        // 创建时间 (ISO 8601格式)
  status: 'private' | 'offered' | 'subscribed'; // 状态
  publisher: string;      // 发布者
  license?: string;       // 许可证
  sourceType: 'uploaded' | 'transformed'; // 来源类型
  sourceResourceId?: string;    // 源资源ID
  sourceResourceName?: string;  // 源资源名称
}
```

**示例请求**:
```
GET /api/resources?page=1&pageSize=10&status=offered&sortBy=created&sortOrder=desc
```

**示例响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "resources": [
      {
        "id": "res-001",
        "title": "客户行为分析资源",
        "description": "包含客户购买行为、浏览记录等分析数据",
        "type": "document",
        "format": "CSV",
        "keywords": ["客户分析", "行为数据", "营销"],
        "created": "2024-01-15T08:30:00Z",
        "status": "offered",
        "publisher": "数据分析部门",
        "license": "CC BY 4.0",
        "sourceType": "transformed",
        "sourceResourceId": "db-001",
        "sourceResourceName": "客户数据库"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 2. 获取单个资源详情

**接口描述**: 根据资源ID获取资源的详细信息

**请求方式**: `GET /api/resources/{id}`

**路径参数**:
- `id`: 资源ID

**响应数据**:
```typescript
interface GetResourceResponse {
  code: number;
  message: string;
  data: Resource;
}
```

**示例请求**:
```
GET /api/resources/res-001
```

**示例响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "res-001",
    "title": "客户行为分析资源",
    "description": "包含客户购买行为、浏览记录等分析数据，用于客户行为模式分析和营销策略制定",
    "type": "document",
    "format": "CSV",
    "keywords": ["客户分析", "行为数据", "营销"],
    "created": "2024-01-15T08:30:00Z",
    "status": "offered",
    "publisher": "数据分析部门",
    "license": "CC BY 4.0",
    "sourceType": "transformed",
    "sourceResourceId": "db-001",
    "sourceResourceName": "客户数据库"
  }
}
```

### 3. 创建新资源

**接口描述**: 创建一个新的资源记录

**请求方式**: `POST /api/resources`

**请求体**:
```typescript
interface CreateResourceRequest {
  title: string;          // 名称
  description: string;    // 描述
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型
  format: string;         // 格式
  keywords: string[];     // 关键词
  license?: string;       // 许可证
  sourceType: 'uploaded' | 'transformed'; // 来源类型
  sourceResourceId?: string;    // 源资源ID（转换资源时必填）
  sourceResourceName?: string;  // 源资源名称（转换资源时必填）
}
```

**响应数据**:
```typescript
interface CreateResourceResponse {
  code: number;
  message: string;
  data: {
    id: string;           // 新创建的资源ID
    resource: Resource;   // 完整的资源信息
  };
}
```

**示例请求**:
```json
{
  "title": "销售数据报告",
  "description": "2024年第一季度销售数据分析报告",
  "type": "document",
  "format": "Excel",
  "keywords": ["销售", "报告", "季度"],
  "license": "内部使用",
  "sourceType": "uploaded"
}
```

**示例响应**:
```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": "res-006",
    "resource": {
      "id": "res-006",
      "title": "销售数据报告",
      "description": "2024年第一季度销售数据分析报告",
      "type": "document",
      "format": "Excel",
      "keywords": ["销售", "报告", "季度"],
      "created": "2024-01-20T10:15:00Z",
      "status": "private",
      "publisher": "当前用户",
      "license": "内部使用",
      "sourceType": "uploaded"
    }
  }
}
```

### 4. 更新资源信息

**接口描述**: 更新现有资源的信息

**请求方式**: `PUT /api/resources/{id}`

**路径参数**:
- `id`: 资源ID

**请求体**:
```typescript
interface UpdateResourceRequest {
  title?: string;         // 名称
  description?: string;   // 描述
  type?: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型
  format?: string;        // 格式
  keywords?: string[];    // 关键词
  status?: 'private' | 'offered' | 'subscribed'; // 状态
  license?: string;       // 许可证
}
```

**响应数据**:
```typescript
interface UpdateResourceResponse {
  code: number;
  message: string;
  data: Resource;         // 更新后的完整资源信息
}
```

**示例请求**:
```json
{
  "title": "客户行为深度分析资源",
  "description": "包含客户购买行为、浏览记录等深度分析数据，用于精准营销",
  "status": "offered",
  "keywords": ["客户分析", "行为数据", "营销", "深度学习"]
}
```

**示例响应**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "res-001",
    "title": "客户行为深度分析资源",
    "description": "包含客户购买行为、浏览记录等深度分析数据，用于精准营销",
    "type": "document",
    "format": "CSV",
    "keywords": ["客户分析", "行为数据", "营销", "深度学习"],
    "created": "2024-01-15T08:30:00Z",
    "status": "offered",
    "publisher": "数据分析部门",
    "license": "CC BY 4.0",
    "sourceType": "transformed",
    "sourceResourceId": "db-001",
    "sourceResourceName": "客户数据库"
  }
}
```

### 5. 删除资源

**接口描述**: 删除指定的资源

**请求方式**: `DELETE /api/resources/{id}`

**路径参数**:
- `id`: 资源ID

**响应数据**:
```typescript
interface DeleteResourceResponse {
  code: number;
  message: string;
  data: {
    deletedId: string;    // 被删除的资源ID
  };
}
```

**示例请求**:
```
DELETE /api/resources/res-001
```

**示例响应**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "deletedId": "res-001"
  }
}
```

### 6. 批量删除资源

**接口描述**: 批量删除多个资源

**请求方式**: `DELETE /api/resources`

**请求体**:
```typescript
interface BatchDeleteResourcesRequest {
  ids: string[];          // 要删除的资源ID列表
}
```

**响应数据**:
```typescript
interface BatchDeleteResourcesResponse {
  code: number;
  message: string;
  data: {
    deletedIds: string[];     // 成功删除的资源ID列表
    failedIds: string[];      // 删除失败的资源ID列表
    errors?: {
      [id: string]: string;   // 删除失败的原因
    };
  };
}
```

**示例请求**:
```json
{
  "ids": ["res-001", "res-002", "res-003"]
}
```

**示例响应**:
```json
{
  "code": 200,
  "message": "批量删除完成",
  "data": {
    "deletedIds": ["res-001", "res-002"],
    "failedIds": ["res-003"],
    "errors": {
      "res-003": "资源正在被其他服务使用，无法删除"
    }
  }
}
```

### 7. 更新资源状态

**接口描述**: 单独更新资源的状态（私有/已提供/已订阅）

**请求方式**: `PATCH /api/resources/{id}/status`

**路径参数**:
- `id`: 资源ID

**请求体**:
```typescript
interface UpdateResourceStatusRequest {
  status: 'private' | 'offered' | 'subscribed'; // 新状态
}
```

**响应数据**:
```typescript
interface UpdateResourceStatusResponse {
  code: number;
  message: string;
  data: {
    id: string;
    oldStatus: string;
    newStatus: string;
    updatedAt: string;    // 更新时间
  };
}
```

**示例请求**:
```json
{
  "status": "offered"
}
```

**示例响应**:
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": {
    "id": "res-001",
    "oldStatus": "private",
    "newStatus": "offered",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

## 错误响应格式

所有接口在发生错误时都会返回统一的错误格式：

```typescript
interface ErrorResponse {
  code: number;           // 错误码
  message: string;        // 错误信息
  error?: {
    type: string;         // 错误类型
    details?: any;        // 错误详情
  };
}
```

**常见错误码**:
- `400`: 请求参数错误
- `401`: 未授权访问
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突（如重复创建）
- `422`: 请求数据验证失败
- `500`: 服务器内部错误

**示例错误响应**:
```json
{
  "code": 404,
  "message": "资源不存在",
  "error": {
    "type": "RESOURCE_NOT_FOUND",
    "details": {
      "resourceId": "res-999"
    }
  }
}
```

## 接口认证

所有接口都需要在请求头中包含认证信息：

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## 接口版本控制

当前API版本为 v1，所有接口的完整路径为：
```
http://your-domain/api/v1/resources
```

## 数据验证规则

### Resource字段验证
- `title`: 必填，长度1-100字符
- `description`: 必填，长度1-1000字符
- `type`: 必填，枚举值
- `format`: 必填，长度1-50字符
- `keywords`: 可选，数组长度0-20，每个关键词长度1-50字符
- `license`: 可选，长度1-100字符
- `status`: 枚举值，默认为'private'
- `sourceType`: 必填，枚举值
- `sourceResourceId`: 当sourceType为'transformed'时必填
- `sourceResourceName`: 当sourceType为'transformed'时必填