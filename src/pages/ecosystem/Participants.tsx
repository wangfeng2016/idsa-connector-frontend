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
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  LocalOffer as LocalOfferIcon,
  VerifiedUser as VerifiedUserIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

// 参与者类型定义
interface Participant {
  id: number;
  name: string;
  description: string;
  type: 'enterprise' | 'institution' | 'government';
  role: 'provider' | 'consumer' | 'both';
  verified: boolean;
  joinDate: string;
  contact: string;
  website: string;
  tags: string[];
  services: string[];
  avatarUrl: string;
}

// 模拟数据
const mockParticipants: Participant[] = [
  {
    id: 1,
    name: '数据科技有限公司',
    description: '专注于数据处理和分析的科技企业，提供多种数据服务和解决方案',
    type: 'enterprise',
    role: 'provider',
    verified: true,
    joinDate: '2024-01-15',
    contact: 'contact@datatech.example.com',
    website: 'https://datatech.example.com',
    tags: ['数据服务', '人工智能', '大数据'],
    services: ['数据清洗服务', '数据分析引擎', '数据可视化工具'],
    avatarUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234CAF50"/><text x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em">D</text></svg>',
  },
  {
    id: 2,
    name: '国家数据研究院',
    description: '国家级数据研究机构，致力于数据科学研究和标准制定',
    type: 'institution',
    role: 'both',
    verified: true,
    joinDate: '2024-02-20',
    contact: 'info@ndri.example.gov',
    website: 'https://ndri.example.gov',
    tags: ['研究机构', '标准制定', '数据科学'],
    services: ['数据标准服务', '数据质量评估', '数据空间咨询'],
    avatarUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%232196F3"/><text x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em">N</text></svg>',
  },
  {
    id: 3,
    name: '智慧城市管理局',
    description: '负责智慧城市建设和数据资源管理的政府部门',
    type: 'government',
    role: 'consumer',
    verified: true,
    joinDate: '2024-03-10',
    contact: 'smartcity@gov.example.com',
    website: 'https://smartcity.gov.example.com',
    tags: ['智慧城市', '政府部门', '数据管理'],
    services: ['城市数据平台', '公共服务数据'],
    avatarUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FF5722"/><text x="50" y="50" font-size="40" fill="white" text-anchor="middle" dy=".3em">S</text></svg>',
  },
];

const Participants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [participants] = useState<Participant[]>(mockParticipants);

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'enterprise':
        return 'primary';
      case 'institution':
        return 'secondary';
      case 'government':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'provider':
        return 'success';
      case 'consumer':
        return 'info';
      case 'both':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 获取类型名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'enterprise':
        return '企业';
      case 'institution':
        return '机构';
      case 'government':
        return '政府';
      default:
        return type;
    }
  };

  // 获取角色名称
  const getRoleName = (role: string) => {
    switch (role) {
      case 'provider':
        return '提供者';
      case 'consumer':
        return '消费者';
      case 'both':
        return '双重角色';
      default:
        return role;
    }
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enterprise':
        return <BusinessIcon />;
      case 'institution':
        return <SchoolIcon />;
      case 'government':
        return <BusinessIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据空间参与者
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
            placeholder="搜索参与者名称、描述或标签..."
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
            <InputLabel>参与者类型</InputLabel>
            <Select
              value={typeFilter}
              label="参与者类型"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="enterprise">企业</MenuItem>
              <MenuItem value="institution">机构</MenuItem>
              <MenuItem value="government">政府</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel>角色</InputLabel>
            <Select
              value={roleFilter}
              label="角色"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="provider">提供者</MenuItem>
              <MenuItem value="consumer">消费者</MenuItem>
              <MenuItem value="both">双重角色</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 参与者列表 */}
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
        {participants.map((participant) => (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={participant.avatarUrl}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6">
                        {participant.name}
                      </Typography>
                      {participant.verified && (
                        <Tooltip title="已验证参与者">
                          <VerifiedUserIcon color="primary" sx={{ ml: 1, fontSize: 20 }} />
                        </Tooltip>
                      )}
                    </Box>
                    <Box display="flex" gap={1} mt={0.5}>
                      <Chip
                        label={getTypeName(participant.type)}
                        color={getTypeColor(participant.type)}
                        size="small"
                        icon={getTypeIcon(participant.type)}
                      />
                      <Chip
                        label={getRoleName(participant.role)}
                        color={getRoleColor(participant.role)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 2 }}>
                  {participant.description}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    '& > *': {
                      flex: '1 1 200px',
                      minWidth: 200
                    }
                  }}
                >
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {participant.contact}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LanguageIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {participant.website}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  <CategoryIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'text-bottom' }} />
                  提供的服务：
                </Typography>
                <List dense>
                  {participant.services.map((service, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <BusinessIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={service}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box display="flex" flexWrap="wrap" gap={1} my={1}>
                  {participant.tags.map((tag) => (
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
                  <Typography variant="body2" color="textSecondary">
                    加入时间：{participant.joinDate}
                  </Typography>
                  <Box>
                    <Tooltip title="发送消息">
                      <IconButton size="small" color="primary">
                        <MessageIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{ ml: 1 }}
                    >
                      查看详情
                    </Button>
                  </Box>
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

export default Participants;