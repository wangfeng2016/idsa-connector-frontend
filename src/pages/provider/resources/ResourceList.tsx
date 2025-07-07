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
  Description as FileIcon,
  TextFields as TextIcon,
  Image as ImageIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  InsertDriveFile as FileGenericIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 简化的资源接口定义
interface Resource {
  id: string;
  title: string; // 名称
  description: string; // 描述
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'; // 类型（文本、图像、音频等）
  format: string; // 格式（CSV、TXT、JSON等）
  keywords: string[]; // 关键词
  created: string; // 创建时间
  status: 'private' | 'offered' | 'subscribed'; // 私有、已提供、已订阅
  publisher: string;
  license?: string;
  sourceType: 'uploaded' | 'transformed';
  sourceResourceId?: string;
  sourceResourceName?: string;
}

// 简化的模拟数据
const mockResources: Resource[] = [
  {
    id: 'res-001',
    title: '客户行为分析资源',
    description: '包含客户购买行为、浏览记录等分析数据，用于客户行为模式分析和营销策略制定',
    type: 'document',
    format: 'CSV',
    keywords: ['客户分析', '行为数据', '营销'],
    created: '2024-01-15',
    status: 'subscribed',
    publisher: '数据分析部门',
    license: 'CC BY 4.0',
    sourceType: 'transformed',
    sourceResourceId: 'db-001',
    sourceResourceName: '客户数据库'
  },
  {
    id: 'res-002',
    title: '产品销售报告',
    description: '月度产品销售数据汇总，包含销售额、销量、地区分布等关键指标',
    type: 'document',
    format: 'Excel',
    keywords: ['销售', '报告', '月度'],
    created: '2024-01-10',
    status: 'offered',
    publisher: '销售部门',
    license: '内部使用',
    sourceType: 'uploaded'
  },
  {
    id: 'res-003',
    title: '用户反馈数据',
    description: '从API收集的用户反馈和评价数据，包含用户满意度、建议和投诉信息',
    type: 'text',
    format: 'JSON',
    keywords: ['用户反馈', 'API数据', '评价'],
    created: '2024-01-12',
    status: 'private',
    publisher: '产品部门',
    sourceType: 'transformed',
    sourceResourceId: 'api-003',
    sourceResourceName: '反馈API'
  },
  {
    id: 'res-004',
    title: '产品宣传图片',
    description: '用于市场推广的产品高清图片资源，包含多种尺寸和格式',
    type: 'image',
    format: 'PNG',
    keywords: ['产品图片', '宣传', '营销素材'],
    created: '2024-01-08',
    status: 'offered',
    publisher: '市场部门',
    license: 'CC BY-SA 4.0',
    sourceType: 'uploaded'
  },
  {
    id: 'res-005',
    title: '培训视频资料',
    description: '员工培训使用的视频教程，涵盖产品知识和操作流程',
    type: 'video',
    format: 'MP4',
    keywords: ['培训', '视频', '教程'],
    created: '2024-01-05',
    status: 'subscribed',
    publisher: '人力资源部',
    license: '内部使用',
    sourceType: 'uploaded'
  }
];

const ResourceList: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'upload' | 'transform'>('upload');

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'private':
        return 'default';
      case 'offered':
        return 'warning';
      case 'subscribed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Resource['status']) => {
    switch (status) {
      case 'private':
        return '私有';
      case 'offered':
        return '已提供';
      case 'subscribed':
        return '已订阅';
      default:
        return '未知';
    }
  };



  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'text':
        return <TextIcon />;
      case 'image':
        return <ImageIcon />;
      case 'audio':
        return <AudioIcon />;
      case 'video':
        return <VideoIcon />;
      case 'document':
        return <FileIcon />;
      default:
        return <FileGenericIcon />;
    }
  };

  const getTypeText = (type: Resource['type']) => {
    switch (type) {
      case 'text':
        return '文本';
      case 'image':
        return '图像';
      case 'audio':
        return '音频';
      case 'video':
        return '视频';
      case 'document':
        return '文档';
      default:
        return '其他';
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'text':
        return 'primary';
      case 'image':
        return 'secondary';
      case 'audio':
        return 'success';
      case 'video':
        return 'warning';
      case 'document':
        return 'info';
      default:
        return 'default';
    }
  };



  const handleCreateResource = () => {
    setCreateDialogOpen(false);
    if (createType === 'upload') {
      navigate('/enterprise/resources/upload');
    } else {
      navigate('/enterprise/resources/transform');
    }
  };

  const handleEditResource = (id: string) => {
    navigate(`/enterprise/resources/edit/${id}`);
  };

  const handleViewResource = (id: string) => {
    navigate(`/enterprise/resources/${id}`);
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      setResources(resources.filter(res => res.id !== id));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          资源管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          创建资源
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="30%">名称</TableCell>
                  <TableCell width="15%">类型</TableCell>
                  <TableCell width="10%">格式</TableCell>
                  <TableCell width="20%">关键词</TableCell>
                  <TableCell width="10%">状态</TableCell>
                  <TableCell width="10%">创建时间</TableCell>
                  <TableCell width="5%">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeIcon(resource.type)}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {resource.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {resource.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeText(resource.type)}
                        size="small"
                        color={getTypeColor(resource.type)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {resource.format}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {resource.keywords.slice(0, 3).map((keyword, index) => (
                          <Chip key={index} label={keyword} size="small" variant="outlined" />
                        ))}
                        {resource.keywords.length > 3 && (
                          <Chip label={`+${resource.keywords.length - 3}`} size="small" variant="outlined" color="default" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(resource.status)}
                        size="small"
                        color={getStatusColor(resource.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {resource.created}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="查看">
                          <IconButton
                            size="small"
                            onClick={() => handleViewResource(resource.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑">
                          <IconButton
                            size="small"
                            onClick={() => handleEditResource(resource.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteResource(resource.id)}
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

      {/* 创建数据资源对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建资源</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            选择创建资源的方式
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
                  上传文件创建资源，支持多种文件格式
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
                  从现有资源转换生成新的资源，支持格式转换和数据处理
                </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleCreateResource}>
            继续
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourceList;