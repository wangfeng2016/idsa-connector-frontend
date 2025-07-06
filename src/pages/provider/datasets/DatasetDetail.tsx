import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
  DataObject as RepresentationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 使用与DatasetList相同的接口定义
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

interface Representation {
  id: string;
  mediaType: string;
  format: string;
  language?: string;
  recordCount?: number;
  schema?: string;
  artifacts: Artifact[];
  createdAt: string;
  updatedAt: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  keyword: string[];
  theme: string[];
  publisher: string;
  license?: string;
  accessRights: 'public' | 'private' | 'restricted';
  temporal?: {
    startDate?: string;
    endDate?: string;
  };
  spatial?: string;
  representations: Representation[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'processing' | 'error' | 'archived';
  sourceType: 'uploaded' | 'transformed';
  sourceResourceId?: string;
  sourceResourceName?: string;
}

// 模拟数据 - 实际应用中应该从API获取
const mockResource: Resource = {
  id: 'res-001',
  title: '客户行为分析数据集',
  description: '包含客户购买行为、浏览记录等分析数据，用于客户行为模式分析和营销策略制定。该数据集涵盖了2024年1月份的完整客户交互数据，包括页面浏览、商品查看、购买转化等关键行为指标。',
  keyword: ['客户分析', '行为数据', '营销', '转化率', '用户体验'],
  theme: ['商业智能', '客户关系管理', '数据分析'],
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
      schema: 'customer_id,action_type,timestamp,product_id,value,session_id,user_agent',
      artifacts: [
        {
          id: 'art-001-csv',
          fileName: 'customer_behavior_analysis.csv',
          filePath: '/data/customer_behavior_analysis.csv',
          fileSize: '2.5 MB',
          checksum: 'sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
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
      schema: '{"customer_id": "string", "actions": [{"type": "string", "timestamp": "datetime", "details": {}}]}',
      artifacts: [
        {
          id: 'art-001-json',
          fileName: 'customer_behavior_analysis.json',
          filePath: '/data/customer_behavior_analysis.json',
          fileSize: '3.2 MB',
          checksum: 'sha256:def456ghi789jkl012mno345pqr678stu901vwx234yz567abc',
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
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DatasetDetail: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // 实际应用中应该根据id从API获取数据
  const resource = mockResource;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDownloadArtifact = (artifact: Artifact) => {
    window.open(artifact.accessUrl, '_blank');
  };

  const getAccessRightsText = (accessRights: Resource['accessRights']) => {
    switch (accessRights) {
      case 'public': return '公开';
      case 'private': return '私有';
      case 'restricted': return '受限';
      default: return '未知';
    }
  };

  const getAccessRightsColor = (accessRights: Resource['accessRights']) => {
    switch (accessRights) {
      case 'public': return 'success';
      case 'private': return 'error';
      case 'restricted': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: Resource['status']) => {
    switch (status) {
      case 'active': return '活跃';
      case 'processing': return '处理中';
      case 'error': return '错误';
      case 'archived': return '已归档';
      default: return '未知';
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'processing': return 'warning';
      case 'error': return 'error';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 头部导航 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/enterprise/datasets')}
          sx={{ mr: 2 }}
        >
          返回列表
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {resource.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<EditIcon />}>
            编辑
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
            删除
          </Button>
        </Box>
      </Box>

      {/* 数据集基本信息卡片 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4,
            alignItems: 'flex-start'
          }}>
            {/* 左侧：描述和标签 */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '2 1 0' },
              minWidth: 0
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}>
                数据集描述
              </Typography>
              <Typography variant="body1" paragraph sx={{ 
                lineHeight: 1.7,
                color: 'text.primary'
              }}>
                {resource.description}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 1.5
                }}>
                  关键词
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  mb: 3
                }}>
                  {resource.keyword.map((keyword, index) => (
                    <Chip 
                      key={index} 
                      label={keyword} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'primary.50'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 1.5
                }}>
                  主题分类
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1
                }}>
                  {resource.theme.map((theme, index) => (
                    <Chip 
                      key={index} 
                      label={theme} 
                      size="small" 
                      color="secondary"
                      sx={{ 
                        borderRadius: 2,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            
            {/* 右侧：数据集信息 */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 0' },
              minWidth: { xs: '100%', md: '300px' },
              backgroundColor: 'grey.50',
              borderRadius: 2,
              p: 3
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                mb: 2.5
              }}>
                数据集信息
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2.5
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>发布者</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.publisher}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>许可证</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.license || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>访问权限</Typography>
                  <Chip 
                    label={getAccessRightsText(resource.accessRights)} 
                    size="small" 
                    color={getAccessRightsColor(resource.accessRights)}
                    sx={{ 
                      borderRadius: 1.5,
                      fontWeight: 500
                    }}
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>状态</Typography>
                  <Chip 
                    label={getStatusText(resource.status)} 
                    size="small" 
                    color={getStatusColor(resource.status)}
                    sx={{ 
                      borderRadius: 1.5,
                      fontWeight: 500
                    }}
                  />
                </Box>
                
                {resource.temporal && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontWeight: 500,
                      mb: 0.5
                    }}>时间范围</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {resource.temporal.startDate} 至 {resource.temporal.endDate}
                    </Typography>
                  </Box>
                )}
                
                {resource.spatial && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontWeight: 500,
                      mb: 0.5
                    }}>空间范围</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {resource.spatial}
                    </Typography>
                  </Box>
                )}
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>创建时间</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.createdAt}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>更新时间</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.updatedAt}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 标签页 */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="表示 (Representations)" />
            <Tab label="制品 (Artifacts)" />
            <Tab label="元数据" />
          </Tabs>
        </Box>
        
        {/* 表示标签页 */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            数据表示
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            该数据集的不同格式表示，每种表示可能包含多个制品文件。
          </Typography>
          
          {resource.representations.map((representation) => (
            <Card key={representation.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <RepresentationIcon color="secondary" />
                  <Typography variant="h6">
                    {representation.format} 表示
                  </Typography>
                  <Chip label={representation.mediaType} size="small" variant="outlined" />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2.5
                }}>
                  {/* 统计信息行 */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 4 },
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 1.5
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontWeight: 500,
                        mb: 0.5
                      }}>记录数</Typography>
                      <Typography variant="h6" sx={{ 
                        color: 'primary.main',
                        fontWeight: 600
                      }}>
                        {representation.recordCount?.toLocaleString() || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontWeight: 500,
                        mb: 0.5
                      }}>制品数量</Typography>
                      <Typography variant="h6" sx={{ 
                        color: 'secondary.main',
                        fontWeight: 600
                      }}>
                        {representation.artifacts.length} 个文件
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* 数据模式 */}
                  {representation.schema && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontWeight: 500,
                        mb: 1
                      }}>数据模式</Typography>
                      <Box sx={{ 
                        bgcolor: 'grey.100', 
                        p: 2.5, 
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}>
                        <Typography variant="body2" component="pre" sx={{ 
                          fontFamily: 'monospace', 
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }}>
                          {representation.schema}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  关联制品
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {representation.artifacts.map((artifact) => (
                    <Box key={artifact.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileIcon fontSize="small" />
                        <Box>
                          <Typography variant="body2">{artifact.fileName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {artifact.fileSize} • 下载 {artifact.downloadCount} 次
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="下载">
                        <IconButton size="small" onClick={() => handleDownloadArtifact(artifact)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </TabPanel>
        
        {/* 制品标签页 */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            制品文件
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            该数据集的所有物理文件制品，包含文件信息和下载统计。
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
          }}>
            {resource.representations.flatMap(rep => 
              rep.artifacts.map(artifact => (
                <Card 
                  key={artifact.id} 
                  variant="outlined" 
                  sx={{ 
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2
                    }}>
                      {/* 文件信息部分 */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        minWidth: 0
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 1.5
                        }}>
                          <FileIcon sx={{ 
                            mr: 1.5, 
                            color: 'primary.main',
                            fontSize: '1.5rem'
                          }} />
                          <Typography variant="h6" component="div" sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {artifact.fileName}
                          </Typography>
                          <Chip 
                            label={rep.format} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        
                        {/* 文件详情 */}
                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: { xs: 1, md: 3 },
                          flexWrap: 'wrap'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              大小:
                            </Typography>
                            <Typography variant="body2">
                              {artifact.fileSize}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              校验和:
                            </Typography>
                            <Tooltip title={artifact.checksum}>
                              <Typography variant="body2" sx={{ 
                                fontFamily: 'monospace',
                                bgcolor: 'grey.100',
                                px: 1,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: '0.75rem'
                              }}>
                                {artifact.checksum.substring(0, 16)}...
                              </Typography>
                            </Tooltip>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              下载次数:
                            </Typography>
                            <Typography variant="body2">
                              {artifact.downloadCount}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              创建时间:
                            </Typography>
                            <Typography variant="body2">
                              {artifact.createdAt}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* 操作按钮 */}
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                      }}>
                        <Tooltip title="下载">
                          <Button
                            variant="outlined"
                            size="medium"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadArtifact(artifact)}
                            sx={{
                              minWidth: '100px',
                              fontWeight: 500
                            }}
                          >
                            下载
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>
        
        {/* 元数据标签页 */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            完整元数据
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            该数据集的完整IDS标准元数据信息。
          </Typography>
          
          <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 1 }}>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(resource, null, 2)}
            </Typography>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default DatasetDetail;