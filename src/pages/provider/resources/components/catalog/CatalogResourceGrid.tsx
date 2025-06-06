import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  Badge
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Label as TagIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Assessment as QualityIcon,
  Link as RelationIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';
import type { CatalogDataResource, Tag } from '../../../../../contexts/DataCatalogContext';

interface CatalogResourceGridProps {
  viewMode?: 'grid' | 'list' | 'tags' | 'compact';
  pageSize?: number;
  onResourceSelect?: (resource: CatalogDataResource) => void;
  onResourceAction?: (action: string, resource: CatalogDataResource) => void;
  showActions?: boolean;
  showMetrics?: boolean;
}

/**
 * 数据目录资源网格组件
 * 支持多种视图模式：网格、列表、标签、紧凑模式
 */
const CatalogResourceGrid: React.FC<CatalogResourceGridProps> = ({
  viewMode = 'grid',
  pageSize = 12,
  onResourceSelect,
  onResourceAction,
  showActions = true,
  showMetrics = true
}) => {
  const responsive = useResponsive();
  const {
    filteredResources,
    filters,
    toggleResourceFavorite,
    getResourcesByTag
  } = useDataCatalog();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'quality' | 'popularity'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedResource, setSelectedResource] = useState<CatalogDataResource | null>(null);

  // 排序和分页处理
  const sortedAndPagedResources = useMemo(() => {
    let sorted = [...filteredResources];
    
    // 排序
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = new Date(a.metadata.updatedAt).getTime() - new Date(b.metadata.updatedAt).getTime();
          break;
        case 'quality':
          comparison = a.qualityMetrics.overall - b.qualityMetrics.overall;
          break;
        case 'popularity':
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // 分页
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      resources: sorted.slice(startIndex, endIndex),
      totalCount: sorted.length,
      totalPages: Math.ceil(sorted.length / pageSize)
    };
  }, [filteredResources, sortBy, sortOrder, currentPage, pageSize]);

  // 处理操作菜单
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, resource: CatalogDataResource) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedResource(resource);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedResource(null);
  };

  const handleAction = (action: string) => {
    if (selectedResource && onResourceAction) {
      onResourceAction(action, selectedResource);
    }
    handleActionClose();
  };

  // 获取质量等级颜色
  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  // 渲染资源卡片
  const renderResourceCard = (resource: CatalogDataResource) => (
    <Card
      key={resource.id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onResourceSelect?.(resource)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 1.5,
              bgcolor: 'primary.main'
            }}
          >
            <StorageIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {resource.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {resource.description}
            </Typography>
          </Box>
        </Box>

        {/* 标签 */}
        <Box sx={{ mb: 1 }}>
          {resource.customTags.slice(0, 3).map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              sx={{
                mr: 0.5,
                mb: 0.5,
                bgcolor: tag.color,
                color: 'white',
                fontSize: '0.75rem'
              }}
            />
          ))}
          {resource.customTags.length > 3 && (
            <Chip
              label={`+${resource.customTags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
            />
          )}
        </Box>

        {/* 质量指标 */}
        {showMetrics && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Tooltip title="数据质量评分">
              <Chip
                icon={<QualityIcon />}
                label={`${Math.round(resource.qualityMetrics.overall * 100)}%`}
                size="small"
                color={getQualityColor(resource.qualityMetrics.overall) as any}
                variant="outlined"
              />
            </Tooltip>
            {resource.relations.length > 0 && (
              <Tooltip title={`${resource.relations.length} 个关联关系`}>
                <Badge badgeContent={resource.relations.length} color="primary">
                  <RelationIcon fontSize="small" color="action" />
                </Badge>
              </Tooltip>
            )}
          </Box>
        )}

        {/* 元数据信息 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {new Date(resource.metadata.updatedAt).toLocaleDateString()}
          </Typography>
          <ViewIcon fontSize="small" color="action" sx={{ ml: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {resource.viewCount || 0}
          </Typography>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
          <Box>
            <Tooltip title={resource.isFavorite ? '取消收藏' : '添加收藏'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleResourceFavorite(resource.id);
                }}
              >
                {resource.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="分享">
              <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => handleActionClick(e, resource)}
          >
            <MoreVertIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );

  // 渲染列表项
  const renderResourceListItem = (resource: CatalogDataResource) => (
    <Paper key={resource.id} sx={{ mb: 1 }}>
      <ListItem
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={() => onResourceSelect?.(resource)}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <StorageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" component="span">
                {resource.name}
              </Typography>
              {showMetrics && (
                <Chip
                  label={`${Math.round(resource.qualityMetrics.overall * 100)}%`}
                  size="small"
                  color={getQualityColor(resource.qualityMetrics.overall) as any}
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {resource.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {resource.customTags.slice(0, 5).map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      bgcolor: tag.color,
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                ))}
              </Box>
            </Box>
          }
        />
        {showActions && (
          <IconButton
            onClick={(e) => handleActionClick(e, resource)}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </ListItem>
    </Paper>
  );

  // 渲染标签视图
  const renderTagsView = () => {
    const allTags = filteredResources.reduce((acc, resource) => {
      resource.customTags.forEach(tag => {
        if (!acc.find(t => t.id === tag.id)) {
          acc.push({
            ...tag,
            resourceCount: getResourcesByTag([tag.id]).length
          });
        }
      });
      return acc;
    }, [] as (Tag & { resourceCount: number })[]);

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {allTags.map((tag) => (
          <Chip
            key={tag.id}
            label={`${tag.name} (${tag.resourceCount})`}
            sx={{
              bgcolor: tag.color,
              color: 'white',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={() => {
              // 可以添加标签点击处理逻辑
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {/* 工具栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          资源列表 ({sortedAndPagedResources.totalCount})
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 排序选择 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>排序方式</InputLabel>
            <Select
              value={sortBy}
              label="排序方式"
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="updated">更新时间</MenuItem>
              <MenuItem value="name">名称</MenuItem>
              <MenuItem value="quality">质量评分</MenuItem>
              <MenuItem value="popularity">热度</MenuItem>
            </Select>
          </FormControl>
          
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(_, value) => value && setSortOrder(value)}
            size="small"
          >
            <ToggleButton value="desc">降序</ToggleButton>
            <ToggleButton value="asc">升序</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* 内容区域 */}
      {viewMode === 'tags' ? (
        renderTagsView()
      ) : viewMode === 'list' ? (
        <List sx={{ width: '100%' }}>
          {sortedAndPagedResources.resources.map(renderResourceListItem)}
        </List>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: responsive.isXs ? 1 : 2 }}>
          {sortedAndPagedResources.resources.map((resource) => (
            <Box
              key={resource.id}
              sx={{
                width: {
                  xs: '100%',
                  sm: viewMode === 'compact' ? 'calc(33.333% - 16px)' : 'calc(50% - 16px)',
                  md: viewMode === 'compact' ? 'calc(25% - 16px)' : 'calc(33.333% - 16px)',
                  lg: viewMode === 'compact' ? 'calc(16.666% - 16px)' : 'calc(25% - 16px)'
                },
                mb: responsive.isXs ? 1 : 2
              }}
            >
              {renderResourceCard(resource)}
            </Box>
          ))}
        </Box>
      )}

      {/* 分页 */}
      {viewMode !== 'tags' && sortedAndPagedResources.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={sortedAndPagedResources.totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size={responsive.isXs ? 'small' : 'medium'}
          />
        </Box>
      )}

      {/* 操作菜单 */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
          <ListItemText>查看详情</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>编辑</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>下载</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>删除</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CatalogResourceGrid;