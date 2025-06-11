import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Business as BusinessIcon,
  Dataset as DatasetIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import ResponsiveContainer from '../../../layouts/ResponsiveContainer';

// 合同协商步骤定义
const negotiationSteps = [
  {
    label: '发送合同请求',
    description: '向数据提供方发送包含合同条款意向的请求',
    automated: true,
  },
  {
    label: '提供方校验与响应',
    description: '数据提供方校验请求有效性并生成合同要约',
    automated: true,
  },
  {
    label: '消费者校验与处理',
    description: '接收并校验提供方的合同要约',
    automated: true,
  },
  {
    label: '人工审核与确认',
    description: '人工审核合同条款并做出决策',
    automated: false,
  },
  {
    label: '发送合同确认',
    description: '向提供方发送接受或拒绝的最终消息',
    automated: true,
  },
  {
    label: '提供方最终确认',
    description: '提供方进行最终校验并签署合同',
    automated: true,
  },
  {
    label: '合同生效与存储',
    description: '合同协议存储并通知相关方',
    automated: true,
  },
];

// 模拟数据源信息
const mockDataSource = {
  providerId: 'ORG-2024-001',
  providerName: '智能制造数据中心',
  connectorEndpoint: 'https://connector.smart-manufacturing.com',
  datasetUuid: 'DS-PROD-2024-0156',
  datasetName: '生产线实时监控数据集',
  datasetDescription: '包含温度、压力、振动等传感器数据，用于设备状态监控和预测性维护',
};

// 模拟合同条款
const mockContractTerms = {
  usagePolicy: '仅限内部研发使用，不得转售或分享给第三方',
  dataRetention: '数据保留期限：2年',
  accessFrequency: '每日最多访问1000次',
  pricePerMonth: 8500,
  currency: 'CNY',
  validityPeriod: '12个月',
  dataFormat: 'JSON, CSV',
  updateFrequency: '实时更新',
};

interface NegotiationStatus {
  currentStep: number;
  isNegotiating: boolean;
  isCompleted: boolean;
  error: string | null;
  contractAccepted: boolean | null;
}

