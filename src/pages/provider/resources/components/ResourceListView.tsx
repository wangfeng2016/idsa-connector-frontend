import { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Rating,
  Avatar,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridToolbar,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// 导入DataResource类型，而不是在本地定义
import { type DataResource } from '../../../../contexts/ResourceContext';

// 删除本地的DataResource接口定义

interface ResourceListViewProps {
  resources: DataResource[];
  selectedResources: DataResource[];
  onSelectionChange: (resources: DataResource[]) => void;
  onViewDetails: (resource: DataResource) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  columnVisibility: Record<string, boolean>;
}

/**
 * 资源列表的表格视图组件
 */
const ResourceListView = ({
  resources,
  selectedResources,
  onSelectionChange,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  sortModel,
  onSortModelChange,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  columnVisibility,
}: ResourceListViewProps) => {
  // 获取状态对应的Chip组件
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

  // 获取访问级别对应的Chip组件
  const getAccessChip = (level: string) => {
    switch (level) {
      case 'public':
        return <Chip label="公开" color="success" size="small" />;
      case 'internal':
        return <Chip label="内部" color="warning" size="small" />;
      case 'confidential':
        return <Chip label="机密" color="error" size="small" />;
      default:
        return <Chip label={level} size="small" />;
    }
  };

  // 表格列定义
  const columns = useMemo<GridColDef[]>(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      flex: 0.3,
    },
    {
      field: 'isFavorite',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          size="small"
          onClick={() => onToggleFavorite(params.row.id)}
          color={params.value ? 'warning' : 'default'}
        >
          {params.value ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
        </IconButton>
      ),
    },
    { 
      field: 'name', 
      headerName: '数据集名称', 
      width: 200,
      flex: 1.2,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'type', 
      headerName: '数据类型', 
      width: 120,
      flex: 0.7,
    },
    {
      field: 'domain',
      headerName: '业务域',
      width: 120,
      flex: 0.7,
    },
    {
      field: 'qualityScore',
      headerName: '质量评分',
      width: 120,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={params.value} readOnly size="small" precision={0.1} />
          <Typography variant="caption">({params.value})</Typography>
        </Box>
      ),
    },
    {
      field: 'usageFrequency',
      headerName: '使用频率',
      width: 120,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon fontSize="small" color="primary" />
          <Typography variant="body2">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: 'dataVolume',
      headerName: '数据量',
      width: 100,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorageIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'owner',
      headerName: '所有者',
      width: 100,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'accessLevel',
      headerName: '访问级别',
      width: 100,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => getAccessChip(params.value as string),
    },
    {
      field: 'status',
      headerName: '状态',
      width: 100,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value as string),
    },
    {
      field: 'tags',
      headerName: '标签',
      width: 150,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {(params.value as string[]).slice(0, 2).map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
          {(params.value as string[]).length > 2 && (
            <Chip label={`+${(params.value as string[]).length - 2}`} size="small" variant="outlined" />
          )}
        </Box>
      ),
    },
    { 
      field: 'lastAccessed', 
      headerName: '最后访问', 
      width: 120,
      flex: 0.7,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const resource = params.row as DataResource;
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="查看详情">
              <IconButton
                size="small"
                onClick={() => onViewDetails(resource)}
                color="primary"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="编辑">
              <IconButton
                size="small"
                onClick={() => onEdit(resource.id)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="下载">
              <IconButton
                size="small"
                onClick={() => console.log('下载资源:', resource.name)}
                color="success"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="删除">
              <IconButton
                size="small"
                onClick={() => onDelete(resource.id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ], [onToggleFavorite, onViewDetails, onEdit, onDelete]);

  // 根据columnVisibility过滤列
  const visibleColumns = useMemo(() => {
    return columns.filter(col => {
      // 始终显示ID、名称和操作列
      if (col.field === 'id' || col.field === 'name' || col.field === 'actions' || col.field === 'isFavorite') {
        return true;
      }
      // 根据columnVisibility决定是否显示其他列
      return columnVisibility[col.field] !== false;
    });
  }, [columns, columnVisibility]);

  return (
    <DataGrid
      rows={resources}
      columns={visibleColumns}
      checkboxSelection
      disableRowSelectionOnClick
      rowSelectionModel={{
        type: "include",
        ids: new Set(selectedResources.map(r => r.id))
      }}
      onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => {
        const selectedIds = newSelectionModel.ids;
        const newSelectedResources = resources.filter(r => selectedIds.has(r.id));
        onSelectionChange(newSelectedResources);
      }}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={(model) => {
        onPageChange(model.page);
        onPageSizeChange(model.pageSize);
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      slots={{
        toolbar: GridToolbar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: false,
          printOptions: { disableToolbarButton: true },
          csvOptions: { disableToolbarButton: true },
        },
      }}
      sx={{
        '& .MuiDataGrid-cell:hover': {
          color: 'primary.main',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'grey.50',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'action.hover',
        },
        height: '100%',
        width: '100%',
        border: 'none',
      }}
    />
  );
};

export default ResourceListView;