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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TextFields as TextIcon,
  Image as ImageIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  Description as FileIcon,
  InsertDriveFile as FileGenericIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 使用与ResourceList相同的简化接口定义
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

// 模拟数据 - 实际应用中应该从API获取
const mockResource: Resource = {
  id: 'res-001',
  title: '客户行为分析资源',
  description: '包含客户购买行为、浏览记录等分析数据，用于客户行为模式分析和营销策略制定。该资源涵盖了2024年1月份的完整客户交互数据，包括页面浏览、商品查看、购买转化等关键行为指标。',
  type: 'document',
  format: 'CSV',
  keywords: ['客户分析', '行为数据', '营销', '转化率', '用户体验'],
  created: '2024-01-15',
  status: 'subscribed',
  publisher: '数据分析部门',
  license: 'CC BY 4.0',
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

const ResourceDetail: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // 实际应用中应该根据id从API获取数据
  const resource = mockResource;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };



  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'text': return <TextIcon />;
      case 'image': return <ImageIcon />;
      case 'audio': return <AudioIcon />;
      case 'video': return <VideoIcon />;
      case 'document': return <FileIcon />;
      default: return <FileGenericIcon />;
    }
  };

  const getTypeText = (type: Resource['type']) => {
    switch (type) {
      case 'text': return '文本';
      case 'image': return '图像';
      case 'audio': return '音频';
      case 'video': return '视频';
      case 'document': return '文档';
      default: return '其他';
    }
  };



  const getStatusText = (status: Resource['status']) => {
    switch (status) {
      case 'private': return '私有';
      case 'offered': return '已提供';
      case 'subscribed': return '已订阅';
      default: return '未知';
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'private': return 'default';
      case 'offered': return 'warning';
      case 'subscribed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 头部导航 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/enterprise/resources')}
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

      {/* 资源基本信息卡片 */}
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
                资源描述
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
                  gap: 1
                }}>
                  {resource.keywords.map((keyword, index) => (
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
            </Box>
            
            {/* 右侧：资源信息 */}
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
                资源信息
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
                  }}>类型</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(resource.type)}
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {getTypeText(resource.type)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>格式</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.format}
                  </Typography>
                </Box>
                
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
                
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    mb: 0.5
                  }}>创建时间</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {resource.created}
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
            <Tab label="元数据" />
          </Tabs>
        </Box>
        
        {/* 元数据标签页 */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            完整元数据
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            该资源的完整IDS标准元数据信息。
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

export default ResourceDetail;