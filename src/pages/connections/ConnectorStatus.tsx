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
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// 模拟数据
interface Connector {
  id: number;
  name: string;
  type: string;
  endpoint: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  uptime: string;
  lastConnection: string;
  dataTransferred: string;
  cpuUsage: number;
  memoryUsage: number;
  description: string;
  logs: {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }[];
}

const mockConnectors: Connector[] = [
  {
    id: 1,
    name: '主数据连接器',
    type: '外部连接器',
    endpoint: 'https://connector1.example.com',
    status: 'online',
    uptime: '15天4小时',
    lastConnection: '2分钟前',
    dataTransferred: '1.2 GB',
    cpuUsage: 35,
    memoryUsage: 42,
    description: '连接到主数据空间的外部连接器',
    logs: [
      { timestamp: '2023-10-15 14:30:22', level: 'info', message: '成功建立连接' },
      { timestamp: '2023-10-15 14:25:10', level: 'info', message: '数据交换完成: 25MB' },
      { timestamp: '2023-10-15 13:45:32', level: 'warning', message: '连接延迟增加' },
    ],
  },
  {
    id: 2,
    name: '财务数据连接器',
    type: '内部连接器',
    endpoint: 'https://finance-connector.internal',
    status: 'warning',
    uptime: '7天12小时',
    lastConnection: '15分钟前',
    dataTransferred: '450 MB',
    cpuUsage: 65,
    memoryUsage: 78,
    description: '连接到财务系统的内部连接器',
    logs: [
      { timestamp: '2023-10-15 14:10:05', level: 'warning', message: 'CPU使用率超过60%' },
      { timestamp: '2023-10-15 13:55:22', level: 'info', message: '数据交换完成: 15MB' },
      { timestamp: '2023-10-15 13:30:18', level: 'info', message: '成功建立连接' },
    ],
  },
  {
    id: 3,
    name: '合作伙伴连接器',
    type: '外部连接器',
    endpoint: 'https://partner-connector.example.com',
    status: 'offline',
    uptime: '0',
    lastConnection: '2天前',
    dataTransferred: '2.5 GB',
    cpuUsage: 0,
    memoryUsage: 0,
    description: '连接到合作伙伴数据空间的外部连接器',
    logs: [
      { timestamp: '2023-10-13 09:15:30', level: 'error', message: '连接断开' },
      { timestamp: '2023-10-13 09:10:22', level: 'warning', message: '连接不稳定' },
      { timestamp: '2023-10-13 08:55:10', level: 'info', message: '数据交换完成: 50MB' },
    ],
  },
  {
    id: 4,
    name: '产品数据连接器',
    type: '内部连接器',
    endpoint: 'https://product-connector.internal',
    status: 'online',
    uptime: '30天2小时',
    lastConnection: '5分钟前',
    dataTransferred: '3.7 GB',
    cpuUsage: 28,
    memoryUsage: 35,
    description: '连接到产品管理系统的内部连接器',
    logs: [
      { timestamp: '2023-10-15 14:20:15', level: 'info', message: '数据交换完成: 30MB' },
      { timestamp: '2023-10-15 14:15:05', level: 'info', message: '成功建立连接' },
      { timestamp: '2023-10-15 13:50:22', level: 'info', message: '连接器配置更新' },
    ],
  },
  {
    id: 5,
    name: '研发数据连接器',
    type: '内部连接器',
    endpoint: 'https://rd-connector.internal',
    status: 'error',
    uptime: '2小时',
    lastConnection: '30分钟前',
    dataTransferred: '120 MB',
    cpuUsage: 90,
    memoryUsage: 95,
    description: '连接到研发系统的内部连接器',
    logs: [
      { timestamp: '2023-10-15 14:00:10', level: 'error', message: '内存使用率过高' },
      { timestamp: '2023-10-15 13:55:30', level: 'error', message: 'CPU使用率过高' },
      { timestamp: '2023-10-15 13:45:22', level: 'warning', message: '资源使用率增加' },
    ],
  },
];

