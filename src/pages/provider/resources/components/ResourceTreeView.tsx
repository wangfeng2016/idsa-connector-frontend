import { Box, Typography, Paper, Button } from '@mui/material';
import { AccountTree as AccountTreeIcon } from '@mui/icons-material';

// 导入DataResource类型，而不是在本地定义
import { type DataResource } from '../../../../contexts/ResourceContext';

// 删除本地的DataResource接口定义

interface ResourceTreeViewProps {
  resources: DataResource[];
  onViewDetails: (resource: DataResource) => void;
}

/**
 * 资源列表的树状视图组件
 * 注意：这是一个占位组件，实际的树状图实现需要使用专门的图形库
 */
const ResourceTreeView = ({
  resources: _resources,
  resources: _onViewDetails,
}: ResourceTreeViewProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      p: 3,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AccountTreeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        数据血缘关系图
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600, mb: 3 }}>
        此功能正在开发中，将展示数据资源之间的血缘关系和依赖关系。
        通过可视化的方式呈现数据流转路径，帮助您更好地理解数据资产之间的关联。
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          bgcolor: 'background.default', 
          border: '1px dashed', 
          borderColor: 'divider',
          borderRadius: 2,
          width: '100%',
          maxWidth: 800,
          mb: 3
        }}
      >
        <Typography variant="body2" color="text.secondary">
          在完整实现中，您将能够：
        </Typography>
        <ul>
          <li><Typography variant="body2">查看数据资源的上下游关系</Typography></li>
          <li><Typography variant="body2">追踪数据流转路径</Typography></li>
          <li><Typography variant="body2">分析数据依赖关系</Typography></li>
          <li><Typography variant="body2">评估数据变更影响范围</Typography></li>
        </ul>
      </Paper>
      <Button 
        variant="outlined" 
        onClick={() => console.log('查看示例血缘图')}
      >
        查看示例血缘图
      </Button>
    </Box>
  );
};

export default ResourceTreeView;