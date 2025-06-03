import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Alert,
  Divider
} from '@mui/material';
import {
  Storage as DatabaseIcon,
  Folder as FolderIcon,
  Cloud as CloudIcon,
  Api as ApiIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'filesystem' | 'cloud' | 'api';
  connectionString: string;
  priority: 'high' | 'medium' | 'low';
  securityLevel: 'public' | 'internal' | 'confidential';
}

interface DiscoveryResult {
  id: string;
  name: string;
  type: 'dataset' | 'table' | 'file';
  source: string;
  recordCount: number;
  columns: number;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  businessCategory: string;
  sensitiveData: boolean;
  confirmed: boolean;
}

const steps = ['数据源配置', '自动化扫描与分析', '发现结果确认'];

const DataDiscovery: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: '客户数据库',
      type: 'database',
      connectionString: 'postgresql://localhost:5432/customers',
      priority: 'high',
      securityLevel: 'confidential'
    },
    {
      id: '2',
      name: '产品文件系统',
      type: 'filesystem',
      connectionString: '/data/products',
      priority: 'medium',
      securityLevel: 'internal'
    }
  ]);
  
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'database',
    connectionString: '',
    priority: 'medium',
    securityLevel: 'internal'
  });
  
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningText, setScanningText] = useState('准备开始扫描...');
  const [scanComplete, setScanComplete] = useState(false);
  
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([
    {
      id: '1',
      name: '客户基本信息表',
      type: 'table',
      source: '客户数据库',
      recordCount: 15420,
      columns: 12,
      dataQuality: 'excellent',
      businessCategory: '客户管理',
      sensitiveData: true,
      confirmed: false
    },
    {
      id: '2',
      name: '订单历史数据',
      type: 'table',
      source: '客户数据库',
      recordCount: 89650,
      columns: 18,
      dataQuality: 'good',
      businessCategory: '交易管理',
      sensitiveData: false,
      confirmed: false
    },
    {
      id: '3',
      name: '产品规格文档',
      type: 'file',
      source: '产品文件系统',
      recordCount: 2340,
      columns: 0,
      dataQuality: 'fair',
      businessCategory: '产品管理',
      sensitiveData: false,
      confirmed: false
    }
  ]);

  const handleNext = () => {
    if (activeStep === 1 && !scanComplete) {
      startScanning();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addDataSource = () => {
    if (newDataSource.name && newDataSource.connectionString) {
      const dataSource: DataSource = {
        id: Date.now().toString(),
        name: newDataSource.name,
        type: newDataSource.type || 'database',
        connectionString: newDataSource.connectionString,
        priority: newDataSource.priority || 'medium',
        securityLevel: newDataSource.securityLevel || 'internal'
      };
      setDataSources([...dataSources, dataSource]);
      setNewDataSource({
        name: '',
        type: 'database',
        connectionString: '',
        priority: 'medium',
        securityLevel: 'internal'
      });
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    
    const scanSteps = [
      '连接数据源...',
      '扫描数据结构...',
      '提取元数据...',
      '分析数据血缘关系...',
      '识别敏感数据...',
      '评估数据质量...',
      '生成发现报告...'
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + (100 / (20 * 5)); // 20秒完成
        if (newProgress >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanComplete(true);
          setScanningText('扫描完成！');
          return 100;
        }
        
        // 更新扫描文本
        const stepIndex = Math.floor((newProgress / 100) * scanSteps.length);
        if (stepIndex < scanSteps.length && stepIndex !== currentStep) {
          setScanningText(scanSteps[stepIndex]);
          currentStep = stepIndex;
        }
        
        return newProgress;
      });
    }, 200);
  };

  const handleResultConfirm = (id: string, confirmed: boolean) => {
    setDiscoveryResults(results => 
      results.map(result => 
        result.id === id ? { ...result, confirmed } : result
      )
    );
  };

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'database': return <DatabaseIcon />;
      case 'filesystem': return <FolderIcon />;
      case 'cloud': return <CloudIcon />;
      case 'api': return <ApiIcon />;
      default: return <DatabaseIcon />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              配置数据源连接
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              配置企业数据资产的连接清单，包括数据源分类、优先级设定和安全访问策略。
            </Typography>
            
            {/* 现有数据源列表 */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>现有数据源</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {dataSources.map((source) => (
                <Box key={source.id} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getDataSourceIcon(source.type)}
                        <Typography variant="subtitle2">{source.name}</Typography>
                        <Chip 
                          label={source.priority} 
                          size="small" 
                          color={source.priority === 'high' ? 'error' : source.priority === 'medium' ? 'warning' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {source.connectionString}
                      </Typography>
                      <Typography variant="caption" display="block">
                        安全级别: {source.securityLevel}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
            
            {/* 添加新数据源 */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>添加新数据源</Typography>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label="数据源名称"
                        value={newDataSource.name}
                        onChange={(e) => setNewDataSource({...newDataSource, name: e.target.value})}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <FormControl fullWidth>
                        <InputLabel>数据源类型</InputLabel>
                        <Select
                          value={newDataSource.type}
                          label="数据源类型"
                          onChange={(e) => setNewDataSource({...newDataSource, type: e.target.value as any})}
                        >
                          <MenuItem value="database">数据库</MenuItem>
                          <MenuItem value="filesystem">文件系统</MenuItem>
                          <MenuItem value="cloud">云存储</MenuItem>
                          <MenuItem value="api">API接口</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    label="连接字符串"
                    value={newDataSource.connectionString}
                    onChange={(e) => setNewDataSource({...newDataSource, connectionString: e.target.value})}
                    placeholder="例如: postgresql://user:password@host:port/database"
                  />
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <FormControl fullWidth>
                        <InputLabel>优先级</InputLabel>
                        <Select
                          value={newDataSource.priority}
                          label="优先级"
                          onChange={(e) => setNewDataSource({...newDataSource, priority: e.target.value as any})}
                        >
                          <MenuItem value="high">高</MenuItem>
                          <MenuItem value="medium">中</MenuItem>
                          <MenuItem value="low">低</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <FormControl fullWidth>
                        <InputLabel>安全级别</InputLabel>
                        <Select
                          value={newDataSource.securityLevel}
                          label="安全级别"
                          onChange={(e) => setNewDataSource({...newDataSource, securityLevel: e.target.value as any})}
                        >
                          <MenuItem value="public">公开</MenuItem>
                          <MenuItem value="internal">内部</MenuItem>
                          <MenuItem value="confidential">机密</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Button variant="outlined" onClick={addDataSource} sx={{ alignSelf: 'flex-start' }}>
                    添加数据源
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              自动化扫描与元数据提取
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              系统正在对配置的数据源进行自动扫描，包括数据血缘关系追踪、敏感数据识别和数据质量初步评估。
            </Typography>
            
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="subtitle1">扫描进度</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(scanProgress)}%
                  </Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={scanProgress} 
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  {scanningText}
                </Typography>
                
                {scanComplete && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckIcon />
                      扫描完成！发现 {discoveryResults.length} 个数据资产，请进入下一步确认结果。
                    </Box>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {scanning && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>扫描详情</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px' }}>
                      <Typography variant="caption" display="block">数据源连接</Typography>
                      <Typography variant="body2">{dataSources.length} 个</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px' }}>
                      <Typography variant="caption" display="block">已扫描表/文件</Typography>
                      <Typography variant="body2">{Math.round(scanProgress * 0.23)} 个</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px' }}>
                      <Typography variant="caption" display="block">提取元数据</Typography>
                      <Typography variant="body2">{Math.round(scanProgress * 0.15)} 项</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px' }}>
                      <Typography variant="caption" display="block">敏感数据识别</Typography>
                      <Typography variant="body2">{Math.round(scanProgress * 0.08)} 项</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );
        
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              发现结果确认
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              请确认发现的数据资产信息，包括元数据确认、数据所有权分配和业务分类标记。
            </Typography>
            
            {/* 统计概览 */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">{discoveryResults.length}</Typography>
                    <Typography variant="caption">发现数据集</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {discoveryResults.reduce((sum, r) => sum + r.recordCount, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption">总记录数</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {discoveryResults.filter(r => r.sensitiveData).length}
                    </Typography>
                    <Typography variant="caption">敏感数据集</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '150px' }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {discoveryResults.filter(r => r.confirmed).length}/{discoveryResults.length}
                    </Typography>
                    <Typography variant="caption">已确认</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
            
            {/* 发现结果详情表 */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>确认</TableCell>
                    <TableCell>名称</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>数据源</TableCell>
                    <TableCell>记录数</TableCell>
                    <TableCell>字段数</TableCell>
                    <TableCell>数据质量</TableCell>
                    <TableCell>业务分类</TableCell>
                    <TableCell>敏感数据</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discoveryResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <Checkbox
                          checked={result.confirmed}
                          onChange={(e) => handleResultConfirm(result.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>
                        <Chip label={result.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{result.source}</TableCell>
                      <TableCell>{result.recordCount.toLocaleString()}</TableCell>
                      <TableCell>{result.columns || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={result.dataQuality} 
                          size="small" 
                          color={getQualityColor(result.dataQuality) as any}
                        />
                      </TableCell>
                      <TableCell>{result.businessCategory}</TableCell>
                      <TableCell>
                        {result.sensitiveData ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <CheckIcon color="success" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              请确认所有发现的数据资产信息。确认后，这些数据将自动添加到资源列表和数据目录中。
            </Alert>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        数据发现
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        通过自动化扫描和分析，发现企业数据资产并建立数据治理基础。
      </Typography>
      
      {/* 步骤导航 */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* 步骤内容 */}
      <Box sx={{ mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>
      
      {/* 导航按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          上一步
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === 1 && !scanComplete}
        >
          {activeStep === 1 && !scanning && !scanComplete ? '开始扫描' : 
           activeStep === steps.length - 1 ? '完成' : '下一步'}
        </Button>
      </Box>
    </Box>
  );
};

export default DataDiscovery;