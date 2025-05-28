import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
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
  Rating,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// 市场资产类型
interface MarketItem {
  id: number;
  title: string;
  description: string;
  type: 'data' | 'service' | 'app';
  provider: string;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  imageUrl: string;
}

// 模拟数据
const mockItems: MarketItem[] = [
  {
    id: 1,
    title: '企业信用数据集',
    description: '全面的企业信用评估数据，包含信用评分、风险指标等信息',
    type: 'data',
    provider: '数据提供商A',
    price: 1000,
    rating: 4.5,
    reviews: 28,
    tags: ['金融', '企业数据', '信用评估'],
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234CAF50"/><text x="50" y="50" font-size="12" fill="white" text-anchor="middle" dy=".3em">企业数据</text></svg>',
  },
  {
    id: 2,
    title: '数据清洗服务',
    description: '专业的数据清洗和标准化服务，提高数据质量',
    type: 'service',
    provider: '服务提供商B',
    price: 500,
    rating: 4.8,
    reviews: 45,
    tags: ['数据处理', '数据质量', '服务'],
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232196F3"/><text x="50" y="50" font-size="12" fill="white" text-anchor="middle" dy=".3em">数据服务</text></svg>',
  },
  {
    id: 3,
    title: '数据可视化应用',
    description: '强大的数据可视化工具，支持多种图表类型和交互方式',
    type: 'app',
    provider: '应用开发商C',
    price: 299,
    rating: 4.2,
    reviews: 156,
    tags: ['可视化', '分析工具', '应用'],
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FF5722"/><text x="50" y="50" font-size="12" fill="white" text-anchor="middle" dy=".3em">应用工具</text></svg>',
  },
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('all');
  const [items] = useState<MarketItem[]>(mockItems);

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'data':
        return 'primary';
      case 'service':
        return 'secondary';
      case 'app':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取类型中文名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'data':
        return '数据';
      case 'service':
        return '服务';
      case 'app':
        return '应用';
      default:
        return type;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <StoreIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据空间市场
      </Typography>

      {/* 搜索和筛选 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="搜索数据资产、服务或应用..."
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
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>资产类型</InputLabel>
            <Select
              value={itemType}
              label="资产类型"
              onChange={(e) => setItemType(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="data">数据</MenuItem>
              <MenuItem value="service">服务</MenuItem>
              <MenuItem value="app">应用</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 市场资产列表 */}
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt={item.title}
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" noWrap>
                    {item.title}
                  </Typography>
                  <Chip
                    label={getTypeName(item.type)}
                    color={getTypeColor(item.type)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <CategoryIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="textSecondary">
                    {item.provider}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating
                    value={item.rating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    ({item.reviews}条评价)
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {item.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      icon={<LocalOfferIcon />}
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ¥{item.price}
                  </Typography>
                  <Button variant="contained" size="small">
                    查看详情
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 分页 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default Marketplace;