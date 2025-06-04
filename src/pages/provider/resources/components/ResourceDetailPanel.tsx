import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as CalendarTodayIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import useResponsive from '../../../../hooks/useResponsive';

// 导入DataResource类型，而不是在本地定义
import { type DataResource } from '../../../../contexts/ResourceContext';

// 删除本地的DataResource接口定义

interface ResourceDetailPanelProps {
  resource: DataResource;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

/**
 * 资源详情面板组件
 */
const ResourceDetailPanel = ({
  resource,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ResourceDetailPanelProps) => {
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

  // 获取访问级别对应的Chip组件
  const getAccessChip = (level: string) => {
    switch (level) {
      case 'public':
        return <Chip label="公开" color="success" size="small" />;
      case 'internal':
        return <Chip label="内部" color="warning" size="small" />;
      case 'confidential':
        return <Chip label="机密" color="error" size="small" />;
      default:
        return <Chip label={level} size="small" />;
    }
  };

  return (
    <Box sx={{ 
      flex: responsive.isDown('md') ? 1 : 0.3, 
      borderLeft: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* 详情面板头部 */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6">资源详情</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 详情内容 */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* 资源标题和收藏按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h2">
            {resource.name}
          </Typography>
          <IconButton
            onClick={onToggleFavorite}
            color={resource.isFavorite ? 'warning' : 'default'}
          >
            {resource.isFavorite ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>

        {/* 状态和类型 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {getStatusChip(resource.status)}
          <Chip label={resource.type} size="small" variant="outlined" />
          {/* 注意：format 属性在 ResourceContext 的 DataResource 中不存在 */}
          {/* <Chip label={resource.format} size="small" variant="outlined" /> */}
        </Box>

        {/* 描述 */}
        <Typography variant="body1" paragraph>
          {resource.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 详细信息列表 */}
        <List disablePadding>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <StorageIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="数据量" 
              secondary={resource.dataVolume.toLocaleString()} 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <TrendingUpIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="使用频率" 
              secondary={`${resource.usageFrequency}%`} 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DescriptionIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="质量评分" 
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={resource.qualityScore} readOnly precision={0.1} />
                  <Typography>({resource.qualityScore})</Typography>
                </Box>
              } 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PersonIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="所有者" 
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {resource.owner.charAt(0)}
                  </Avatar>
                  <Typography>{resource.owner}</Typography>
                </Box>
              } 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SecurityIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="访问级别" 
              secondary={getAccessChip(resource.accessLevel)} 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CalendarTodayIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="创建时间" 
              secondary="不可用" 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CalendarTodayIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="更新时间" 
              secondary="不可用" 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
          
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ScheduleIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="最后访问" 
              secondary={resource.lastAccessed} 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* 标签 */}
        <Typography variant="subtitle2" gutterBottom>
          标签
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {resource.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" />
          ))}
        </Box>

        {/* 数据血缘 */}
        <Typography variant="subtitle2" gutterBottom>
          数据血缘
        </Typography>
        <Box sx={{ mb: 3 }}>
          {/* 注意：dataLineage 属性在 ResourceContext 的 DataResource 中不存在 */}
          <Typography variant="body2" color="text.secondary">
            无数据血缘信息
          </Typography>
        </Box>
      </Box>

      {/* 操作按钮 */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          编辑
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          删除
        </Button>
      </Box>
    </Box>
  );
};

export default ResourceDetailPanel;