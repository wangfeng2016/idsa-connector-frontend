import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Button,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Explore as ExploreIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

// 服务类型定义
interface Service {
  id: number;
  name: string;
  description: string;
  provider: string;
  category: 'data' | 'infrastructure' | 'security' | 'analytics';
  endpoints: string[];
  rating: number;
  reviews: number;
  tags: string[];
  status: 'active' | 'maintenance' | 'deprecated';
}

// 模拟数据
const mockServices: Service[] = [
  {
    id: 1,
    name: '数据清洗服务',
    description: '提供高效的数据清洗、标准化和转换功能，支持多种数据格式',
    provider: '数据服务提供商A',
    category: 'data',
    endpoints: ['https://api.example.com/data-cleaning', 'https://api.example.com/data-transform'],
    rating: 4.7,
    reviews: 42,
    tags: ['数据处理', '清洗', 'ETL'],
    status: 'active',
  },
  {
    id: 2,
    name: '数据空间连接器',
    description: '提供与其他数据空间的安全连接和数据交换功能',
    provider: '基础设施提供商B',
    category: 'infrastructure',
    endpoints: ['https://api.example.com/connector'],
    rating: 4.5,
    reviews: 28,
    tags: ['连接器', '数据交换', '互操作性'],
    status: 'active',
  },
  {
    id: 3,
    name: '数据加密服务',
    description: '提供端到端加密和安全数据传输功能',
    provider: '安全服务提供商C',
    category: 'security',
    endpoints: ['https://api.example.com/encryption', 'https://api.example.com/key-management'],
    rating: 4.9,
    reviews: 56,
    tags: ['加密', '安全', '密钥管理'],
    status: 'maintenance',
  },
  {
    id: 4,
    name: '数据分析引擎',
    description: '提供高性能的数据分析和可视化功能',
    provider: '分析服务提供商D',
    category: 'analytics',
    endpoints: ['https://api.example.com/analytics', 'https://api.example.com/visualization'],
    rating: 4.3,
    reviews: 35,
    tags: ['分析', '可视化', '报表'],
    status: 'active',
  },
];

const ServiceDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [services] = useState<Service[]>(mockServices);

  // 获取类别颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data':
        return 'primary';
      case 'infrastructure':
        return 'secondary';
      case 'security':
        return 'error';
      case 'analytics':
        return 'success';
      default:
        return 'default';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'deprecated':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'data':
        return '数据服务';
      case 'infrastructure':
        return '基础设施';
      case 'security':
        return '安全服务';
      case 'analytics':
        return '分析服务';
      default:
        return category;
    }
  };

  // 获取状态名称
  const getStatusName = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'maintenance':
        return '维护中';
      case 'deprecated':
        return '已弃用';
      default:
        return status;
    }
  };

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data':
        return <StorageIcon />;
      case 'infrastructure':
        return <ApiIcon />;
      case 'security':
        return <SecurityIcon />;
      case 'analytics':
        return <CategoryIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <ExploreIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        服务发现
      </Typography>

      {/* 搜索和筛选 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          '& > *': {
            flex: '1 1 200px',
            minWidth: 200
          },
          '& > *:first-of-type': {
            flex: '2 1 300px'
          }
        }}
      >
        <TextField
          fullWidth
          placeholder="搜索服务名称、描述或提供商..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl fullWidth>
          <InputLabel>服务类别</InputLabel>
          <Select
            value={categoryFilter}
            label="服务类别"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="data">数据服务</MenuItem>
            <MenuItem value="infrastructure">基础设施</MenuItem>
            <MenuItem value="security">安全服务</MenuItem>
            <MenuItem value="analytics">分析服务</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>状态</InputLabel>
          <Select
            value={statusFilter}
            label="状态"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="active">活跃</MenuItem>
            <MenuItem value="maintenance">维护中</MenuItem>
            <MenuItem value="deprecated">已弃用</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 服务列表 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          '& > *': {
            flex: '1 1 400px',
            minWidth: 400,
            maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }
          }
        }}
      >
        {services.map((service) => (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" noWrap>
                    {service.name}
                  </Typography>
                  <Chip
                    label={getCategoryName(service.category)}
                    color={getCategoryColor(service.category)}
                    size="small"
                    icon={getCategoryIcon(service.category)}
                  />
                </Box>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <CategoryIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="textSecondary">
                    提供商：{service.provider}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating
                    value={service.rating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    ({service.reviews}条评价)
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  API端点：
                </Typography>
                <List dense>
                  {service.endpoints.map((endpoint, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={endpoint}
                        primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box display="flex" flexWrap="wrap" gap={1} my={1}>
                  {service.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      icon={<LocalOfferIcon />}
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Chip
                    label={getStatusName(service.status)}
                    color={getStatusColor(service.status)}
                    size="small"
                  />
                  <Button variant="contained" size="small">
                    查看详情
                  </Button>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* 分页 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={3} color="primary" />
      </Box>
    </Box>
  );
};

export default ServiceDiscovery;