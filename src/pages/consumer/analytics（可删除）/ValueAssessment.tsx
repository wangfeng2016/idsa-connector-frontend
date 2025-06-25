import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  BarChart as BarChartIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

// 价值评估类型定义
interface ValueAssessmentItem {
  id: number;
  assetName: string;
  assetType: 'data' | 'service' | 'application';
  monetaryValue: number;
  nonMonetaryValue: number;
  riskScore: number;
  qualityScore: number;
  usageCount: number;
  lastAssessment: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

// 模拟数据
const mockAssessments: ValueAssessmentItem[] = [
  {
    id: 1,
    assetName: '企业信用数据集',
    assetType: 'data',
    monetaryValue: 50000,
    nonMonetaryValue: 85,
    riskScore: 15,
    qualityScore: 92,
    usageCount: 128,
    lastAssessment: '2024-06-01',
    trend: 'up',
    trendPercentage: 12,
  },
  {
    id: 2,
    assetName: '数据清洗服务',
    assetType: 'service',
    monetaryValue: 35000,
    nonMonetaryValue: 75,
    riskScore: 8,
    qualityScore: 88,
    usageCount: 95,
    lastAssessment: '2024-06-02',
    trend: 'stable',
    trendPercentage: 0,
  },
  {
    id: 3,
    assetName: '数据可视化应用',
    assetType: 'application',
    monetaryValue: 25000,
    nonMonetaryValue: 70,
    riskScore: 12,
    qualityScore: 85,
    usageCount: 210,
    lastAssessment: '2024-06-03',
    trend: 'down',
    trendPercentage: 5,
  },
  {
    id: 4,
    assetName: '市场分析数据集',
    assetType: 'data',
    monetaryValue: 45000,
    nonMonetaryValue: 80,
    riskScore: 18,
    qualityScore: 90,
    usageCount: 156,
    lastAssessment: '2024-06-04',
    trend: 'up',
    trendPercentage: 8,
  },
];

// 总体价值统计
const valueStats = {
  totalMonetaryValue: 155000,
  avgQualityScore: 88.75,
  totalAssets: 4,
  avgRiskScore: 13.25,
};

const ValueAssessment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [assessments] = useState<ValueAssessmentItem[]>(mockAssessments);

  // 获取资产类型颜色
  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'data':
        return 'primary';
      case 'service':
        return 'secondary';
      case 'application':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取资产类型名称
  const getAssetTypeName = (type: string) => {
    switch (type) {
      case 'data':
        return '数据';
      case 'service':
        return '服务';
      case 'application':
        return '应用';
      default:
        return type;
    }
  };

  // 获取趋势图标和颜色
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpwardIcon sx={{ color: 'success.main' }} />;
      case 'down':
        return <ArrowDownwardIcon sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  // 格式化货币
  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据资产价值评估
      </Typography>

      {/* 统计卡片 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
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
              总货币价值
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{formatCurrency(valueStats.totalMonetaryValue)}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(76, 175, 80, 0.9)' }}>
              <MonetizationOnIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: 18 }} />
              所有资产评估总价值
            </Typography>
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
              平均质量评分
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>{valueStats.avgQualityScore}</Typography>
              <Typography variant="body1">/100</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={valueStats.avgQualityScore}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4caf50'
                }
              }}
            />
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
              评估资产数
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{valueStats.totalAssets}</Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              <Chip label="数据: 2" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="服务: 1" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="应用: 1" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(250, 112, 154, 0.4)'
            }
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              平均风险评分
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>{valueStats.avgRiskScore}</Typography>
              <Typography variant="body1">/100</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={valueStats.avgRiskScore}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#f44336'
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* 搜索和筛选 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
          alignItems: 'stretch'
        }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' }, minWidth: '280px' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索资产名称..."
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
        
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' }, minWidth: '200px' }}>
          <FormControl fullWidth>
            <InputLabel>资产类型</InputLabel>
            <Select
              value={typeFilter}
              label="资产类型"
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="data">数据</MenuItem>
              <MenuItem value="service">服务</MenuItem>
              <MenuItem value="application">应用</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 评估表格 */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>资产名称</TableCell>
              <TableCell>类型</TableCell>
              <TableCell align="right">货币价值</TableCell>
              <TableCell align="right">非货币价值</TableCell>
              <TableCell align="right">质量评分</TableCell>
              <TableCell align="right">风险评分</TableCell>
              <TableCell align="right">使用次数</TableCell>
              <TableCell align="right">价值趋势</TableCell>
              <TableCell align="right">最近评估</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>
                  <Chip
                    label={getAssetTypeName(item.assetType)}
                    color={getAssetTypeColor(item.assetType)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{formatCurrency(item.monetaryValue)}</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography variant="body2" sx={{ mr: 1 }}>{item.nonMonetaryValue}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.nonMonetaryValue}
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography variant="body2" sx={{ mr: 1 }}>{item.qualityScore}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.qualityScore}
                      color="success"
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <Typography variant="body2" sx={{ mr: 1 }}>{item.riskScore}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.riskScore}
                      color="error"
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{item.usageCount}</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {getTrendIcon(item.trend)}
                    <Typography
                      variant="body2"
                      color={item.trend === 'up' ? 'success.main' : item.trend === 'down' ? 'error.main' : 'text.secondary'}
                      sx={{ ml: 0.5 }}
                    >
                      {item.trend === 'stable' ? '稳定' : `${item.trendPercentage}%`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{item.lastAssessment}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined">
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<BarChartIcon />}
          sx={{ mr: 2 }}
        >
          生成报告
        </Button>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
        >
          重新评估
        </Button>
      </Box>
    </Box>
  );
};

export default ValueAssessment;