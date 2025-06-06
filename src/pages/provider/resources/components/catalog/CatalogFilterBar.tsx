import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Popover,
  Paper,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  BookmarkBorder as BookmarkIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';
import type { CatalogFilterState } from '../../../../../contexts/DataCatalogContext';

interface CatalogFilterBarProps {
  onFiltersChange?: (filters: CatalogFilterState) => void;
}

/**
 * 数据目录过滤栏组件
 * 提供搜索、过滤、排序等功能
 */
const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({ onFiltersChange }) => {
  const responsive = useResponsive();
  const {
    filters,
    setFilters,
    dimensions,
    getAllTags,
    searchResources,
    resetFilters
  } = useDataCatalog();

  // 本地状态
  const [searchValue, setSearchValue] = useState(filters.searchQuery || '');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  // 获取所有标签
  const allTags = getAllTags();

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchValue(query);
    const newFilters = { ...filters, searchQuery: query };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // 处理过滤器变更
  const handleFilterChange = (key: keyof CatalogFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // 清除所有过滤器
  const handleClearFilters = () => {
    setSearchValue('');
    resetFilters();
    onFiltersChange?.({
      searchQuery: '',
      selectedDimensions: [],
      selectedCategories: [],
      selectedTags: [],
      resourceTypes: [],
      accessLevels: [],
      qualityRange: [0, 100],
      usageRange: [0, 1000],
      dateRange: { start: null, end: null },
      sortBy: 'name',
      sortOrder: 'asc',
      showFavorites: false,
      showRecent: false
    });
  };

  // 处理标签选择
  const handleTagSelect = (tagId: string) => {
    const currentTags = filters.selectedTags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id: string) => id !== tagId)
      : [...currentTags, tagId];
    handleFilterChange('selectedTags', newTags);
  };

  // 处理资源类型选择
  const handleResourceTypeSelect = (type: string) => {
    const currentTypes = filters.resourceTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type];
    handleFilterChange('resourceTypes', newTypes);
  };

  // 获取活跃过滤器数量
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedDimensions?.length) count++;
    if (filters.selectedCategories?.length) count++;
    if (filters.selectedTags?.length) count++;
    if (filters.resourceTypes?.length) count++;
    if (filters.accessLevels?.length) count++;
    if (filters.showFavorites) count++;
    if (filters.showRecent) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // 资源类型选项
  const resourceTypeOptions = [
    { value: 'dataset', label: '数据集' },
    { value: 'api', label: 'API' },
    { value: 'service', label: '服务' },
    { value: 'model', label: '模型' },
    { value: 'report', label: '报告' },
    { value: 'document', label: '文档' }
  ];

  // 访问级别选项
  const accessLevelOptions = [
    { value: 'public', label: '公开' },
    { value: 'internal', label: '内部' },
    { value: 'restricted', label: '受限' },
    { value: 'confidential', label: '机密' }
  ];

  // 排序选项
  const sortOptions = [
    { value: 'name', label: '名称' },
    { value: 'created', label: '创建时间' },
    { value: 'updated', label: '更新时间' },
    { value: 'quality', label: '质量分数' },
    { value: 'usage', label: '使用频率' }
  ];

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: responsive.isXs ? 'column' : 'row',
        gap: 2, 
        alignItems: responsive.isXs ? 'stretch' : 'center'
      }}>
        {/* 搜索框 */}
        <Box sx={{ 
          flex: 1, 
          minWidth: responsive.isXs ? '100%' : 300
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="搜索资源、标签、描述..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearch('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {/* 快速过滤器 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* 收藏夹 */}
          <Tooltip title="显示收藏">
            <IconButton
              size="small"
              onClick={() => handleFilterChange('showFavorites', !filters.showFavorites)}
              sx={{
                color: filters.showFavorites ? 'primary.main' : 'text.secondary'
              }}
            >
              <StarIcon />
            </IconButton>
          </Tooltip>
          
          {/* 最近访问 */}
          <Tooltip title="显示最近访问">
            <IconButton
              size="small"
              onClick={() => handleFilterChange('showRecent', !filters.showRecent)}
              sx={{
                color: filters.showRecent ? 'primary.main' : 'text.secondary'
              }}
            >
              <ScheduleIcon />
            </IconButton>
          </Tooltip>
          
          {/* 排序 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>排序</InputLabel>
            <Select
              value={filters.sortBy || 'name'}
              label="排序"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* 高级过滤器按钮 */}
          <Button
            size="small"
            variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{ position: 'relative' }}
          >
            过滤器
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  height: 16,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Button>
          
          {/* 清除过滤器 */}
          {activeFiltersCount > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={handleClearFilters}
            >
              清除
            </Button>
          )}
        </Box>
      </Box>
      
      {/* 活跃过滤器标签 */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.selectedTags?.map((tagId: string) => {
            const tag = allTags.find(t => t.id === tagId);
            return tag ? (
              <Chip
                key={tagId}
                label={tag.name}
                size="small"
                onDelete={() => handleTagSelect(tagId)}
                color="primary"
                variant="outlined"
              />
            ) : null;
          })}
          
          {filters.resourceTypes?.map((type: string) => {
            const typeOption = resourceTypeOptions.find(opt => opt.value === type);
            return typeOption ? (
              <Chip
                key={type}
                label={typeOption.label}
                size="small"
                onDelete={() => handleResourceTypeSelect(type)}
                color="secondary"
                variant="outlined"
              />
            ) : null;
          })}
        </Box>
      )}
      
      {/* 高级过滤器弹出框 */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Paper sx={{ p: 3, minWidth: 320, maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            高级过滤器
          </Typography>
          
          {/* 资源类型 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              资源类型
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {resourceTypeOptions.map(option => (
                <Chip
                  key={option.value}
                  label={option.label}
                  size="small"
                  clickable
                  color={filters.resourceTypes?.includes(option.value) ? 'primary' : 'default'}
                  onClick={() => handleResourceTypeSelect(option.value)}
                />
              ))}
            </Box>
          </Box>
          
          {/* 访问级别 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              访问级别
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={filters.accessLevels || []}
                onChange={(e) => handleFilterChange('accessLevels', e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      const option = accessLevelOptions.find(opt => opt.value === value);
                      return (
                        <Chip key={value} label={option?.label} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {accessLevelOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* 质量分数范围 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              质量分数: {filters.qualityRange?.[0]} - {filters.qualityRange?.[1]}
            </Typography>
            <Slider
              value={filters.qualityRange || [0, 100]}
              onChange={(_, value) => handleFilterChange('qualityRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
            />
          </Box>
          
          {/* 使用频率范围 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              使用频率: {filters.usageRange?.[0]} - {filters.usageRange?.[1]}
            </Typography>
            <Slider
              value={filters.usageRange || [0, 1000]}
              onChange={(_, value) => handleFilterChange('usageRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* 操作按钮 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
            >
              重置
            </Button>
            <Button
              variant="contained"
              onClick={() => setFilterAnchorEl(null)}
            >
              应用
            </Button>
          </Box>
        </Paper>
      </Popover>
    </Paper>
  );
};

export default CatalogFilterBar;