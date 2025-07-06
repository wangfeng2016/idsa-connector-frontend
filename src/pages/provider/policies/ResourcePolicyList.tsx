import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Policy as PolicyIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Numbers as NumbersIcon,
} from '@mui/icons-material';

// 策略类型定义
type PolicyType = 'specific_consumer' | 'specific_connector' | 'time_limit' | 'usage_count';

// 资源策略接口
interface ResourcePolicy {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  businessType: string;
  domain: string;
  owner: string;
  policyType: PolicyType;
  policyClass: string;
  policyDetails: {
    consumer?: string;
    connector?: string;
    startTime?: string;
    endTime?: string;
    maxUsageCount?: number;
  };
  createdAt: string;
  status: 'active' | 'inactive' | 'expired';
}

// 模拟资源策略数据
const mockResourcePolicies: ResourcePolicy[] = [
  {
    id: 'policy-001',
    resourceId: 'resource-001',
    resourceName: '客户交易数据',
    resourceDescription: '包含客户的历史交易记录和行为分析数据',
    businessType: '金融服务',
    domain: 'finance',
    owner: '数据管理部',
    policyType: 'specific_consumer',
    policyClass: '限制使用者',
    policyDetails: {
      consumer: 'ABC银行数据分析部门'
    },
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 'policy-002',
    resourceId: 'resource-002',
    resourceName: '产品销售数据',
    resourceDescription: '各产品线的销售数据和市场表现指标',
    businessType: '零售电商',
    domain: 'retail',
    owner: '销售部',
    policyType: 'time_limit',
    policyClass: '限制使用时间',
    policyDetails: {
      startTime: '2024-01-01T00:00',
      endTime: '2024-12-31T23:59'
    },
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: 'policy-003',
    resourceId: 'resource-003',
    resourceName: '用户行为数据',
    resourceDescription: '用户在平台上的浏览、点击、购买等行为数据',
    businessType: '互联网服务',
    domain: 'internet',
    owner: '产品部',
    policyType: 'usage_count',
    policyClass: '使用次数限制',
    policyDetails: {
      maxUsageCount: 1000
    },
    createdAt: '2024-02-01',
    status: 'active'
  },
  {
    id: 'policy-004',
    resourceId: 'resource-004',
    resourceName: '供应链数据',
    resourceDescription: '供应商信息、采购记录和库存管理数据',
    businessType: '制造业',
    domain: 'manufacturing',
    owner: '采购部',
    policyType: 'specific_connector',
    policyClass: '指定连接器',
    policyDetails: {
      connector: 'SAP连接器'
    },
    createdAt: '2024-02-10',
    status: 'active'
  },
  {
    id: 'policy-005',
    resourceId: 'resource-005',
    resourceName: '医疗诊断数据',
    resourceDescription: '患者诊断记录和医疗影像数据',
    businessType: '医疗健康',
    domain: 'healthcare',
    owner: '医疗信息部',
    policyType: 'specific_consumer',
    policyClass: '限制使用者',
    policyDetails: {
      consumer: '合作医院研究中心'
    },
    createdAt: '2024-02-15',
    status: 'active'
  },
  {
    id: 'policy-006',
    resourceId: 'resource-006',
    resourceName: '物流运输数据',
    resourceDescription: '货物运输路线、时效和成本数据',
    businessType: '物流运输',
    domain: 'logistics',
    owner: '运营部',
    policyType: 'time_limit',
    policyClass: '限制使用时间',
    policyDetails: {
      startTime: '2024-03-01T00:00',
      endTime: '2024-06-30T23:59'
    },
    createdAt: '2024-02-20',
    status: 'expired'
  }
];

// 排序选项
const sortOptions = [
  { value: 'businessType', label: '按业务类型排序' },
  { value: 'policyClass', label: '按策略类型排序' },
  { value: 'createdAt', label: '按创建时间排序' },
  { value: 'resourceName', label: '按资源名称排序' }
];

// 策略类型图标映射
const policyTypeIcons = {
  specific_consumer: <PersonIcon />,
  specific_connector: <LinkIcon />,
  time_limit: <ScheduleIcon />,
  usage_count: <NumbersIcon />
};

// 状态颜色映射
const statusColors = {
  active: 'success',
  inactive: 'warning',
  expired: 'error'
} as const;

// 状态标签映射
const statusLabels = {
  active: '生效中',
  inactive: '未激活',
  expired: '已过期'
};

const ResourcePolicyList: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('businessType');

  // 排序后的数据
  const sortedPolicies = useMemo(() => {
    const sorted = [...mockResourcePolicies].sort((a, b) => {
      switch (sortBy) {
        case 'businessType':
          return a.businessType.localeCompare(b.businessType);
        case 'policyClass':
          return a.policyClass.localeCompare(b.policyClass);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'resourceName':
        return a.resourceName.localeCompare(b.resourceName);
        default:
          return 0;
      }
    });
    return sorted;
  }, [sortBy]);

  // 格式化策略详情
  const formatPolicyDetails = (policy: ResourcePolicy) => {
    const { policyType, policyDetails } = policy;
    switch (policyType) {
      case 'specific_consumer':
        return `指定消费者: ${policyDetails.consumer}`;
      case 'specific_connector':
        return `指定连接器: ${policyDetails.connector}`;
      case 'time_limit':
        return `时间限制: ${policyDetails.startTime} 至 ${policyDetails.endTime}`;
      case 'usage_count':
        return `使用次数限制: ${policyDetails.maxUsageCount} 次`;
      default:
        return '未知策略类型';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        资源策略列表
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        查看所有已配置策略的资源，支持按不同维度排序浏览
      </Typography>

      {/* 排序控制 */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              排序方式
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>选择排序方式</InputLabel>
              <Select
                value={sortBy}
                label="选择排序方式"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 策略列表 */}
      <Stack spacing={2}>
        {sortedPolicies.map((policy) => (
          <Card 
            key={policy.id} 
            sx={{ 
              borderRadius: 2, 
              boxShadow: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* 左侧：资源信息 */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <StorageIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {policy.resourceName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {policy.resourceDescription}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<BusinessIcon />}
                      label={policy.businessType}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label={policy.domain}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip 
                      label={`负责人: ${policy.owner}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

                {/* 右侧：策略信息 */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <PolicyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {policy.policyClass}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        策略ID: {policy.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {policyTypeIcons[policy.policyType]}
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        策略详情
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {formatPolicyDetails(policy)}
                    </Typography>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={statusLabels[policy.status]}
                      color={statusColors[policy.status]}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      创建时间: {policy.createdAt}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* 统计信息 */}
      <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            统计信息
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              label={`总计: ${mockResourcePolicies.length} 个策略`}
              color="primary"
            />
            <Chip 
              label={`生效中: ${mockResourcePolicies.filter(p => p.status === 'active').length} 个`}
              color="success"
            />
            <Chip 
              label={`已过期: ${mockResourcePolicies.filter(p => p.status === 'expired').length} 个`}
              color="error"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResourcePolicyList;