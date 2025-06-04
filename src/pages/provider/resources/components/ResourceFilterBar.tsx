import { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Slider,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// 从ResourceContext导入FilterState类型
import { type FilterState } from '../../../../contexts/ResourceContext';

// 删除本地的FilterState接口定义，使用导入的类型

interface FilterOptions {
  domains: string[];
  dataTypes: string[];
  accessLevels: string[];
  owners: string[];
  tags: string[];
}

interface ResourceFilterBarProps {
  filterState: FilterState;
  filterOptions: FilterOptions;
  onFilterChange: (field: keyof FilterState, value: any) => void;
  onResetFilters: () => void;
}

/**
 * 资源列表页面的过滤栏组件
 * 包含搜索框、快速过滤和高级过滤
 */
const ResourceFilterBar = ({
  filterState,
  filterOptions,
  onFilterChange,
  onResetFilters,
}: ResourceFilterBarProps) => {
  // 高级过滤器展开状态
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('searchTerm', e.target.value);
  };

  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    const newTags = filterState.tags.includes(tag)
      ? filterState.tags.filter(t => t !== tag)
      : [...filterState.tags, tag];
    onFilterChange('tags', newTags);
  };

  // 处理质量评分滑块变化
  const handleQualityScoreChange = (_: Event, newValue: number | number[]) => {
    onFilterChange('qualityScore', newValue as number);
  };

  // 处理使用频率滑块变化
  const handleUsageFrequencyChange = (_: Event, newValue: number | number[]) => {
    onFilterChange('usageFrequency', newValue as number);
  };

  // 判断是否有任何过滤器被应用
  const hasActiveFilters = (): boolean => {
    return (
      filterState.searchTerm !== '' ||
      filterState.status !== 'all' ||
      filterState.domain !== 'all' ||
      filterState.dataType !== 'all' ||
      filterState.accessLevel !== 'all' ||
      filterState.owner !== 'all' ||
      filterState.qualityScore !== null ||
      filterState.usageFrequency !== null ||
      filterState.tags.length > 0 ||
      filterState.onlyFavorites
    );
  };

  return (
    <Box>
      {/* 基本过滤器 */}
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="搜索数据资源..."
            value={filterState.searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 300, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>状态</InputLabel>
            <Select
              value={filterState.status}
              label="状态"
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="active">活跃</MenuItem>
              <MenuItem value="inactive">非活跃</MenuItem>
              <MenuItem value="pending">待处理</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>业务域</InputLabel>
            <Select
              value={filterState.domain}
              label="业务域"
              onChange={(e) => onFilterChange('domain', e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              {filterOptions.domains.map((domain) => (
                <MenuItem key={domain} value={domain}>{domain}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={filterState.onlyFavorites}
                onChange={(e) => onFilterChange('onlyFavorites', e.target.checked)}
                size="small"
              />
            }
            label="仅收藏"
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            size="small"
          >
            高级筛选
          </Button>

          {hasActiveFilters() && (
            <Button
              variant="text"
              onClick={onResetFilters}
              size="small"
              startIcon={<CloseIcon fontSize="small" />}
            >
              重置
            </Button>
          )}
        </Stack>
      </Paper>

      {/* 高级过滤器 */}
      {showAdvancedFilters && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">高级筛选选项</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 200, flex: '1 1 200px' }}>
                    <InputLabel>数据类型</InputLabel>
                    <Select
                      value={filterState.dataType}
                      label="数据类型"
                      onChange={(e) => onFilterChange('dataType', e.target.value)}
                    >
                      <MenuItem value="all">全部</MenuItem>
                      {filterOptions.dataTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 200, flex: '1 1 200px' }}>
                    <InputLabel>访问级别</InputLabel>
                    <Select
                      value={filterState.accessLevel}
                      label="访问级别"
                      onChange={(e) => onFilterChange('accessLevel', e.target.value)}
                    >
                      <MenuItem value="all">全部</MenuItem>
                      {filterOptions.accessLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level === 'public' ? '公开' : 
                           level === 'internal' ? '内部' : 
                           level === 'confidential' ? '机密' : level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 200, flex: '1 1 200px' }}>
                    <InputLabel>所有者</InputLabel>
                    <Select
                      value={filterState.owner}
                      label="所有者"
                      onChange={(e) => onFilterChange('owner', e.target.value)}
                    >
                      <MenuItem value="all">全部</MenuItem>
                      {filterOptions.owners.map((owner) => (
                        <MenuItem key={owner} value={owner}>{owner}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    质量评分: {filterState.qualityScore !== null ? filterState.qualityScore : 0}
                  </Typography>
                  <Slider
                    value={filterState.qualityScore !== null ? filterState.qualityScore : 0}
                    onChange={handleQualityScoreChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </Box>

                <Box sx={{ px: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    使用频率: {filterState.usageFrequency !== null ? filterState.usageFrequency : 0}%
                  </Typography>
                  <Slider
                    value={filterState.usageFrequency !== null ? filterState.usageFrequency : 0}
                    onChange={handleUsageFrequencyChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    step={1}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    标签
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {filterOptions.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        clickable
                        color={filterState.tags.includes(tag) ? 'primary' : 'default'}
                        onClick={() => handleTagSelect(tag)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      )}
    </Box>
  );
};

export default ResourceFilterBar;