const DataSubscription: React.FC = () => {
  const theme = useTheme();
  const [negotiationStatus, setNegotiationStatus] = useState<NegotiationStatus>({
    currentStep: -1,
    isNegotiating: false,
    isCompleted: false,
    error: null,
    contractAccepted: null,
  });
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<string[]>([]);

  // 开始协商流程
  const startNegotiation = () => {
    setNegotiationStatus({
      currentStep: 0,
      isNegotiating: true,
      isCompleted: false,
      error: null,
      contractAccepted: null,
    });
    setStepStatuses(new Array(negotiationSteps.length).fill('pending'));
    
    // 模拟自动化步骤执行
    executeAutomatedSteps();
  };

  // 执行自动化步骤
  const executeAutomatedSteps = async () => {
    for (let i = 0; i < 3; i++) { // 前3步是自动化的
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟处理时间
      
      setNegotiationStatus(prev => ({ ...prev, currentStep: i }));
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[i] = 'completed';
        return newStatuses;
      });
    }
    
    // 到达人工审核步骤
    setNegotiationStatus(prev => ({ ...prev, currentStep: 3 }));
    setStepStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[3] = 'active';
      return newStatuses;
    });
    setShowContractDialog(true);
  };

  // 处理合同确认
  const handleContractDecision = async (accepted: boolean) => {
    setShowContractDialog(false);
    setNegotiationStatus(prev => ({ ...prev, contractAccepted: accepted }));
    
    if (accepted) {
      // 继续执行剩余的自动化步骤
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[3] = 'completed';
        return newStatuses;
      });
      
      for (let i = 4; i < negotiationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setNegotiationStatus(prev => ({ ...prev, currentStep: i }));
        setStepStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[i] = 'completed';
          return newStatuses;
        });
      }
      
      // 协商完成
      setNegotiationStatus(prev => ({
        ...prev,
        isNegotiating: false,
        isCompleted: true,
      }));
    } else {
      // 拒绝合同
      setNegotiationStatus(prev => ({
        ...prev,
        isNegotiating: false,
        error: '合同协商被拒绝',
      }));
      setStepStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[3] = 'error';
        return newStatuses;
      });
    }
  };

  // 下载合同
  const downloadContract = () => {
    // 模拟下载功能
    const contractContent = `
数据订阅合同协议

提供方信息：
机构名称：${mockDataSource.providerName}
机构ID：${mockDataSource.providerId}
Connector端点：${mockDataSource.connectorEndpoint}

数据源信息：
数据集名称：${mockDataSource.datasetName}
数据集UUID：${mockDataSource.datasetUuid}
数据集描述：${mockDataSource.datasetDescription}

合同条款：
使用政策：${mockContractTerms.usagePolicy}
数据保留：${mockContractTerms.dataRetention}
访问频率：${mockContractTerms.accessFrequency}
价格：${mockContractTerms.pricePerMonth} ${mockContractTerms.currency}/月
有效期：${mockContractTerms.validityPeriod}
数据格式：${mockContractTerms.dataFormat}
更新频率：${mockContractTerms.updateFrequency}

数据空间运营平台背书：已获得IDSA数据空间运营平台的合规性背书

签署时间：${new Date().toLocaleString()}
    `;
    
    const blob = new Blob([contractContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `数据订阅合同_${mockDataSource.datasetName}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取步骤图标
  const getStepIcon = (index: number) => {
    const status = stepStatuses[index];
    if (status === 'completed') {
      return <CheckCircleIcon color="success" />;
    } else if (status === 'active') {
      return <CircularProgress size={24} />;
    } else if (status === 'error') {
      return <ErrorIcon color="error" />;
    } else {
      return <ScheduleIcon color="disabled" />;
    }
  };

  return (
    <ResponsiveContainer>
      <Box sx={{ p: 3 }}>
        {/* 页面标题 */}
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          数据订阅
        </Typography>

        {/* 信息展示区域 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">合同协商信息</Typography>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              本次活动的目的是与 <strong>{mockDataSource.providerName}</strong> 机构的 
              <strong>{mockDataSource.datasetName}</strong> 数据源订购事宜进行合同协商。
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* 提供方信息 */}
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  提供方信息
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>机构名称</TableCell>
                        <TableCell>{mockDataSource.providerName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>机构ID</TableCell>
                        <TableCell>{mockDataSource.providerId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Connector端点</TableCell>
                        <TableCell sx={{ wordBreak: 'break-all' }}>
                          {mockDataSource.connectorEndpoint}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* 数据源信息 */}
              <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  <DatasetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  数据源信息
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>数据集名称</TableCell>
                        <TableCell>{mockDataSource.datasetName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>数据集UUID</TableCell>
                        <TableCell>{mockDataSource.datasetUuid}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>描述</TableCell>
                        <TableCell>{mockDataSource.datasetDescription}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* 开始协商按钮 */}
        {!negotiationStatus.isNegotiating && !negotiationStatus.isCompleted && !negotiationStatus.error && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={startNegotiation}
              sx={{ px: 4, py: 1.5 }}
            >
              开始协商
            </Button>
          </Box>
        )}

        {/* 协商流程步骤 */}
        {(negotiationStatus.isNegotiating || negotiationStatus.isCompleted || negotiationStatus.error) && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <GavelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                合同协商流程
              </Typography>
              
              <Stepper activeStep={negotiationStatus.currentStep} orientation="vertical">
                {negotiationSteps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      icon={getStepIcon(index)}
                      optional={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={step.automated ? '自动' : '人工'}
                            size="small"
                            color={step.automated ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                          {stepStatuses[index] === 'active' && (
                            <Typography variant="caption" color="primary">
                              进行中...
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* 错误信息 */}
              {negotiationStatus.error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {negotiationStatus.error}
                </Alert>
              )}

              {/* 完成信息 */}
              {negotiationStatus.isCompleted && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    合同协商已成功完成！数据订阅合同已生效。
                  </Alert>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={downloadContract}
                    >
                      下载合同
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => window.print()}
                    >
                      打印合同
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* 合同审核对话框 */}
        <Dialog
          open={showContractDialog}
          onClose={() => {}}
          maxWidth="md"
          fullWidth
          disableEscapeKeyDown
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              人工审核 - 合同条款确认
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              请仔细审核以下合同条款，确认无误后选择接受或拒绝。
            </Alert>
            
            <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                合同条款详情
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>使用政策</TableCell>
                      <TableCell>{mockContractTerms.usagePolicy}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>数据保留期限</TableCell>
                      <TableCell>{mockContractTerms.dataRetention}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>访问频率限制</TableCell>
                      <TableCell>{mockContractTerms.accessFrequency}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>价格</TableCell>
                      <TableCell>
                        <Chip
                          label={`${mockContractTerms.pricePerMonth} ${mockContractTerms.currency}/月`}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>合同有效期</TableCell>
                      <TableCell>{mockContractTerms.validityPeriod}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>数据格式</TableCell>
                      <TableCell>{mockContractTerms.dataFormat}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>更新频率</TableCell>
                      <TableCell>{mockContractTerms.updateFrequency}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => handleContractDecision(false)}
              color="error"
              variant="outlined"
            >
              拒绝合同
            </Button>
            <Button
              onClick={() => handleContractDecision(true)}
              color="success"
              variant="contained"
              autoFocus
            >
              同意并签署
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ResponsiveContainer>
  );
};

export default DataSubscription;