const ConnectorStatus = () => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'stop' | 'restart'>('start');

  useEffect(() => {
    // 模拟API请求
    const timer = setTimeout(() => {
      setConnectors(mockConnectors);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // 模拟刷新
    setTimeout(() => {
      setConnectors(mockConnectors);
      setLoading(false);
    }, 1000);
  };

  const handleViewLogs = (connector: Connector) => {
    setSelectedConnector(connector);
    setLogDialogOpen(true);
  };

  const handleCloseLogDialog = () => {
    setLogDialogOpen(false);
  };

  const handleAction = (connector: Connector, action: 'start' | 'stop' | 'restart') => {
    setSelectedConnector(connector);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedConnector) return;

    // 模拟执行操作
    const updatedConnectors = [...connectors];
    const index = updatedConnectors.findIndex((c) => c.id === selectedConnector.id);

    if (index !== -1) {
      if (actionType === 'start') {
        updatedConnectors[index].status = 'online';
      } else if (actionType === 'stop') {
        updatedConnectors[index].status = 'offline';
      } else if (actionType === 'restart') {
        // 模拟重启过程
        updatedConnectors[index].status = 'offline';
        setTimeout(() => {
          const restartedConnectors = [...updatedConnectors];
          restartedConnectors[index].status = 'online';
          setConnectors(restartedConnectors);
        }, 2000);
      }

      setConnectors(updatedConnectors);
    }

    setActionDialogOpen(false);
  };

  const handleCloseActionDialog = () => {
    setActionDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon color="success" />;
      case 'offline':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'online':
        return <Chip label="在线" color="success" size="small" />;
      case 'offline':
        return <Chip label="离线" color="error" size="small" />;
      case 'warning':
        return <Chip label="警告" color="warning" size="small" />;
      case 'error':
        return <Chip label="错误" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <InfoIcon color="info" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return <InfoIcon color="info" fontSize="small" />;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">连接器状态监控</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          刷新
        </Button>
      </Box>

      {loading ? (
        <LinearProgress sx={{ mb: 2 }} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {connectors.map((connector) => (
            <Box
              key={connector.id}
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' },
              }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(connector.status)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {connector.name}
                      </Typography>
                    </Box>
                    {getStatusChip(connector.status)}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {connector.description}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>类型:</strong> {connector.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>端点:</strong> {connector.endpoint}
                    </Typography>
                    <Typography variant="body2">
                      <strong>运行时间:</strong> {connector.uptime}
                    </Typography>
                    <Typography variant="body2">
                      <strong>最后连接:</strong> {connector.lastConnection}
                    </Typography>
                    <Typography variant="body2">
                      <strong>数据传输量:</strong> {connector.dataTransferred}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      CPU 使用率: {connector.cpuUsage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={connector.cpuUsage}
                      color={
                        connector.cpuUsage > 80
                          ? 'error'
                          : connector.cpuUsage > 60
                          ? 'warning'
                          : 'success'
                      }
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />

                    <Typography variant="body2" gutterBottom>
                      内存使用率: {connector.memoryUsage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={connector.memoryUsage}
                      color={
                        connector.memoryUsage > 80
                          ? 'error'
                          : connector.memoryUsage > 60
                          ? 'warning'
                          : 'success'
                      }
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Tooltip title="查看日志">
                    <IconButton
                      size="small"
                      onClick={() => handleViewLogs(connector)}
                      color="primary"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {connector.status === 'online' ? (
                    <Tooltip title="停止连接器">
                      <IconButton
                        size="small"
                        onClick={() => handleAction(connector, 'stop')}
                        color="error"
                      >
                        <StopIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="启动连接器">
                      <IconButton
                        size="small"
                        onClick={() => handleAction(connector, 'start')}
                        color="success"
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="重启连接器">
                    <IconButton
                      size="small"
                      onClick={() => handleAction(connector, 'restart')}
                      color="primary"
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="配置">
                    <IconButton size="small" color="primary">
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* 日志对话框 */}
      <Dialog
        open={logDialogOpen}
        onClose={handleCloseLogDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedConnector?.name} - 日志
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedConnector?.logs.map((log, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getLogLevelIcon(log.level)}
                </ListItemIcon>
                <ListItemText
                  primary={log.message}
                  secondary={log.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogDialog}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 操作确认对话框 */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleCloseActionDialog}
      >
        <DialogTitle>
          确认{actionType === 'start' ? '启动' : actionType === 'stop' ? '停止' : '重启'}连接器
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要{actionType === 'start' ? '启动' : actionType === 'stop' ? '停止' : '重启'}
            连接器 "{selectedConnector?.name}" 吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog}>取消</Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConnectorStatus;