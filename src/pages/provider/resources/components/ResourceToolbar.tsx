import { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Divider,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  AccountTree as AccountTreeIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ViewColumn as ViewColumnIcon,
} from '@mui/icons-material';

type ViewType = 'list' | 'card' | 'tree';

interface ResourceToolbarProps {
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onExport: () => void;
  columnVisibility: Record<string, boolean>;
  onToggleColumnVisibility: (column: string) => void;
}

/**
 * 资源列表页面的工具栏组件
 * 包含视图切换、批量操作和列可见性控制
 */
const ResourceToolbar = ({
  viewType,
  onViewTypeChange,
  selectedCount,
  onBulkDelete,
  onExport,
  columnVisibility,
  onToggleColumnVisibility,
}: ResourceToolbarProps) => {
  // 列可见性菜单状态
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);

  // 处理视图类型变更
  const handleViewTypeChange = (_: React.MouseEvent<HTMLElement>, newViewType: ViewType | null) => {
    if (newViewType) {
      onViewTypeChange(newViewType);
    }
  };

  // 打开列可见性菜单
  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  // 关闭列可见性菜单
  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  // 列配置选项
  const columnOptions = [
    { key: 'type', label: '数据类型' },
    { key: 'businessDomain', label: '业务域' },
    { key: 'qualityScore', label: '质量评分' },
    { key: 'usageFrequency', label: '使用频率' },
    { key: 'dataVolume', label: '数据量' },
    { key: 'owner', label: '所有者' },
    { key: 'accessLevel', label: '访问级别' },
    { key: 'status', label: '状态' },
    { key: 'tags', label: '标签' },
    { key: 'lastAccessTime', label: '最后访问' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            视图模式:
          </Typography>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewTypeChange}
            size="small"
          >
            <ToggleButton value="list" aria-label="列表视图">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="card" aria-label="卡片视图">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="tree" aria-label="树状视图">
              <AccountTreeIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          
          {selectedCount > 0 && (
            <>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" color="text.secondary">
                已选择 {selectedCount} 项
              </Typography>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={onExport}
              >
                导出
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={onBulkDelete}
              >
                删除
              </Button>
            </>
          )}
        </Stack>
        
        {viewType === 'list' && (
          <Button
            size="small"
            startIcon={<ViewColumnIcon />}
            onClick={handleColumnMenuOpen}
          >
            显示列
          </Button>
        )}
      </Stack>
      
      {/* 列可见性菜单 */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={handleColumnMenuClose}
      >
        {columnOptions.map((option) => (
          <MenuItem 
            key={option.key}
            onClick={() => onToggleColumnVisibility(option.key)}
            dense
          >
            <Checkbox 
              checked={columnVisibility[option.key] !== false} 
              size="small"
            />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default ResourceToolbar;