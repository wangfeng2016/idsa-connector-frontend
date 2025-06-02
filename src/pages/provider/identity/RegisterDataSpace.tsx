import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Switch,
  Checkbox,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import ResponsiveContainer from '../../../layouts/ResponsiveContainer';

const RegisterDataSpace: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyShortName: '',
    registrationAddress: '',
    country: '',
    province: '',
    city: '',
    organizationType: '',
    userType: 'enterprise',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    position: '',
    isMultiRole: false,
    didPublic: '',
    businessLicense: '',
    description: '',
    publicAddress: '',
    agreeTerms: false,
  });

  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submitTime, setSubmitTime] = useState('');

  const handleInputChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSwitchChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.checked,
    });
  };

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '' }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const handleSubmit = () => {
    console.log('提交表单数据:', formData, contacts);
    
    // 获取当前时间
    const now = new Date();
    const timeString = `${now.getFullYear()}年${(now.getMonth() + 1).toString().padStart(2, '0')}月${now.getDate().toString().padStart(2, '0')}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setSubmitTime(timeString);
    setShowSuccessMessage(true);
    
    // 2秒后自动关闭消息
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('取消操作');
  };

  return (
    <ResponsiveContainer>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: '#00bcd4',
              fontWeight: 500,
              mb: 3 
            }}
          >
            请完善注册信息
          </Typography>
          
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 基本信息 */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#f44336' }}>
                    * 公司名称
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="请输入公司名称"
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    size="small"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    公司简称
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="请输入公司简称"
                    value={formData.companyShortName}
                    onChange={handleInputChange('companyShortName')}
                    size="small"
                  />
                </Box>
              </Box>

              {/* 注册地址 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#f44336' }}>
                  * 注册地址（门牌号）
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入注册地址（门牌号）"
                  value={formData.registrationAddress}
                  onChange={handleInputChange('registrationAddress')}
                  size="small"
                />
              </Box>

              {/* 国家省市 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: '#f44336' }}>
                  * 国家
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={formData.country}
                      onChange={handleInputChange('country')}
                      displayEmpty
                    >
                      <MenuItem value="">请选择国家</MenuItem>
                      <MenuItem value="china">中国</MenuItem>
                      <MenuItem value="usa">美国</MenuItem>
                      <MenuItem value="germany">德国</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={formData.province}
                      onChange={handleInputChange('province')}
                      displayEmpty
                    >
                      <MenuItem value="">请选择省</MenuItem>
                      <MenuItem value="beijing">北京</MenuItem>
                      <MenuItem value="shanghai">上海</MenuItem>
                      <MenuItem value="guangdong">广东</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={formData.city}
                      onChange={handleInputChange('city')}
                      displayEmpty
                    >
                      <MenuItem value="">请选择市</MenuItem>
                      <MenuItem value="beijing">北京市</MenuItem>
                      <MenuItem value="shanghai">上海市</MenuItem>
                      <MenuItem value="shenzhen">深圳市</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* 机构类型 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  机构类型
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={formData.organizationType}
                    onChange={handleInputChange('organizationType')}
                    displayEmpty
                  >
                    <MenuItem value="">请选择机构类型</MenuItem>
                    <MenuItem value="enterprise">企业</MenuItem>
                    <MenuItem value="government">政府机构</MenuItem>
                    <MenuItem value="institution">事业单位</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* 用户类型 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  用户类型
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <TextField
                    placeholder="请输入公司名称"
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <RadioGroup
                    row
                    value={formData.userType}
                    onChange={handleInputChange('userType')}
                    sx={{ alignItems: 'center' }}
                  >
                    <FormControlLabel value="enterprise" control={<Radio size="small" />} label="企业" />
                    <FormControlLabel value="developer" control={<Radio size="small" />} label="开发者" />
                  </RadioGroup>
                </Box>
              </Box>

              {/* 联系人信息 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  联系人信息
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="请输入联系人姓名"
                    value={formData.contactName}
                    onChange={handleInputChange('contactName')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="请输入联系人电话"
                    value={formData.contactPhone}
                    onChange={handleInputChange('contactPhone')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              {/* 职位 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  职位
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    placeholder="请输入职位"
                    value={formData.position}
                    onChange={handleInputChange('position')}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isMultiRole}
                        onChange={handleSwitchChange('isMultiRole')}
                        size="small"
                      />
                    }
                    label="身份兼职"
                  />
                </Box>
              </Box>

              {/* 生成或配置DID */}
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00bcd4',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#00acc1',
                    },
                  }}
                >
                  生成或配置DID身份
                </Button>
                <Typography variant="caption" sx={{ ml: 2, color: '#666' }}>
                  组织生成DID（自动生成、用户不需要填写）
                </Typography>
              </Box>

              {/* DID公钥 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  DID公钥
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入DID公钥"
                  value={formData.didPublic}
                  onChange={handleInputChange('didPublic')}
                  size="small"
                  multiline
                  rows={2}
                />
              </Box>

              {/* 营业执照 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  营业执照
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={formData.businessLicense}
                      onChange={handleInputChange('businessLicense')}
                      displayEmpty
                    >
                      <MenuItem value="">请选择类型</MenuItem>
                      <MenuItem value="business">营业执照</MenuItem>
                      <MenuItem value="organization">组织机构代码证</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select displayEmpty>
                      <MenuItem value="">请选择格式</MenuItem>
                      <MenuItem value="pdf">PDF</MenuItem>
                      <MenuItem value="jpg">JPG</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select displayEmpty>
                      <MenuItem value="">请选择服务</MenuItem>
                      <MenuItem value="service1">服务1</MenuItem>
                      <MenuItem value="service2">服务2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* 公司简介 */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  公司简介
                </Typography>
                <TextField
                  fullWidth
                  placeholder="请输入公司简介"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  size="small"
                  multiline
                  rows={3}
                />
              </Box>

              {/* 上传公司logo */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  上传公司logo
                </Typography>
                <Card 
                  sx={{ 
                    border: '2px dashed #ddd',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#00bcd4',
                    },
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Supports: jpeg, png, jpg. Maximum file size 25mb
                  </Typography>
                </Card>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="大写/写真/法人头像"
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* 按钮组 */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    borderColor: '#ccc',
                    color: '#666',
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                  }}
                >
                  暂存
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#00bcd4',
                    color: 'white',
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#00acc1',
                    },
                  }}
                >
                  提交
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* 成功提交消息 */}
      <Snackbar
        open={showSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          top: '200px !important',
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#4dd0e1',
            color: 'white',
            borderRadius: '8px',
            minWidth: '800px',
            fontSize: '14px',
            fontWeight: 400,
            padding: '16px 24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
        message={
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, fontSize: '28px' }}>
              等待验证：
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '24px' }}>
              已提供所有信息，您的验证申请已于 {submitTime} 提交，请等待处理
            </Typography>
          </Box>
        }
      />
    </ResponsiveContainer>
  );
};

export default RegisterDataSpace;