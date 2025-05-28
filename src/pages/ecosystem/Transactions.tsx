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
} from '@mui/material';
import {
  Search as SearchIcon,
  CompareArrows as CompareArrowsIcon,
  AccountBalanceWallet as WalletIcon,
  Event as EventIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';

interface Transaction {
  id: number;
  title: string;
  type: 'purchase' | 'sale' | 'exchange';
  asset: string;
  counterparty: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  tags: string[];
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    title: '采购企业信用数据集',
    type: 'purchase',
    asset: '企业信用数据集',
    counterparty: '数据提供商A',
    amount: 1000,
    status: 'completed',
    date: '2024-06-01 10:23',
    tags: ['数据', '采购'],
  },
  {
    id: 2,
    title: '出售数据可视化应用',
    type: 'sale',
    asset: '数据可视化应用',
    counterparty: '应用开发商C',
    amount: 299,
    status: 'pending',
    date: '2024-06-02 14:11',
    tags: ['应用', '出售'],
  },
  {
    id: 3,
    title: '数据交换服务',
    type: 'exchange',
    asset: '数据清洗服务',
    counterparty: '服务提供商B',
    amount: 500,
    status: 'failed',
    date: '2024-06-03 09:45',
    tags: ['服务', '交换'],
  },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'primary';
      case 'sale':
        return 'secondary';
      case 'exchange':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'purchase':
        return '采购';
      case 'sale':
        return '出售';
      case 'exchange':
        return '交换';
      default:
        return type;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'pending':
        return '待处理';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <CompareArrowsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        交易记录
      </Typography>
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
          placeholder="搜索交易标题、资产或对方..."
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
          <InputLabel>交易类型</InputLabel>
          <Select
            value={typeFilter}
            label="交易类型"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="purchase">采购</MenuItem>
            <MenuItem value="sale">出售</MenuItem>
            <MenuItem value="exchange">交换</MenuItem>
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
            <MenuItem value="completed">已完成</MenuItem>
            <MenuItem value="pending">待处理</MenuItem>
            <MenuItem value="failed">失败</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          '& > *': {
            flex: '1 1 300px',
            minWidth: 300,
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }
          }
        }}
      >
        {transactions.map((tx) => (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" noWrap>
                    {tx.title}
                  </Typography>
                  <Chip
                    label={getTypeName(tx.type)}
                    color={getTypeColor(tx.type)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                  资产：{tx.asset}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <WalletIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="textSecondary">
                    对方：{tx.counterparty}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="textSecondary">
                    时间：{tx.date}
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {tx.tags.map((tag) => (
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
                    ¥{tx.amount}
                  </Typography>
                  <Chip
                    label={getStatusName(tx.status)}
                    color={getStatusColor(tx.status)}
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
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={5} color="primary" />
      </Box>
    </Box>
  );
};

export default Transactions;