import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Chip,
  Button,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { ClassificationDimension, CategoryNode } from '../../../../../contexts/DataCatalogContext';

interface CatalogDimensionPanelProps {
  onDimensionSelect?: (dimensionId: string | null) => void;
  onManageCategories?: () => void;
}

/**
 * 数据目录维度面板组件
 * 显示分类维度和类别层次结构
 */
const CatalogDimensionPanel: React.FC<CatalogDimensionPanelProps> = ({
  onDimensionSelect,
  onManageCategories
}) => {
  const {
    dimensions,
    selectedDimensionId,
    setSelectedDimensionId,
    selectedCategoryIds,
    setSelectedCategoryIds,
    getCategoriesByDimension,
    getResourceCountByCategory
  } = useDataCatalog();

  // 本地状态
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDimensionForMenu, setSelectedDimensionForMenu] = useState<string | null>(null);

  // 维度图标映射
  const getDimensionIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <BusinessIcon />;
      case 'technical':
        return <StorageIcon />;
      case 'security':
        return <SecurityIcon />;
      case 'lifecycle':
        return <ScheduleIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  // 切换维度展开状态
  const toggleDimensionExpanded = (dimensionId: string) => {
    const newExpanded = new Set(expandedDimensions);
    if (newExpanded.has(dimensionId)) {
      newExpanded.delete(dimensionId);
    } else {
      newExpanded.add(dimensionId);
    }
    setExpandedDimensions(newExpanded);
  };

  // 切换类别展开状态
  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 选择维度
  const handleDimensionSelect = (dimensionId: string) => {
    const newSelectedId = selectedDimensionId === dimensionId ? null : dimensionId;
    setSelectedDimensionId(newSelectedId);
    onDimensionSelect?.(newSelectedId);
    
    // 自动展开选中的维度
    if (newSelectedId) {
      setExpandedDimensions(prev => new Set([...prev, newSelectedId]));
    }
  };

  // 选择类别
  const handleCategorySelect = (categoryId: string) => {
    const newSelected = new Set(selectedCategoryIds);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategoryIds(newSelected);
  };

  // 处理维度菜单
  const handleDimensionMenu = (event: React.MouseEvent<HTMLElement>, dimensionId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDimensionForMenu(dimensionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDimensionForMenu(null);
  };

  // 渲染类别节点
  const renderCategoryNode = (category: CategoryNode, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryIds.has(category.id);
    const resourceCount = getResourceCountByCategory(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <Box key={category.id}>
        <ListItem 
          disablePadding 
          sx={{ 
            pl: 2 + level * 2,
            borderLeft: level > 0 ? '1px solid' : 'none',
            borderColor: 'divider',
            ml: level > 0 ? 1 : 0
          }}
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => handleCategorySelect(category.id)}
            sx={{ 
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.main'
                }
              }
            }}
          >
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoryExpanded(category.id);
                }}
                sx={{ mr: 1 }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {category.name}
                  </Typography>
                  {resourceCount > 0 && (
                    <Chip 
                      label={resourceCount} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              }
              secondary={category.description}
            />
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {category.children?.map(child => renderCategoryNode(child, level + 1))}
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 面板头部 */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          分类维度
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onManageCategories}
        >
          管理
        </Button>
      </Box>
      
      {/* 维度列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense>
          {dimensions.map((dimension) => {
            const isExpanded = expandedDimensions.has(dimension.id);
            const isSelected = selectedDimensionId === dimension.id;
            const categories = getCategoriesByDimension(dimension.id);
            
            return (
              <Box key={dimension.id}>
                {/* 维度项 */}
                <ListItem disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleDimensionSelect(dimension.id)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'primary.main'
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getDimensionIcon(dimension.type)}
                    </ListItemIcon>
                    
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {dimension.name}
                          </Typography>
                          <Chip 
                            label={categories.length} 
                            size="small" 
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.75rem' }}
                          />
                        </Box>
                      }
                      secondary={dimension.description}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {categories.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDimensionExpanded(dimension.id);
                          }}
                        >
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                      
                      <IconButton
                        size="small"
                        onClick={(e) => handleDimensionMenu(e, dimension.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </ListItemButton>
                </ListItem>
                
                {/* 类别列表 */}
                {categories.length > 0 && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List dense disablePadding>
                      {categories.map(category => renderCategoryNode(category))}
                    </List>
                  </Collapse>
                )}
                
                <Divider />
              </Box>
            );
          })}
        </List>
      </Box>
      
      {/* 维度操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          // 查看维度详情
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          查看详情
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          onManageCategories?.();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          编辑维度
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleMenuClose();
          // 删除维度
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          删除维度
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default CatalogDimensionPanel;