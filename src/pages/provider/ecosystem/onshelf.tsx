import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  RadioGroup,
  Radio,
  InputAdornment
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

const steps = [
  '基本信息',
  '可见性',
  'API',
  '元数据管理',
  '测试数据管理',
  '使用条款'
];

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  },
  '& .MuiStepLabel-label': {
    marginTop: theme.spacing(1),
    fontSize: '14px',
    fontWeight: 500
  },
  '& .MuiStepConnector-root': {
    marginLeft: '27px',
    '& .MuiStepConnector-line': {
      borderColor: '#e0e0e0',
      borderLeftWidth: '2px',
      minHeight: '24px'
    }
  },
  '& .MuiStep-root:last-child .MuiStepConnector-root': {
    display: 'none'
  }
}));

const OnShelf: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: ''
  });
  
  const [visibilitySettings, setVisibilitySettings] = useState({
    globalVisible: true,
    platformVisible: true,
    specificVisible: false
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  
  const [apiList] = useState([
    {
      id: 1,
      name: '提供服务列表清单',
      url: 'https://api.api-noviclouds.cn',
      method: 'GET',
      status: '配置状态',
      configured: true
    },
    {
      id: 2,
      name: '提供服务列表清单',
      url: 'https://api.api-noviclouds.cn',
      method: 'GET',
      status: '配置状态',
      configured: true
    }
  ]);
  
  const [metadataType, setMetadataType] = useState('tags');
  const [tags, setTags] = useState(['生产数据', '测试入网点信息']);
  const [newTag, setNewTag] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([
    { key: 'category', value: '数据服务' },
    { key: 'version', value: '1.0.0' },
    { key: 'provider', value: 'noviclouds' },
    { key: 'format', value: 'JSON' },
    { key: 'updateFrequency', value: '实时' }
  ]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  
  const [policyMode, setPolicyMode] = useState('');
  const [contractTerms, setContractTerms] = useState('');
  const [licenseTerms, setLicenseTerms] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  const policyOptions = [
    '用途限制',
    '时间约束限制', 
    '地理围栏限制',
    '操作类型管控'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleVisibilityChange = (field: string, value: boolean) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleOpenSaveDialog = () => {
    setSaveDialogOpen(true);
  };
  
  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  const handleAddKeyValue = () => {
    if (newKey.trim() && newValue.trim()) {
      const existingIndex = keyValuePairs.findIndex(pair => pair.key === newKey.trim());
      if (existingIndex >= 0) {
        const updatedPairs = [...keyValuePairs];
        updatedPairs[existingIndex].value = newValue.trim();
        setKeyValuePairs(updatedPairs);
      } else {
        setKeyValuePairs([...keyValuePairs, { key: newKey.trim(), value: newValue.trim() }]);
      }
      setNewKey('');
      setNewValue('');
    }
  };
  
  const handleDeleteKeyValue = (keyToDelete: string) => {
    setKeyValuePairs(keyValuePairs.filter(pair => pair.key !== keyToDelete));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              基本信息
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              填写能够清楚介绍您数据产品的信息
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
               <Box>
                 <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                   产品名称
                 </Typography>
                 <TextField
                   fullWidth
                   placeholder="请输入产品名称"
                   value={productData.name}
                   onChange={(e) => handleInputChange('name', e.target.value)}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       backgroundColor: '#f8f9fa'
                     }
                   }}
                 />
               </Box>
               
               <Box>
                 <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                   产品描述
                 </Typography>
                 <TextField
                   fullWidth
                   multiline
                   rows={4}
                   placeholder="请输入产品描述"
                   value={productData.description}
                   onChange={(e) => handleInputChange('description', e.target.value)}
                   sx={{
                     '& .MuiOutlinedInput-root': {
                       backgroundColor: '#f8f9fa'
                     }
                   }}
                 />
               </Box>
               
               <Box>
                 <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                   关键词
                 </Typography>
                 <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                   <Chip 
                     label="产品X" 
                     sx={{ 
                       backgroundColor: '#4fc3f7', 
                       color: 'white',
                       fontWeight: 500
                     }} 
                   />
                   <Chip 
                     label="分析X" 
                     sx={{ 
                       backgroundColor: '#1565c0', 
                       color: 'white',
                       fontWeight: 500
                     }} 
                   />
                 </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Typography variant="body2" color="text.secondary">
                     大写/分隔/用入键换
                   </Typography>
                 </Box>
               </Box>
             </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              可见性
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
              设置产品在各个渠道的可见性
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 全局可见 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    全局可见
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    您的产品在所有渠道都可见
                  </Typography>
                </Box>
                <Switch
                  checked={visibilitySettings.globalVisible}
                  onChange={(e) => handleVisibilityChange('globalVisible', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4fc3f7',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4fc3f7',
                    },
                  }}
                />
              </Box>
              
              {/* 平台内容采用用户可见 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    平台内容采用用户可见
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    您的产品在平台渠道可见
                  </Typography>
                </Box>
                <Switch
                  checked={visibilitySettings.platformVisible}
                  onChange={(e) => handleVisibilityChange('platformVisible', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4fc3f7',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4fc3f7',
                    },
                  }}
                />
              </Box>
              
              {/* 其他特定可见 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    其他特定可见
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    您的产品在特定渠道可见
                  </Typography>
                </Box>
                <Switch
                  checked={visibilitySettings.specificVisible}
                  onChange={(e) => handleVisibilityChange('specificVisible', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4fc3f7',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4fc3f7',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              API设定
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
              设置产品在各个渠道的可见性
            </Typography>
            
            {/* 创建按钮 */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: '#4fc3f7',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#29b6f6'
                  }
                }}
              >
                创建
              </Button>
            </Box>
            
            {/* API列表 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {apiList.map((api) => (
                <Box
                  key={api.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    gap: 2
                  }}
                >
                  {/* API图标 */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #e0e0e0'
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '60%',
                        backgroundColor: '#ddd',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  </Box>
                  
                  {/* API信息 */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {api.name}
                      </Typography>
                      <Chip
                        label="全部创建"
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {api.url}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* GET标签指示器 */}
                      <Chip
                        label={api.method}
                        size="small"
                        sx={{
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {api.status}
                      </Typography>
                      <Chip
                        label="API链接正常"
                        size="small"
                        sx={{
                          backgroundColor: '#e8f5e8',
                          color: '#4caf50',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {/* 更多操作按钮 */}
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
            
            {/* 创建对话框 */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>创建API</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <ConstructionIcon sx={{ fontSize: 48, color: '#ccc', mr: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    功能开发中...
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>关闭</Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
              元数据管理
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
              提供有关产品的元数据，让数据取得方更好的了解您的数据产品
            </Typography>
            
            {/* 数据服务项 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                提供服务列表清单
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                https://api.api-noviclouds.cn
              </Typography>
              
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Radio
                    checked={true}
                    sx={{
                      color: '#4fc3f7',
                      '&.Mui-checked': {
                        color: '#4fc3f7',
                      },
                    }}
                  />
                  <Typography variant="body2">
                    打开数据
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    其他选项
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 'auto' }}>
                  <Radio
                    checked={false}
                    sx={{
                      color: '#ccc',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    大写/分级/接入链路
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* 元数据类型选择 */}
            <Box sx={{ mb: 3 }}>
              <RadioGroup
                row
                value={metadataType}
                onChange={(e) => setMetadataType(e.target.value)}
                sx={{ gap: 4 }}
              >
                <FormControlLabel
                  value="tags"
                  control={<Radio sx={{ color: '#4fc3f7', '&.Mui-checked': { color: '#4fc3f7' } }} />}
                  label="标签方式"
                />
                <FormControlLabel
                  value="keyvalue"
                  control={<Radio sx={{ color: '#4fc3f7', '&.Mui-checked': { color: '#4fc3f7' } }} />}
                  label="Key-Value方式"
                />
              </RadioGroup>
            </Box>
            
            {/* 标签方式 */}
            {metadataType === 'tags' && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  标签管理
                </Typography>
                
                {/* 添加标签 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    size="small"
                    placeholder="请输入标签名称"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTag}
                    sx={{
                      backgroundColor: '#4fc3f7',
                      '&:hover': { backgroundColor: '#29b6f6' }
                    }}
                  >
                    添加
                  </Button>
                </Box>
                
                {/* 标签列表 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Key-Value方式 */}
            {metadataType === 'keyvalue' && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Key-Value管理
                </Typography>
                
                {/* 添加Key-Value */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    size="small"
                    placeholder="Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyValue()}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddKeyValue}
                    sx={{
                      backgroundColor: '#4fc3f7',
                      '&:hover': { backgroundColor: '#29b6f6' }
                    }}
                  >
                    添加
                  </Button>
                </Box>
                
                {/* Key-Value列表 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {keyValuePairs.map((pair, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 120 }}>
                        {pair.key}:
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1, ml: 2 }}>
                        {pair.value}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteKeyValue(pair.key)}
                      >
                        删除
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Key Value 输入区域 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                key value
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="输入元数据信息"
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          </Box>
        );
      
      case 4:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              测试数据管理
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              mock数据
            </Typography>
            
            {/* 服务信息 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                服务：产品服务清单
              </Typography>
              
              {/* 模拟数据上传 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  模拟数据说明
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #e0e0e0',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderColor: '#bdbdbd'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography sx={{ fontSize: 24, color: '#999' }}>↑</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Supports: jpeg, png, jpg. Maximum file size 25mb
                  </Typography>
                </Box>
              </Box>
              
              {/* 测试数据说明上传 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  测试数据说明
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #e0e0e0',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderColor: '#bdbdbd'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography sx={{ fontSize: 24, color: '#999' }}>↑</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Supports: jpeg, png, jpg. Maximum file size 25mb
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      
      case 5:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
              使用条款
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              mock数据
            </Typography>
            
            {/* 策略模式 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                策略
              </Typography>
              <TextField
                fullWidth
                placeholder="请输入标题"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
              
              {/* 添加策略模式下拉选择 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  添加策略模式
                </Typography>
                <FormControl sx={{ minWidth: 400 }}>
                  <Select
                    value={policyMode}
                    onChange={(e) => setPolicyMode(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: '#fff',
                      '& .MuiSelect-select': {
                        py: 1
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>请选择策略模式</em>
                    </MenuItem>
                    {policyOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      width: 32,
                      height: 32,
                      borderRadius: '50%'
                    }}
                  >
                    <Typography sx={{ fontSize: 16 }}>+</Typography>
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ 
                      border: '1px solid #e0e0e0',
                      width: 32,
                      height: 32,
                      borderRadius: '50%'
                    }}
                  >
                    <Typography sx={{ fontSize: 16 }}>−</Typography>
                  </IconButton>
                </Box>
              </Box>
              
              {/* 合同条款 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  合同条款
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    开始时间
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="开始时间"
                    sx={{ flex: 1 }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    开始时间
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="开始时间"
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small">
                    <Typography sx={{ fontSize: 16 }}>☐</Typography>
                  </IconButton>
                </Box>
              </Box>
              
              {/* 许可条款 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  许可条款
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    支付方式
                  </Typography>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      value={licenseTerms}
                      onChange={(e) => setLicenseTerms(e.target.value)}
                      displayEmpty
                      size="small"
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiSelect-select': {
                          py: 1
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>请选择支付方式</em>
                      </MenuItem>
                      <MenuItem value="free">免费</MenuItem>
                      <MenuItem value="paid">付费</MenuItem>
                      <MenuItem value="subscription">订阅制</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ConstructionIcon sx={{ fontSize: 64, color: '#666', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {steps[step]} - 功能开发中
            </Typography>
            <Typography variant="body1" color="text.secondary">
              该功能正在开发中，敬请期待...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 左侧导航 */}
      <Box sx={{ width: 230, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ p: 2 }}>
          
          <StyledStepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label} onClick={() => handleStepClick(index)}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: activeStep === index ? '#1976d2' : '#666',
                      fontWeight: activeStep === index ? 600 : 400
                    }
                  }}
                >
                  {index + 1} {label}
                </StepLabel>
              </Step>
            ))}
          </StyledStepper>
        </Box>
      </Box>
      
      {/* 右侧内容区域 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flex: 1, m: 3, p: 4, overflow: 'auto' }}>
          {renderStepContent(activeStep)}
          
          {/* 底部按钮 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 4
                }}
              >
                上一步
              </Button>
            )}
            {activeStep === 5 && (
              <Button
                onClick={handleOpenSaveDialog}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 4
                }}
              >
                保存
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  backgroundColor: '#4fc3f7',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 4,
                  '&:hover': {
                    backgroundColor: '#29b6f6'
                  }
                }}
              >
                下一步
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      {/* 保存对话框 */}
      <Dialog
        open={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            产品测试需要经过审核认证和审批
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ p: 1 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              不需要经过审批流程订阅我的产品
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                条款及点击确认
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#29b6f6',
                    mr: 1
                  }}
                />
                <Typography variant="body2">
                  我接受并同意系统提供的有效服务条款，以及系统的使用限制
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={handleCloseSaveDialog}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            返回
          </Button>
          <Button
            onClick={handleCloseSaveDialog}
            variant="contained"
            sx={{
              backgroundColor: '#4fc3f7',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                backgroundColor: '#29b6f6'
              }
            }}
          >
            发布
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnShelf;