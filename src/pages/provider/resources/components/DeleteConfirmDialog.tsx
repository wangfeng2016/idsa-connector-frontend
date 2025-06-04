import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
} from '@mui/icons-material';

// 导入DataResource类型
import { type DataResource } from '../../../../contexts/ResourceContext';

interface DeleteConfirmDialogProps {
  open: boolean;
  resources: DataResource[];
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * 删除确认对话框组件
 */
const DeleteConfirmDialog = ({
  open,
  resources,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmDialogProps) => {
  const isSingleResource = resources.length === 1;
  const hasActiveResources = resources.some(resource => resource.status === 'active');
  const hasHighUsageResources = resources.some(resource => resource.usageFrequency > 50);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <WarningIcon color="warning" />
        <Typography variant="h6">
          {isSingleResource ? '确认删除资源' : `确认删除 ${resources.length} 个资源`}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* 警告信息 */}
        {(hasActiveResources || hasHighUsageResources) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {hasActiveResources && (
              <Typography variant="body2" gutterBottom>
                • 包含活跃状态的资源，删除后可能影响正在运行的业务流程
              </Typography>
            )}
            {hasHighUsageResources && (
              <Typography variant="body2">
                • 包含高使用频率的资源，删除后可能影响其他系统的数据依赖
              </Typography>
            )}
          </Alert>
        )}

        {/* 删除提示 */}
        <Typography variant="body1" gutterBottom>
          {isSingleResource 
            ? '您确定要删除以下资源吗？此操作不可撤销。'
            : `您确定要删除以下 ${resources.length} 个资源吗？此操作不可撤销。`
          }
        </Typography>

        {/* 资源列表 */}
        <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
          <List dense>
            {resources.map((resource) => (
              <ListItem key={resource.id} sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {resource.name}
                      </Typography>
                      <Chip 
                        label={resource.type} 
                        size="small" 
                        variant="outlined" 
                      />
                      {resource.status === 'active' && (
                        <Chip 
                          label="活跃" 
                          size="small" 
                          color="success" 
                        />
                      )}
                      {resource.usageFrequency > 50 && (
                        <Chip 
                          label="高频使用" 
                          size="small" 
                          color="warning" 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {resource.domain} • 使用频率: {resource.usageFrequency}%
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* 额外提醒 */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            删除资源后，相关的数据血缘关系、访问权限和使用统计信息也将被清除。
            如果您只是想暂停使用，建议将资源状态设置为"非活跃"。
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          取消
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 80 }}
        >
          {loading ? '删除中...' : '确认删除'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;