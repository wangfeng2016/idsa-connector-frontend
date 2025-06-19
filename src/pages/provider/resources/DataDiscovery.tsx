import React, { useState } from 'react';
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
  Alert,
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
  type: 'database' | 'filesystem';
  // 数据库连接信息
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  // 文件系统连接信息
  path?: string;
  recursive?: boolean;
  filePattern?: string;
}

interface DiscoveryResult {
  id: string;
  name: string;
  type: 'dataset' | 'table' | 'file';
  source: string;
  recordCount: number;
  columns: number;
  fileSize?: number; // 文件大小（字节）
  estimatedSize?: string; // 估算大小（如"1.2GB"）
  confirmed: boolean;
}

interface ResourceInfo {
  assetId: string;
  businessDomain: string;
  owner: string;
  accessLevel: 'public' | 'internal' | 'confidential';
  tags: string[];
  description?: string;
  category?: string;
}

const steps = ['数据源配置', '自动化扫描与分析', '发现结果确认', '资源信息完善'];

const DataDiscovery: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: '客户数据库',
      type: 'database',
      host: 'localhost',
      port: 5432,
      database: 'customers',
      username: 'admin',
      password: '******'
    },
    {
      id: '2',
      name: '产品文件系统',
      type: 'filesystem',
      path: '/data/products',
      recursive: true,
      filePattern: '*.csv,*.json'
    }
  ]);
  
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'database',
    host: '',
    port: undefined,
    database: '',
    username: '',
    password: '',
    path: '',
    recursive: false,
    filePattern: ''
  });
  
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningText, setScanningText] = useState('准备开始扫描...');
  const [scanComplete, setScanComplete] = useState(false);
  
  // 资源信息完善相关状态
  const [resourcesInfo, setResourcesInfo] = useState<ResourceInfo[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([
    {
      id: '1',
      name: '客户基本信息表',
      type: 'table',
      source: '客户数据库',
      recordCount: 15420,
      columns: 12,
      fileSize: 2048576, // 2MB
      estimatedSize: '2.0MB',
      confirmed: false
    },
    {
      id: '2',
      name: '订单历史数据',
      type: 'table',
      source: '客户数据库',
      recordCount: 89650,
      columns: 18,
      fileSize: 15728640, // 15MB
      estimatedSize: '15.0MB',
      confirmed: false
    },
    {
      id: '3',
      name: '产品规格文档',
      type: 'file',
      source: '产品文件系统',
      recordCount: 2340,
      columns: 0,
      fileSize: 524288, // 512KB
      estimatedSize: '512KB',
      confirmed: false
    }
  ]);

  const handleNext = () => {
    if (activeStep === 1 && !scanComplete) {
      startScanning();
    } else if (activeStep === 2) {
      // 确认发现结果，进入资源信息完善步骤
      const confirmedAssets = discoveryResults.filter(r => r.confirmed);
      const initialResourcesInfo = confirmedAssets.map(asset => ({
        assetId: asset.id,
        businessDomain: '',
        owner: '',
        accessLevel: 'internal' as const,
        tags: [],
        description: '',
        category: ''
      }));
      setResourcesInfo(initialResourcesInfo);
      setSessionId(`session_${Date.now()}`);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addDataSource = () => {
    const isValidDatabase = newDataSource.type === 'database' && 
      newDataSource.name && newDataSource.host && newDataSource.port && 
      newDataSource.database && newDataSource.username && newDataSource.password;
    
    const isValidFilesystem = newDataSource.type === 'filesystem' && 
      newDataSource.name && newDataSource.path;
    
    if (isValidDatabase || isValidFilesystem) {
      const dataSource: DataSource = {
        id: Date.now().toString(),
        name: newDataSource.name!,
        type: newDataSource.type || 'database',
        ...(newDataSource.type === 'database' ? {
          host: newDataSource.host,
          port: newDataSource.port,
          database: newDataSource.database,
          username: newDataSource.username,
          password: newDataSource.password
        } : {
          path: newDataSource.path,
          recursive: newDataSource.recursive,
          filePattern: newDataSource.filePattern
        })
      };
      setDataSources([...dataSources, dataSource]);
      setNewDataSource({
        name: '',
        type: 'database',
        host: '',
        port: undefined,
        database: '',
        username: '',
        password: '',
        path: '',
        recursive: false,
        filePattern: ''
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
                <Box sx={{ flex: '1 1 calc(25% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }} key={source.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getDataSourceIcon(source.type)}
                        <Typography variant="subtitle2">{source.name}</Typography>
                        <Chip 
                          label={source.type === 'database' ? '数据库' : '文件系统'} 
                          size="small" 
                          color={source.type === 'database' ? 'primary' : 'secondary'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {source.type === 'database' 
                          ? `${source.host}:${source.port}/${source.database}`
                          : source.path
                        }
                      </Typography>
                      <Typography variant="caption" display="block">
                        {source.type === 'database' 
                          ? `用户: ${source.username}`
                          : `递归: ${source.recursive ? '是' : '否'}`
                        }
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                    <TextField
                      fullWidth
                      label="数据源名称"
                      value={newDataSource.name}
                      onChange={(e) => setNewDataSource({...newDataSource, name: e.target.value})}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                    <FormControl fullWidth>
                      <InputLabel>数据源类型</InputLabel>
                      <Select
                        value={newDataSource.type}
                        label="数据源类型"
                        onChange={(e) => setNewDataSource({...newDataSource, type: e.target.value as any})}
                      >
                        <MenuItem value="database">数据库</MenuItem>
                        <MenuItem value="filesystem">文件系统</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* 数据库连接信息 */}
                  {newDataSource.type === 'database' && (
                    <>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="主机地址"
                          value={newDataSource.host || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, host: e.target.value})}
                          placeholder="localhost"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="端口"
                          type="number"
                          value={newDataSource.port || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, port: parseInt(e.target.value) || undefined})}
                          placeholder="5432"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="数据库名"
                          value={newDataSource.database || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, database: e.target.value})}
                          placeholder="database_name"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="用户名"
                          value={newDataSource.username || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, username: e.target.value})}
                          placeholder="username"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                        <TextField
                          fullWidth
                          label="密码"
                          type="password"
                          value={newDataSource.password || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, password: e.target.value})}
                          placeholder="password"
                        />
                      </Box>
                    </>
                  )}
                  
                  {/* 文件系统连接信息 */}
                  {newDataSource.type === 'filesystem' && (
                    <>
                      <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                        <TextField
                          fullWidth
                          label="文件路径"
                          value={newDataSource.path || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, path: e.target.value})}
                          placeholder="/data/files 或 C:\\Data\\Files"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <FormControl fullWidth>
                          <InputLabel>递归扫描</InputLabel>
                          <Select
                            value={newDataSource.recursive ? 'true' : 'false'}
                            label="递归扫描"
                            onChange={(e) => setNewDataSource({...newDataSource, recursive: e.target.value === 'true'})}
                          >
                            <MenuItem value="true">是</MenuItem>
                            <MenuItem value="false">否</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: '1 1 calc(100% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="文件过滤规则"
                          value={newDataSource.filePattern || ''}
                          onChange={(e) => setNewDataSource({...newDataSource, filePattern: e.target.value})}
                          placeholder="*.csv,*.json,*.xlsx"
                        />
                      </Box>
                    </>
                  )}
                  <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                    <Button variant="outlined" onClick={addDataSource}>
                      添加数据源
                    </Button>
                  </Box>
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
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                      <Typography variant="caption" display="block">数据源连接</Typography>
                      <Typography variant="body2">{dataSources.length} 个</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                      <Typography variant="caption" display="block">已扫描表/文件</Typography>
                      <Typography variant="body2">{Math.round(scanProgress * 0.23)} 个</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                      <Typography variant="caption" display="block">提取元数据</Typography>
                      <Typography variant="body2">{Math.round(scanProgress * 0.15)} 项</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
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
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">{discoveryResults.length}</Typography>
                    <Typography variant="caption">发现数据集</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {discoveryResults.reduce((sum, r) => sum + r.recordCount, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption">总记录数</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {discoveryResults.reduce((sum, r) => sum + (r.fileSize || 0), 0) > 1024*1024*1024 ? 
                        Math.round(discoveryResults.reduce((sum, r) => sum + (r.fileSize || 0), 0) / (1024*1024*1024) * 100) / 100 + 'GB' :
                        Math.round(discoveryResults.reduce((sum, r) => sum + (r.fileSize || 0), 0) / (1024*1024) * 100) / 100 + 'MB'
                      }
                    </Typography>
                    <Typography variant="caption">总数据量</Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(25% - 6px)' } }}>
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
                    <TableCell>数据量</TableCell>
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
                      <TableCell>{result.estimatedSize || formatFileSize(result.fileSize)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              请确认所有发现的数据资产信息。确认后，将进入资源信息完善步骤。
            </Alert>
          </Box>
        );
        
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              资源信息完善
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              为确认的数据资产补充业务信息，包括业务域、所有者、访问级别和标签等。
            </Typography>
            
            {resourcesInfo.map((resource, index) => {
              const asset = discoveryResults.find(r => r.id === resource.assetId);
              if (!asset) return null;
              
              return (
                <Card key={resource.assetId} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {asset.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {asset.type} | {asset.source} | {asset.recordCount.toLocaleString()} 条记录 | {asset.estimatedSize}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="业务域 *"
                          value={resource.businessDomain}
                          onChange={(e) => {
                            const newResourcesInfo = [...resourcesInfo];
                            newResourcesInfo[index].businessDomain = e.target.value;
                            setResourcesInfo(newResourcesInfo);
                          }}
                          placeholder="如：客户管理、财务管理、产品管理等"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="数据所有者 *"
                          value={resource.owner}
                          onChange={(e) => {
                            const newResourcesInfo = [...resourcesInfo];
                            newResourcesInfo[index].owner = e.target.value;
                            setResourcesInfo(newResourcesInfo);
                          }}
                          placeholder="如：张三、李四等"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <FormControl fullWidth>
                          <InputLabel>访问级别 *</InputLabel>
                          <Select
                            value={resource.accessLevel}
                            label="访问级别 *"
                            onChange={(e) => {
                              const newResourcesInfo = [...resourcesInfo];
                              newResourcesInfo[index].accessLevel = e.target.value as 'public' | 'internal' | 'confidential';
                              setResourcesInfo(newResourcesInfo);
                            }}
                          >
                            <MenuItem value="public">公开</MenuItem>
                            <MenuItem value="internal">内部</MenuItem>
                            <MenuItem value="confidential">机密</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: { xs: 'calc(100% - 8px)', md: 'calc(50% - 8px)' } }}>
                        <TextField
                          fullWidth
                          label="资源分类"
                          value={resource.category}
                          onChange={(e) => {
                            const newResourcesInfo = [...resourcesInfo];
                            newResourcesInfo[index].category = e.target.value;
                            setResourcesInfo(newResourcesInfo);
                          }}
                          placeholder="如：主数据、交易数据、参考数据等"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                        <TextField
                          fullWidth
                          label="标签"
                          value={resource.tags.join(', ')}
                          onChange={(e) => {
                            const newResourcesInfo = [...resourcesInfo];
                            newResourcesInfo[index].tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                            setResourcesInfo(newResourcesInfo);
                          }}
                          placeholder="用逗号分隔多个标签，如：客户数据, 核心业务, 高价值"
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 100%', width: '100%' }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="资源描述"
                          value={resource.description}
                          onChange={(e) => {
                            const newResourcesInfo = [...resourcesInfo];
                            newResourcesInfo[index].description = e.target.value;
                            setResourcesInfo(newResourcesInfo);
                          }}
                          placeholder="详细描述该数据资源的内容、用途和特点"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
            
            <Alert severity="success" sx={{ mt: 2 }}>
              完善资源信息后，点击"添加到数据资源列表"将这些数据资产正式加入到数据目录中。
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
          disabled={activeStep === 1 && scanning}
        >
          {activeStep === 1 && !scanning && !scanComplete ? '开始扫描' : 
           activeStep === 2 ? '进入资源信息完善' :
           activeStep === steps.length - 1 ? '添加到数据资源列表' : '下一步'}
        </Button>
      </Box>
    </Box>
  );
};

export default DataDiscovery;