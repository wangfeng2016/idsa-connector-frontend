import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  Download,
  People,
  AttachMoney,
  Dataset,
  Share,
  Analytics,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// 数据集使用统计接口
interface DatasetUsage {
  id: string;
  name: string;
  category: string;
  downloadCount: number;
  consumerCount: number;
  revenue: number;
  lastAccessed: string;
  popularityTrend: 'up' | 'down' | 'stable';
  description: string;
}

// 总体统计接口
interface OverallStats {
  totalDatasets: number;
  totalDownloads: number;
  totalConsumers: number;
  totalRevenue: number;
  platformCommission: number;
  netRevenue: number;
}

// 时间段选项
type TimePeriod = 'week' | 'month' | 'quarter';

const DatasetUsageAnalysis: React.FC = () => {
  const theme = useTheme();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalDatasets: 0,
    totalDownloads: 0,
    totalConsumers: 0,
    totalRevenue: 0,
    platformCommission: 0,
    netRevenue: 0,
  });
  const [datasetUsages, setDatasetUsages] = useState<DatasetUsage[]>([]);

  // 模拟数据生成
  const generateMockData = (period: TimePeriod) => {
    const multiplier = period === 'week' ? 0.25 : period === 'month' ? 1 : 3;
    
    const mockDatasets: DatasetUsage[] = [
      {
        id: '1',
        name: '车辆行驶轨迹数据集',
        category: '行驶数据',
        downloadCount: Math.floor(156 * multiplier),
        consumerCount: Math.floor(23 * multiplier),
        revenue: Math.floor(45600 * multiplier),
        lastAccessed: '2024-01-15',
        popularityTrend: 'up',
        description: '包含GPS轨迹、速度、加速度等实时行驶数据',
      },
      {
        id: '2',
        name: '发动机性能测试数据',
        category: '研发数据',
        downloadCount: Math.floor(89 * multiplier),
        consumerCount: Math.floor(12 * multiplier),
        revenue: Math.floor(67800 * multiplier),
        lastAccessed: '2024-01-14',
        popularityTrend: 'stable',
        description: '发动机台架测试数据，包含功率、扭矩、油耗等指标',
      },
      {
        id: '3',
        name: '市场销售数据分析',
        category: '市场数据',
        downloadCount: Math.floor(234 * multiplier),
        consumerCount: Math.floor(34 * multiplier),
        revenue: Math.floor(89200 * multiplier),
        lastAccessed: '2024-01-13',
        popularityTrend: 'up',
        description: '各地区销售数据、用户画像、市场趋势分析',
      },
      {
        id: '4',
        name: '供应链物流数据',
        category: '供应链数据',
        downloadCount: Math.floor(67 * multiplier),
        consumerCount: Math.floor(8 * multiplier),
        revenue: Math.floor(23400 * multiplier),
        lastAccessed: '2024-01-12',
        popularityTrend: 'down',
        description: '零部件供应、物流配送、库存管理等数据',
      },
      {
        id: '5',
        name: '生产线效率数据',
        category: '生产制造数据',
        downloadCount: Math.floor(123 * multiplier),
        consumerCount: Math.floor(18 * multiplier),
        revenue: Math.floor(56700 * multiplier),
        lastAccessed: '2024-01-11',
        popularityTrend: 'stable',
        description: '生产线运行效率、设备状态、质量控制数据',
      },
      {
        id: '6',
        name: '智能驾驶算法数据',
        category: '研发数据',
        downloadCount: Math.floor(198 * multiplier),
        consumerCount: Math.floor(28 * multiplier),
        revenue: Math.floor(134500 * multiplier),
        lastAccessed: '2024-01-10',
        popularityTrend: 'up',
        description: '自动驾驶算法训练数据、传感器融合数据',
      },
    ];

    const totalDownloads = mockDatasets.reduce((sum, item) => sum + item.downloadCount, 0);
    const totalConsumers = mockDatasets.reduce((sum, item) => sum + item.consumerCount, 0);
    const totalRevenue = mockDatasets.reduce((sum, item) => sum + item.revenue, 0);
    const platformCommission = Math.floor(totalRevenue * 0.15); // 15%平台分成
    const netRevenue = totalRevenue - platformCommission;

    setDatasetUsages(mockDatasets);
    setOverallStats({
      totalDatasets: mockDatasets.length,
      totalDownloads,
      totalConsumers,
      totalRevenue,
      platformCommission,
      netRevenue,
    });
  };

  useEffect(() => {
    generateMockData(timePeriod);
  }, [timePeriod]);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: theme.palette.success.main }} />;
      case 'down':
        return <TrendingUp sx={{ color: theme.palette.error.main, transform: 'rotate(180deg)' }} />;
      default:
        return <TrendingUp sx={{ color: theme.palette.info.main, transform: 'rotate(90deg)' }} />;
    }
  };

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'week':
        return '过去一周';
      case 'month':
        return '过去一月';
      case 'quarter':
        return '过去一季度';
      default:
        return '过去一月';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 页面标题和时间选择器 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
          数据集使用分析
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>时间范围</InputLabel>
          <Select
            value={timePeriod}
            label="时间范围"
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
          >
            <MenuItem value="week">过去一周</MenuItem>
            <MenuItem value="month">过去一月</MenuItem>
            <MenuItem value="quarter">过去一季度</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 总体统计卡片 */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 4,
        '& > *': {
          flex: '1 1 300px',
          minWidth: '250px'
        }
      }}>
        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Dataset />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {overallStats.totalDatasets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  提供的数据集总数
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Download />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {overallStats.totalDownloads.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  总下载次数
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <People />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {overallStats.totalConsumers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  数据消费者总数
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 收入统计卡片 */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 4,
        '& > *': {
          flex: '1 1 300px',
          minWidth: '250px'
        }
      }}>
        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {formatCurrency(overallStats.totalRevenue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  总收入
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Share />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {formatCurrency(overallStats.platformCommission)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  平台分成 (15%)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: theme.palette.primary.light }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Analytics />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                  {formatCurrency(overallStats.netRevenue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  净收入
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 数据集详细使用情况 */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.dark }}>
            数据集使用详情 - {getTimePeriodLabel(timePeriod)}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {datasetUsages.map((dataset) => (
              <Card key={dataset.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* 数据集基本信息 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {dataset.name}
                        </Typography>
                        <Chip 
                          label={dataset.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Tooltip title={`趋势: ${dataset.popularityTrend === 'up' ? '上升' : dataset.popularityTrend === 'down' ? '下降' : '稳定'}`}>
                          <IconButton size="small">
                            {getTrendIcon(dataset.popularityTrend)}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {dataset.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        最后访问: {dataset.lastAccessed}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* 使用统计 */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3,
                    '& > *': {
                      flex: '1 1 150px',
                      minWidth: '120px'
                    }
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                        {dataset.downloadCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        下载次数
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                        {dataset.consumerCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        消费者数量
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                        {formatCurrency(dataset.revenue)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        产生收入
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                        {formatCurrency(Math.floor(dataset.revenue * 0.85))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        净收入
                      </Typography>
                    </Box>
                  </Box>

                  {/* 收入进度条 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">收入占比</Typography>
                      <Typography variant="body2">
                        {((dataset.revenue / overallStats.totalRevenue) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dataset.revenue / overallStats.totalRevenue) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DatasetUsageAnalysis;