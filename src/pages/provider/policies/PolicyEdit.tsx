import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Autocomplete,
  Stack,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';

// 策略类型定义
interface PolicyRule {
  id: string;
  type: 'usage_count' | 'time_limit' | 'location' | 'purpose' | 'user_role' | 'data_classification';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number;
  description: string;
}

interface Policy {
  id?: number;
  name: string;
  description: string;
  type: 'access' | 'usage' | 'retention' | 'sharing';
  status: 'active' | 'inactive' | 'draft';
  priority: 'high' | 'medium' | 'low';
  targetResources: string[];
  targetUsers: string[];
  rules: PolicyRule[];
  validFrom: Date | null;
  validTo: Date | null;
  notifications: boolean;
  enforcement: 'strict' | 'warning' | 'log_only';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockResources = [
  '销售资源',
  '客户信息数据库',
  '产品目录',
  '财务报表',
  '员工信息',
  '供应商数据',
  '市场分析报告',
];

const mockUsers = [
  '销售部门',
  '市场部门',
  '财务部门',
  '人力资源部',
  '研发部门',
  '管理层',
  '外部合作伙伴',
];

const ruleTypes = [
  { value: 'usage_count', label: '使用次数限制' },
  { value: 'time_limit', label: '时间限制' },
  { value: 'location', label: '地理位置限制' },
  { value: 'purpose', label: '使用目的限制' },
  { value: 'user_role', label: '用户角色限制' },
  { value: 'data_classification', label: '数据分类限制' },
];

const operators = [
  { value: 'equals', label: '等于' },
  { value: 'not_equals', label: '不等于' },
  { value: 'greater_than', label: '大于' },
  { value: 'less_than', label: '小于' },
  { value: 'contains', label: '包含' },
  { value: 'not_contains', label: '不包含' },
];

const PolicyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id && id !== 'new');
  
  const [policy, setPolicy] = useState<Policy>({
    name: '',
    description: '',
    type: 'access',
    status: 'draft',
    priority: 'medium',
    targetResources: [],
    targetUsers: [],
    rules: [],
    validFrom: null,
    validTo: null,
    notifications: true,
    enforcement: 'strict',
    createdBy: '当前用户',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      // 模拟加载现有策略
      setLoading(true);
      setTimeout(() => {
        const mockPolicy: Policy = {
          id: parseInt(id!),
          name: '销售数据访问策略',
          description: '限制销售数据的访问权限和使用范围',
          type: 'access',
          status: 'active',
          priority: 'high',
          targetResources: ['销售资源', '客户信息数据库'],
          targetUsers: ['销售部门', '管理层'],
          rules: [
            {
              id: '1',
              type: 'usage_count',
              operator: 'less_than',
              value: 100,
              description: '每月使用次数不超过100次',
            },
            {
              id: '2',
              type: 'time_limit',
              operator: 'equals',
              value: '工作时间',
              description: '仅在工作时间内可访问',
            },
          ],
          validFrom: new Date('2023-10-01'),
          validTo: new Date('2024-10-01'),
          notifications: true,
          enforcement: 'strict',
          createdBy: '管理员',
          createdAt: '2023-10-01T09:00:00Z',
          updatedAt: '2023-10-15T14:30:00Z',
        };
        setPolicy(mockPolicy);
        setLoading(false);
      }, 1000);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof Policy, value: any) => {
    setPolicy(prev => ({ ...prev, [field]: value }));
    // 清除相关错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddRule = () => {
    const newRule: PolicyRule = {
      id: Date.now().toString(),
      type: 'usage_count',
      operator: 'equals',
      value: '',
      description: '',
    };
    setPolicy(prev => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
  };

  const handleUpdateRule = (ruleId: string, field: keyof PolicyRule, value: any) => {
    setPolicy(prev => ({
      ...prev,
      rules: prev.rules.map(rule =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const handleDeleteRule = (ruleId: string) => {
    setPolicy(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== ruleId),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!policy.name.trim()) {
      newErrors.name = '策略名称不能为空';
    }

    if (!policy.description.trim()) {
      newErrors.description = '策略描述不能为空';
    }

    if (policy.targetResources.length === 0) {
      newErrors.targetResources = '至少选择一个目标资源';
    }

    if (policy.targetUsers.length === 0) {
      newErrors.targetUsers = '至少选择一个目标用户';
    }

    if (policy.validFrom && policy.validTo && policy.validFrom >= policy.validTo) {
      newErrors.validTo = '结束时间必须晚于开始时间';
    }

    // 验证规则
    policy.rules.forEach((rule, index) => {
      if (!rule.description.trim()) {
        newErrors[`rule_${index}_description`] = '规则描述不能为空';
      }
      if (!rule.value) {
        newErrors[`rule_${index}_value`] = '规则值不能为空';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('保存策略:', policy);
      navigate('/policies');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/policies');
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          {isEdit ? '编辑策略' : '创建新策略'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 基本信息 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              基本信息
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                minWidth: { xs: '100%', md: '250px' }
              }
            }}
          >
            <TextField
              fullWidth
              label="策略名称"
              value={policy.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel id="policy-type-label">策略类型</InputLabel>
              <Select
                labelId="policy-type-label"
                value={policy.type}
                label="策略类型"
                onChange={(e) => handleInputChange('type', e.target.value)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem value="access">访问控制</MenuItem>
                <MenuItem value="usage">使用控制</MenuItem>
                <MenuItem value="retention">数据保留</MenuItem>
                <MenuItem value="sharing">数据共享</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            fullWidth
            label="策略描述"
            value={policy.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }
            }}
            />
          
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' },
                minWidth: { xs: '100%', md: '200px' }
              }
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="status-label">状态</InputLabel>
              <Select
                labelId="status-label"
                value={policy.status}
                label="状态"
                onChange={(e) => handleInputChange('status', e.target.value)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem value="draft">草稿</MenuItem>
                <MenuItem value="active">激活</MenuItem>
                <MenuItem value="inactive">停用</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="priority-label">优先级</InputLabel>
              <Select
                labelId="priority-label"
                value={policy.priority}
                label="优先级"
                onChange={(e) => handleInputChange('priority', e.target.value)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="high">高</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="enforcement-label">执行模式</InputLabel>
              <Select
                labelId="enforcement-label"
                value={policy.enforcement}
                label="执行模式"
                onChange={(e) => handleInputChange('enforcement', e.target.value)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <MenuItem value="strict">严格执行</MenuItem>
                <MenuItem value="warning">警告模式</MenuItem>
                <MenuItem value="log_only">仅记录</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 目标资源和用户 */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              目标资源和用户
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                minWidth: { xs: '100%', md: '250px' }
              }
            }}
          >
            <Autocomplete
              multiple
              options={mockResources}
              value={policy.targetResources}
              onChange={(_event, newValue) => handleInputChange('targetResources', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="目标资源"
                  error={!!errors.targetResources}
                  helperText={errors.targetResources}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }
                  }}
                />
              )}
            />
            
            <Autocomplete
              multiple
              options={mockUsers}
              value={policy.targetUsers}
              onChange={(_event, newValue) => handleInputChange('targetUsers', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="目标用户"
                  error={!!errors.targetUsers}
                  helperText={errors.targetUsers}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* 有效期 */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              有效期设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              '& > *': {
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                minWidth: { xs: '100%', md: '250px' }
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              <DateTimePicker
                label="生效时间"
                value={policy.validFrom}
                onChange={(newValue: any) => handleInputChange('validFrom', newValue)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              />
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <DateTimePicker
                label="失效时间"
                value={policy.validTo}
                onChange={(newValue: any) => handleInputChange('validTo', newValue)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              />
              {errors.validTo && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.validTo}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 策略规则 */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
              <Typography variant="h6">
                策略规则
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddRule}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                添加规则
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Box>
            {policy.rules.length === 0 ? (
              <Alert severity="info" icon={<InfoIcon />}>
                暂无策略规则，请点击"添加规则"按钮创建规则。
              </Alert>
            ) : (
              <Stack spacing={2}>
                {policy.rules.map((rule, index) => (
                  <Card 
                    key={rule.id} 
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          alignItems: 'flex-start',
                          '& > *': {
                            minWidth: { xs: '100%', sm: '150px' }
                          }
                        }}
                      >
                        <FormControl 
                          size="small"
                          sx={{ 
                            flex: { xs: '1 1 100%', md: '1 1 calc(25% - 12px)' },
                            minWidth: '150px'
                          }}
                        >
                          <InputLabel>规则类型</InputLabel>
                          <Select
                            value={rule.type}
                            label="规则类型"
                            onChange={(e) => handleUpdateRule(rule.id, 'type', e.target.value)}
                            sx={{ borderRadius: 2 }}
                          >
                            {ruleTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <FormControl 
                          size="small"
                          sx={{ 
                            flex: { xs: '1 1 100%', md: '1 1 calc(16.666% - 12px)' },
                            minWidth: '120px'
                          }}
                        >
                          <InputLabel>操作符</InputLabel>
                          <Select
                            value={rule.operator}
                            label="操作符"
                            onChange={(e) => handleUpdateRule(rule.id, 'operator', e.target.value)}
                            sx={{ borderRadius: 2 }}
                          >
                            {operators.map((op) => (
                              <MenuItem key={op.value} value={op.value}>
                                {op.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <TextField
                          size="small"
                          label="值"
                          value={rule.value}
                          onChange={(e) => handleUpdateRule(rule.id, 'value', e.target.value)}
                          error={!!errors[`rule_${index}_value`]}
                          helperText={errors[`rule_${index}_value`]}
                          sx={{ 
                            flex: { xs: '1 1 100%', md: '1 1 calc(16.666% - 12px)' },
                            minWidth: '120px',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                        
                        <TextField
                          size="small"
                          label="描述"
                          value={rule.description}
                          onChange={(e) => handleUpdateRule(rule.id, 'description', e.target.value)}
                          error={!!errors[`rule_${index}_description`]}
                          helperText={errors[`rule_${index}_description`]}
                          sx={{ 
                            flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 12px)' },
                            minWidth: '200px',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteRule(rule.id)}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: 'rgba(244, 67, 54, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>

          {/* 其他设置 */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              其他设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>
          
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={policy.notifications}
                  onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main'
                    }
                  }}
                />
              }
              label="启用通知"
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PolicyEdit;