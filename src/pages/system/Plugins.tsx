import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Extension as ExtensionIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Update as UpdateIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// 插件类型定义
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  status: 'active' | 'inactive' | 'error' | 'update-available';
  type: 'connector' | 'security' | 'ui' | 'data' | 'integration';
  lastUpdated: string;
  size: string;
  dependencies: string[];
  permissions: string[];
}

// 模拟数据
const mockPlugins: Plugin[] = [
  {
    id: 'idsa-core',
    name: 'IDSA 核心组件',
    version: '1.2.0',
    description: '提供IDSA数据空间核心功能和协议支持',
    author: 'IDSA官方',
    enabled: true,
    status: 'active',
    type: 'connector',
    lastUpdated: '2024-05-15',
    size: '4.2 MB',
    dependencies: ['base-system'],
    permissions: ['network', 'storage'],
  },
  {
    id: 'data-catalog',
    name: '数据目录扩展',
    version: '0.9.5',
    description: '增强数据资产管理和元数据处理能力',
    author: '数据空间团队',
    enabled: true,
    status: 'update-available',
    type: 'data',
    lastUpdated: '2024-04-20',
    size: '2.8 MB',
    dependencies: ['idsa-core'],
    permissions: ['storage'],
  },
  {
    id: 'security-audit',
    name: '安全审计插件',
    version: '1.0.2',
    description: '提供高级安全审计和合规检查功能',
    author: '安全团队',
    enabled: true,
    status: 'active',
    type: 'security',
    lastUpdated: '2024-05-10',
    size: '1.5 MB',
    dependencies: ['idsa-core'],
    permissions: ['logs', 'network', 'security'],
  },
  {
    id: 'dashboard-plus',
    name: '增强仪表板',
    version: '0.8.0',
    description: '提供高级数据可视化和自定义仪表板功能',
    author: 'UI团队',
    enabled: false,
    status: 'inactive',
    type: 'ui',
    lastUpdated: '2024-03-25',
    size: '3.1 MB',
    dependencies: ['idsa-core', 'data-catalog'],
    permissions: ['ui'],
  },
  {
    id: 'api-gateway',
    name: 'API网关',
    version: '1.1.0',
    description: '提供统一的API管理和访问控制',
    author: '集成团队',
    enabled: true,
    status: 'error',
    type: 'integration',
    lastUpdated: '2024-04-05',
    size: '2.3 MB',
    dependencies: ['idsa-core'],
    permissions: ['network', 'api'],
  },
];

