import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  LinearProgress,
  Chip,
  Stack,
  Container,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Policy as PolicyIcon,
  SyncAlt as SyncAltIcon,
  Security as SecurityIcon,
  Store as StoreIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Monitor as MonitorIcon,
} from '@mui/icons-material';
import ResponsiveContainer from '../layouts/ResponsiveContainer';
import useResponsive from '../hooks/useResponsive';

// 模拟数据
const mockData = {
  resources: {
    total: 128,
    active: 112,
    inactive: 16,
  },
  policies: {
    total: 45,
    active: 42,
    pending: 3,
  },
  connections: {
    total: 24,
    active: 22,
    inactive: 2,
    exchangeRate: 87,
  },
  security: {
    complianceScore: 92,
    pendingIssues: 3,
    criticalIssues: 0,
  },
  ecosystem: {
    participants: 18,
    services: 34,
    transactions: {
      total: 1245,
      today: 42,
    },
  },
  analytics: {
    dataFlowVolume: 1.2, // GB
    valueScore: 78,
  },
  system: {
    status: 'healthy',
    uptime: '99.8%',
    lastUpdate: '2023-10-15',
  },
  recentActivities: [
    { id: 1, type: 'exchange', message: '数据交换请求 #1031 已完成', timestamp: '10分钟前', status: 'success' },
    { id: 2, type: 'policy', message: '新策略 "数据使用限制-财务数据" 已创建', timestamp: '1小时前', status: 'success' },
    { id: 3, type: 'security', message: '发现潜在安全风险', timestamp: '3小时前', status: 'warning' },
    { id: 4, type: 'system', message: '系统更新可用', timestamp: '1天前', status: 'info' },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // 模拟API请求
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <CheckCircleIcon color="info" />;
    }
  };

  // 统计卡片组件
  const StatCard = ({ icon, title, value, subtitle, chips, action, color = 'primary' }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
        }
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        {chips && (
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {chips}
          </Stack>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ px: 2, py: 2 }}>
        {action}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
      pb: 4
    }}>
      <ResponsiveContainer>
        {/* 页面头部 */}
        <Box sx={{ 
          pt: 4, 
          pb: 4,
          textAlign: 'center',
          position: 'relative'
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            仪表盘
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            欢迎使用IDS Connector GUI，这里是系统概览
          </Typography>
        </Box>

        {/* 核心指标区域 */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: theme.palette.text.primary,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2
              }
            }}
          >
            核心指标
          </Typography>
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'space-between',
              alignItems: 'stretch',
              '& > *': {
                flex: '1 1 250px',
                minWidth: 260,
                maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 2px)' }
              }
            }}
          >
            {/* 数据资源管理 */}
            <StatCard
              icon={<StorageIcon />}
              title="数据资源管理"
              value={data.resources.total}
              subtitle="总资源数"
              color="primary"
              chips={[
                <Chip
                  key="active"
                  label={`活跃: ${data.resources.active}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />,
                <Chip
                  key="inactive"
                  label={`非活跃: ${data.resources.inactive}`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              ]}
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/resources')}
                  sx={{ fontWeight: 500 }}
                >
                  查看详情
                </Button>
              }
            />

            {/* 策略管理 */}
            <StatCard
              icon={<PolicyIcon />}
              title="策略管理"
              value={data.policies.total}
              subtitle="总策略数"
              color="secondary"
              chips={[
                <Chip
                  key="active"
                  label={`活跃: ${data.policies.active}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />,
                <Chip
                  key="pending"
                  label={`待审核: ${data.policies.pending}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              ]}
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/policies')}
                  sx={{ fontWeight: 500 }}
                >
                  查看详情
                </Button>
              }
            />

            {/* 连接管理 */}
            <StatCard
              icon={<SyncAltIcon />}
              title="连接管理"
              value={data.connections.total}
              subtitle="总连接数"
              color="info"
              chips={[
                <Box key="progress" sx={{ width: '100%' }}>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                    数据交换成功率: {data.connections.exchangeRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.connections.exchangeRate}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ]}
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/connections')}
                  sx={{ fontWeight: 500 }}
                >
                  查看详情
                </Button>
              }
            />

            {/* 安全与合规 */}
            <StatCard
              icon={<SecurityIcon />}
              title="安全与合规"
              value={`${data.security.complianceScore}%`}
              subtitle="合规评分"
              color="success"
              chips={[
                <Chip
                  key="pending"
                  label={`待处理: ${data.security.pendingIssues}`}
                  size="small"
                  color={data.security.pendingIssues > 0 ? 'warning' : 'success'}
                  variant="outlined"
                />,
                <Chip
                  key="critical"
                  label={`严重: ${data.security.criticalIssues}`}
                  size="small"
                  color={data.security.criticalIssues > 0 ? 'error' : 'success'}
                  variant="outlined"
                />
              ]}
              action={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/security')}
                  sx={{ fontWeight: 500 }}
                >
                  查看详情
                </Button>
              }
            />
          </Box>
        </Box>

        {/* 活动与状态 */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 2,
              }
            }}
          >
            活动与状态
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            实时监控系统活动和运行状态
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
              alignItems: 'stretch',
              '& > *': {
                flex: '1 1 400px',
                minWidth: 400,
                maxWidth: { xs: '100%', md: 'calc(50% - 12px)' }
              },
              '@media (max-width: 480px)': {
                '& > *': {
                  minWidth: '100%',
                  flex: '1 1 100%'
                }
              }
            }}
          >
            {/* 最近活动 */}
            <Card
              sx={{
                height: '100%',
                borderTop: `4px solid ${theme.palette.info.main}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                     sx={{
                       bgcolor: alpha(theme.palette.info.main, 0.1),
                       color: theme.palette.info.main,
                       mr: 2,
                       width: 48,
                       height: 48,
                     }}
                   >
                     <HistoryIcon />
                   </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      最近活动
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      系统活动记录
                    </Typography>
                  </Box>
                </Box>
                <List sx={{ py: 0 }}>
                  {data.recentActivities.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        px: 0,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          borderRadius: 1,
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getStatusIcon(activity.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Divider />
              <CardActions sx={{ px: 3, py: 2 }}>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/activities')}
                  sx={{ fontWeight: 500 }}
                >
                  查看所有活动
                </Button>
              </CardActions>
            </Card>

            {/* 系统状态 */}
            <Card
              sx={{
                height: '100%',
                borderTop: `4px solid ${theme.palette.success.main}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                     sx={{
                       bgcolor: alpha(theme.palette.success.main, 0.1),
                       color: theme.palette.success.main,
                       mr: 2,
                       width: 48,
                       height: 48,
                     }}
                   >
                     <MonitorIcon />
                   </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      系统状态
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      运行监控信息
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <Typography variant="body2" sx={{ fontWeight: 500 }}>系统健康度:</Typography>
                     <Chip
                       label={data.system.status === 'healthy' ? '良好' : '异常'}
                       size="small"
                       color={data.system.status === 'healthy' ? 'success' : 'warning'}
                       sx={{ fontWeight: 500 }}
                     />
                   </Box>
                   <Box>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                       运行时间: <strong>{data.system.uptime}</strong>
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       最后更新: <strong>{data.system.lastUpdate}</strong>
                     </Typography>
                   </Box>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ px: 3, py: 2 }}>
                <Button
                   size="small"
                   endIcon={<ArrowForwardIcon />}
                   onClick={() => navigate('/system')}
                   sx={{ fontWeight: 500 }}
                 >
                   系统设置
                 </Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
       </ResponsiveContainer>
     </Box>
   );
};

export default Dashboard;