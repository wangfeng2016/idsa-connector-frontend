import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
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
  // 研发数据类
  {
    id: 1,
    title: '产品设计数据集',
    description: '包含CAD模型、设计图纸、技术规格等产品设计全流程数据',
    type: 'data',
    provider: '汽车研发中心A',
    price: 15000,
    rating: 4.7,
    reviews: 32,
    tags: ['研发数据', 'CAD模型', '产品设计'],
    imageUrl: '/src/assets/images/mp_banner_rd_data.png',
  },
  {
    id: 2,
    title: '测试验证数据',
    description: '车辆性能测试、安全测试、耐久性测试等验证数据集',
    type: 'data',
    provider: '测试验证实验室B',
    price: 12000,
    rating: 4.5,
    reviews: 28,
    tags: ['研发数据', '测试验证', '性能数据'],
    imageUrl: '/src/assets/images/mp_banner_rd_data.png',
  },
  // 市场数据类
  {
    id: 3,
    title: '消费者行为分析数据',
    description: '汽车消费者购买偏好、使用习惯、满意度调研等市场数据',
    type: 'data',
    provider: '市场调研公司C',
    price: 8000,
    rating: 4.3,
    reviews: 45,
    tags: ['市场数据', '消费者行为', '市场调研'],
    imageUrl: '/src/assets/images/mp_banner_mkt_data.png',
  },
  {
    id: 4,
    title: '竞品分析数据集',
    description: '竞争对手产品信息、价格策略、市场份额等竞品分析数据',
    type: 'data',
    provider: '商业情报公司D',
    price: 10000,
    rating: 4.6,
    reviews: 38,
    tags: ['市场数据', '竞品分析', '商业情报'],
    imageUrl: '/src/assets/images/mp_banner_mkt_data.png',
  },
  // 供应链数据类
  {
    id: 5,
    title: '供应商评估数据',
    description: '供应商资质、产能、质量评级、交付能力等评估数据',
    type: 'data',
    provider: '供应链管理平台E',
    price: 6000,
    rating: 4.4,
    reviews: 52,
    tags: ['供应链数据', '供应商评估', '质量管理'],
    imageUrl: '/src/assets/images/mp_banner_sc_data.png',
  },
  {
    id: 6,
    title: '物流运输数据',
    description: '运输路线、配送时效、成本分析等物流运输全链条数据',
    type: 'data',
    provider: '物流服务商F',
    price: 7500,
    rating: 4.2,
    reviews: 41,
    tags: ['供应链数据', '物流运输', '成本分析'],
    imageUrl: '/src/assets/images/mp_banner_sc_data.png',
  },
  // 生产制造数据类
  {
    id: 7,
    title: '生产工艺数据集',
    description: '生产线工艺参数、设备运行数据、质量控制指标等制造数据',
    type: 'data',
    provider: '智能制造工厂G',
    price: 18000,
    rating: 4.8,
    reviews: 29,
    tags: ['生产制造数据', '工艺参数', '质量控制'],
    imageUrl: '/src/assets/images/mp_banner_mf_data.png',
  },
  {
    id: 8,
    title: '设备维护数据',
    description: '生产设备维护记录、故障诊断、预测性维护等设备管理数据',
    type: 'data',
    provider: '设备维护服务商H',
    price: 9000,
    rating: 4.1,
    reviews: 36,
    tags: ['生产制造数据', '设备维护', '预测性维护'],
    imageUrl: '/src/assets/images/mp_banner_mf_data.png',
  },
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('all');
  const [items] = useState<MarketItem[]>(mockItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 筛选数据
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = itemType === 'all' || item.type === itemType;
    return matchesSearch && matchesType;
  });

  // 计算分页
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // 当筛选条件变化时重置到第一页
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemType]);

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
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          alignItems: 'center',
          '& > *:first-of-type': {
            flex: '2 1 300px',
            minWidth: 300
          },
          '& > *:not(:first-of-type)': {
            flex: '1 1 200px',
            minWidth: 200
          }
        }}
      >
        <Box>
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
        </Box>
        <Box>
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
        </Box>
      </Box>

      {/* 市场资产列表 */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 3,
          alignItems: 'stretch'
        }}
      >
        {currentItems.map((item) => (
          <Card key={item.id}>
              <CardMedia
                component="img"
                height="98"
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
        ))}
      </Box>

      {/* 分页 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination 
          count={totalPages} 
          page={currentPage}
          onChange={handlePageChange}
          color="primary" 
        />
      </Box>
    </Box>
  );
};

export default Marketplace;