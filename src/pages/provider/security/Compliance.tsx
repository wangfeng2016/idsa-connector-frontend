import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

// 合规检查步骤
const complianceSteps = [
  '数据安全检查',
  '隐私合规检查',
  '访问控制审计',
  '数据交换合规性',
  '生成合规报告',
];

// 合规策略类型
interface CompliancePolicy {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  lastChecked: string;
  result: 'passed' | 'warning' | 'failed';
}

// 合规历史记录
interface ComplianceHistory {
  id: number;
  timestamp: string;
  event: string;
  type: string;
  result: 'passed' | 'warning' | 'failed';
  details: string;
}

// 模拟数据
const mockPolicies: CompliancePolicy[] = [
  {
    id: 1,
    name: 'GDPR合规检查',
    description: '确保数据处理符合GDPR要求',
    status: 'active',
    lastChecked: '2024-01-20 10:30:00',
    result: 'passed',
  },
  {
    id: 2,
    name: '数据分类合规',
    description: '检查数据分类和标签是否符合规定',
    status: 'active',
    lastChecked: '2024-01-20 11:15:00',
    result: 'warning',
  },
  {
    id: 3,
    name: '数据访问审计',
    description: '审计数据访问记录和权限设置',
    status: 'active',
    lastChecked: '2024-01-20 14:20:00',
    result: 'failed',
  },
];

const mockHistory: ComplianceHistory[] = [
  {
    id: 1,
    timestamp: '2024-01-20 10:30:00',
    event: 'GDPR合规检查',
    type: '定期检查',
    result: 'passed',
    details: '所有检查项均通过',
  },
  {
    id: 2,
    timestamp: '2024-01-20 11:15:00',
    event: '数据分类合规检查',
    type: '手动检查',
    result: 'warning',
    details: '部分数据缺少必要标签',
  },
  {
    id: 3,
    timestamp: '2024-01-20 14:20:00',
    event: '数据访问审计',
    type: '自动检查',
    result: 'failed',
    details: '发现未授权访问记录',
  },
];

const Compliance = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // 处理标签页切换
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 获取状态图标
  const getStatusIcon = (result: string) => {
    switch (result) {
      case 'passed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        合规管理
      </Typography>

      {/* 合规检查进度 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            合规检查进度
          </Typography>
          <Stepper activeStep={activeStep}>
            {complianceSteps.map((label, _index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => (prev + 1) % complianceSteps.length)}
            >
              {activeStep === complianceSteps.length - 1 ? '完成' : '下一步'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 合规策略和历史记录标签页 */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              icon={<AssignmentIcon />}
              iconPosition="start"
              label="合规策略"
            />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label="合规历史"
            />
          </Tabs>

          {/* 合规策略列表 */}
          {tabValue === 0 && (
            <Box 
              sx={{ 
                mt: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '@media (min-width: 768px)': {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 3,
                },
              }}
            >
              {mockPolicies.map((policy) => (
                <Box 
                  key={policy.id}
                  sx={{
                    flex: '1 1 100%',
                    minWidth: 0,
                    '@media (min-width: 768px)': {
                      flex: '1 1 calc(50% - 12px)',
                      maxWidth: 'calc(50% - 12px)',
                    },
                    '@media (min-width: 1200px)': {
                      flex: '1 1 calc(33.333% - 16px)',
                      maxWidth: 'calc(33.333% - 16px)',
                    },
                  }}
                >
                  <Card 
                    variant="outlined"
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box 
                        sx={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
                          {policy.name}
                        </Typography>
                        {getStatusIcon(policy.result)}
                      </Box>
                      <Typography 
                        color="textSecondary" 
                        sx={{ 
                          mb: 2,
                          flex: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        {policy.description}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          最后检查时间: {policy.lastChecked}
                        </Typography>
                        <Typography 
                          variant="body2"
                          sx={{
                            color: policy.status === 'active' ? 'success.main' : 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          状态: {policy.status === 'active' ? '启用' : '禁用'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}

          {/* 合规历史记录 */}
          {tabValue === 1 && (
            <Timeline sx={{ mt: 2 }}>
              {mockHistory.map((history) => (
                <TimelineItem key={history.id}>
                  <TimelineOppositeContent color="textSecondary">
                    {history.timestamp}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={
                      history.result === 'passed' ? 'success' :
                      history.result === 'warning' ? 'warning' : 'error'
                    }>
                      {getStatusIcon(history.result)}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">{history.event}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      类型: {history.type}
                    </Typography>
                    <Typography>{history.details}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Compliance;