import { useState } from 'react';
import {
  Box,
  Typography,
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
  FilterList as FilterIcon,
  Description as DescriptionIcon,
  List as ListIcon
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
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 3,
        '& > *': {
          flex: '1 1 250px',
          minWidth: '250px'
        }
      }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
          }
        }}>
          <CardContent>
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>可用更新</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{availableUpdates.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          background: criticalUpdates.length > 0 
            ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
            : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: criticalUpdates.length > 0 
              ? '0 8px 25px rgba(255, 107, 107, 0.3)'
              : '0 8px 25px rgba(168, 237, 234, 0.3)'
          }
        }}>
          <CardContent>
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>紧急更新</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {criticalUpdates.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
          }
        }}>
          <CardContent>
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>已安装更新</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{installedUpdates.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)'
          }
        }}>
          <CardContent>
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>最后更新</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {installedUpdates
                .sort((a, b) => new Date(b.installDate || '').getTime() - new Date(a.installDate || '').getTime())[0]?.installDate || '从未'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

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
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 3,
        alignItems: 'flex-end'
      }}>
        <Box sx={{ flex: '2 1 300px', minWidth: '300px' }}>
          <TextField
            fullWidth
            placeholder="搜索更新..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)'
                }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            select
            fullWidth
            label="更新类型"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          >
            <option value="all">所有类型</option>
            <option value="security">安全更新</option>
            <option value="feature">功能更新</option>
            <option value="bugfix">错误修复</option>
            <option value="performance">性能优化</option>
          </TextField>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            select
            fullWidth
            label="优先级"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          >
            <option value="all">所有优先级</option>
            <option value="critical">紧急</option>
            <option value="high">高</option>
            <option value="medium">中等</option>
            <option value="low">低</option>
          </TextField>
        </Box>
        {tabValue === 0 && (
          <Box sx={{ flex: '0 1 auto' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<UpdateIcon />}
              disabled={availableUpdates.length === 0}
              onClick={() => {
                // Install all available updates
                setSnackbarMessage('正在安装所有更新...');
                setSnackbarSeverity('info');
                setSnackbarOpen(true);
              }}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  transform: 'none'
                }
              }}
            >
              全部安装
            </Button>
          </Box>
        )}
      </Box>

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
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                minHeight: '400px'
              }}>
                <Box sx={{ 
                  flex: '1 1 300px',
                  minWidth: '300px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                    详细信息
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="textSecondary">版本</Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedUpdate.version}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="textSecondary">类型</Typography>
                      <Chip 
                        icon={getTypeIcon(selectedUpdate.type)}
                        label={selectedUpdate.type.charAt(0).toUpperCase() + selectedUpdate.type.slice(1)} 
                        size="small" 
                        color={selectedUpdate.type === 'security' ? 'error' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="textSecondary">优先级</Typography>
                      <Chip 
                        label={selectedUpdate.priority.charAt(0).toUpperCase() + selectedUpdate.priority.slice(1)} 
                        size="small" 
                        color={getPriorityColor(selectedUpdate.priority)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="textSecondary">大小</Typography>
                      <Typography variant="body2" fontWeight="bold">{selectedUpdate.size}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <Typography variant="body2" color="textSecondary">
                        {selectedUpdate.status === 'installed' ? '安装日期' : '发布日期'}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedUpdate.status === 'installed' ? selectedUpdate.installDate : selectedUpdate.releaseDate}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ 
                  flex: '1 1 300px',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(25, 118, 210, 0.2)'
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
                      描述
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      lineHeight: 1.6,
                      color: 'text.primary'
                    }}>
                      {selectedUpdate.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(156, 39, 176, 0.2)',
                    flex: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <ListIcon sx={{ mr: 1, fontSize: 20 }} />
                      更新日志
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedUpdate.changelog.map((item, index) => (
                        <Box key={index} sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          p: 1,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          borderRadius: 1,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            transform: 'translateX(4px)'
                          }
                        }}>
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main', mt: 0.2 }} />
                          <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.4 }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
              
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