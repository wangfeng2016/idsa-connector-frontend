import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Key as KeyIcon,
  VerifiedUser as CertificateIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// 类型定义
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
  description?: string;
}

// 模拟数据
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
    description: 'IDS连接器的主证书，用于身份认证和数据交换',
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
    description: '用于API服务之间的认证',
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
    description: '已过期的旧证书',
  },
];

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [certPassword, setCertPassword] = useState('');

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setCertificates(mockCertificates);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCert(null);
  };

  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
    setNewCertFile(null);
    setCertPassword('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewCertFile(event.target.files[0]);
    }
  };

  const handleImportCert = () => {
    // 模拟证书导入
    console.log('导入证书:', newCertFile?.name, '密码:', certPassword);
    handleCloseImportDialog();
  };

  const handleDeleteCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCert) {
      // 模拟删除证书
      setCertificates(prev => prev.filter(c => c.id !== selectedCert.id));
      setDeleteDialogOpen(false);
      setSelectedCert(null);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'valid':
        return <Chip label="有效" color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'expired':
        return <Chip label="过期" color="error" size="small" icon={<WarningIcon />} />;
      case 'revoked':
        return <Chip label="已撤销" color="error" size="small" icon={<DeleteIcon />} />;
      case 'pending':
        return <Chip label="待处理" color="warning" size="small" icon={<RefreshIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getCertTypeIcon = (type: string) => {
    switch (type) {
      case 'x509':
        return <CertificateIcon />;
      case 'jwt':
        return <SecurityIcon />;
      case 'oauth':
        return <KeyIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">证书管理</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleOpenImportDialog}
            sx={{ mr: 2 }}
          >
            导入证书
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setLoading(true)}
          >
            刷新
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 - Flex布局 */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 3,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
            minWidth: { xs: '100%', sm: '200px', md: '180px' }
          }
        }}
      >
        <Card 
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CertificateIcon sx={{ fontSize: 40, mr: 2, color: 'rgba(255,255,255,0.9)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {certificates.filter(c => c.status === 'valid').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>有效证书</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{
            background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(244, 67, 54, 0.4)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, mr: 2, color: 'rgba(255,255,255,0.9)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {certificates.filter(c => c.status === 'expired').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>过期证书</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{
            background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(33, 150, 243, 0.4)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'rgba(255,255,255,0.9)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {certificates.filter(c => c.type === 'x509').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>X.509证书</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(255, 152, 0, 0.4)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <KeyIcon sx={{ fontSize: 40, mr: 2, color: 'rgba(255,255,255,0.9)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {certificates.filter(c => ['jwt', 'oauth'].includes(c.type)).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>令牌/密钥</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 证书列表 */}
      <Paper sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              p: 2,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)', lg: '1 1 calc(33.333% - 11px)' },
                minWidth: { xs: '100%', md: '300px', lg: '280px' }
              }
            }}
          >
            {certificates.map((cert) => (
                <Card key={cert.id}>
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

                    {cert.description && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        描述: {cert.description}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                      {getStatusChip(cert.status)}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" onClick={() => handleViewCert(cert)}>
                      查看详情
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      disabled={cert.status !== 'valid'}
                    >
                      下载
                    </Button>
                    {cert.status === 'valid' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCert(cert)}
                      >
                        删除
                      </Button>
                    )}
                  </CardActions>
                </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* 证书详情对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>证书详情</DialogTitle>
        <DialogContent>
          {selectedCert && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3, 
              mt: 1,
              '& .cert-field': {
                padding: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(156, 39, 176, 0.08) 100%)'
                }
              }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2,
                '& > *': { 
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                  minWidth: 0
                }
              }}>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>证书名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.name}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>类型</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.type.toUpperCase()}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>颁发者</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.issuer}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>主题</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.subject}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>生效时间</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.validFrom}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>过期时间</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.validTo}</Typography>
                </Box>
                <Box className="cert-field">
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>状态</Typography>
                  <Typography variant="body1" gutterBottom>{getStatusChip(selectedCert.status)}</Typography>
                </Box>
              </Box>
              <Box className="cert-field" sx={{ flex: '1 1 100%' }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>指纹</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedCert.fingerprint}
                </Typography>
              </Box>
              {selectedCert.description && (
                <Box className="cert-field" sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>描述</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.description}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 导入证书对话框 */}
      <Dialog open={importDialogOpen} onClose={handleCloseImportDialog} maxWidth="sm" fullWidth>
        <DialogTitle>导入证书</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".crt,.cer,.pem,.key,.pfx,.p12"
              style={{ display: 'none' }}
              id="cert-file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="cert-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                选择证书文件
              </Button>
            </label>
            {newCertFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                已选择: {newCertFile.name}
              </Typography>
            )}
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="证书密码（如果需要）"
              value={certPassword}
              onChange={(e) => setCertPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>取消</Button>
          <Button
            onClick={handleImportCert}
            variant="contained"
            disabled={!newCertFile}
          >
            导入
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除证书 "{selectedCert?.name}" 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateManagement;