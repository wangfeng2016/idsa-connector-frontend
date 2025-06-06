import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import { SimpleTreeView as TreeView, TreeItem } from '@mui/x-tree-view';
import {
  ExpandMore,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as FileIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { CategoryNode, CatalogDataResource, DimensionType } from '../../../../../contexts/DataCatalogContext';

interface CatalogHierarchyViewProps {
  onResourceSelect?: (resource: CatalogDataResource) => void;
  onCategorySelect?: (category: CategoryNode) => void;
}

/**
 * 数据目录层次视图组件
 * 以树形结构展示分类维度、类别和资源
 */
const CatalogHierarchyView: React.FC<CatalogHierarchyViewProps> = ({
  onResourceSelect,
  onCategorySelect
}) => {
  const {
    dimensions,
    selectedDimensionId,
    getCategoriesByDimension,
    getResourcesByCategory,
    toggleResourceFavorite,
    getResourceQualityColor
  } = useDataCatalog();

  // 本地状态
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<{
    type: 'category' | 'resource';
    data: CategoryNode | CatalogDataResource;
  } | null>(null);

  // 获取要显示的数据
  const hierarchyData = useMemo(() => {
    if (selectedDimensionId) {
      // 显示选中维度的类别和资源
      const categories = getCategoriesByDimension(selectedDimensionId as DimensionType);
      return categories;
    } else {
      // 显示所有维度
      return dimensions.map(dimension => ({
        id: dimension.id,
        name: dimension.name,
        description: dimension.description,
        type: 'dimension' as const,
        children: getCategoriesByDimension(dimension.id as DimensionType)
      }));
    }
  }, [selectedDimensionId, dimensions, getCategoriesByDimension]);

  // 处理节点展开/收起
  const handleToggle = (_event: React.SyntheticEvent, itemIds: string[]) => {
    setExpanded(itemIds);
  };

  // 处理节点选择
  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    setSelected(itemId || '');
  };

  // 处理右键菜单
  const handleContextMenu = (
    event: React.MouseEvent,
    type: 'category' | 'resource',
    data: CategoryNode | CatalogDataResource
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
    setContextMenuTarget({ type, data });
  };

  // 关闭右键菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
    setContextMenuTarget(null);
  };

  // 获取资源图标
  const getResourceIcon = (resource: CatalogDataResource) => {
    const iconProps = {
      fontSize: 'small' as const,
      sx: { color: getResourceQualityColor(resource.qualityScore || 0) }
    };

    switch (resource.type) {
      case 'dataset':
        return <AssessmentIcon {...iconProps} />;
      case 'api':
        return <SecurityIcon {...iconProps} />;
      case 'service':
        return <ScheduleIcon {...iconProps} />;
      default:
        return <FileIcon {...iconProps} />;
    }
  };

  // 获取访问级别颜色
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'success';
      case 'internal':
        return 'info';
      case 'restricted':
        return 'warning';
      case 'confidential':
        return 'error';
      default:
        return 'default';
    }
  };

  // 渲染资源节点
  const renderResourceNode = (resource: CatalogDataResource) => {
    const qualityColor = getResourceQualityColor(resource.qualityScore || 0);
    
    return (
      <TreeItem
        key={`resource-${resource.id}`}
        itemId={`resource-${resource.id}`}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              pr: 1
            }}
            onContextMenu={(e) => handleContextMenu(e, 'resource', resource)}
          >
            {/* 资源图标 */}
            {getResourceIcon(resource)}
            
            {/* 资源信息 */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {resource.name}
                </Typography>
                
                {/* 收藏状态 */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleResourceFavorite(resource.id);
                  }}
                  sx={{ p: 0.25 }}
                >
                  {resource.isFavorite ? (
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  ) : (
                    <StarBorderIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              </Box>
              
              {/* 资源描述 */}
              {resource.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {resource.description}
                </Typography>
              )}
              
              {/* 质量分数条 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={resource.qualityScore || 0}
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: qualityColor
                    }
                  }}
                />
                <Typography variant="caption" sx={{ minWidth: 30 }}>
                  {resource.qualityScore || 0}%
                </Typography>
              </Box>
            </Box>
            
            {/* 标签和状态 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* 访问级别 */}
              <Chip
                label={resource.accessLevel}
                size="small"
                color={getAccessLevelColor(resource.accessLevel) as any}
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
              
              {/* 资源类型 */}
              <Chip
                label={resource.type}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
              
              {/* 更多操作 */}
              <IconButton
                size="small"
                onClick={(e) => handleContextMenu(e, 'resource', resource)}
                sx={{ p: 0.25 }}
              >
                <MoreVertIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        }
        onClick={() => onResourceSelect?.(resource)}
      />
    );
  };

  // 渲染类别节点
  const renderCategoryNode = (category: CategoryNode): React.ReactNode => {
    // 获取当前选中的维度ID
    const dimensionId = selectedDimensionId as DimensionType;
    const resources = getResourcesByCategory(dimensionId, category.path);
    
    return (
      <TreeItem
        key={`category-${category.id}`}
        itemId={`category-${category.id}`}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5,
              pr: 1
            }}
            onContextMenu={(e) => handleContextMenu(e, 'category', category)}
          >
            {/* 文件夹图标 */}
            {expanded.includes(`category-${category.id}`) ? (
              <FolderOpenIcon sx={{ color: 'primary.main' }} />
            ) : (
              <FolderIcon sx={{ color: 'text.secondary' }} />
            )}
            
            {/* 类别信息 */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {category.name}
              </Typography>
              {category.description && (
                <Typography variant="caption" color="text.secondary">
                  {category.description}
                </Typography>
              )}
            </Box>
            
            {/* 资源数量 */}
            <Chip
              label={resources.length}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            
            {/* 更多操作 */}
            <IconButton
              size="small"
              onClick={(e) => handleContextMenu(e, 'category', category)}
              sx={{ p: 0.25 }}
            >
              <MoreVertIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        }
        onClick={() => onCategorySelect?.(category)}
      >
        {/* 子类别 */}
        {category.children?.map(child => renderCategoryNode(child))}
        
        {/* 类别下的资源 */}
        {resources.map(resource => renderResourceNode(resource))}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TreeView
        slots={{
          collapseIcon: ExpandMore,
          expandIcon: ChevronRight
        }}
        expandedItems={expanded}
        selectedItems={selected}
        onExpandedItemsChange={handleToggle}
        onSelectedItemsChange={handleSelect}
        sx={{
          flexGrow: 1,
          maxWidth: '100%',
          overflowY: 'auto',
          '& .MuiTreeItem-root': {
            '& .MuiTreeItem-content': {
              borderRadius: 1,
              margin: '2px 0',
              '&:hover': {
                bgcolor: 'action.hover'
              },
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.main'
                }
              }
            }
          }
        }}
      >
        {hierarchyData.map(item => {
          if ('type' in item && item.type === 'dimension') {
            // 渲染维度节点
            return (
              <TreeItem
                key={`dimension-${item.id}`}
                itemId={`dimension-${item.id}`}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      <Typography variant="caption">
                        {item.name.charAt(0)}
                      </Typography>
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={item.children?.length || 0}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
              >
                {item.children?.map(category => renderCategoryNode(category))}
              </TreeItem>
            );
          } else {
            // 渲染类别节点
            return renderCategoryNode(item as CategoryNode);
          }
        })}
      </TreeView>
      
      {/* 右键菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {contextMenuTarget?.type === 'resource' ? (
          // 资源菜单
          [
            <MenuItem key="view" onClick={handleMenuClose}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>查看详情</ListItemText>
            </MenuItem>,
            <MenuItem key="edit" onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>编辑资源</ListItemText>
            </MenuItem>,
            <MenuItem key="share" onClick={handleMenuClose}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>分享资源</ListItemText>
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="delete" onClick={handleMenuClose}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>删除资源</ListItemText>
            </MenuItem>
          ]
        ) : (
          // 类别菜单
          [
            <MenuItem key="view" onClick={handleMenuClose}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>查看类别</ListItemText>
            </MenuItem>,
            <MenuItem key="edit" onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>编辑类别</ListItemText>
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="delete" onClick={handleMenuClose}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>删除类别</ListItemText>
            </MenuItem>
          ]
        )}
      </Menu>
    </Box>
  );
};

export default CatalogHierarchyView;