const Plugins = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // 处理搜索
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 过滤插件
  const filteredPlugins = plugins.filter((plugin) =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理插件启用/禁用
  const handleTogglePlugin = (id: string) => {
    setPlugins(
      plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, enabled: !plugin.enabled } : plugin
      )
    );
  };

  // 打开插件详情对话框
  const handleOpenDetails = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setOpenDialog(true);
  };

  // 关闭插件详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 打开上传对话框
  const handleOpenUploadDialog = () => {
    setUploadDialog(true);
  };

  // 关闭上传对话框
  const handleCloseUploadDialog = () => {
    setUploadDialog(false);
    setIsInstalling(false);
  };

  // 模拟安装插件
  const handleInstallPlugin = () => {
    setIsInstalling(true);
    setTimeout(() => {
      setIsInstalling(false);
      // 这里应该有实际的安装逻辑
    }, 2000);
  };

  // 获取插件类型颜色
  const getPluginTypeColor = (type: string) => {
    switch (type) {
      case 'connector':
        return 'primary';
      case 'security':
        return 'error';
      case 'ui':
        return 'success';
      case 'data':
        return 'info';
      case 'integration':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 获取插件类型名称
  const getPluginTypeName = (type: string) => {
    switch (type) {
      case 'connector':
        return '连接器';
      case 'security':
        return '安全';
      case 'ui':
        return '用户界面';
      case 'data':
        return '数据';
      case 'integration':
        return '集成';
      default:
        return type;
    }
  };

  // 获取插件状态图标
  const getPluginStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'inactive':
        return <InfoIcon color="disabled" />;
      case 'error':
        return <WarningIcon color="error" />;
      case 'update-available':
        return <UpdateIcon color="primary" />;
      default:
        return null;
    }
  };

  // 获取插件状态文本
  const getPluginStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '未激活';
      case 'error':
        return '错误';
      case 'update-available':
        return '可更新';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <ExtensionIcon sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4">插件管理</Typography>
      </Box>

      {/* 搜索和操作按钮 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="搜索插件..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ mr: 2 }}
          >
            刷新
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenUploadDialog}
          >
            上传插件
          </Button>
        </Grid>
      </Grid>

      {/* 插件卡片列表 */}
      <Grid container spacing={3}>
        {filteredPlugins.map((plugin) => (
          <Grid item xs={12} sm={6} md={4} key={plugin.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                    {plugin.name}
                  </Typography>
                  {getPluginStatusIcon(plugin.status)}
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    label={getPluginTypeName(plugin.type)}
                    size="small"
                    color={getPluginTypeColor(plugin.type)}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    v{plugin.version}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plugin.description}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    作者: {plugin.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    更新: {plugin.lastUpdated}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <FormControlLabel
                  control={
                    <Switch
                      checked={plugin.enabled}
                      onChange={() => handleTogglePlugin(plugin.id)}
                      size="small"
                    />
                  }
                  label={plugin.enabled ? "已启用" : "已禁用"}
                />
                <Box flexGrow={1} />
                <Button size="small" onClick={() => handleOpenDetails(plugin)}>
                  详情
                </Button>
                {plugin.status === 'update-available' && (
                  <Button size="small" color="primary" startIcon={<UpdateIcon />}>
                    更新
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 插件详情对话框 */}
      {selectedPlugin && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <ExtensionIcon sx={{ mr: 1 }} />
              {selectedPlugin.name}
              <Box flexGrow={1} />
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Chip
                    label={getPluginTypeName(selectedPlugin.type)}
                    color={getPluginTypeColor(selectedPlugin.type)}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={getPluginStatusText(selectedPlugin.status)}
                    color={
                      selectedPlugin.status === 'active' ? 'success' :
                      selectedPlugin.status === 'error' ? 'error' :
                      selectedPlugin.status === 'update-available' ? 'primary' : 'default'
                    }
                    icon={getPluginStatusIcon(selectedPlugin.status)}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body1">
                    版本: {selectedPlugin.version}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  {selectedPlugin.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    基本信息
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <InfoIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="插件ID"
                        secondary={selectedPlugin.id}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CodeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="作者"
                        secondary={selectedPlugin.author}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <UpdateIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="最后更新"
                        secondary={selectedPlugin.lastUpdated}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <StorageIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="大小"
                        secondary={selectedPlugin.size}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    依赖和权限
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    依赖项:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {selectedPlugin.dependencies.map((dep) => (
                      <Chip key={dep} label={dep} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    所需权限:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedPlugin.permissions.map((perm) => (
                      <Chip
                        key={perm}
                        label={perm}
                        size="small"
                        icon={perm === 'security' || perm === 'network' ? <SecurityIcon fontSize="small" /> : undefined}
                        color={perm === 'security' || perm === 'network' ? 'warning' : 'default'}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              {selectedPlugin.status === 'error' && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    此插件当前存在错误。错误原因：依赖冲突或配置问题。请检查系统日志获取详细信息。
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleTogglePlugin(selectedPlugin.id)}
              color={selectedPlugin.enabled ? 'error' : 'success'}
            >
              {selectedPlugin.enabled ? '禁用' : '启用'}
            </Button>
            {selectedPlugin.status === 'update-available' && (
              <Button color="primary" startIcon={<UpdateIcon />}>
                更新到新版本
              </Button>
            )}
            <Button color="error" startIcon={<DeleteIcon />}>
              卸载
            </Button>
            <Button onClick={handleCloseDialog}>
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* 上传插件对话框 */}
      <Dialog open={uploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CloudUploadIcon sx={{ mr: 1 }} />
            上传新插件
            <Box flexGrow={1} />
            <IconButton onClick={handleCloseUploadDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, border: '2px dashed #ccc', borderRadius: 2, textAlign: 'center', mb: 3 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              拖放插件文件到此处，或
            </Typography>
            <Button variant="outlined" component="label">
              浏览文件
              <input type="file" hidden />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              支持的格式: .zip, .jar (最大 10MB)
            </Typography>
          </Box>

          {isInstalling && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                正在安装插件...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          <TextField
            fullWidth
            label="插件来源 (可选)"
            placeholder="例如: 官方插件库, 第三方开发者"
            margin="normal"
          />

          <FormControlLabel
            control={<Switch defaultChecked />}
            label="安装后自动启用"
            sx={{ mt: 1 }}
          />

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              警告: 只安装来自可信来源的插件。未经验证的插件可能会对系统安全造成风险。
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>取消</Button>
          <Button
            variant="contained"
            onClick={handleInstallPlugin}
            disabled={isInstalling}
          >
            安装
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Plugins;