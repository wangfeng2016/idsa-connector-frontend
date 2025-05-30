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
  Stack,
} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import ResponsiveContainer from '../../layouts/ResponsiveContainer';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// 模拟数据
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
  {
    id: 3,
    name: '交易记录数据',
    type: '结构化数据',
    format: 'SQL',
    size: '15.2 MB',
    status: 'active',
    createdAt: '2023-07-20',
    updatedAt: '2023-10-12',
    description: '历史交易记录，包含交易ID、客户ID、产品ID、交易金额、交易时间等',
  },
  {
    id: 4,
    name: '产品图片集',
    type: '非结构化数据',
    format: 'ZIP',
    size: '156 MB',
    status: 'inactive',
    createdAt: '2023-06-10',
    updatedAt: '2023-09-05',
    description: '产品高清图片压缩包，包含所有产品的多角度图片',
  },
  {
    id: 5,
    name: '市场分析报告',
    type: '文档',
    format: 'PDF',
    size: '8.5 MB',
    status: 'active',
    createdAt: '2023-09-25',
    updatedAt: '2023-09-25',
    description: '2023年第三季度市场分析报告，包含市场趋势、竞争分析等',
  },
  {
    id: 6,
    name: '用户行为日志',
    type: '日志数据',
    format: 'JSON',
    size: '45.8 MB',
    status: 'active',
    createdAt: '2023-08-01',
    updatedAt: '2023-10-14',
    description: '用户在网站/应用上的行为日志，包含页面访问、点击、停留时间等信息',
  },
  {
    id: 7,
    name: '供应商信息',
    type: '结构化数据',
    format: 'XML',
    size: '1.2 MB',
    status: 'active',
    createdAt: '2023-07-15',
    updatedAt: '2023-09-20',
    description: '供应商基本信息，包括ID、名称、联系方式、合作状态等',
  },
  {
    id: 8,
    name: '产品说明书集',
    type: '文档',
    format: 'ZIP',
    size: '24.6 MB',
    status: 'pending',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
    description: '所有产品的电子说明书压缩包，包含PDF格式的产品使用说明',
  },
  {
    id: 9,
    name: '员工培训视频',
    type: '非结构化数据',
    format: 'MP4',
    size: '1.2 GB',
    status: 'inactive',
    createdAt: '2023-05-20',
    updatedAt: '2023-08-15',
    description: '新员工入职培训视频集合，包含公司介绍、产品知识、操作流程等',
  },
  {
    id: 10,
    name: '销售预测模型',
    type: '模型',
    format: 'PKL',
    size: '5.7 MB',
    status: 'active',
    createdAt: '2023-09-10',
    updatedAt: '2023-10-05',
    description: '基于历史销售数据训练的销售预测机器学习模型',
  },
];

const ResourceList = () => {
  const navigate = useNavigate();
  const responsive = useResponsive();
  const [resources, setResources] = useState<DataResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<DataResource | null>(null);
  
  // 列可见性控制
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    type: !responsive.isDown('xs'),
    size: !responsive.isDown('xs'),
    createdAt: !responsive.isDown('sm'),
    updatedAt: !responsive.isDown('md'),
  });

  useEffect(() => {
    // 模拟API请求
    const timer = setTimeout(() => {
      setResources(mockResources);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewResource = (id: number) => {
    navigate(`/resources/view/${id}`);
  };

  const handleEditResource = (id: number) => {
    navigate(`/resources/edit/${id}`);
  };

  const handleDeleteClick = (resource: DataResource) => {
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (resourceToDelete) {
      // 模拟删除操作
      setResources(resources.filter((r) => r.id !== resourceToDelete.id));
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setResourceToDelete(null);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'inactive':
        return <Chip label="非活跃" color="default" size="small" />;
      case 'pending':
        return <Chip label="待处理" color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // 根据屏幕尺寸动态调整列配置
  const getColumns = (): GridColDef[] => {
    // 基础列配置
    const baseColumns: GridColDef[] = [
      { 
        field: 'id', 
        headerName: 'ID', 
        width: responsive.value({ xs: 60, sm: 70, md: 70 }, 70),
        flex: responsive.isDown('sm') ? undefined : 0.3,
      },
      { 
        field: 'name', 
        headerName: '资源名称', 
        width: responsive.value({ xs: 150, sm: 180, md: 200 }, 200),
        flex: responsive.isDown('sm') ? undefined : 1,
      },
      { 
        field: 'type', 
        headerName: '类型', 
        width: responsive.value({ xs: 100, sm: 120, md: 130 }, 130),
        flex: responsive.isDown('sm') ? undefined : 0.7,
      },
      { 
        field: 'format', 
        headerName: '格式', 
        width: responsive.value({ xs: 80, sm: 90, md: 100 }, 100),
        flex: responsive.isDown('sm') ? undefined : 0.5,
      },
      { 
        field: 'size', 
        headerName: '大小', 
        width: responsive.value({ xs: 80, sm: 90, md: 100 }, 100),
        flex: responsive.isDown('sm') ? undefined : 0.5,
      },
      {
        field: 'status',
        headerName: '状态',
        width: responsive.value({ xs: 100, sm: 110, md: 120 }, 120),
        flex: responsive.isDown('sm') ? undefined : 0.6,
        renderCell: (params: GridRenderCellParams) => getStatusChip(params.value as string),
      },
      { 
        field: 'createdAt', 
        headerName: '创建日期', 
        width: responsive.value({ xs: 110, sm: 120, md: 130 }, 130),
        flex: responsive.isDown('sm') ? undefined : 0.7,
      },
      { 
        field: 'updatedAt', 
        headerName: '更新日期', 
        width: responsive.value({ xs: 110, sm: 120, md: 130 }, 130),
        flex: responsive.isDown('sm') ? undefined : 0.7,
      },
      {
        field: 'actions',
        headerName: '操作',
        width: responsive.value({ xs: 120, sm: 150, md: 180 }, 180),
        flex: responsive.isDown('sm') ? undefined : 0.8,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const resource = params.row as DataResource;
          return (
            <Stack 
              direction="row" 
              spacing={responsive.isDown('sm') ? 0.5 : 1}
            >
              <Tooltip title="查看详情">
                <IconButton
                  size="small"
                  onClick={() => handleViewResource(resource.id)}
                  color="primary"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="编辑">
                <IconButton
                  size="small"
                  onClick={() => handleEditResource(resource.id)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(resource)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ];

    return baseColumns;
  };

  const columns = getColumns();

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: { xs: 2, sm: 0 },
            mb: { xs: 3, sm: 2 } 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            数据资源管理
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/resources/create')}
            size={responsive.isDown('sm') ? 'medium' : 'large'}
            fullWidth={responsive.isDown('xs')}
          >
            添加资源
          </Button>
        </Box>

        <Paper 
          sx={{ 
            flexGrow: 1, 
            width: '100%', 
            overflow: 'hidden',
            boxShadow: { xs: 1, sm: 2, md: 3 }
          }}
        >
          <DataGrid
            rows={resources}
            columns={columns}
            loading={loading}
            autoPageSize
            disableRowSelectionOnClick
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(model) => {
              setColumnVisibilityModel({
                type: model.type ?? !responsive.isDown('xs'),
                size: model.size ?? !responsive.isDown('xs'),
                createdAt: model.createdAt ?? !responsive.isDown('sm'),
                updatedAt: model.updatedAt ?? !responsive.isDown('md')
              });
            }}
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
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: (theme) => theme.palette.mode === 'light' 
                  ? theme.palette.grey[100] 
                  : theme.palette.grey[900],
              },
              '& .MuiDataGrid-virtualScroller': {
                minHeight: '300px',
              },
              height: { xs: 'calc(100vh - 220px)', sm: 'calc(100vh - 200px)' }
            }}
          />
        </Paper>
      </ResponsiveContainer>

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
            您确定要删除资源 "{resourceToDelete?.name}" 吗？此操作无法撤销。
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

export default ResourceList;