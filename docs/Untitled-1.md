
**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| name | string | 数据集名称（必填） |
| description | string | 数据集描述 |
| category | string | 分类 |
| accessLevel | string | 访问级别，可选值：public（公开）、private（私有）、restricted（受限） |
| tags | array | 标签列表 |


**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| sourceResourceId | string | 源资源ID（必填） |
| transformConfig | object | 转换配置 |
| transformConfig.selectedFields | array | 选中的字段列表 |
| transformConfig.filters | array | 过滤条件列表 |
| transformConfig.filters[].field | string | 过滤字段（必填） |
| transformConfig.filters[].operator | string | 操作符，可选值：equals（等于）、not_equals（不等于）、greater_than（大于）、less_than（小于）、contains（包含）、not_contains（不包含）（必填） |
| transformConfig.filters[].value | string | 过滤值（必填） |
| transformConfig.limit | number | 限制记录数 |
| metadata | object | 元数据信息（必填） |
| metadata.name | string | 数据集名称（必填） |
| metadata.description | string | 数据集描述 |
| metadata.category | string | 分类 |
| metadata.accessLevel | string | 访问级别，可选值：public（公开）、private（私有）、restricted（受限） |
| metadata.tags | array | 标签列表 |


**参数说明表格**:

| 参数名称 | 参数类型 | 参数描述 |
|----------|----------|----------|
| success | boolean | 操作是否成功 |
| data | object | 返回的数据对象 |
| data.datasets | array | 数据集列表 |
| data.datasets[].id | string | 数据集ID |
| data.datasets[].name | string | 数据集名称 |
| data.datasets[].description | string | 数据集描述 |
| data.datasets[].type | string | 数据集类型，可选值：uploaded（上传）、transformed（转换） |
| data.datasets[].sourceType | string | 源类型，可选值：file（文件）、database（数据库）、api（API） |
| data.datasets[].sourceResourceId | string | 源资源ID |
| data.datasets[].sourceResourceName | string | 源资源名称 |
| data.datasets[].format | string | 数据格式 |
| data.datasets[].size | string | 数据大小 |
| data.datasets[].recordCount | number | 记录数量 |
| data.datasets[].status | string | 状态，可选值：active（活跃）、processing（处理中）、error（错误）、archived（已归档） |
| data.datasets[].category | string | 分类 |
| data.datasets[].accessLevel | string | 访问级别，可选值：public（公开）、private（私有）、restricted（受限） |
| data.datasets[].tags | array | 标签列表 |
| data.datasets[].createdAt | string | 创建时间（ISO 8601格式） |
| data.datasets[].updatedAt | string | 更新时间（ISO 8601格式） |
| data.total | integer | 总记录数 |
| data.page | integer | 当前页码 |
| data.pageSize | integer | 每页数量 |

**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| policyConfig | object | 策略配置对象（必填） |
| policyConfig.restrict_consumer | object | 消费者限制配置（必填） |
| policyConfig.restrict_consumer.enabled | boolean | 是否启用消费者限制（必填） |
| policyConfig.restrict_consumer.allowedConsumers | array | 允许的消费者列表 |
| policyConfig.restrict_connector | object | 连接器限制配置（必填） |
| policyConfig.restrict_connector.enabled | boolean | 是否启用连接器限制（必填） |
| policyConfig.restrict_connector.allowedConnectors | array | 允许的连接器列表 |
| policyConfig.time_limit | object | 时间限制配置（必填） |
| policyConfig.time_limit.enabled | boolean | 是否启用时间限制（必填） |
| policyConfig.time_limit.startTime | string | 开始时间（ISO 8601格式） |
| policyConfig.time_limit.endTime | string | 结束时间（ISO 8601格式） |
| policyConfig.usage_count | object | 使用次数限制配置（必填） |
| policyConfig.usage_count.enabled | boolean | 是否启用使用次数限制（必填） |
| policyConfig.usage_count.maxCount | integer | 最大使用次数 |
| odrlSpec | object | 生成的ODRL策略规范（必填） |
| idsSpec | object | 生成的IDS策略规范（必填） |


**参数说明表格**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功 |
| data | object | 响应数据 |
| data.isValid | boolean | 连接器地址是否有效 |
| data.connectorInfo | object | 连接器信息 |
| data.connectorInfo.name | string | 连接器名称 |
| data.connectorInfo.version | string | 连接器版本 |
| data.connectorInfo.description | string | 连接器描述 |
| message | string | 响应消息 |