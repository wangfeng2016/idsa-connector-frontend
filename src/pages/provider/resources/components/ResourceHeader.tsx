import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ResourceStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

interface ResourceHeaderProps {
  stats: ResourceStats;
  onAddResource: () => void;
}

/**
 * 资源列表页面的头部组件
 * 显示页面标题、资源统计信息和添加资源按钮
 */
const ResourceHeader = ({ stats, onAddResource }: ResourceHeaderProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2
    }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          数据资产管理中心
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            共 {stats.total} 个数据资源
          </Typography>
          <Typography variant="body2" color="success.main">
            活跃: {stats.active}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            非活跃: {stats.inactive}
          </Typography>
          <Typography variant="body2" color="warning.main">
            待处理: {stats.pending}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddResource}
      >
        添加资源
      </Button>
    </Box>
  );
};

export default ResourceHeader;