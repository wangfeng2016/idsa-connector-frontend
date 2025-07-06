import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface PolicyFormData {
  name: string;
  type: string;
  target: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
}

const initialFormData: PolicyFormData = {
  name: '',
  type: '',
  target: '',
  description: '',
  status: 'pending',
};

const policyTypes = [
  '访问控制',
  '使用控制',
  '分发控制',
  '数据生命周期',
  '安全控制',
];

const PolicyEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<PolicyFormData>(initialFormData);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    if (id) {
      // 如果是编辑模式，从API获取策略数据
      // 这里暂时使用模拟数据
      const mockPolicy = {
        id: parseInt(id),
        name: '数据访问限制-财务数据',
        type: '访问控制',
        target: '财务资源',
        status: 'active' as const,
        description: '限制财务数据只能被财务部门访问',
        createdAt: '2023-09-01',
        updatedAt: '2023-10-15',
        createdBy: '系统管理员',
      };
      setFormData({
        name: mockPolicy.name,
        type: mockPolicy.type,
        target: mockPolicy.target,
        description: mockPolicy.description,
        status: mockPolicy.status,
      });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // 这里应该调用API保存策略
    console.log('保存策略:', formData);
    setOpenConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDialog(false);
    navigate('/policies');
  };

  const handleCancel = () => {
    navigate('/policies');
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {id ? '编辑策略' : '创建新策略'}
        </Typography>

        <Stack spacing={3} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="策略名称"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth>
            <FormLabel>策略类型</FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              required
            >
              {policyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="目标资源"
            name="target"
            value={formData.target}
            onChange={handleInputChange}
            required
          />

          <TextField
            fullWidth
            label="策略描述"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />

          <FormControl fullWidth>
            <FormLabel>状态</FormLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="active">启用</MenuItem>
              <MenuItem value="inactive">禁用</MenuItem>
              <MenuItem value="pending">待定</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancel}>
              取消
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              保存
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={openConfirmDialog} onClose={handleConfirmClose}>
        <DialogTitle>操作成功</DialogTitle>
        <DialogContent>
          <DialogContentText>
            策略已{id ? '更新' : '创建'}成功！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>确定</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PolicyEditor;