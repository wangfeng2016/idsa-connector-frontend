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
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  DataObject as RepresentationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// IDS标准接口定义

// 制品(Artifact) - 数据的物理实例
interface Artifact {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  checksum: string;
  createdAt: string;
  accessUrl: string;
  downloadCount: number;
}

// 表示(Representation) - 数据的格式化表示
interface Representation {
  id: string;
  mediaType: string; // MIME类型，如 text/csv, application/json
  format: string; // 格式描述，如 CSV, JSON, Excel
  language?: string;
  recordCount?: number;
  schema?: string; // 数据模式描述
  artifacts: Artifact[]; // 关联的制品
  createdAt: string;
  updatedAt: string;
}

// 资源(Resource) - 数据的逻辑描述
interface Resource {
  id: string;
  title: string;
  description: string;
  keyword: string[]; // 关键词/标签
  theme: string[]; // 主题分类
  publisher: string;
  license?: string;
  accessRights: 'public' | 'private' | 'restricted';
  temporal?: {
    startDate?: string;
    endDate?: string;
  };
  spatial?: string; // 地理范围
  representations: Representation[]; // 关联的表示
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'processing' | 'error' | 'archived';
  sourceType: 'uploaded' | 'transformed';
  sourceResourceId?: string;
  sourceResourceName?: string;
}

// 模拟IDS标准数据
const mockResources: Resource[] = [
  {
    id: 'res-001',
    title: '客户行为分析资源',
    description: '包含客户购买行为、浏览记录等分析数据，用于客户行为模式分析和营销策略制定',
    keyword: ['客户分析', '行为数据', '营销'],
    theme: ['商业智能', '客户关系管理'],
    publisher: '数据分析部门',
    license: 'CC BY 4.0',
    accessRights: 'private',
    temporal: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    spatial: '全国',
    representations: [
      {
        id: 'rep-001-csv',
        mediaType: 'text/csv',
        format: 'CSV',
        recordCount: 15000,
        schema: 'customer_id,action_type,timestamp,product_id,value',
        artifacts: [
          {
            id: 'art-001-csv',
            fileName: 'customer_behavior_analysis.csv',
            filePath: '/data/customer_behavior_analysis.csv',
            fileSize: '2.5 MB',
            checksum: 'sha256:abc123...',
            createdAt: '2024-01-15',
            accessUrl: '/api/artifacts/art-001-csv/download',
            downloadCount: 23
          }
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: 'rep-001-json',
        mediaType: 'application/json',
        format: 'JSON',
        recordCount: 15000,
        schema: '{"customer_id": "string", "actions": []}',
        artifacts: [
          {
            id: 'art-001-json',
            fileName: 'customer_behavior_analysis.json',
            filePath: '/data/customer_behavior_analysis.json',
            fileSize: '3.2 MB',
            checksum: 'sha256:def456...',
            createdAt: '2024-01-15',
            accessUrl: '/api/artifacts/art-001-json/download',
            downloadCount: 12
          }
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    status: 'active',
    sourceType: 'transformed',
    sourceResourceId: 'db-001',
    sourceResourceName: '客户数据库'
  },
  {
    id: 'res-002',
    title: '产品销售报告',
    description: '月度产品销售数据汇总，包含销售额、销量、地区分布等关键指标',
    keyword: ['销售', '报告', '月度'],
    theme: ['销售管理', '业务报告'],
    publisher: '销售部门',
    license: '内部使用',
    accessRights: 'restricted',
    temporal: {
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    representations: [
      {
        id: 'rep-002-excel',
        mediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        format: 'Excel',
        recordCount: 8500,
        artifacts: [
          {
            id: 'art-002-excel',
            fileName: 'monthly_sales_report_202401.xlsx',
            filePath: '/data/monthly_sales_report_202401.xlsx',
            fileSize: '1.8 MB',
            checksum: 'sha256:ghi789...',
            createdAt: '2024-01-10',
            accessUrl: '/api/artifacts/art-002-excel/download',
            downloadCount: 45
          }
        ],
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18'
      }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    status: 'active',
    sourceType: 'uploaded'
  },
  {
    id: 'res-003',
    title: '用户反馈数据',
    description: '从API收集的用户反馈和评价数据，包含用户满意度、建议和投诉信息',
    keyword: ['用户反馈', 'API数据', '评价'],
    theme: ['用户体验', '质量管理'],
    publisher: '产品部门',
    accessRights: 'private',
    representations: [
      {
        id: 'rep-003-json',
        mediaType: 'application/json',
        format: 'JSON',
        recordCount: 3200,
        schema: '{"feedback_id": "string", "user_id": "string", "rating": "number", "comment": "string"}',
        artifacts: [
          {
            id: 'art-003-json',
            fileName: 'user_feedback_data.json',
            filePath: '/data/user_feedback_data.json',
            fileSize: '850 KB',
            checksum: 'sha256:jkl012...',
            createdAt: '2024-01-12',
            accessUrl: '/api/artifacts/art-003-json/download',
            downloadCount: 8
          }
        ],
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19'
      }
    ],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    status: 'processing',
    sourceType: 'transformed',
    sourceResourceId: 'api-003',
    sourceResourceName: '反馈API'
  }
];

const ResourceList: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'upload' | 'transform'>('upload');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const getStatusColor = (status: Resource['status']) => {
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

  const getStatusText = (status: Resource['status']) => {
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

  const getSourceTypeText = (type: Resource['sourceType']) => {
    return type === 'uploaded' ? '上传' : '转换';
  };

  const getAccessRightsText = (accessRights: Resource['accessRights']) => {
    switch (accessRights) {
      case 'public':
        return '公开';
      case 'private':
        return '私有';
      case 'restricted':
        return '受限';
      default:
        return '未知';
    }
  };

  const getAccessRightsColor = (accessRights: Resource['accessRights']) => {
    switch (accessRights) {
      case 'public':
        return 'success';
      case 'private':
        return 'error';
      case 'restricted':
        return 'warning';
      default:
        return 'default';
    }
  };

  const toggleRowExpansion = (resourceId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedRows(newExpanded);
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

  const handleDownloadArtifact = (artifact: Artifact) => {
    // 模拟下载
    window.open(artifact.accessUrl, '_blank');
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
                  <TableCell width="40"></TableCell>
                  <TableCell width="23%">资源/表示/制品</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell>格式/大小</TableCell>
                  <TableCell>记录数/下载数</TableCell>
                  <TableCell>状态/权限</TableCell>
                  <TableCell>主题/关键词</TableCell>
                  <TableCell>更新时间</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <React.Fragment key={resource.id}>
                    {/* Resource 行 */}
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(resource.id)}
                        >
                          {expandedRows.has(resource.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FileIcon color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {resource.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {resource.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getSourceTypeText(resource.sourceType)}
                          size="small"
                          color={resource.sourceType === 'uploaded' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {resource.representations.length} 个表示
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          总计: {resource.representations.reduce((sum, rep) => sum + (rep.recordCount || 0), 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Chip
                            label={getStatusText(resource.status)}
                            size="small"
                            color={getStatusColor(resource.status)}
                          />
                          <Chip
                            label={getAccessRightsText(resource.accessRights)}
                            size="small"
                            color={getAccessRightsColor(resource.accessRights)}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {resource.theme.slice(0, 2).map((theme, index) => (
                              <Chip key={index} label={theme} size="small" variant="outlined" color="secondary" />
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {resource.keyword.slice(0, 3).map((keyword, index) => (
                              <Chip key={index} label={keyword} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{resource.updatedAt}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                    
                    {/* Representation 和 Artifact 行 */}
                    {expandedRows.has(resource.id) && resource.representations.map((representation) => (
                      <React.Fragment key={representation.id}>
                        {/* Representation 行 */}
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ pl: 6 }}></TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RepresentationIcon color="secondary" fontSize="small" />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  表示: {representation.format}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {representation.mediaType}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label="表示" size="small" color="secondary" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {representation.format}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {representation.recordCount?.toLocaleString() || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {representation.artifacts.length} 个制品
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {representation.schema && (
                              <Tooltip title={representation.schema}>
                                <Chip label="有模式" size="small" variant="outlined" />
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{representation.updatedAt}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        
                        {/* Artifact 行 */}
                        {representation.artifacts.map((artifact) => (
                          <TableRow key={artifact.id} sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ pl: 8 }}></TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DownloadIcon color="action" fontSize="small" />
                                <Box>
                                  <Typography variant="body2">
                                    {artifact.fileName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    制品 ID: {artifact.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label="制品" size="small" color="default" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {artifact.fileSize}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                下载 {artifact.downloadCount} 次
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {artifact.checksum.substring(0, 16)}...
                              </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>{artifact.createdAt}</TableCell>
                            <TableCell>
                              <Tooltip title="下载">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadArtifact(artifact)}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
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
                  上传文件创建资源，系统将自动生成相应的表示和制品
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