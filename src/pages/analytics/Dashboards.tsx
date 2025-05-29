import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  TableChart as TableChartIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// 仪表板类型定义
interface Dashboard {
  id: number;
  title: string;
  description: string;
  category: 'data' | 'operations' | 'compliance' | 'business';
  charts: number;
  creator: string;
  created: string;
  lastModified: string;
  starred: boolean;
  shared: boolean;
  thumbnail: string; // 实际项目中应该是图片URL
}

// 模拟数据
const mockDashboards: Dashboard[] = [
  {
    id: 1,
    title: '数据空间概览',
    description: '展示数据空间整体运行状况、数据流量和参与者活跃度',
    category: 'operations',
    charts: 8,
    creator: '系统管理员',
    created: '2024-05-01',
    lastModified: '2024-06-10',
    starred: true,
    shared: true,
    thumbnail: 'dashboard1.png',
  },
  {
    id: 2,
    title: '数据资产价值分析',
    description: '分析各类数据资产的使用情况、价值评估和趋势变化',
    category: 'business',
    charts: 6,
    creator: '数据分析师',
    created: '2024-04-15',
    lastModified: '2024-06-05',
    starred: true,
    shared: true,
    thumbnail: 'dashboard2.png',
  },
  {
    id: 3,
    title: '合规监控面板',
    description: '监控数据使用合规性、隐私保护和安全审计结果',
    category: 'compliance',
    charts: 5,
    creator: '合规官',
    created: '2024-03-20',
    lastModified: '2024-05-30',
    starred: false,
    shared: true,
    thumbnail: 'dashboard3.png',
  },
  {
    id: 4,
    title: '数据质量监控',
    description: '实时监控数据质量指标、异常检测和数据清洗效果',
    category: 'data',
    charts: 7,
    creator: '数据工程师',
    created: '2024-02-10',
    lastModified: '2024-06-01',
    starred: false,
    shared: false,
    thumbnail: 'dashboard4.png',
  },
];

// 仪表板统计
const dashboardStats = {
  total: 4,
  starred: 2,
  shared: 3,
  charts: 26,
  categories: {
    data: 1,
    operations: 1,
    compliance: 1,
    business: 1,
  },
};

