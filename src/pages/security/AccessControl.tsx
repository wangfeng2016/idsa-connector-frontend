import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// 类型定义
interface AccessPolicy {
  id: number;
  name: string;
  type: 'user' | 'role' | 'group';
  subject: string;
  resource: string;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 模拟数据
const mockPolicies: AccessPolicy[] = [
  {
    id: 1,
    name: '管理员权限',
    type: 'role',
    subject: 'admin',
    resource: '*',
    permissions: ['read', 'write', 'delete', 'admin'],
    status: 'active',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '用户读取权限',
    type: 'role',
    subject: 'user',
    resource: '/api/data/*',
    permissions: ['read'],
    status: 'active',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
  },
  {
    id: 3,
    name: '特定用户权限',
    type: 'user',
    subject: 'john.doe@example.com',
    resource: '/api/projects/123',
    permissions: ['read', 'write'],
    status: 'active',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
  },
];

const AccessControl = () => {
  const [policies, setPolicies] = useState<AccessPolicy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<AccessPolicy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 处理添加/编辑策略
  const handleOpenDialog = (policy?: AccessPolicy) => {
    setSelectedPolicy(policy || null);
    setDialogOpen(true);
  };

  // 处理删除策略
  const handleOpenDeleteDialog = (policy: AccessPolicy) => {
    setSelectedPolicy(policy);
    setDeleteDialogOpen(true);
  };

  // 处理保存策略
  const handleSavePolicy = () => {
    // 实现保存逻辑
    setDialogOpen(false);
  };

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (selectedPolicy) {
      setPolicies(policies.filter(p => p.id !== selectedPolicy.id));
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card 
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
            }
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                访问控制策略
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                添加策略
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        <Card 
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }
          }}
        >
          <CardContent>
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>策略名称</TableCell>
                      <TableCell>类型</TableCell>
                      <TableCell>主体</TableCell>
                      <TableCell>资源</TableCell>
                      <TableCell>权限</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>{policy.name}</TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              policy.type === 'user' ? <PersonIcon /> :
                              policy.type === 'role' ? <SecurityIcon /> :
                              <GroupIcon />
                            }
                            label={policy.type}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{policy.subject}</TableCell>
                        <TableCell>{policy.resource}</TableCell>
                        <TableCell>
                          {policy.permissions.map((perm) => (
                            <Chip
                              key={perm}
                              label={perm}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={policy.status}
                            color={policy.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(policy)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(policy)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          </Box>
        </Box>

      {/* 添加/编辑策略对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPolicy ? '编辑策略' : '添加策略'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="策略名称"
              margin="normal"
              defaultValue={selectedPolicy?.name}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>类型</InputLabel>
              <Select
                defaultValue={selectedPolicy?.type || 'role'}
                label="类型"
              >
                <MenuItem value="user">用户</MenuItem>
                <MenuItem value="role">角色</MenuItem>
                <MenuItem value="group">组</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="主体"
              margin="normal"
              defaultValue={selectedPolicy?.subject}
            />
            <TextField
              fullWidth
              label="资源"
              margin="normal"
              defaultValue={selectedPolicy?.resource}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>权限</InputLabel>
              <Select
                multiple
                defaultValue={selectedPolicy?.permissions || []}
                label="权限"
              >
                <MenuItem value="read">读取</MenuItem>
                <MenuItem value="write">写入</MenuItem>
                <MenuItem value="delete">删除</MenuItem>
                <MenuItem value="admin">管理</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>状态</InputLabel>
              <Select
                defaultValue={selectedPolicy?.status || 'active'}
                label="状态"
              >
                <MenuItem value="active">激活</MenuItem>
                <MenuItem value="inactive">未激活</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={handleSavePolicy} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除策略 "{selectedPolicy?.name}" 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccessControl;