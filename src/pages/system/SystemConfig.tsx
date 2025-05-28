import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  CloudSync as CloudSyncIcon,
  Api as ApiIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';

// 定义接口
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 选项卡面板组件
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`system-tabpanel-${index}`}
      aria-labelledby={`system-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SystemConfig = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 模拟系统配置数据
  const [config, setConfig] = useState({
    general: {
      systemName: 'IDSA 数据空间连接器',
      adminEmail: 'admin@example.com',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      autoUpdate: true,
      telemetry: true,
    },
    network: {
      hostAddress: '0.0.0.0',
      port: 8080,
      useHttps: true,
      proxyEnabled: false,
      proxyAddress: '',
      proxyPort: '',
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: 'strong',
      twoFactorAuth: true,
      allowedIPs: '*',
    },
    storage: {
      dataPath: '/data',
      tempPath: '/tmp',
      maxUploadSize: 100,
      backupEnabled: true,
      backupSchedule: '0 0 * * *',
      retentionDays: 30,
    },
    api: {
      enableREST: true,
      enableGraphQL: false,
      rateLimitPerMinute: 100,
      tokenExpiration: 24,
    },
    notifications: {
      email: true,
      slack: false,
      slackWebhook: '',
      systemAlerts: true,
      securityAlerts: true,
    },
  });

  // 处理选项卡变更
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理编辑模式切换
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveSuccess(false);
  };

  // 处理保存配置
  const handleSaveConfig = () => {
    // 这里应该有实际的保存逻辑
    setTimeout(() => {
      setSaveSuccess(true);
      setIsEditing(false);
    }, 1000);
  };

  // 处理配置字段变更
  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value,
      },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <SettingsIcon sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h4">系统配置</Typography>
        <Box flexGrow={1} />
        <Tooltip title={isEditing ? '取消编辑' : '编辑配置'}>
          <Button
            variant={isEditing ? 'outlined' : 'contained'}
            color={isEditing ? 'error' : 'primary'}
            startIcon={isEditing ? <CloseIcon /> : <EditIcon />}
            onClick={handleEditToggle}
            sx={{ mr: 1 }}
          >
            {isEditing ? '取消' : '编辑'}
          </Button>
        </Tooltip>
        {isEditing && (
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfig}
          >
            保存
          </Button>
        )}
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          配置已成功保存！
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<InfoIcon />} label="常规" />
          <Tab icon={<ApiIcon />} label="网络" />
          <Tab icon={<SecurityIcon />} label="安全" />
          <Tab icon={<StorageIcon />} label="存储" />
          <Tab icon={<CloudSyncIcon />} label="API" />
          <Tab icon={<NotificationsIcon />} label="通知" />
        </Tabs>

        {/* 常规设置 */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="系统名称"
                value={config.general.systemName}
                onChange={(e) => handleConfigChange('general', 'systemName', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="管理员邮箱"
                value={config.general.adminEmail}
                onChange={(e) => handleConfigChange('general', 'adminEmail', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="系统语言"
                value={config.general.language}
                onChange={(e) => handleConfigChange('general', 'language', e.target.value)}
                disabled={!isEditing}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English (US)</option>
                <option value="de-DE">Deutsch</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="时区"
                value={config.general.timezone}
                onChange={(e) => handleConfigChange('general', 'timezone', e.target.value)}
                disabled={!isEditing}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="Asia/Shanghai">亚洲/上海 (GMT+8)</option>
                <option value="Europe/Berlin">欧洲/柏林 (GMT+1)</option>
                <option value="America/New_York">美国/纽约 (GMT-5)</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.general.autoUpdate}
                    onChange={(e) => handleConfigChange('general', 'autoUpdate', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用自动更新"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.general.telemetry}
                    onChange={(e) => handleConfigChange('general', 'telemetry', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="允许发送匿名使用统计"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* 网络设置 */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="主机地址"
                value={config.network.hostAddress}
                onChange={(e) => handleConfigChange('network', 'hostAddress', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="端口"
                type="number"
                value={config.network.port}
                onChange={(e) => handleConfigChange('network', 'port', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.network.useHttps}
                    onChange={(e) => handleConfigChange('network', 'useHttps', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="使用HTTPS"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.network.proxyEnabled}
                    onChange={(e) => handleConfigChange('network', 'proxyEnabled', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用代理"
              />
            </Grid>
            {config.network.proxyEnabled && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="代理地址"
                    value={config.network.proxyAddress}
                    onChange={(e) => handleConfigChange('network', 'proxyAddress', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="代理端口"
                    value={config.network.proxyPort}
                    onChange={(e) => handleConfigChange('network', 'proxyPort', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* 安全设置 */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="会话超时（分钟）"
                type="number"
                value={config.security.sessionTimeout}
                onChange={(e) => handleConfigChange('security', 'sessionTimeout', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="最大登录尝试次数"
                type="number"
                value={config.security.maxLoginAttempts}
                onChange={(e) => handleConfigChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="密码策略"
                value={config.security.passwordPolicy}
                onChange={(e) => handleConfigChange('security', 'passwordPolicy', e.target.value)}
                disabled={!isEditing}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="weak">基本 (至少8个字符)</option>
                <option value="medium">中等 (字母+数字, 至少8个字符)</option>
                <option value="strong">强 (大小写字母+数字+特殊字符, 至少10个字符)</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.security.twoFactorAuth}
                    onChange={(e) => handleConfigChange('security', 'twoFactorAuth', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用双因素认证"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="允许的IP地址 (使用逗号分隔, * 表示所有)"
                value={config.security.allowedIPs}
                onChange={(e) => handleConfigChange('security', 'allowedIPs', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* 存储设置 */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="数据存储路径"
                value={config.storage.dataPath}
                onChange={(e) => handleConfigChange('storage', 'dataPath', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="临时文件路径"
                value={config.storage.tempPath}
                onChange={(e) => handleConfigChange('storage', 'tempPath', e.target.value)}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="最大上传大小 (MB)"
                type="number"
                value={config.storage.maxUploadSize}
                onChange={(e) => handleConfigChange('storage', 'maxUploadSize', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.storage.backupEnabled}
                    onChange={(e) => handleConfigChange('storage', 'backupEnabled', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用自动备份"
              />
            </Grid>
            {config.storage.backupEnabled && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="备份计划 (Cron表达式)"
                    value={config.storage.backupSchedule}
                    onChange={(e) => handleConfigChange('storage', 'backupSchedule', e.target.value)}
                    disabled={!isEditing}
                    margin="normal"
                    helperText="例如: 0 0 * * * (每天午夜)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="备份保留天数"
                    type="number"
                    value={config.storage.retentionDays}
                    onChange={(e) => handleConfigChange('storage', 'retentionDays', parseInt(e.target.value))}
                    disabled={!isEditing}
                    margin="normal"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* API设置 */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.api.enableREST}
                    onChange={(e) => handleConfigChange('api', 'enableREST', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用REST API"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.api.enableGraphQL}
                    onChange={(e) => handleConfigChange('api', 'enableGraphQL', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用GraphQL API"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API速率限制 (每分钟请求数)"
                type="number"
                value={config.api.rateLimitPerMinute}
                onChange={(e) => handleConfigChange('api', 'rateLimitPerMinute', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="令牌过期时间 (小时)"
                type="number"
                value={config.api.tokenExpiration}
                onChange={(e) => handleConfigChange('api', 'tokenExpiration', parseInt(e.target.value))}
                disabled={!isEditing}
                margin="normal"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* 通知设置 */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.notifications.email}
                    onChange={(e) => handleConfigChange('notifications', 'email', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用电子邮件通知"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.notifications.slack}
                    onChange={(e) => handleConfigChange('notifications', 'slack', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="启用Slack通知"
              />
            </Grid>
            {config.notifications.slack && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slack Webhook URL"
                  value={config.notifications.slackWebhook}
                  onChange={(e) => handleConfigChange('notifications', 'slackWebhook', e.target.value)}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.notifications.systemAlerts}
                    onChange={(e) => handleConfigChange('notifications', 'systemAlerts', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="系统警报通知"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.notifications.securityAlerts}
                    onChange={(e) => handleConfigChange('notifications', 'securityAlerts', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="安全警报通知"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{ mr: 2 }}
        >
          重置为默认值
        </Button>
        <Button
          variant="outlined"
          startIcon={<BackupIcon />}
        >
          导出配置
        </Button>
      </Box>
    </Box>
  );
};

export default SystemConfig;