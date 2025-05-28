import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Tooltip,
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
  Map as MapIcon,
  BubbleChart as BubbleChartIcon,
  Category as CategoryIcon,
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

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4, alignItems: 'stretch' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 180, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                仪表板总数
              </Typography>
              <Typography variant="h3">{dashboardStats.total}</Typography>
              <Box display="flex" mt={1}>
                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label={`收藏: ${dashboardStats.starred}`}
                  size="small"
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<ShareIcon fontSize="small" />}
                  label={`共享: ${dashboardStats.shared}`}
                  size="small"
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 180, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                图表总数
              </Typography>
              <Typography variant="h3">{dashboardStats.charts}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                平均每个仪表板 {(dashboardStats.charts / dashboardStats.total).toFixed(1)} 个图表
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 180, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                分类统计
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                <Chip
                  label={`数据: ${dashboardStats.categories.data}`}
                  size="small"
                  color="primary"
                />
                <Chip
                  label={`运营: ${dashboardStats.categories.operations}`}
                  size="small"
                  color="success"
                />
                <Chip
                  label={`合规: ${dashboardStats.categories.compliance}`}
                  size="small"
                  color="warning"
                />
                <Chip
                  label={`业务: ${dashboardStats.categories.business}`}
                  size="small"
                  color="error"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 搜索和筛选 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="搜索仪表板..."
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
        <Grid item xs={6} md={3}>
          <TextField
            select
            fullWidth
            label="分类"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">全部分类</MenuItem>
            <MenuItem value="data">数据</MenuItem>
            <MenuItem value="operations">运营</MenuItem>
            <MenuItem value="compliance">合规</MenuItem>
            <MenuItem value="business">业务</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ height: '56px' }}
          >
            创建仪表板
          </Button>
        </Grid>
      </Grid>

      {/* 仪表板列表 */}
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        {dashboards.map((dashboard) => (
          <Grid item xs={12} sm={6} md={4} key={dashboard.id}>
            <Card sx={{ height: 400, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                      {dashboard.title}
                    </Typography>
                    {dashboard.starred && (
                      <StarIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                }
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={(e) => handleMenuOpen(e, dashboard)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                subheader={
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Chip
                      icon={getCategoryIcon(dashboard.category)}
                      label={getCategoryName(dashboard.category)}
                      size="small"
                      color={getCategoryColor(dashboard.category)}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      {dashboard.charts} 个图表
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <Box
                  sx={{
                    height: 140,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                    borderRadius: 1,
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                </Box>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {dashboard.description}
                </Typography>
                <Box display="flex" alignItems="center" mt="auto" pt={2}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    {dashboard.creator}
                  </Typography>
                  <AccessTimeIcon fontSize="small" color="action" sx={{ ml: 2 }} />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                    更新于 {dashboard.lastModified}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <Box display="flex" justifyContent="space-between" p={1} sx={{ height: 48 }}>
                <Button startIcon={<VisibilityIcon />} size="small">
                  查看
                </Button>
                <Button startIcon={<EditIcon />} size="small">
                  编辑
                </Button>
                {dashboard.shared ? (
                  <Button startIcon={<ShareIcon />} size="small" color="success">
                    已共享
                  </Button>
                ) : (
                  <Button startIcon={<ShareIcon />} size="small">
                    共享
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

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