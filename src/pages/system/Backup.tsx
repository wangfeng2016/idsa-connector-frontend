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
  Snackbar
} from '@mui/material';
import {
  Backup as BackupIcon,
  RestoreOutlined,
  DeleteOutline,
  CloudDownload,
  Search as SearchIcon,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
} from '@mui/icons-material';

// 类型定义
// type BackupStatus = 'completed' | 'in_progress' | 'failed' | 'scheduled';
type BackupStatus = '完成' | '进行中' | '失败' | '计划中';

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  status: BackupStatus;
  type: '全量' | '增量' | '配置';
  description: string;
}

// Mock data
const mockBackups: BackupItem[] = [
  {
    id: 'bkp-001',
    name: '全量系统备份',
    date: '2025-05-15 08:30:00',
    size: '1.2 GB',
    status: '完成',
    type: '全量',
    description: '包含数据和配置的完整的系统备份'
  },
  {
    id: 'bkp-002',
    name: '配置信息备份',
    date: '2025-05-10 14:45:00',
    size: '45 MB',
    status: '完成',
    type: '配置',
    description: '系统配置信息备份'
  },
  {
    id: 'bkp-003',
    name: '日增量备份',
    date: '2025-05-18 00:00:00',
    size: '250 MB',
    status: '进行中',
    type: '增量',
    description: '每日增量备份'
  },
  {
    id: 'bkp-004',
    name: '周全量备份',
    date: '2025-05-20 02:00:00',
    size: '0',
    status: '计划中',
    type: '全量',
    description: '计划的周一全量备份'
  },
  {
    id: 'bkp-005',
    name: '临时备份',
    date: '2025-05-14 18:22:00',
    size: '1.1 GB',
    status: '失败',
    type: '全量',
    description: '手工触发的紧急备份 - 磁盘空间不足'
  }
];

