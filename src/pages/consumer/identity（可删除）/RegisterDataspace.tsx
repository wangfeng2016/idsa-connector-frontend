import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Checkbox,
  Card,
  Snackbar,
} from '@mui/material';
import {
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

  const contacts = [{ name: '', phone: '' }];
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
              fontWeight: 600,
              color: 'primary.main',
              mb: 3
            }}
          >
            数据空间机构注册
          </Typography>
          
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            {/* 基本信息 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              基本信息
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <TextField
                label="机构名称"
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="机构简称"
                value={formData.companyShortName}
                onChange={handleInputChange('companyShortName')}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
              <FormControl fullWidth>
                <Select
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="" disabled>选择国家</MenuItem>
                  <MenuItem value="china">中国</MenuItem>
                  <MenuItem value="usa">美国</MenuItem>
                  <MenuItem value="germany">德国</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select
                  value={formData.province}
                  onChange={handleInputChange('province')}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="" disabled>选择省份</MenuItem>
                  <MenuItem value="beijing">北京</MenuItem>
                  <MenuItem value="shanghai">上海</MenuItem>
                  <MenuItem value="guangdong">广东</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <Select
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="" disabled>选择城市</MenuItem>
                  <MenuItem value="beijing">北京</MenuItem>
                  <MenuItem value="shanghai">上海</MenuItem>
                  <MenuItem value="shenzhen">深圳</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="注册地址"
              value={formData.registrationAddress}
              onChange={handleInputChange('registrationAddress')}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 4 }}
              variant="outlined"
            />

            {/* 机构类型 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              机构类型
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <RadioGroup
                value={formData.userType}
                onChange={handleInputChange('userType')}
                row
              >
                <FormControlLabel value="enterprise" control={<Radio />} label="企业" />
                <FormControlLabel value="government" control={<Radio />} label="政府机构" />
                <FormControlLabel value="research" control={<Radio />} label="科研院所" />
                <FormControlLabel value="other" control={<Radio />} label="其他" />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Select
                value={formData.organizationType}
                onChange={handleInputChange('organizationType')}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="" disabled>选择具体类型</MenuItem>
                <MenuItem value="private">民营企业</MenuItem>
                <MenuItem value="state">国有企业</MenuItem>
                <MenuItem value="foreign">外资企业</MenuItem>
                <MenuItem value="joint">合资企业</MenuItem>
              </Select>
            </FormControl>

            {/* 联系信息 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              联系信息
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <TextField
                label="联系人姓名"
                value={formData.contactName}
                onChange={handleInputChange('contactName')}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="职位"
                value={formData.position}
                onChange={handleInputChange('position')}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
              <TextField
                label="联系电话"
                value={formData.contactPhone}
                onChange={handleInputChange('contactPhone')}
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="邮箱地址"
                value={formData.contactEmail}
                onChange={handleInputChange('contactEmail')}
                fullWidth
                required
                type="email"
                variant="outlined"
              />
            </Box>

            {/* 技术信息 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              技术信息
            </Typography>
            
            <TextField
              label="DID 公钥"
              value={formData.didPublic}
              onChange={handleInputChange('didPublic')}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 3 }}
              variant="outlined"
              placeholder="请输入DID公钥信息"
            />

            <TextField
              label="公网地址"
              value={formData.publicAddress}
              onChange={handleInputChange('publicAddress')}
              fullWidth
              sx={{ mb: 4 }}
              variant="outlined"
              placeholder="请输入公网访问地址"
            />

            {/* 角色选择 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              角色配置
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>是否支持多角色：</Typography>
              <Switch
                checked={formData.isMultiRole}
                onChange={handleSwitchChange('isMultiRole')}
                color="primary"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {formData.isMultiRole ? '支持' : '不支持'}
              </Typography>
            </Box>

            {/* 资质文件 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              资质文件
            </Typography>
            
            <Card sx={{ p: 3, mb: 4, border: '2px dashed', borderColor: 'grey.300' }}>
              <Box sx={{ textAlign: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" gutterBottom>
                  上传营业执照
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  支持 PDF、JPG、PNG 格式，文件大小不超过 10MB
                </Typography>
                <Button variant="outlined" component="label">
                  选择文件
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
              </Box>
            </Card>

            {/* 机构描述 */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              机构描述
            </Typography>
            
            <TextField
              label="机构简介"
              value={formData.description}
              onChange={handleInputChange('description')}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 4 }}
              variant="outlined"
              placeholder="请简要描述您的机构背景、业务范围等信息"
            />

            {/* 协议确认 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Checkbox
                checked={formData.agreeTerms}
                onChange={handleSwitchChange('agreeTerms')}
                color="primary"
              />
              <Typography variant="body2">
                我已阅读并同意 <Button variant="text" size="small">《数据空间服务协议》</Button> 和 <Button variant="text" size="small">《隐私政策》</Button>
              </Typography>
            </Box>

            {/* 操作按钮 */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                sx={{ minWidth: 100 }}
              >
                取消
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!formData.agreeTerms}
                sx={{ minWidth: 100 }}
              >
                提交注册
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* 成功提示 */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={2000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            p: 2,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="body2">
            ✅ 注册申请提交成功！提交时间：{submitTime}
          </Typography>
        </Box>
      </Snackbar>
    </ResponsiveContainer>
  );
};

export default RegisterDataSpace;