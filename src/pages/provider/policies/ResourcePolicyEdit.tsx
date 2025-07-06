import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  TextField,
  Button,
  Stack,
  Switch,
  Autocomplete,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import { mockResources } from '../../../contexts/ResourceContext';

// 策略类型定义
type PolicyType = 'restrict_consumer' | 'restrict_connector' | 'time_limit' | 'usage_count';

// 资源接口
interface Resource {
  id: number;
  name: string;
  description: string;
  uuid: string;
}

// 单个策略类配置接口
interface PolicyClassConfig {
  id: string;
  type: PolicyType;
  enabled: boolean;
  consumers?: string[];
  connectors?: string[];
  startTime?: string;
  endTime?: string;
  maxUsageCount?: number;
}

// 组合策略配置接口
interface CombinedPolicyConfig {
  policyClasses: PolicyClassConfig[];
}

// 模拟消费者数据
const mockConsumers = [
  { id: 'consumer-001', name: '数据消费者A', organization: '公司A' },
  { id: 'consumer-002', name: '数据消费者B', organization: '公司B' },
  { id: 'consumer-003', name: '数据消费者C', organization: '公司C' },
  { id: 'consumer-004', name: '数据消费者D', organization: '公司D' },
];

// 模拟连接器数据
const mockConnectors = [
  { id: 'connector-001', name: '连接器Alpha', endpoint: 'https://connector-a.example.com' },
  { id: 'connector-002', name: '连接器Beta', endpoint: 'https://connector-b.example.com' },
  { id: 'connector-003', name: '连接器Gamma', endpoint: 'https://connector-c.example.com' },
  { id: 'connector-004', name: '连接器Delta', endpoint: 'https://connector-d.example.com' },
];



// 生成UUID的辅助函数
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 转换资源数据为资源格式
const convertToResources = (): Resource[] => {
  return mockResources.map(resource => ({
    id: resource.id,
    name: resource.name,
    description: resource.description,
    uuid: generateUUID(),
  }));
};

// 生成IDS策略规范
const generateIDSPolicy = (resource: Resource, config: CombinedPolicyConfig): string => {
  const basePolicy = {
    "@context": {
      "ids": "https://w3id.org/idsa/core/",
      "idsc": "https://w3id.org/idsa/code/"
    },
    "@type": "ids:ContractAgreement",
    "@id": `https://w3id.org/idsa/autogen/contract/${resource.uuid}`,
    "profile": "http://example.com/ids-profile",
    "ids:provider": "http://example.com/party/data-provider",
    "ids:consumer": "http://example.com/party/data-consumer",
    "ids:permission": [{
      "ids:target": {
        "@id": `http://example.com/ids/target/${resource.uuid}`
      },
      "ids:action": [{
        "@id": "idsc:USE"
      }]
    }]
  };

  // 根据启用的策略类型添加约束
  const permission = basePolicy["ids:permission"][0] as any;
  const constraints: any[] = [];
  
  // 处理启用的策略类
  const enabledPolicies = config.policyClasses.filter(p => p.enabled);
  
  enabledPolicies.forEach(policyClass => {
    switch (policyClass.type) {
      case 'restrict_consumer':
        if (policyClass.consumers && policyClass.consumers.length > 0) {
          basePolicy["ids:consumer"] = policyClass.consumers[0];
        }
        break;
      case 'restrict_connector':
        if (policyClass.connectors && policyClass.connectors.length > 0) {
          constraints.push({
            "@type": "ids:Constraint",
            "ids:leftOperand": { "@id": "idsc:CONNECTOR" },
            "ids:operator": { "@id": "idsc:EQUALS" },
            "ids:rightOperand": [{
              "@value": policyClass.connectors[0],
              "@type": "xsd:string"
            }]
          });
        }
        break;
      case 'time_limit':
        if (policyClass.startTime && policyClass.endTime) {
          constraints.push({
            "@type": "ids:Constraint",
            "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
            "ids:operator": { "@id": "idsc:AFTER" },
            "ids:rightOperand": [{
              "@value": policyClass.startTime,
              "@type": "xsd:dateTimeStamp"
            }]
          }, {
            "@type": "ids:Constraint",
            "ids:leftOperand": { "@id": "idsc:POLICY_EVALUATION_TIME" },
            "ids:operator": { "@id": "idsc:BEFORE" },
            "ids:rightOperand": [{
              "@value": policyClass.endTime,
              "@type": "xsd:dateTimeStamp"
            }]
          });
        }
        break;
      case 'usage_count':
        if (policyClass.maxUsageCount) {
          constraints.push({
            "@type": "ids:Constraint",
            "ids:leftOperand": { "@id": "idsc:COUNT" },
            "ids:operator": { "@id": "idsc:LTEQ" },
            "ids:rightOperand": [{
              "@value": policyClass.maxUsageCount.toString(),
              "@type": "xsd:double"
            }]
          });
        }
        break;
    }
  });

  // 如果有约束条件，添加到permission中
  if (constraints.length > 0) {
    permission["ids:constraint"] = constraints;
  }

  return JSON.stringify(basePolicy, null, 2);
};

// 生成ODRL策略规范
const generateODRLPolicy = (resource: Resource, config: CombinedPolicyConfig): string => {
  const basePolicy = {
    "@context": [
      "http://www.w3.org/ns/odrl.jsonld",
      {
        "dc": "http://purl.org/dc/terms/",
        "ids": "https://w3id.org/idsa/core/",
        "idsc": "https://w3id.org/idsa/code/"
      }
    ],
    "@type": "Agreement",
    "uid": `http://example.com/policy/${resource.uuid}`,
    "profile": "http://www.w3.org/ns/odrl/2/core",
    "dc:creator": "Data Provider",
    "dc:description": `Policy for resource: ${resource.name}`,
    "dc:issued": new Date().toISOString(),
    "permission": [{
      "target": `http://example.com/ids/data/${resource.uuid}`,
      "assigner": "http://example.com/ids/party/data-provider",
      "assignee": "http://example.com/ids/party/data-consumer",
      "action": "use"
    }]
  };

  const permission = basePolicy.permission[0] as any;
  const constraints: any[] = [];
  
  // 处理启用的策略类
  const enabledPolicies = config.policyClasses.filter(p => p.enabled);
  
  enabledPolicies.forEach(policyClass => {
    switch (policyClass.type) {
      case 'restrict_consumer':
        if (policyClass.consumers && policyClass.consumers.length > 0) {
          permission.assignee = policyClass.consumers[0];
        }
        break;
      case 'restrict_connector':
        if (policyClass.connectors && policyClass.connectors.length > 0) {
          constraints.push({
            "leftOperand": "connector",
            "operator": "eq",
            "rightOperand": policyClass.connectors[0]
          });
        }
        break;
      case 'time_limit':
        if (policyClass.startTime && policyClass.endTime) {
          constraints.push({
            "leftOperand": "dateTime",
            "operator": "gteq",
            "rightOperand": { "@value": policyClass.startTime, "@type": "xsd:dateTime" }
          }, {
            "leftOperand": "dateTime",
            "operator": "lteq",
            "rightOperand": { "@value": policyClass.endTime, "@type": "xsd:dateTime" }
          });
        }
        break;
      case 'usage_count':
        if (policyClass.maxUsageCount) {
          constraints.push({
            "leftOperand": "count",
            "operator": "lteq",
            "rightOperand": policyClass.maxUsageCount
          });
        }
        break;
    }
  });

  // 如果有约束条件，添加到permission中
  if (constraints.length > 0) {
    permission.constraint = constraints;
  }

  return JSON.stringify(basePolicy, null, 2);
};

