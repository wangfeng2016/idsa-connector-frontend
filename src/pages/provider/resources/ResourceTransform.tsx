import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Checkbox,
  Divider,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 数据资源接口
interface DataResource {
  id: string;
  name: string;
  type: 'database' | 'file' | 'api';
  description: string;
  format: string;
  domain: string;
}

// 数据库字段接口
interface DatabaseField {
  name: string;
  type: string;
  nullable: boolean;
  description?: string;
}

// 过滤条件接口
interface FilterCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string;
}

// 转换配置接口
interface TransformConfig {
  sourceResourceId: string;
  selectedFields: string[];
  filters: FilterCondition[];
  limit?: number;
  metadata: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    accessLevel: 'public' | 'private' | 'restricted';
  };
}

const steps = ['选择数据源', '配置转换规则', '设置元数据', '预览并创建'];

// 模拟数据资源
const mockResources: DataResource[] = [
  {
    id: 'res-001',
    name: '客户数据库',
    type: 'database',
    description: '包含客户基本信息和交易记录',
    format: 'MySQL',
    domain: '客户管理',
  },
  {
    id: 'res-002',
    name: '产品信息API',
    type: 'api',
    description: '实时产品信息和库存数据',
    format: 'REST API',
    domain: '产品管理',
  },
  {
    id: 'res-003',
    name: '销售报表文件',
    type: 'file',
    description: '月度销售数据汇总',
    format: 'CSV',
    domain: '销售分析',
  },
];

// 模拟数据库字段
const mockDatabaseFields: DatabaseField[] = [
  { name: 'customer_id', type: 'INT', nullable: false, description: '客户ID' },
  { name: 'customer_name', type: 'VARCHAR(100)', nullable: false, description: '客户姓名' },
  { name: 'email', type: 'VARCHAR(255)', nullable: true, description: '邮箱地址' },
  { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: '电话号码' },
  { name: 'city', type: 'VARCHAR(50)', nullable: true, description: '所在城市' },
  { name: 'registration_date', type: 'DATE', nullable: false, description: '注册日期' },
  { name: 'last_login', type: 'DATETIME', nullable: true, description: '最后登录时间' },
  { name: 'total_orders', type: 'INT', nullable: false, description: '总订单数' },
  { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false, description: '总消费金额' },
  { name: 'status', type: 'VARCHAR(20)', nullable: false, description: '客户状态' },
];

