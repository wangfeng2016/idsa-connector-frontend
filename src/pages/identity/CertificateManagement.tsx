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
  Certificate as CertificateIcon,
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

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CertificateIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {certificates.filter(c => c.status === 'valid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">有效证书</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {certificates.filter(c => c.status === 'expired').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">过期证书</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {certificates.filter(c => c.type === 'x509').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">X.509证书</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {certificates.filter(c => ['jwt', 'oauth'].includes(c.type)).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">令牌/密钥</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 证书列表 */}
      <Paper sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={2} sx={{ p: 2 }}>
            {certificates.map((cert) => (
              <Grid item xs={12} md={6} lg={4} key={cert.id}>
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
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* 证书详情对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>证书详情</DialogTitle>
        <DialogContent>
          {selectedCert && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">证书名称</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">类型</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.type.toUpperCase()}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">颁发者</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.issuer}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">主题</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.subject}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">生效时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.validFrom}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">过期时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedCert.validTo}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">状态</Typography>
                <Typography variant="body1" gutterBottom>{getStatusChip(selectedCert.status)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">指纹</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {selectedCert.fingerprint}
                </Typography>
              </Grid>
              {selectedCert.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">描述</Typography>
                  <Typography variant="body1" gutterBottom>{selectedCert.description}</Typography>
                </Grid>
              )}
            </Grid>
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