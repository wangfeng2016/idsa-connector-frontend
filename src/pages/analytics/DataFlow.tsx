import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  CompareArrows as CompareArrowsIcon,
  Storage as StorageIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarTodayIcon,
  Speed as SpeedIcon,
  DataUsage as DataUsageIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// 数据流类型定义
interface DataFlowItem {
  id: number;
  name: string;
  source: string;
  destination: string;
  dataType: string;
  frequency: string;
  volume: string;
  status: 'active' | 'paused' | 'failed';
  lastTransfer: string;
  transferRate: string;
}

// 模拟数据
const mockDataFlows: DataFlowItem[] = [
  {
    id: 1,
    name: '企业信用数据同步',
    source: '数据提供商A',
    destination: '数据消费者X',
    dataType: '结构化数据',
    frequency: '每日',
    volume: '2.5 GB',
    status: 'active',
    lastTransfer: '2024-06-05 08:30',
    transferRate: '15 MB/s',
  },
  {
    id: 2,
    name: '市场分析数据传输',
    source: '分析服务B',
    destination: '企业客户Y',
    dataType: '半结构化数据',
    frequency: '每周',
    volume: '5 GB',
    status: 'active',
    lastTransfer: '2024-06-01 10:15',
    transferRate: '12 MB/s',
  },
  {
    id: 3,
    name: '传感器数据流',
    source: 'IoT平台C',
    destination: '分析引擎Z',
    dataType: '时序数据',
    frequency: '实时',
    volume: '500 MB/小时',
    status: 'paused',
    lastTransfer: '2024-06-04 15:45',
    transferRate: '8 MB/s',
  },
  {
    id: 4,
    name: '文档数据交换',
    source: '内容管理系统D',
    destination: '归档系统W',
    dataType: '非结构化数据',
    frequency: '每月',
    volume: '10 GB',
    status: 'failed',
    lastTransfer: '2024-05-30 09:00',
    transferRate: '0 MB/s',
  },
];

// 数据流统计
const flowStats = {
  totalFlows: 4,
  activeFlows: 2,
  pausedFlows: 1,
  failedFlows: 1,
  totalVolume: '18 GB',
  avgTransferRate: '8.75 MB/s',
};

const DataFlow = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataFlows] = useState<DataFlowItem[]>(mockDataFlows);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取状态名称
  const getStatusName = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'paused':
        return '已暂停';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  return (
    // 数据分析模块可采用相同布局配置
    <Box sx={{
      width: '100%',
      p: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2
    }}>
 
      <Typography variant="h4" gutterBottom>
        <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据流分析
      </Typography>

      {/* 统计卡片 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' },
            minWidth: { xs: '100%', sm: '280px', md: '220px' }
          }
        }}
      >
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              数据流总数
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{flowStats.totalFlows}</Typography>
            <Box display="flex" mt={1}>
              <Chip label={`活跃: ${flowStats.activeFlows}`} size="small" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: 'white', mr: 1 }} />
              <Chip label={`暂停: ${flowStats.pausedFlows}`} size="small" sx={{ backgroundColor: 'rgba(255, 152, 0, 0.2)', color: 'white', mr: 1 }} />
              <Chip label={`失败: ${flowStats.failedFlows}`} size="small" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', color: 'white' }} />
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(240, 147, 251, 0.4)'
            }
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              总数据量
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{flowStats.totalVolume}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <DataUsageIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              所有数据流累计传输量
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(79, 172, 254, 0.4)'
            }
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              平均传输速率
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{flowStats.avgTransferRate}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <SpeedIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              所有活跃数据流平均值
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 搜索和筛选 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          alignItems: 'stretch'
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' }, minWidth: '280px' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索数据流..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 20%' }, minWidth: '180px' }}>
          <FormControl fullWidth>
            <InputLabel>状态筛选</InputLabel>
            <Select
              value={statusFilter}
              label="状态筛选"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuItem value="all">全部状态</MenuItem>
              <MenuItem value="active">活跃</MenuItem>
              <MenuItem value="paused">暂停</MenuItem>
              <MenuItem value="failed">失败</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 数据流列表 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {dataFlows.map((flow) => (
          <Box key={flow.id}>
            <Card
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 33.333%' } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6">{flow.name}</Typography>
                      <Chip
                        label={getStatusName(flow.status)}
                        color={getStatusColor(flow.status)}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StorageIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        数据类型: {flow.dataType}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingUpIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        频率: {flow.frequency}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <DataUsageIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        数据量: {flow.volume}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 41.667%' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Box sx={{ textAlign: 'center', width: '40%' }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          来源
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {flow.source}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon sx={{ mx: 2 }} />
                      <Box sx={{ textAlign: 'center', width: '40%' }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          目标
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {flow.destination}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 25%' } }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarTodayIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        最近传输: {flow.lastTransfer}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <SpeedIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary">
                        传输速率: {flow.transferRate}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CompareArrowsIcon />}
                      >
                        查看详情
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DataFlow;