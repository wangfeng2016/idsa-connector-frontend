import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  SystemUpdate as UpdateIcon,
  History as HistoryIcon,
  CheckCircle,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  GetApp as DownloadIcon,
  Security as SecurityIcon,
  Speed as PerformanceIcon,
  BugReport as BugFixIcon,
  NewReleases as NewFeatureIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

// Types
type UpdateStatus = 'available' | 'downloading' | 'installing' | 'installed' | 'failed';
type UpdateType = 'security' | 'feature' | 'bugfix' | 'performance';
type UpdatePriority = 'critical' | 'high' | 'medium' | 'low';

interface UpdateItem {
  id: string;
  name: string;
  version: string;
  releaseDate: string;
  size: string;
  status: UpdateStatus;
  type: UpdateType;
  priority: UpdatePriority;
  description: string;
  changelog: string[];
  installDate?: string;
}

// Mock data
const mockUpdates: UpdateItem[] = [
  {
    id: 'upd-001',
    name: '安全补丁',
    version: '2.5.1',
    releaseDate: '2025-05-10',
    size: '45 MB',
    status: 'available',
    type: 'security',
    priority: 'critical',
    description: '修复身份验证模块中关键安全漏洞的紧急安全更新',
    changelog: [
      '修复身份验证模块中的CVE-2025-1234漏洞',
      '改进证书验证机制',
      '增强敏感数据加密'
    ]
  },
  {
    id: 'upd-002',
    name: '功能更新',
    version: '2.6.0',
    releaseDate: '2025-05-15',
    size: '120 MB',
    status: 'available',
    type: 'feature',
    priority: 'medium',
    description: '新增数据交换和可视化功能',
    changelog: [
      '新增数据可视化仪表板',
      '改进数据交换协议',
      '增强资源管理用户界面',
      '新增对多种数据格式的支持'
    ]
  },
  {
    id: 'upd-003',
    name: '性能优化',
    version: '2.5.2',
    releaseDate: '2025-05-12',
    size: '30 MB',
    status: 'installed',
    type: 'performance',
    priority: 'medium',
    description: '优化数据处理和API响应性能',
    changelog: [
      '优化数据库查询',
      'API响应时间减少30%',
      '改进内存管理',
      '增强缓存机制'
    ],
    installDate: '2025-05-13'
  },
  {
    id: 'upd-004',
    name: '错误修复版本',
    version: '2.5.0',
    releaseDate: '2025-05-01',
    size: '15 MB',
    status: 'installed',
    type: 'bugfix',
    priority: 'high',
    description: '修复策略管理和资源列表中的已知问题',
    changelog: [
      '修复策略编辑器验证问题',
      '解决资源列表分页错误',
      '修复交易历史数据不一致问题',
      '纠正证书管理中的错误处理'
    ],
    installDate: '2025-05-02'
  },
  {
    id: 'upd-005',
    name: '维护更新',
    version: '2.4.5',
    releaseDate: '2025-04-20',
    size: '25 MB',
    status: 'installed',
    type: 'bugfix',
    priority: 'low',
    description: '小幅修复和依赖项更新',
    changelog: [
      '更新第三方库',
      '修复界面细节不一致问题',
      '改进错误提示信息',
      '增强故障排查日志'
    ],
    installDate: '2025-04-21'
  }
];

const Updates = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>(mockUpdates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  // Filter updates based on search, filters and tab
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || update.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || update.priority === selectedPriority;
    const matchesTab = tabValue === 0 ? update.status === 'available' : update.status === 'installed';
    
    return matchesSearch && matchesType && matchesPriority && matchesTab;
  });

  // Get priority color
  const getPriorityColor = (priority: UpdatePriority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Get type icon
  const getTypeIcon = (type: UpdateType) => {
    switch (type) {
      case 'security': return <SecurityIcon fontSize="small" />;
      case 'feature': return <NewFeatureIcon fontSize="small" />;
      case 'bugfix': return <BugFixIcon fontSize="small" />;
      case 'performance': return <PerformanceIcon fontSize="small" />;
      default: return null;
    }
  };

  // Handle install update
  const handleInstallUpdate = () => {
    if (!selectedUpdate) return;
    
    setIsInstalling(true);
    
    // Simulate installation process
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    
    // Simulate completion
    setTimeout(() => {
      clearInterval(interval);
      setIsInstalling(false);
      setInstallProgress(0);
      setOpenDetailsDialog(false);
      
      // Update the status
      setUpdates(prev => prev.map(upd => 
        upd.id === selectedUpdate.id 
          ? {
              ...upd, 
              status: 'installed', 
              installDate: new Date().toISOString().split('T')[0]
            } 
          : upd
      ));
      
      setSnackbarMessage(`${selectedUpdate.name} (${selectedUpdate.version}) 安装成功`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedUpdate(null);
    }, 5000);
  };

  // Count updates by status
  const availableUpdates = updates.filter(u => u.status === 'available');
  const installedUpdates = updates.filter(u => u.status === 'installed');
  const criticalUpdates = updates.filter(u => u.status === 'available' && u.priority === 'critical');

  return (
    // 使用sx属性进行内联样式定制
    <Box sx={{
      width: '100%',
      p: 3,
      backgroundColor: 'background.paper',
      borderRadius: 2
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold'
      }}>
        <UpdateIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#1976d2' }} />
        系统更新管理
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>可用更新</Typography>
              <Typography variant="h4">{availableUpdates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>紧急更新</Typography>
              <Typography variant="h4" color={criticalUpdates.length > 0 ? 'error' : 'inherit'}>
                {criticalUpdates.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>已安装更新</Typography>
              <Typography variant="h4">{installedUpdates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>最后更新</Typography>
              <Typography variant="h6">
                {installedUpdates
                  .sort((a, b) => new Date(b.installDate || '').getTime() - new Date(a.installDate || '').getTime())[0]?.installDate || '从未'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="可用更新" icon={<DownloadIcon />} iconPosition="start" />
        <Tab label="更新历史" icon={<HistoryIcon />} iconPosition="start" />
      </Tabs>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="搜索更新..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="更新类型"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="all">所有类型</option>
            <option value="security">安全更新</option>
            <option value="feature">功能更新</option>
            <option value="bugfix">错误修复</option>
            <option value="performance">性能优化</option>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="优先级"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="all">所有优先级</option>
            <option value="critical">紧急</option>
            <option value="high">高</option>
            <option value="medium">中等</option>
            <option value="low">低</option>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          {tabValue === 0 && (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              startIcon={<UpdateIcon />}
              disabled={availableUpdates.length === 0}
              onClick={() => {
                // Install all available updates
                setSnackbarMessage('正在安装所有更新...');
                setSnackbarSeverity('info');
                setSnackbarOpen(true);
              }}
            >
              全部安装
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Updates Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>更新</TableCell>
              <TableCell>版本</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>优先级</TableCell>
              <TableCell>{tabValue === 0 ? '发布日期' : '安装日期'}</TableCell>
              <TableCell>大小</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUpdates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  未找到符合条件的更新
                </TableCell>
              </TableRow>
            ) : (
              filteredUpdates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      {getTypeIcon(update.type)}
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1">{update.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{update.description}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{update.version}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={getTypeIcon(update.type)}
                      label={update.type.charAt(0).toUpperCase() + update.type.slice(1)} 
                      size="small" 
                      color={update.type === 'security' ? 'error' : 'default'}
                      variant={update.type === 'feature' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} 
                      size="small" 
                      color={getPriorityColor(update.priority)}
                    />
                  </TableCell>
                  <TableCell>{tabValue === 0 ? update.releaseDate : update.installDate}</TableCell>
                  <TableCell>{update.size}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        setSelectedUpdate(update);
                        setOpenDetailsDialog(true);
                      }}
                    >
                      {tabValue === 0 ? '安装' : '详情'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => !isInstalling && setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        {selectedUpdate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedUpdate.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedUpdate.name} ({selectedUpdate.version})
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">详细信息</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="版本" secondary={selectedUpdate.version} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="类型" secondary={
                        <Chip 
                          icon={getTypeIcon(selectedUpdate.type)}
                          label={selectedUpdate.type.charAt(0).toUpperCase() + selectedUpdate.type.slice(1)} 
                          size="small" 
                          color={selectedUpdate.type === 'security' ? 'error' : 'default'}
                        />
                      } />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="优先级" secondary={
                        <Chip 
                          label={selectedUpdate.priority.charAt(0).toUpperCase() + selectedUpdate.priority.slice(1)} 
                          size="small" 
                          color={getPriorityColor(selectedUpdate.priority)}
                        />
                      } />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="大小" secondary={selectedUpdate.size} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={selectedUpdate.status === 'installed' ? '安装日期' : '发布日期'} 
                        secondary={selectedUpdate.status === 'installed' ? selectedUpdate.installDate : selectedUpdate.releaseDate} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">描述</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedUpdate.description}
                  </Typography>
                  
                  <Typography variant="subtitle1">更新日志</Typography>
                  <List dense>
                    {selectedUpdate.changelog.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
              
              {isInstalling && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">正在安装更新</Typography>
                  <LinearProgress variant="determinate" value={installProgress} sx={{ mt: 1, mb: 1 }} />
                  <Typography variant="caption" align="center" display="block">
                    {installProgress}% 完成
                  </Typography>
                </Box>
              )}
              
              {selectedUpdate.status === 'available' && selectedUpdate.priority === 'critical' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  这是一个紧急安全更新，建议尽快安装。
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => !isInstalling && setOpenDetailsDialog(false)}>关闭</Button>
              {selectedUpdate.status === 'available' && (
                <Button 
                  onClick={handleInstallUpdate} 
                  variant="contained" 
                  color="primary"
                  disabled={isInstalling}
                  startIcon={isInstalling ? <CircularProgress size={20} /> : <UpdateIcon />}
                >
                  {isInstalling ? '正在安装...' : '安装更新'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Updates;