const Backup = () => {
  const [backups, setBackups] = useState<BackupItem[]>(mockBackups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // 根据搜索和过滤器筛选备份
  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || backup.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || backup.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: BackupStatus): 'success' | 'info' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case '完成': return 'success';
      case '进行中': return 'info';
      case '失败': return 'error';
      case '计划中': return 'warning';
      default: return 'default';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: BackupStatus) => {
    switch (status) {
      case '完成': return <CheckCircle fontSize="small" color="success" />;
      case '进行中': return <CircularProgress size={16} />;
      case '失败': return <ErrorIcon fontSize="small" color="error" />;
      case '计划中': return <Schedule fontSize="small" color="warning" />;
      default: return null;
    }
  };

  // 处理创建备份
  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    // Simulate backup creation
    setTimeout(() => {
      const newBackup: BackupItem = {
        id: `bkp-${Math.floor(Math.random() * 1000)}`,
        name: '新手动备份',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        size: '0',
        status: '进行中',
        type: '全量',
        description: '用户创建的手动备份'
      };
      
      setBackups([newBackup, ...backups]);
      setIsCreatingBackup(false);
      setOpenCreateDialog(false);
      
      // Simulate backup completion after some time
      setTimeout(() => {
        setBackups(prev => prev.map(b => 
          b.id === newBackup.id 
            ? {...b, status: '完成', size: '1.3 GB'} 
            : b
        ));
        setSnackbarMessage('Backup completed successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }, 8000);
    }, 2000);
  };

  // 处理恢复备份
  const handleRestoreBackup = () => {
    if (!selectedBackup) return;
    
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      setOpenRestoreDialog(false);
      setSelectedBackup(null);
      setSnackbarMessage(`System restored from backup: ${selectedBackup.name}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 3000);
  };

  // 处理删除备份
  const handleDeleteBackup = (id: string) => {
    setBackups(backups.filter(backup => backup.id !== id));
    setSnackbarMessage('Backup deleted');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <BackupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        备份和恢复
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
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>备份数量</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{backups.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
          }
        }}>
          <CardContent>
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>备份大小</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {backups
                .filter(b => b.status === '完成')
                .reduce((acc, curr) => acc + parseFloat(curr.size.replace(' GB', '')), 0)
                .toFixed(2)} GB
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
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>最近备份时间</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {backups
                .filter(b => b.status === '完成')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || 'None'}
            </Typography>
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
            <Typography color="inherit" gutterBottom sx={{ opacity: 0.9 }}>下次备份时间</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {backups
                .filter(b => b.status === '计划中')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.date || 'None'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

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
            placeholder="查找备份..."
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
            label="备份类型"
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
            <option value="全量">全量</option>
            <option value="增量">增量</option>
            <option value="配置">配置</option>
          </TextField>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
          <TextField
            select
            fullWidth
            label="状态"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          >
            <option value="all">所有状态</option>
            <option value="完成">已完成</option>
            <option value="进行中">进行中</option>
            <option value="失败">失败</option>
            <option value="计划中">计划中</option>
          </TextField>
        </Box>
        <Box sx={{ flex: '0 1 auto' }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<BackupIcon />}
            onClick={() => setOpenCreateDialog(true)}
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
              }
            }}
          >
            创建备份
          </Button>
        </Box>
      </Box>

      {/* Backups Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>大小</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBackups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No backups found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredBackups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1">{backup.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{backup.description}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={backup.type === '全量' ? '完整' : 
                             backup.type === '增量' ? '增量' : 
                             backup.type === '配置' ? '配置' : backup.type} 
                      size="small" 
                      color={backup.type === '全量' ? 'primary' : 'default'}
                      variant={backup.type === '配置' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>{backup.date}</TableCell>
                  <TableCell>{backup.status === '计划中' ? '-' : backup.size}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(backup.status)}
                      label={backup.status === '完成' ? '已完成' : 
                             backup.status === '进行中' ? '进行中' : 
                             backup.status === '失败' ? '失败' : 
                             backup.status === '计划中' ? '已计划' : backup.status} 
                      size="small" 
                      color={getStatusColor(backup.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      disabled={backup.status !== '完成'}
                      onClick={() => {
                        setSelectedBackup(backup);
                        setOpenRestoreDialog(true);
                      }}
                      title="Restore from this backup"
                    >
                      <RestoreOutlined />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      disabled={backup.status !== '完成'}
                      title="Download backup"
                    >
                      <CloudDownload />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      disabled={backup.status === '进行中'}
                      onClick={() => handleDeleteBackup(backup.id)}
                      title="Delete backup"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Backup Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Backup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="备份名称"
            fullWidth
            defaultValue="手动备份"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            select
            fullWidth
            label="备份类型"
            defaultValue="全量"
            SelectProps={{
              native: true,
            }}
            sx={{ mb: 2 }}
          >
            <option value="全量">全量系统备份 </option>
            <option value="增量">增量备份</option>
            <option value="配置">配置备份</option>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            defaultValue="Manual backup initiated by user"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateBackup} 
            variant="contained" 
            color="primary"
            disabled={isCreatingBackup}
            startIcon={isCreatingBackup ? <CircularProgress size={20} /> : <BackupIcon />}
          >
            {isCreatingBackup ? 'Creating...' : 'Create Backup'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={openRestoreDialog} onClose={() => setOpenRestoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Restore System</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              Warning: This will restore your system to a previous state
            </Typography>
            <Typography variant="body2">
              All changes made after this backup will be lost. This action cannot be undone.
            </Typography>
          </Alert>
          {selectedBackup && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Backup Details:</Typography>
              <Typography><strong>名称:</strong> {selectedBackup.name}</Typography>
              <Typography><strong>日期:</strong> {selectedBackup.date}</Typography>
              <Typography><strong>大小:</strong> {selectedBackup.size}</Typography>
              <Typography><strong>类型：</strong> {selectedBackup.type === '全量' ? '完整' : selectedBackup.type === '增量' ? '增量' : selectedBackup.type === '配置' ? '配置' : selectedBackup.type}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestoreDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRestoreBackup} 
            variant="contained" 
            color="error"
            disabled={isRestoring}
            startIcon={isRestoring ? <CircularProgress size={20} /> : <RestoreOutlined />}
          >
            {isRestoring ? 'Restoring...' : 'Restore System'}
          </Button>
        </DialogActions>
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

export default Backup;