const ResourcePolicyEdit: React.FC = () => {
  const [resources] = useState<Resource[]>(convertToResources());
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [policyConfig, setPolicyConfig] = useState<CombinedPolicyConfig>({
    policyClasses: [
      {
        id: 'restrict_consumer',
        type: 'restrict_consumer',
        enabled: false,
        consumers: [],
      },
      {
        id: 'restrict_connector',
        type: 'restrict_connector',
        enabled: false,
        connectors: [],
      },
      {
        id: 'time_limit',
        type: 'time_limit',
        enabled: false,
        startTime: '',
        endTime: '',
      },
      {
        id: 'usage_count',
        type: 'usage_count',
        enabled: false,
        maxUsageCount: 1,
      }
    ]
  });
  const [idsPolicy, setIdsPolicy] = useState<string>('');
  const [odrlPolicy, setOdrlPolicy] = useState<string>('');

  // 当资源或策略配置改变时，更新策略规范
  useEffect(() => {
    if (selectedResource) {
      const ids = generateIDSPolicy(selectedResource, policyConfig);
      const odrl = generateODRLPolicy(selectedResource, policyConfig);
      setIdsPolicy(ids);
      setOdrlPolicy(odrl);
    }
  }, [selectedResource, policyConfig]);

  // 处理策略类启用/禁用
  const handlePolicyClassToggle = (policyType: PolicyType) => {
    setPolicyConfig({
      ...policyConfig,
      policyClasses: policyConfig.policyClasses.map(pc => 
        pc.type === policyType ? { ...pc, enabled: !pc.enabled } : pc
      )
    });
  };

  // 处理消费者选择变化
  const handleConsumersChange = (_event: any, newValue: string[]) => {
    setPolicyConfig({
      ...policyConfig,
      policyClasses: policyConfig.policyClasses.map(pc => 
        pc.type === 'restrict_consumer' ? { ...pc, consumers: newValue } : pc
      )
    });
  };

  // 处理连接器选择变化
  const handleConnectorsChange = (_event: any, newValue: string[]) => {
    setPolicyConfig({
      ...policyConfig,
      policyClasses: policyConfig.policyClasses.map(pc => 
        pc.type === 'restrict_connector' ? { ...pc, connectors: newValue } : pc
      )
    });
  };

  // 处理时间变化
  const handleTimeChange = (field: 'startTime' | 'endTime') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyConfig({
      ...policyConfig,
      policyClasses: policyConfig.policyClasses.map(pc => 
        pc.type === 'time_limit' ? { ...pc, [field]: event.target.value } : pc
      )
    });
  };

  // 处理使用次数变化
  const handleUsageCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    setPolicyConfig({
      ...policyConfig,
      policyClasses: policyConfig.policyClasses.map(pc => 
        pc.type === 'usage_count' ? { ...pc, maxUsageCount: value } : pc
      )
    });
  };

  // 保存策略
  const handleSavePolicy = () => {
    if (!selectedResource) {
      alert('请先选择资源');
      return;
    }
    
    // 这里可以添加保存策略的逻辑
    console.log('保存策略:', {
      resource: selectedResource,
      config: policyConfig,
      idsPolicy,
      odrlPolicy,
    });
    
    alert('策略保存成功！');
  };

  // 获取策略类型的显示名称
  const getPolicyTypeLabel = (type: PolicyType): string => {
    const labels = {
      'restrict_consumer': '限制消费者',
      'restrict_connector': '限制连接器',
      'time_limit': '时间限制',
      'usage_count': '使用次数限制'
    };
    return labels[type];
  };

  // 渲染单个策略类配置
  const renderPolicyClassConfig = (policyClass: PolicyClassConfig) => {
    if (!policyClass.enabled) return null;

    switch (policyClass.type) {
      case 'restrict_consumer':
        return (
          <Autocomplete
            multiple
            options={mockConsumers.map(c => c.id)}
            getOptionLabel={(option) => {
              const consumer = mockConsumers.find(c => c.id === option);
              return consumer ? `${consumer.name} (${consumer.organization})` : option;
            }}
            value={policyClass.consumers || []}
            onChange={handleConsumersChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const consumer = mockConsumers.find(c => c.id === option);
                return (
                  <Chip
                    variant="outlined"
                    label={consumer ? consumer.name : option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="选择允许的消费者"
                placeholder="请选择消费者"
                helperText="可以选择多个消费者"
              />
            )}
          />
        );
      case 'restrict_connector':
        return (
          <Autocomplete
            multiple
            options={mockConnectors.map(c => c.id)}
            getOptionLabel={(option) => {
              const connector = mockConnectors.find(c => c.id === option);
              return connector ? `${connector.name} (${connector.endpoint})` : option;
            }}
            value={policyClass.connectors || []}
            onChange={handleConnectorsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const connector = mockConnectors.find(c => c.id === option);
                return (
                  <Chip
                    variant="outlined"
                    label={connector ? connector.name : option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="选择允许的连接器"
                placeholder="请选择连接器"
                helperText="可以选择多个连接器"
              />
            )}
          />
        );
      case 'time_limit':
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label="开始时间"
              type="datetime-local"
              value={policyClass.startTime || ''}
              onChange={handleTimeChange('startTime')}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="数据使用的开始时间"
            />
            <TextField
              fullWidth
              label="结束时间"
              type="datetime-local"
              value={policyClass.endTime || ''}
              onChange={handleTimeChange('endTime')}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="数据使用的结束时间"
            />
          </Box>
        );
      case 'usage_count':
        return (
          <TextField
            fullWidth
            label="最大使用次数"
            type="number"
            value={policyClass.maxUsageCount || 1}
            onChange={handleUsageCountChange}
            inputProps={{ min: 1 }}
            helperText="数据可以被使用的最大次数"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        资源策略管理
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        为资源定义使用策略，控制数据的访问和使用权限。
      </Typography>

      <Stack spacing={3}>
        {/* 资源选择区域 */}
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              选择资源
            </Typography>
            
            <Autocomplete
              options={resources}
              getOptionLabel={(option) => `${option.name} (${option.description})`}
              value={selectedResource}
              onChange={(_event, newValue) => setSelectedResource(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="选择要配置策略的资源"
                  placeholder="请选择资源"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      UUID: {option.uuid}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
            
            {selectedResource && (
              <Alert severity="info" sx={{ mt: 2 }}>
                已选择资源：<strong>{selectedResource.name}</strong>
                <br />
                UUID: {selectedResource.uuid}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 策略配置区域 */}
        {selectedResource && (
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                策略配置
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                选择并配置多个策略类别来创建组合策略
              </Typography>
              
              {/* 策略类别列表 */}
              {policyConfig.policyClasses.map((policyClass) => (
                <Card key={policyClass.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={policyClass.enabled}
                            onChange={() => handlePolicyClassToggle(policyClass.type)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {getPolicyTypeLabel(policyClass.type)}
                          </Typography>
                        }
                      />
                    </Box>
                    
                    {/* 策略参数配置 */}
                    {renderPolicyClassConfig(policyClass)}
                  </CardContent>
                </Card>
              ))}
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSavePolicy}
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  保存策略
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 策略规范显示区域 */}
        {selectedResource && idsPolicy && (
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                策略规范
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                gap: 2,
                mt: 2
              }}>
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, height: 'fit-content' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                      IDS 策略规范
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={idsPolicy}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          fontFamily: 'monospace', 
                          fontSize: '0.875rem',
                          borderRadius: 1
                        }
                      }}
                    />
                  </Paper>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, height: 'fit-content' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                      ODRL 策略规范
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={20}
                      value={odrlPolicy}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          fontFamily: 'monospace', 
                          fontSize: '0.875rem',
                          borderRadius: 1
                        }
                      }}
                    />
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default ResourcePolicyEdit;