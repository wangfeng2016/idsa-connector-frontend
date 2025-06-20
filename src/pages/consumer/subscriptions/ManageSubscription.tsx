import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Dataset as DatasetIcon,
  CalendarToday as CalendarTodayIcon,
  CloudDownload as CloudDownloadIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';
import ResponsiveContainer from '../../../layouts/ResponsiveContainer';

// 订阅状态类型
type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'pending';

// 订阅记录接口
interface SubscriptionRecord {
  id: string;
  datasetName: string;
  datasetUuid: string;
  providerName: string;
  providerId: string;
  subscriptionDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  dataTransferred: number; // MB
  monthlyQuota: number; // MB
  contractSummary: string;
  pricePerMonth: number;
  currency: string;
  lastAccessDate: string;
  accessCount: number;
}

// 模拟订阅数据
const mockSubscriptions: SubscriptionRecord[] = [
  {
    id: 'SUB-2024-001',
    datasetName: '生产线实时监控数据集',
    datasetUuid: 'DS-PROD-2024-0156',
    providerName: '智能制造数据中心',
    providerId: 'ORG-2024-001',
    subscriptionDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'active',
    dataTransferred: 2450,
    monthlyQuota: 5000,
    contractSummary: '仅限内部研发使用，包含温度、压力、振动传感器数据',
    pricePerMonth: 8500,
    currency: 'CNY',
    lastAccessDate: '2024-12-20',
    accessCount: 1247,
  },
  {
    id: 'SUB-2024-002',
    datasetName: '供应链物流追踪数据',
    datasetUuid: 'DS-SCM-2024-0089',
    providerName: '全球物流数据平台',
    providerId: 'ORG-2024-002',
    subscriptionDate: '2024-02-20',
    expiryDate: '2025-02-20',
    status: 'active',
    dataTransferred: 1820,
    monthlyQuota: 3000,
    contractSummary: '供应链优化分析使用，包含运输路径、时效、成本数据',
    pricePerMonth: 6200,
    currency: 'CNY',
    lastAccessDate: '2024-12-19',
    accessCount: 892,
  },
  {
    id: 'SUB-2024-003',
    datasetName: '市场消费行为分析数据',
    datasetUuid: 'DS-MKT-2024-0234',
    providerName: '消费者洞察研究院',
    providerId: 'ORG-2024-003',
    subscriptionDate: '2024-03-10',
    expiryDate: '2024-12-10',
    status: 'expired',
    dataTransferred: 4200,
    monthlyQuota: 8000,
    contractSummary: '市场研究和产品开发使用，包含消费偏好、购买行为数据',
    pricePerMonth: 12000,
    currency: 'CNY',
    lastAccessDate: '2024-12-08',
    accessCount: 2156,
  },
  {
    id: 'SUB-2024-004',
    datasetName: '能源消耗优化数据集',
    datasetUuid: 'DS-ENE-2024-0178',
    providerName: '绿色能源数据中心',
    providerId: 'ORG-2024-004',
    subscriptionDate: '2024-04-05',
    expiryDate: '2025-04-05',
    status: 'suspended',
    dataTransferred: 980,
    monthlyQuota: 2000,
    contractSummary: '节能减排项目使用，包含设备能耗、效率优化数据',
    pricePerMonth: 4500,
    currency: 'CNY',
    lastAccessDate: '2024-11-15',
    accessCount: 456,
  },
  {
    id: 'SUB-2024-005',
    datasetName: '质量检测标准数据库',
    datasetUuid: 'DS-QUA-2024-0312',
    providerName: '质量认证机构',
    providerId: 'ORG-2024-005',
    subscriptionDate: '2024-05-12',
    expiryDate: '2025-05-12',
    status: 'pending',
    dataTransferred: 0,
    monthlyQuota: 1500,
    contractSummary: '产品质量控制使用，包含检测标准、合格率数据',
    pricePerMonth: 3800,
    currency: 'CNY',
    lastAccessDate: '-',
    accessCount: 0,
  },
  {
    id: 'SUB-2024-006',
    datasetName: '客户服务交互数据',
    datasetUuid: 'DS-CUS-2024-0445',
    providerName: '客户体验研究中心',
    providerId: 'ORG-2024-006',
    subscriptionDate: '2024-06-18',
    expiryDate: '2025-06-18',
    status: 'active',
    dataTransferred: 3100,
    monthlyQuota: 4000,
    contractSummary: '客户满意度提升使用，包含服务记录、反馈评价数据',
    pricePerMonth: 5500,
    currency: 'CNY',
    lastAccessDate: '2024-12-21',
    accessCount: 1678,
  },
  {
    id: 'SUB-2024-007',
    datasetName: '财务风险评估数据',
    datasetUuid: 'DS-FIN-2024-0567',
    providerName: '金融风控数据服务',
    providerId: 'ORG-2024-007',
    subscriptionDate: '2024-07-25',
    expiryDate: '2025-07-25',
    status: 'active',
    dataTransferred: 1650,
    monthlyQuota: 2500,
    contractSummary: '投资决策支持使用，包含信用评级、风险指标数据',
    pricePerMonth: 7200,
    currency: 'CNY',
    lastAccessDate: '2024-12-18',
    accessCount: 734,
  },
  {
    id: 'SUB-2024-008',
    datasetName: '人力资源分析数据',
    datasetUuid: 'DS-HR-2024-0689',
    providerName: '人才发展研究院',
    providerId: 'ORG-2024-008',
    subscriptionDate: '2024-08-30',
    expiryDate: '2025-08-30',
    status: 'active',
    dataTransferred: 890,
    monthlyQuota: 1200,
    contractSummary: '人才管理优化使用，包含绩效评估、培训效果数据',
    pricePerMonth: 2800,
    currency: 'CNY',
    lastAccessDate: '2024-12-17',
    accessCount: 312,
  },
];

const ManageSubscription: React.FC = () => {
  const theme = useTheme();
  const [subscriptions] = useState<SubscriptionRecord[]>(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionRecord[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const itemsPerPage = 5;

  // 过滤订阅数据
  React.useEffect(() => {
    let filtered = subscriptions;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.datasetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subscriptions]);

  // 分页数据
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  // 获取状态颜色和图标
  const getStatusConfig = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return {
          color: 'success' as const,
          label: '活跃',
          icon: <CheckCircleIcon fontSize="small" />,
        };
      case 'expired':
        return {
          color: 'error' as const,
          label: '已过期',
          icon: <ErrorIcon fontSize="small" />,
        };
      case 'suspended':
        return {
          color: 'warning' as const,
          label: '已暂停',
          icon: <WarningIcon fontSize="small" />,
        };
      case 'pending':
        return {
          color: 'default' as const,
          label: '待激活',
          icon: <ScheduleIcon fontSize="small" />,
        };
      default:
        return {
          color: 'default' as const,
          label: '未知',
          icon: <ScheduleIcon fontSize="small" />,
        };
    }
  };

  // 格式化数据大小
  const formatDataSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  // 计算使用率
  const getUsagePercentage = (transferred: number, quota: number) => {
    return Math.round((transferred / quota) * 100);
  };

  // 处理详情点击
  const handleDetailClick = () => {
    setShowDetailDialog(true);
  };

  return (
    <ResponsiveContainer maxWidth="95%">
      <Box sx={{ p: 3 }}>
        {/* 页面标题 */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          订阅管理
        </Typography>

        {/* 统计概览 */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {subscriptions.filter(s => s.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                活跃订阅
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {subscriptions.filter(s => s.status === 'expired').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已过期
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {subscriptions.filter(s => s.status === 'suspended').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已暂停
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                ¥{subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.pricePerMonth, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                月度费用
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* 搜索和过滤 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="搜索数据集名称、提供方或订阅ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, minWidth: 300 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>状态筛选</InputLabel>
                <Select
                  value={statusFilter}
                  label="状态筛选"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="active">活跃</MenuItem>
                  <MenuItem value="expired">已过期</MenuItem>
                  <MenuItem value="suspended">已暂停</MenuItem>
                  <MenuItem value="pending">待激活</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* 订阅列表 */}
        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>数据集信息</TableCell>
                    <TableCell>提供方</TableCell>
                    <TableCell>订阅时间</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>数据传输</TableCell>
                    <TableCell>月费用</TableCell>
                    <TableCell>合同描述</TableCell>
                    <TableCell align="center">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSubscriptions.map((subscription) => {
                    const statusConfig = getStatusConfig(subscription.status);
                    const usagePercentage = getUsagePercentage(subscription.dataTransferred, subscription.monthlyQuota);
                    
                    return (
                      <TableRow key={subscription.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {subscription.datasetName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <DatasetIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {subscription.datasetUuid}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{subscription.providerName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              <BusinessIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {subscription.providerId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {subscription.subscriptionDate}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              到期: {subscription.expiryDate}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              <CloudDownloadIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                              {formatDataSize(subscription.dataTransferred)} / {formatDataSize(subscription.monthlyQuota)}
                            </Typography>
                            <Typography variant="caption" color={usagePercentage > 80 ? 'error' : 'text.secondary'}>
                              使用率: {usagePercentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            ¥{subscription.pricePerMonth.toLocaleString()}/{subscription.currency === 'CNY' ? '月' : 'month'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={subscription.contractSummary}
                          >
                            <GavelIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {subscription.contractSummary}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={handleDetailClick}
                          >
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* 无数据提示 */}
            {filteredSubscriptions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  暂无订阅记录
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  请尝试调整搜索条件或状态筛选
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* 详情对话框 */}
        <Dialog
          open={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>订阅详情</DialogTitle>
          <DialogContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: 200,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              border: `2px dashed ${theme.palette.warning.main}`
            }}>
              <Typography variant="h6" color="warning.main">
                🚧 功能建设中 (Under Construction)
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ResponsiveContainer>
  );
};

export default ManageSubscription;