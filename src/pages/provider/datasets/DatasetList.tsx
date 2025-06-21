import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Transform as TransformIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 数据集接口定义
interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'uploaded' | 'transformed';
  sourceType: 'file' | 'database' | 'api';
  sourceResourceId?: string;
  sourceResourceName?: string;
  format: string;
  size: string;
  recordCount: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'processing' | 'error' | 'archived';
  tags: string[];
}

// 模拟数据集数据
const mockDatasets: Dataset[] = [
  {
    id: 'ds-001',
    name: '客户行为分析数据集',
    description: '包含客户购买行为、浏览记录等分析数据',
    type: 'transformed',
    sourceType: 'database',
    sourceResourceId: 'res-001',
    sourceResourceName: '客户数据库',
    format: 'CSV',
    size: '2.5 MB',
    recordCount: 15000,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    status: 'active',
    tags: ['客户分析', '行为数据', '营销'],
  },
  {
    id: 'ds-002',
    name: '产品销售报告',
    description: '月度产品销售数据汇总',
    type: 'uploaded',
    sourceType: 'file',
    format: 'Excel',
    size: '1.8 MB',
    recordCount: 8500,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    status: 'active',
    tags: ['销售', '报告', '月度'],
  },
  {
    id: 'ds-003',
    name: '用户反馈数据',
    description: '从API收集的用户反馈和评价数据',
    type: 'transformed',
    sourceType: 'api',
    sourceResourceId: 'res-003',
    sourceResourceName: '反馈API',
    format: 'JSON',
    size: '850 KB',
    recordCount: 3200,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    status: 'processing',
    tags: ['用户反馈', 'API数据', '评价'],
  },
];

const DatasetList: React.FC = () => {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<Dataset[]>(mockDatasets);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'upload' | 'transform'>('upload');

  const getStatusColor = (status: Dataset['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'error';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Dataset['status']) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'processing':
        return '处理中';
      case 'error':
        return '错误';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  const getTypeText = (type: Dataset['type']) => {
    return type === 'uploaded' ? '上传' : '转换';
  };

  const handleCreateDataset = () => {
    setCreateDialogOpen(false);
    if (createType === 'upload') {
      navigate('/enterprise/datasets/upload');
    } else {
      navigate('/enterprise/datasets/transform');
    }
  };

  const handleEditDataset = (id: string) => {
    navigate(`/enterprise/datasets/edit/${id}`);
  };

  const handleViewDataset = (id: string) => {
    navigate(`/enterprise/datasets/view/${id}`);
  };

  const handleDeleteDataset = (id: string) => {
    if (window.confirm('确定要删除这个数据集吗？')) {
      setDatasets(datasets.filter(ds => ds.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          数据集管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          创建数据集
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>名称</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>来源</TableCell>
                  <TableCell>格式</TableCell>
                  <TableCell>大小</TableCell>
                  <TableCell>记录数</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>标签</TableCell>
                  <TableCell>更新时间</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{dataset.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dataset.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeText(dataset.type)}
                        size="small"
                        color={dataset.type === 'uploaded' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {dataset.sourceType === 'file' ? '文件上传' : 
                           dataset.sourceType === 'database' ? '数据库' : 'API'}
                        </Typography>
                        {dataset.sourceResourceName && (
                          <Typography variant="caption" color="text.secondary">
                            {dataset.sourceResourceName}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{dataset.format}</TableCell>
                    <TableCell>{dataset.size}</TableCell>
                    <TableCell>{dataset.recordCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(dataset.status)}
                        size="small"
                        color={getStatusColor(dataset.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {dataset.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{dataset.updatedAt}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="查看">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDataset(dataset.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton
                            size="small"
                            onClick={() => handleEditDataset(dataset.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteDataset(dataset.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 创建数据集对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建数据集</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            选择创建数据集的方式：
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: createType === 'upload' ? 2 : 1,
                  borderColor: createType === 'upload' ? 'primary.main' : 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  height: '100%'
                }}
                onClick={() => setCreateType('upload')}
              >
                <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">上传文件</Typography>
                  <Typography variant="body2" color="text.secondary">
                    直接上传CSV、Excel等文件创建数据集
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: createType === 'transform' ? 2 : 1,
                  borderColor: createType === 'transform' ? 'primary.main' : 'divider',
                  '&:hover': { borderColor: 'primary.main' },
                  height: '100%'
                }}
                onClick={() => setCreateType('transform')}
              >
                <CardContent sx={{ textAlign: 'center', py: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <TransformIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h6">转换资源</Typography>
                  <Typography variant="body2" color="text.secondary">
                    从现有数据资源转换生成数据集
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleCreateDataset}>
            继续
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DatasetList;