const Dashboards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dashboards] = useState<Dashboard[]>(mockDashboards);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 菜单处理
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dashboard: Dashboard) => {
    setAnchorEl(event.currentTarget);
    setSelectedDashboard(dashboard);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 对话框处理
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 获取类别颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data':
        return 'primary';
      case 'operations':
        return 'success';
      case 'compliance':
        return 'warning';
      case 'business':
        return 'error';
      default:
        return 'default';
    }
  };

  // 获取类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'data':
        return '数据';
      case 'operations':
        return '运营';
      case 'compliance':
        return '合规';
      case 'business':
        return '业务';
      default:
        return category;
    }
  };

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data':
        return <TableChartIcon />;
      case 'operations':
        return <TimelineIcon />;
      case 'compliance':
        return <PieChartIcon />;
      case 'business':
        return <BarChartIcon />;
      default:
        return <DashboardIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        数据仪表板
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
            minWidth: { xs: '100%', sm: '280px', md: '240px' }
          }
        }}
      >
        <Card 
          sx={{ 
            height: 180, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              仪表板总数
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>{dashboardStats.total}</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                icon={<StarIcon fontSize="small" />}
                label={`收藏: ${dashboardStats.starred}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<ShareIcon fontSize="small" />}
                label={`共享: ${dashboardStats.shared}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            height: 180, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(240, 147, 251, 0.4)'
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
              图表总数
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{dashboardStats.charts}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              平均每个仪表板 {(dashboardStats.charts / dashboardStats.total).toFixed(1)} 个图表
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            height: 180, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(79, 172, 254, 0.4)'
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
              分类统计
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={`数据: ${dashboardStats.categories.data}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white'
                }}
              />
              <Chip
                label={`运营: ${dashboardStats.categories.operations}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white'
                }}
              />
              <Chip
                label={`合规: ${dashboardStats.categories.compliance}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white'
                }}
              />
              <Chip
                label={`业务: ${dashboardStats.categories.business}`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white'
                }}
              />
            </Box>
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
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' }, minWidth: '280px' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索仪表板..."
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
                  <SearchIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 25%' }, minWidth: '200px' }}>
          <TextField
            select
            fullWidth
            label="分类"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                transition: 'all 0.3s ease'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            <MenuItem value="all">全部分类</MenuItem>
            <MenuItem value="data">数据</MenuItem>
            <MenuItem value="operations">运营</MenuItem>
            <MenuItem value="compliance">合规</MenuItem>
            <MenuItem value="business">业务</MenuItem>
          </TextField>
        </Box>
        
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 25%' }, minWidth: '200px' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ 
              height: '56px',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            创建仪表板
          </Button>
        </Box>
      </Box>

      {/* 仪表板列表 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)', lg: '1 1 calc(25% - 18px)' },
            minWidth: { xs: '100%', sm: '300px', md: '280px' },
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' }
          }
        }}
      >
        {dashboards.map((dashboard) => (
          <Card
            key={dashboard.id}
            sx={{
              height: 'fit-content',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${getCategoryColor(dashboard.category)}, ${getCategoryColor(dashboard.category)}88)`,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
                '&::before': {
                  opacity: 1
                }
              },
            }}
          >
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <Typography 
                    variant="h6" 
                    noWrap 
                    sx={{ 
                      flexGrow: 1,
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}
                  >
                    {dashboard.title}
                  </Typography>
                  {dashboard.starred && (
                    <StarIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              action={
                <IconButton
                  aria-label="settings"
                  onClick={(e) => handleMenuOpen(e, dashboard)}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                  <Chip
                    icon={getCategoryIcon(dashboard.category)}
                    label={getCategoryName(dashboard.category)}
                    size="small"
                    sx={{
                      bgcolor: `${getCategoryColor(dashboard.category)}20`,
                      color: getCategoryColor(dashboard.category),
                      fontWeight: 500,
                      border: `1px solid ${getCategoryColor(dashboard.category)}40`
                    }}
                  />
                  {dashboard.shared && (
                    <Chip
                      icon={<ShareIcon fontSize="small" />}
                      label="共享"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }}
                    />
                  )}
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <Divider />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', pt: 2 }}>
              <Box
                sx={{
                  height: 120,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  borderRadius: 2,
                  border: '2px dashed rgba(0,0,0,0.1)'
                }}
              >
                <DashboardIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
              </Box>
              <Typography 
                variant="body2" 
                color="textSecondary" 
                paragraph
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5,
                  minHeight: '3em'
                }}
              >
                {dashboard.description}
              </Typography>
              <Box 
                display="flex" 
                alignItems="center" 
                mt="auto" 
                pt={2}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5, mr: 2 }}>
                  {dashboard.creator}
                </Typography>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                  {dashboard.lastModified}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="space-between" p={2} sx={{ height: 'auto' }}>
              <Button 
                startIcon={<VisibilityIcon />} 
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                查看
              </Button>
              <Button 
                startIcon={<EditIcon />} 
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'secondary.main',
                    color: 'white'
                  }
                }}
              >
                编辑
              </Button>
              {dashboard.shared ? (
                <Button 
                  startIcon={<ShareIcon />} 
                  size="small" 
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.main',
                      color: 'white'
                    }
                  }}
                >
                  已共享
                </Button>
              ) : (
                <Button 
                  startIcon={<ShareIcon />} 
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'info.main',
                      color: 'white'
                    }
                  }}
                >
                  共享
                </Button>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {/* 仪表板操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>查看仪表板</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>编辑仪表板</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            {selectedDashboard?.starred ? (
              <StarBorderIcon fontSize="small" />
            ) : (
              <StarIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedDashboard?.starred ? '取消收藏' : '收藏仪表板'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>共享仪表板</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>删除仪表板</ListItemText>
        </MenuItem>
      </Menu>

      {/* 创建仪表板对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>创建新仪表板</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="仪表板名称"
            fullWidth
            variant="outlined"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="分类"
            fullWidth
            variant="outlined"
            defaultValue="data"
          >
            <MenuItem value="data">数据</MenuItem>
            <MenuItem value="operations">运营</MenuItem>
            <MenuItem value="compliance">合规</MenuItem>
            <MenuItem value="business">业务</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            创建
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboards;