import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// 模拟数据 - 与ResourceList中的数据保持一致
interface DataResource {
  id: number;
  name: string;
  type: string;
  format: string;
  size: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  description: string;
}

const mockResources: DataResource[] = [
  {
    id: 1,
    name: '产品目录数据',
    type: '结构化数据',
    format: 'CSV',
    size: '2.4 MB',
    status: 'active',
    createdAt: '2023-09-01',
    updatedAt: '2023-10-15',
    description: '包含产品ID、名称、价格、库存等信息的产品目录',
  },
  {
    id: 2,
    name: '客户信息数据',
    type: '结构化数据',
    format: 'JSON',
    size: '4.7 MB',
    status: 'active',
    createdAt: '2023-08-15',
    updatedAt: '2023-10-10',
    description: '客户基本信息，包括ID、姓名、联系方式等',
  },
  // 其他资源数据...
];

const dataTypes = [
  '结构化数据',
  '非结构化数据',
  '半结构化数据',
  '文档',
  '日志数据',
  '模型',
  '其他',
];

const dataFormats = [
  'CSV',
  'JSON',
  'XML',
  'SQL',
  'PDF',
  'ZIP',
  'MP4',
  'PKL',
  '其他',
];

const statusOptions = [
  { value: 'active', label: '活跃' },
  { value: 'inactive', label: '非活跃' },
  { value: 'pending', label: '待处理' },
];

const ResourceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreating = id === 'create';
  // const pageTitle = isCreating ? '编辑数据资源' : '编辑数据资源';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resource, setResource] = useState<DataResource>({
    id: 0,
    name: '',
    type: '',
    format: '',
    size: '',
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!resource.name.trim()) {
      newErrors.name = '资源名称不能为空';
    }

    if (!resource.type) {
      newErrors.type = '请选择资源类型';
    }

    if (!resource.format) {
      newErrors.format = '请选择资源格式';
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
        navigate('/resources');
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
          onClick={() => navigate('/resources')}
          sx={{ color: '#1976d2', textTransform: 'none', pl: 0 }}
        >
          返回
        </Button>
        <Typography variant="h6" sx={{ ml: 2, color: '#333' }}>
          编辑数据资源
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
            {/* 第一行：资源名称、资源类型、资源格式 */}
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
              <FormControl fullWidth error={!!errors.format} size="small">
                <InputLabel>资源格式</InputLabel>
                <Select
                  label="资源格式"
                  name="format"
                  value={resource.format}
                  onChange={handleChange}
                >
                  {dataFormats.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </Select>
                {errors.format && <FormHelperText>{errors.format}</FormHelperText>}
              </FormControl>
            </Stack>

            {/* 第二行：资源大小、资源状态 */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <TextField
                fullWidth
                label="资源大小"
                name="size"
                value={resource.size}
                onChange={handleChange}
                size="small"
              />
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

            {/* 第三行：资源描述 */}
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

            {/* 第四行：创建日期和更新日期 */}
            {!isCreating && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="创建日期"
                  value={resource.createdAt}
                  disabled
                  size="small"
                  InputProps={{
                    readOnly: true
                  }}
                />
                <TextField
                  fullWidth
                  label="更新日期"
                  value={resource.updatedAt}
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
          onClick={() => navigate('/resources')}
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