const ResourceTransform: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<TransformConfig>({
    sourceResourceId: '',
    selectedFields: [],
    filters: [],
    metadata: {
      name: '',
      description: '',
      tags: [],
      category: '',
      accessLevel: 'private',
    },
  });
  const [selectedResource, setSelectedResource] = useState<DataResource | null>(null);
  const [availableFields, setAvailableFields] = useState<DatabaseField[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedResource?.type === 'database') {
      setAvailableFields(mockDatabaseFields);
    } else {
      setAvailableFields([]);
    }
  }, [selectedResource]);

  const handleResourceSelect = (resourceId: string) => {
    const resource = mockResources.find(r => r.id === resourceId);
    setSelectedResource(resource || null);
    setConfig({
      ...config,
      sourceResourceId: resourceId,
      selectedFields: [],
      filters: [],
      metadata: {
        ...config.metadata,
        name: resource ? `${resource.name}_资源` : '',
      },
    });
  };

  const handleFieldToggle = (fieldName: string) => {
    const newSelectedFields = config.selectedFields.includes(fieldName)
      ? config.selectedFields.filter(f => f !== fieldName)
      : [...config.selectedFields, fieldName];
    
    setConfig({
      ...config,
      selectedFields: newSelectedFields,
    });
  };

  const handleAddFilter = () => {
    setConfig({
      ...config,
      filters: [
        ...config.filters,
        { field: availableFields[0]?.name || '', operator: 'equals', value: '' },
      ],
    });
  };

  const handleFilterChange = (index: number, field: keyof FilterCondition, value: string) => {
    const newFilters = [...config.filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setConfig({ ...config, filters: newFilters });
  };

  const handleRemoveFilter = (index: number) => {
    setConfig({
      ...config,
      filters: config.filters.filter((_, i) => i !== index),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !config.metadata.tags.includes(tagInput.trim())) {
      setConfig({
        ...config,
        metadata: {
          ...config.metadata,
          tags: [...config.metadata.tags, tagInput.trim()],
        },
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setConfig({
      ...config,
      metadata: {
        ...config.metadata,
        tags: config.metadata.tags.filter(tag => tag !== tagToRemove),
      },
    });
  };

  const handleNext = () => {
    if (activeStep === 0 && !config.sourceResourceId) {
      setError('请选择数据源');
      return;
    }
    if (activeStep === 1 && config.selectedFields.length === 0) {
      setError('请至少选择一个字段');
      return;
    }
    if (activeStep === 2) {
      if (!config.metadata.name || !config.metadata.description || !config.metadata.category) {
        setError('请填写所有必填字段');
        return;
      }
      // 生成预览数据
      generatePreviewData();
    }
    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const generatePreviewData = () => {
    // 模拟生成预览数据
    const mockData = [
      { customer_id: 1, customer_name: '张三', email: 'zhang@example.com', city: '北京', total_orders: 15 },
      { customer_id: 2, customer_name: '李四', email: 'li@example.com', city: '上海', total_orders: 8 },
      { customer_id: 3, customer_name: '王五', email: 'wang@example.com', city: '广州', total_orders: 22 },
    ];
    setPreviewData(mockData);
  };

  const handleCreateResource = () => {
    // 模拟创建资源
    setTimeout(() => {
      navigate('/enterprise/resources');
    }, 1000);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              选择数据源
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              从现有数据资源中选择一个作为资源的来源
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {mockResources.map((resource) => (
                <Box
                  key={resource.id}
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(50% - 8px)' },
                    minWidth: 0,
                  }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: config.sourceResourceId === resource.id ? 2 : 1,
                      borderColor: config.sourceResourceId === resource.id ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.main' },
                      height: '100%',
                    }}
                    onClick={() => handleResourceSelect(resource.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {resource.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Chip label={resource.type} size="small" />
                        <Chip label={resource.format} size="small" variant="outlined" />
                        <Chip label={resource.domain} size="small" variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              配置转换规则
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              选择要包含的字段并设置过滤条件
            </Typography>

            {selectedResource?.type === 'database' && (
              <Box>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">字段选择</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox">选择</TableCell>
                            <TableCell>字段名</TableCell>
                            <TableCell>类型</TableCell>
                            <TableCell>可空</TableCell>
                            <TableCell>描述</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {availableFields.map((field) => (
                            <TableRow key={field.name}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={config.selectedFields.includes(field.name)}
                                  onChange={() => handleFieldToggle(field.name)}
                                />
                              </TableCell>
                              <TableCell>{field.name}</TableCell>
                              <TableCell>{field.type}</TableCell>
                              <TableCell>{field.nullable ? '是' : '否'}</TableCell>
                              <TableCell>{field.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      过滤条件 ({config.filters.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {config.filters.map((filter, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%', md: '0 0 25%' } }}>
                              <FormControl fullWidth size="small">
                                <InputLabel>字段</InputLabel>
                                <Select
                                  value={filter.field}
                                  label="字段"
                                  onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                                >
                                  {availableFields.map((field) => (
                                    <MenuItem key={field.name} value={field.name}>
                                      {field.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%', md: '0 0 25%' } }}>
                              <FormControl fullWidth size="small">
                                <InputLabel>操作符</InputLabel>
                                <Select
                                  value={filter.operator}
                                  label="操作符"
                                  onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                                >
                                  <MenuItem value="equals">等于</MenuItem>
                                  <MenuItem value="not_equals">不等于</MenuItem>
                                  <MenuItem value="greater_than">大于</MenuItem>
                                  <MenuItem value="less_than">小于</MenuItem>
                                  <MenuItem value="contains">包含</MenuItem>
                                  <MenuItem value="not_contains">不包含</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%', md: '0 0 35%' } }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="值"
                                value={filter.value}
                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                              />
                            </Box>
                            <Box sx={{ flex: '0 0 auto' }}>
                              <Tooltip title="删除条件">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveFilter(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                      
                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddFilter}
                        variant="outlined"
                      >
                        添加过滤条件
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {selectedResource?.type === 'file' && (
              <Alert severity="info">
                文件类型的数据资源将直接转换为资源，无需额外配置。
              </Alert>
            )}

            {selectedResource?.type === 'api' && (
              <Alert severity="info">
                API类型的数据资源将使用当前配置进行数据提取。
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              设置资源元数据
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              为转换后的资源添加描述信息
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="资源名称"
                value={config.metadata.name}
                onChange={(e) => setConfig({
                  ...config,
                  metadata: { ...config.metadata, name: e.target.value }
                })}
                required
                helperText="为资源指定一个有意义的名称"
              />
              
              <TextField
                fullWidth
                label="描述"
                value={config.metadata.description}
                onChange={(e) => setConfig({
                  ...config,
                  metadata: { ...config.metadata, description: e.target.value }
                })}
                multiline
                rows={3}
                required
                helperText="详细描述资源的内容和用途"
              />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth required>
                    <InputLabel>分类</InputLabel>
                    <Select
                      value={config.metadata.category}
                      label="分类"
                      onChange={(e) => setConfig({
                        ...config,
                        metadata: { ...config.metadata, category: e.target.value }
                      })}
                    >
                      <MenuItem value="customer">客户数据</MenuItem>
                      <MenuItem value="sales">销售数据</MenuItem>
                      <MenuItem value="product">产品数据</MenuItem>
                      <MenuItem value="financial">财务数据</MenuItem>
                      <MenuItem value="operational">运营数据</MenuItem>
                      <MenuItem value="other">其他</MenuItem>
                    </Select>
                    <FormHelperText>选择资源的业务分类</FormHelperText>
                  </FormControl>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>访问级别</InputLabel>
                    <Select
                      value={config.metadata.accessLevel}
                      label="访问级别"
                      onChange={(e) => setConfig({
                        ...config,
                        metadata: { ...config.metadata, accessLevel: e.target.value as any }
                      })}
                    >
                      <MenuItem value="public">公开</MenuItem>
                      <MenuItem value="private">私有</MenuItem>
                      <MenuItem value="restricted">受限</MenuItem>
                    </Select>
                    <FormHelperText>设置资源的访问权限</FormHelperText>
                  </FormControl>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  标签
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {config.metadata.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="添加标签"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button variant="outlined" onClick={handleAddTag}>
                    添加
                  </Button>
                </Box>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              预览并创建资源
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              确认转换配置并预览生成的资源
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    转换配置摘要
                  </Typography>
                  <Typography variant="body2">数据源：{selectedResource?.name}</Typography>
                  <Typography variant="body2">选择字段：{config.selectedFields.length} 个</Typography>
                  <Typography variant="body2">过滤条件：{config.filters.length} 个</Typography>
                  <Typography variant="body2">资源名称：{config.metadata.name}</Typography>
                  <Typography variant="body2">分类：{config.metadata.category}</Typography>
                </Paper>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    预计结果
                  </Typography>
                  <Typography variant="body2">预计记录数：约 15,000 条</Typography>
                  <Typography variant="body2">预计大小：约 2.5 MB</Typography>
                  <Typography variant="body2">格式：CSV</Typography>
                  <Typography variant="body2">处理时间：约 30 秒</Typography>
                </Paper>
              </Box>
            </Box>

            {previewData.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  数据预览（前3行）
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {config.selectedFields.map((field) => (
                          <TableCell key={field}>{field}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          {config.selectedFields.map((field) => (
                            <TableCell key={field}>{row[field]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Alert severity="success" sx={{ mt: 3 }}>
              <CheckIcon sx={{ mr: 1 }} />
              配置验证通过，可以开始创建资源
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/enterprise/resources')}
          sx={{ mr: 2 }}
        >
          返回
        </Button>
        <Typography variant="h4" component="h1">
          转换资源
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              上一步
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCreateResource}
              >
                创建资源
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                下一步
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResourceTransform;