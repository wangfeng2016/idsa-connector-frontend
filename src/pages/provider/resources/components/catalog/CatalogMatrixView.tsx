import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { CatalogDataResource, ClassificationDimension } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';

interface CatalogMatrixViewProps {
  onResourceSelect?: (resource: CatalogDataResource) => void;
}

/**
 * 数据目录矩阵视图组件
 * 以表格形式展示资源的多维度分类信息
 */
const CatalogMatrixView: React.FC<CatalogMatrixViewProps> = ({ onResourceSelect }) => {
  const responsive = useResponsive();
  const {
    dimensions,
    getFilteredResources,
    toggleResourceFavorite,
    getResourceQualityColor,
    getResourceCategories
  } = useDataCatalog();

  // 本地状态
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(
    dimensions.slice(0, 3).map(d => d.id) // 默认显示前3个维度
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
    'name', 'type', 'quality', 'usage', 'lastAccessed', 'favorite'
  ]));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedResource, setSelectedResource] = useState<CatalogDataResource | null>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);

  // 获取过滤后的资源
  const resources = getFilteredResources();

  // 表格列配置
  const baseColumns = [
    {
      id: 'name',
      label: '资源名称',
      minWidth: 200,
      render: (resource: CatalogDataResource) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <Typography variant="caption">
              {resource.name.charAt(0).toUpperCase()}
            </Typography>
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {resource.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {resource.description}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'type',
      label: '类型',
      minWidth: 100,
      render: (resource: CatalogDataResource) => (
        <Chip
          label={resource.type}
          size="small"
          variant="outlined"
          color="primary"
        />
      )
    },
    {
      id: 'quality',
      label: '质量分数',
      minWidth: 120,
      render: (resource: CatalogDataResource) => {
        const score = resource.qualityScore || 0;
        const color = getResourceQualityColor(score);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                width: 60,
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: color
                }
              }}
            />
            <Typography variant="caption">{score}%</Typography>
          </Box>
        );
      }
    },
    {
      id: 'usage',
      label: '使用频率',
      minWidth: 100,
      render: (resource: CatalogDataResource) => (
        <Typography variant="body2">
          {resource.usageFrequency || 0}
        </Typography>
      )
    },
    {
      id: 'lastAccessed',
      label: '最后访问',
      minWidth: 120,
      render: (resource: CatalogDataResource) => (
        <Typography variant="body2" color="text.secondary">
          {resource.lastAccessed ? new Date(resource.lastAccessed).toLocaleDateString() : '-'}
        </Typography>
      )
    },
    {
      id: 'favorite',
      label: '收藏',
      minWidth: 80,
      render: (resource: CatalogDataResource) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleResourceFavorite(resource.id);
          }}
        >
          {resource.isFavorite ? (
            <StarIcon sx={{ color: 'warning.main' }} />
          ) : (
            <StarBorderIcon />
          )}
        </IconButton>
      )
    }
  ];

  // 动态维度列
  const dimensionColumns = selectedDimensions.map(dimensionId => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    if (!dimension) return null;
    
    return {
      id: `dimension-${dimensionId}`,
      label: dimension.name,
      minWidth: 150,
      render: (resource: CatalogDataResource) => {
        const categories = getResourceCategories(resource.id, dimensionId);
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {categories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {categories.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                未分类
              </Typography>
            )}
          </Box>
        );
      }
    };
  }).filter(Boolean);

  // 所有列
  const allColumns = [...baseColumns, ...dimensionColumns];
  
  // 可见列
  const visibleColumnsData = allColumns.filter(col => 
    visibleColumns.has(col.id) || col.id.startsWith('dimension-')
  );

  // 处理资源菜单
  const handleResourceMenu = (event: React.MouseEvent, resource: CatalogDataResource) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
    setSelectedResource(resource);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResource(null);
  };

  // 处理列显示设置
  const handleColumnVisibility = (columnId: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(columnId)) {
      newVisible.delete(columnId);
    } else {
      newVisible.add(columnId);
    }
    setVisibleColumns(newVisible);
  };

  // 处理维度选择
  const handleDimensionSelect = (dimensionIds: string[]) => {
    setSelectedDimensions(dimensionIds);
  };

  // 导出数据
  const handleExport = () => {
    const csvContent = [
      // 表头
      visibleColumnsData.map(col => col.label).join(','),
      // 数据行
      ...resources.map(resource => 
        visibleColumnsData.map(col => {
          if (col.id === 'name') return `"${resource.name}"`;
          if (col.id === 'type') return resource.type;
          if (col.id === 'quality') return resource.qualityScore || 0;
          if (col.id === 'usage') return resource.usageFrequency || 0;
          if (col.id === 'lastAccessed') return resource.lastAccessed || '';
          if (col.id === 'favorite') return resource.isFavorite ? '是' : '否';
          if (col.id.startsWith('dimension-')) {
            const dimensionId = col.id.replace('dimension-', '');
            const categories = getResourceCategories(resource.id, dimensionId);
            return `"${categories.map(c => c.name).join('; ')}"`;
          }
          return '';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data-catalog-matrix-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* 维度选择 */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>显示维度</InputLabel>
              <Select
                multiple
                value={selectedDimensions}
                onChange={(e) => handleDimensionSelect(e.target.value as string[])}
                label="显示维度"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      const dimension = dimensions.find(d => d.id === value);
                      return (
                        <Chip key={value} label={dimension?.name} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {dimensions.map(dimension => (
                  <MenuItem key={dimension.id} value={dimension.id}>
                    <Checkbox checked={selectedDimensions.includes(dimension.id)} />
                    <ListItemText primary={dimension.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* 资源统计 */}
            <Typography variant="body2" color="text.secondary">
              共 {resources.length} 个资源
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 列显示设置 */}
            <Tooltip title="列设置">
              <IconButton
                size="small"
                onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              >
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>
            
            {/* 导出 */}
            <Tooltip title="导出数据">
              <IconButton size="small" onClick={handleExport}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      {/* 表格 */}
      <Paper sx={{ flex: 1, overflow: 'hidden' }}>
        <TableContainer sx={{ height: '100%' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {visibleColumnsData.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ 
                      minWidth: column.minWidth,
                      fontWeight: 600,
                      bgcolor: 'background.paper'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell sx={{ width: 50, bgcolor: 'background.paper' }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource) => (
                <TableRow
                  key={resource.id}
                  hover
                  onClick={() => onResourceSelect?.(resource)}
                  sx={{ cursor: 'pointer' }}
                >
                  {visibleColumnsData.map((column) => (
                    <TableCell key={column.id}>
                      {column.render(resource)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleResourceMenu(e, resource)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* 资源操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>查看详情</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>编辑资源</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>分享资源</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* 列设置菜单 */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            显示列
          </Typography>
          {baseColumns.map(column => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={visibleColumns.has(column.id)}
                  onChange={() => handleColumnVisibility(column.id)}
                  size="small"
                />
              }
              label={column.label}
              sx={{ display: 'block', mb: 0.5 }}
            />
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export default CatalogMatrixView;