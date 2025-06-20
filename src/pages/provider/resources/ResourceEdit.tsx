import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { type DataResource, mockResources } from '../../../contexts/ResourceContext';

// 数据类型选项
const dataTypes = [
  '结构化数据',
  '非结构化数据',
  '半结构化数据',
  '报表',
  '文档',
  '日志数据',
  '模型',
  '其他',
];

// 领域选项
const domainOptions = [
  '销售',
  '产品',
  '市场',
  '人力资源',
  '财务',
  '供应链',
  '技术',
  '其他',
];

// 访问级别选项
const accessLevelOptions = [
  '公开',
  '内部',
  '受限',
  '机密',
];

// 状态选项
const statusOptions = [
  { value: '已发布', label: '已发布' },
  { value: '草稿', label: '草稿' },
  { value: '审核中', label: '审核中' },
  { value: '已下线', label: '已下线' },
];

const ResourceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreating = id === 'create';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resource, setResource] = useState<DataResource>({
    id: 0,
    name: '',
    description: '',
    type: '',
    domain: '',
    owner: '',
    accessLevel: '内部',
    status: '草稿',
    tags: [],
    qualityScore: 0,
    usageFrequency: 0,
    dataVolume: '',
    lastAccessed: new Date().toISOString().split('T')[0],
    isFavorite: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isCreating) {
      setLoading(false);
      return;
    }

    // 模拟API请求获取资源详情
    const timer = setTimeout(() => {
      const resourceId = parseInt(id as string, 10);
      const foundResource = mockResources.find((r) => r.id === resourceId);

      if (foundResource) {
        setResource(foundResource);
      } else {
        setSnackbar({
          open: true,
          message: '未找到指定的资源',
          severity: 'error',
        });
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, isCreating]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (name) {
      setResource((prev) => ({
        ...prev,
        [name]: value,
      }));

      // 清除该字段的错误
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !resource.tags.includes(tagInput.trim())) {
      setResource(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setResource(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!resource.name.trim()) {
      newErrors.name = '资源名称不能为空';
    }

    if (!resource.type) {
      newErrors.type = '请选择资源类型';
    }

    if (!resource.domain) {
      newErrors.domain = '请选择所属领域';
    }

    if (!resource.owner.trim()) {
      newErrors.owner = '资源负责人不能为空';
    }

    if (!resource.accessLevel) {
      newErrors.accessLevel = '请选择访问级别';
    }

    if (!resource.status) {
      newErrors.status = '请选择资源状态';
    }

    if (!resource.description.trim()) {
      newErrors.description = '资源描述不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: '请修正表单中的错误',
        severity: 'error',
      });
      return;
    }

    setSaving(true);

    // 模拟API保存请求
    setTimeout(() => {
      setSaving(false);
      setSnackbar({
        open: true,
        message: isCreating ? '资源创建成功' : '资源更新成功',
        severity: 'success',
      });

      // 创建成功后延迟返回列表页
      setTimeout(() => {
        navigate('/enterprise/resources');
      }, 1500);
    }, 1500);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 2 }}>
      {/* 返回链接 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/enterprise/resources')}
          sx={{ color: '#1976d2', textTransform: 'none', pl: 0 }}
        >
          返回
        </Button>
        <Typography variant="h6" sx={{ ml: 2, color: '#333' }}>
          {isCreating ? '创建数据资源' : '编辑数据资源'}
        </Typography>
      </Box>

      <Card component="form" onSubmit={handleSubmit} sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="500" color="primary" gutterBottom>
              基本信息
            </Typography>
            <Divider />
          </Box>

          <Stack spacing={3}>
            {/* 第一行：资源名称、资源类型、所属领域 */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <TextField
                fullWidth
                label="资源名称"
                name="name"
                value={resource.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                size="small"
              />
              <FormControl fullWidth error={!!errors.type} size="small">
                <InputLabel>资源类型</InputLabel>
                <Select
                  label="资源类型"
                  name="type"
                  value={resource.type}
                  onChange={handleChange}
                >
                  {dataTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth error={!!errors.domain} size="small">
                <InputLabel>所属领域</InputLabel>
                <Select
                  label="所属领域"
                  name="domain"
                  value={resource.domain}
                  onChange={handleChange}
                >
                  {domainOptions.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
                {errors.domain && <FormHelperText>{errors.domain}</FormHelperText>}
              </FormControl>
            </Stack>

            {/* 第二行：负责人、访问级别、状态 */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <TextField
                fullWidth
                label="资源负责人"
                name="owner"
                value={resource.owner}
                onChange={handleChange}
                error={!!errors.owner}
                helperText={errors.owner}
                size="small"
              />
              <FormControl fullWidth error={!!errors.accessLevel} size="small">
                <InputLabel>访问级别</InputLabel>
                <Select
                  label="访问级别"
                  name="accessLevel"
                  value={resource.accessLevel}
                  onChange={handleChange}
                >
                  {accessLevelOptions.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
                {errors.accessLevel && <FormHelperText>{errors.accessLevel}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth error={!!errors.status} size="small">
                <InputLabel>资源状态</InputLabel>
                <Select
                  label="资源状态"
                  name="status"
                  value={resource.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Stack>

            {/* 第三行：数据量 */}
            <TextField
              fullWidth
              label="数据量"
              name="dataVolume"
              value={resource.dataVolume}
              onChange={handleChange}
              size="small"
              placeholder="例如：2.3 GB"
            />

            {/* 第四行：标签 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                标签
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {resource.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <Button onClick={handleTagAdd} variant="outlined" size="small">
                  添加
                </Button>
              </Box>
            </Box>

            {/* 第五行：资源描述 */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="资源描述"
              name="description"
              value={resource.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              size="small"
            />

            {/* 第六行：只读字段（编辑时显示） */}
            {!isCreating && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="质量评分"
                  value={resource.qualityScore}
                  disabled
                  size="small"
                  InputProps={{
                    readOnly: true
                  }}
                />
                <TextField
                  fullWidth
                  label="使用频率"
                  value={resource.usageFrequency}
                  disabled
                  size="small"
                  InputProps={{
                    readOnly: true
                  }}
                />
                <TextField
                  fullWidth
                  label="最后访问时间"
                  value={resource.lastAccessed}
                  disabled
                  size="small"
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* 底部操作按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/enterprise/resources')}
          sx={{ mr: 2 }}
          disabled={saving}
          size="small"
        >
          取消
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving}
          onClick={handleSubmit}
          size="small"
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResourceEdit;