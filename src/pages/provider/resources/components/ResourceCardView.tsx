import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Stack,
  Rating,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import useResponsive from '../../../../hooks/useResponsive';

// 导入DataResource类型，而不是在本地定义
import { type DataResource } from '../../../../contexts/ResourceContext';

// 删除本地的DataResource接口定义

interface ResourceCardViewProps {
  resources: DataResource[];
  onViewDetails: (resource: DataResource) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * 资源列表的卡片视图组件
 */
const ResourceCardView = ({
  resources,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: ResourceCardViewProps) => {
  const responsive = useResponsive();

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

  // 计算分页
  const totalPages = Math.ceil(resources.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResources = resources.slice(startIndex, endIndex);

  // 处理分页变化
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1); // DataGrid是0-indexed，而Pagination是1-indexed
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* 卡片网格 */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflow: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {paginatedResources.map((resource) => (
          <Card 
            key={resource.id} 
            sx={{ 
              width: responsive.isDown('sm') ? '100%' : 
                    responsive.isDown('md') ? 'calc(50% - 8px)' : 
                    responsive.isDown('lg') ? 'calc(33.33% - 10.67px)' : 
                    'calc(25% - 12px)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': { boxShadow: 4 }
            }}
            onClick={() => onViewDetails(resource)}
          >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" component="h3" noWrap>
                  {resource.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(resource.id);
                  }}
                  color={resource.isFavorite ? 'warning' : 'default'}
                >
                  {resource.isFavorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                </IconButton>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2, 
                  height: 40, 
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {resource.description}
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">类型:</Typography>
                  <Typography variant="caption">{resource.type}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">业务域:</Typography>
                  <Typography variant="caption">{resource.domain}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">质量评分:</Typography>
                  <Rating value={resource.qualityScore} readOnly size="small" precision={0.1} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">使用频率:</Typography>
                  <Typography variant="caption">{resource.usageFrequency}%</Typography>
                </Box>
              </Stack>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
                {resource.tags.length > 3 && (
                  <Chip label={`+${resource.tags.length - 3}`} size="small" variant="outlined" />
                )}
              </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              {getStatusChip(resource.status)}
              <Box>
                <Tooltip title="查看详情">
                  <IconButton 
                    size="small" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onViewDetails(resource); 
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="编辑">
                  <IconButton 
                    size="small" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onEdit(resource.id); 
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="下载">
                  <IconButton 
                    size="small" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      console.log('下载:', resource.name); 
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="删除">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onDelete(resource.id); 
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* 分页控制 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Pagination 
          count={totalPages} 
          page={page + 1} // DataGrid是0-indexed，而Pagination是1-indexed
          onChange={handlePageChange} 
          color="primary" 
          size="small"
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            每页显示:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              size="small"
            >
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={36}>36</MenuItem>
              <MenuItem value={48}>48</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default ResourceCardView;