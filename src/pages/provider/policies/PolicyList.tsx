import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';

// 模拟数据
interface Policy {
  id: number;
  name: string;
  type: string;
  target: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  description: string;
  createdBy: string;
}

const mockPolicies: Policy[] = [
  {
    id: 1,
    name: '数据访问限制-财务数据',
    type: '访问控制',
    target: '财务资源',
    status: 'active',
    createdAt: '2023-09-01',
    updatedAt: '2023-10-15',
    description: '限制财务数据只能被财务部门访问',
    createdBy: '系统管理员',
  },
  {
    id: 2,
    name: '数据使用时间限制',
    type: '使用控制',
    target: '客户资源',
    status: 'active',
    createdAt: '2023-08-15',
    updatedAt: '2023-10-10',
    description: '限制客户数据只能在工作时间内使用',
    createdBy: '数据安全官',
  },
  {
    id: 3,
    name: '数据分享限制',
    type: '分发控制',
    target: '产品资源',
    status: 'active',
    createdAt: '2023-07-20',
    updatedAt: '2023-10-12',
    description: '限制产品数据只能分享给合作伙伴',
    createdBy: '产品经理',
  },
  {
    id: 4,
    name: '数据删除策略',
    type: '数据生命周期',
    target: '日志资源',
    status: 'inactive',
    createdAt: '2023-06-10',
    updatedAt: '2023-09-05',
    description: '日志数据保留30天后自动删除',
    createdBy: 'IT管理员',
  },
  {
    id: 5,
    name: '数据加密要求',
    type: '安全控制',
    target: '所有敏感数据',
    status: 'active',
    createdAt: '2023-09-25',
    updatedAt: '2023-09-25',
    description: '所有敏感数据必须使用AES-256加密存储和传输',
    createdBy: '安全工程师',
  },
  {
    id: 6,
    name: '数据匿名化策略',
    type: '隐私保护',
    target: '用户行为数据',
    status: 'pending',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
    description: '用户行为数据必须进行匿名化处理后才能用于分析',
    createdBy: '隐私官',
  },
  {
    id: 7,
    name: '数据质量控制',
    type: '质量控制',
    target: '产品目录数据',
    status: 'active',
    createdAt: '2023-08-05',
    updatedAt: '2023-10-08',
    description: '产品目录数据必须通过质量检查后才能发布',
    createdBy: '数据质量专员',
  },
  {
    id: 8,
    name: '数据使用次数限制',
    type: '使用控制',
    target: 'API数据服务',
    status: 'active',
    createdAt: '2023-09-15',
    updatedAt: '2023-10-10',
    description: 'API数据服务每日调用次数限制',
    createdBy: 'API管理员',
  },
];

const PolicyList = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);

  useEffect(() => {
    // 模拟API请求
    const timer = setTimeout(() => {
      setPolicies(mockPolicies);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewPolicy = (id: number) => {
    navigate(`/policies/view/${id}`);
  };

  const handleEditPolicy = (id: number) => {
    navigate(`/policies/edit/${id}`);
  };

  const handleDeleteClick = (policy: Policy) => {
    setPolicyToDelete(policy);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (policyToDelete) {
      // 模拟删除操作
      setPolicies(policies.filter((p) => p.id !== policyToDelete.id));
      setDeleteDialogOpen(false);
      setPolicyToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  const handleDuplicatePolicy = (id: number) => {
    // 模拟复制策略
    const policyToDuplicate = policies.find((p) => p.id === id);
    if (policyToDuplicate) {
      const newPolicy = {
        ...policyToDuplicate,
        id: Math.max(...policies.map((p) => p.id)) + 1,
        name: `${policyToDuplicate.name} (副本)`,
        status: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setPolicies([...policies, newPolicy]);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'inactive':
        return <Chip label="非活跃" color="default" size="small" />;
      case 'pending':
        return <Chip label="待审核" color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: '策略名称', width: 220 },
    { field: 'type', headerName: '类型', width: 130 },
    { field: 'target', headerName: '目标资源', width: 150 },
    {
      field: 'status',
      headerName: '状态',
      width: 120,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value as string),
    },
    { field: 'createdBy', headerName: '创建者', width: 130 },
    { field: 'createdAt', headerName: '创建日期', width: 130 },
    { field: 'updatedAt', headerName: '更新日期', width: 130 },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const policy = params.row as Policy;
        return (
          <Box>
            <Tooltip title="查看详情">
              <IconButton
                size="small"
                onClick={() => handleViewPolicy(policy.id)}
                color="primary"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="编辑">
              <IconButton
                size="small"
                onClick={() => handleEditPolicy(policy.id)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="复制">
              <IconButton
                size="small"
                onClick={() => handleDuplicatePolicy(policy.id)}
                color="primary"
              >
                <FileCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="删除">
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(policy)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '90%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">数据使用控制策略管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/policies/create')}
        >
          创建策略
        </Button>
      </Box>

      <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={policies}
          columns={columns}
          loading={loading}
          autoPageSize
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Paper>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            您确定要删除策略 "{policyToDelete?.name}" 吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PolicyList;