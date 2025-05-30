import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Key as KeyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  VpnKey as VpnKeyIcon,
  VerifiedUser as CertificateIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// 类型定义
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

interface Certificate {
  id: number;
  name: string;
  type: 'x509' | 'jwt' | 'oauth';
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  fingerprint: string;
}

interface AuthSession {
  id: number;
  userId: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  status: 'active' | 'expired';
  location: string;
}

// 模拟数据
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    fullName: '系统管理员',
    role: '超级管理员',
    status: 'active',
    lastLogin: '2023-10-15 14:30:25',
    createdAt: '2023-01-01 09:00:00',
    permissions: ['全部权限'],
  },
  {
    id: 2,
    username: 'sales_manager',
    email: 'sales@company.com',
    fullName: '张销售',
    role: '销售经理',
    status: 'active',
    lastLogin: '2023-10-15 13:45:12',
    createdAt: '2023-02-15 10:30:00',
    permissions: ['销售数据访问', '客户信息查看', '报表生成'],
  },
  {
    id: 3,
    username: 'data_analyst',
    email: 'analyst@company.com',
    fullName: '李分析',
    role: '数据分析师',
    status: 'active',
    lastLogin: '2023-10-15 11:20:45',
    createdAt: '2023-03-10 14:15:00',
    permissions: ['数据分析', '报表查看', '统计功能'],
  },
  {
    id: 4,
    username: 'guest_user',
    email: 'guest@partner.com',
    fullName: '访客用户',
    role: '访客',
    status: 'inactive',
    lastLogin: '2023-10-10 16:30:00',
    createdAt: '2023-10-01 09:00:00',
    permissions: ['基础查看'],
  },
  {
    id: 5,
    username: 'locked_user',
    email: 'locked@company.com',
    fullName: '被锁定用户',
    role: '普通用户',
    status: 'locked',
    lastLogin: '2023-10-12 08:15:30',
    createdAt: '2023-05-20 11:45:00',
    permissions: ['基础功能'],
  },
];

const mockCertificates: Certificate[] = [
  {
    id: 1,
    name: 'IDS连接器证书',
    type: 'x509',
    issuer: 'IDSA CA',
    subject: 'CN=connector.company.com',
    validFrom: '2023-01-01 00:00:00',
    validTo: '2024-01-01 00:00:00',
    status: 'valid',
    fingerprint: 'SHA256:1234567890abcdef...',
  },
  {
    id: 2,
    name: 'API访问令牌',
    type: 'jwt',
    issuer: '内部认证服务',
    subject: 'api-service',
    validFrom: '2023-10-01 00:00:00',
    validTo: '2023-11-01 00:00:00',
    status: 'valid',
    fingerprint: 'JWT:eyJhbGciOiJIUzI1NiIs...',
  },
  {
    id: 3,
    name: '过期证书',
    type: 'x509',
    issuer: 'Old CA',
    subject: 'CN=old.company.com',
    validFrom: '2022-01-01 00:00:00',
    validTo: '2023-01-01 00:00:00',
    status: 'expired',
    fingerprint: 'SHA256:abcdef1234567890...',
  },
];

const mockSessions: AuthSession[] = [
  {
    id: 1,
    userId: 1,
    username: 'admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    loginTime: '2023-10-15 09:00:00',
    lastActivity: '2023-10-15 14:30:25',
    status: 'active',
    location: '北京, 中国',
  },
  {
    id: 2,
    userId: 2,
    username: 'sales_manager',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    loginTime: '2023-10-15 08:30:00',
    lastActivity: '2023-10-15 13:45:12',
    status: 'active',
    location: '上海, 中国',
  },
  {
    id: 3,
    userId: 3,
    username: 'data_analyst',
    ipAddress: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    loginTime: '2023-10-15 10:00:00',
    lastActivity: '2023-10-15 11:20:45',
    status: 'active',
    location: '深圳, 中国',
  },
];

const Authentication = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setCertificates(mockCertificates);
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleViewCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setCertDialogOpen(true);
  };

  const handleCloseCertDialog = () => {
    setCertDialogOpen(false);
    setSelectedCert(null);
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleTerminateSession = (sessionId: number) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'expired' as const }
        : session
    ));
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'inactive':
        return <Chip label="停用" color="default" size="small" />;
      case 'locked':
        return <Chip label="锁定" color="error" size="small" />;
      case 'pending':
        return <Chip label="待审核" color="warning" size="small" />;
      case 'valid':
        return <Chip label="有效" color="success" size="small" />;
      case 'expired':
        return <Chip label="过期" color="error" size="small" />;
      case 'revoked':
        return <Chip label="已撤销" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getCertTypeIcon = (type: string) => {
    switch (type) {
      case 'x509':
        return <CertificateIcon />;
      case 'jwt':
        return <VpnKeyIcon />;
      case 'oauth':
        return <KeyIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const renderUsersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">用户管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          添加用户
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>用户</TableCell>
                  <TableCell>角色</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>最后登录</TableCell>
                  <TableCell>权限数量</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow hover key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {user.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.username} • {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusChip(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <Chip label={user.permissions.length} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="查看详情">
                          <IconButton size="small" onClick={() => handleViewUser(user)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'active' ? '停用' : '启用'}>
                          <IconButton 
                            size="small" 
                            color={user.status === 'active' ? 'error' : 'success'}
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === 'active' ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每页行数:"
            />
          </>
        )}
      </TableContainer>
    </Box>
  );

  const renderCertificatesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">证书管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          导入证书
        </Button>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          '& > *': {
            flex: '1 1 300px',
            minWidth: 300,
            maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' }
          }
        }}
      >
        {certificates.map((cert) => (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getCertTypeIcon(cert.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {cert.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  类型: {cert.type.toUpperCase()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  颁发者: {cert.issuer}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  主题: {cert.subject}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  有效期: {cert.validFrom} 至 {cert.validTo}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {getStatusChip(cert.status)}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button size="small" onClick={() => handleViewCert(cert)}>
                  查看详情
                </Button>
                <Button size="small" color="primary">
                  下载
                </Button>
                {cert.status === 'valid' && (
                  <Button size="small" color="error">
                    撤销
                  </Button>
                )}
              </CardActions>
            </Card>
        ))}
      </Box>
    </Box>
  );

  const renderSessionsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">活跃会话</Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />}>
          刷新
        </Button>
      </Box>
      
      <List>
        {sessions.map((session) => (
          <Paper key={session.id} sx={{ mb: 1 }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">{session.username}</Typography>
                    {getStatusChip(session.status)}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      IP: {session.ipAddress} • 位置: {session.location}
                    </Typography>
                    <Typography variant="caption" display="block">
                      登录时间: {session.loginTime}
                    </Typography>
                    <Typography variant="caption" display="block">
                      最后活动: {session.lastActivity}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      浏览器: {session.userAgent.substring(0, 50)}...
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {session.status === 'active' && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    终止会话
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        身份认证管理
      </Typography>

      {/* 统计卡片 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          '& > *': {
            flex: '1 1 240px',
            minWidth: 240,
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
          }
        }}
      >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{users.filter(u => u.status === 'active').length}</Typography>
                  <Typography variant="body2" color="text.secondary">活跃用户</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        
        <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CertificateIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{certificates.filter(c => c.status === 'valid').length}</Typography>
                  <Typography variant="body2" color="text.secondary">有效证书</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        
        <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{sessions.filter(s => s.status === 'active').length}</Typography>
                  <Typography variant="body2" color="text.secondary">活跃会话</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        
        <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{certificates.filter(c => c.status === 'expired').length}</Typography>
                  <Typography variant="body2" color="text.secondary">过期证书</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
      </Box>

      {/* 标签页 */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="用户管理" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="证书管理" icon={<CertificateIcon />} iconPosition="start" />
          <Tab label="会话管理" icon={<SecurityIcon />} iconPosition="start" />
        </Tabs>
        
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {currentTab === 0 && renderUsersTab()}
          {currentTab === 1 && renderCertificatesTab()}
          {currentTab === 2 && renderSessionsTab()}
        </Box>
      </Paper>

      {/* 用户详情对话框 */}
      <Dialog open={userDialogOpen} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>用户详情</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box 
              sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: 1,
                '& > *': {
                  flex: '1 1 250px',
                  minWidth: 250
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2">用户名</Typography>
                <Typography variant="body1" gutterBottom>{selectedUser.username}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">全名</Typography>
                <Typography variant="body1" gutterBottom>{selectedUser.fullName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">邮箱</Typography>
                <Typography variant="body1" gutterBottom>{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">角色</Typography>
                <Typography variant="body1" gutterBottom>{selectedUser.role}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">状态</Typography>
                <Typography variant="body1" gutterBottom>{getStatusChip(selectedUser.status)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">最后登录</Typography>
                <Typography variant="body1" gutterBottom>{selectedUser.lastLogin}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                <Typography variant="subtitle2">权限列表</Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedUser.permissions.map((permission, index) => (
                    <Chip key={index} label={permission} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 证书详情对话框 */}
      <Dialog open={certDialogOpen} onClose={handleCloseCertDialog} maxWidth="md" fullWidth>
        <DialogTitle>证书详情</DialogTitle>
        <DialogContent>
          {selectedCert && (
            <Box 
              sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mt: 1,
                '& > *': {
                  flex: '1 1 250px',
                  minWidth: 250
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2">证书名称</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">类型</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.type.toUpperCase()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">颁发者</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.issuer}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">主题</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">生效时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.validFrom}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">过期时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.validTo}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">状态</Typography>
                <Typography variant="body1" gutterBottom>{getStatusChip(selectedCert.status)}</Typography>
              </Box>
              <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                <Typography variant="subtitle2">指纹</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedCert.fingerprint}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCertDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Authentication;