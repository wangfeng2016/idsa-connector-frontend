import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tooltip
} from '@mui/material';
import { SimpleTreeView as TreeView, TreeItem } from '@mui/x-tree-view';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { CategoryNode, DimensionType } from '../../../../../contexts/DataCatalogContext';

interface CategoryManagementDialogProps {
  open: boolean;
  onClose: () => void;
  dimensionId: string | null;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId?: string;
  icon?: string;
  color?: string;
}

/**
 * 分类管理对话框组件
 * 用于管理数据目录的分类维度和类别层次结构
 */
const CategoryManagementDialog: React.FC<CategoryManagementDialogProps> = ({
  open,
  onClose,
  dimensionId
}) => {
  const {
    dimensions,
    getCategoriesByDimension,
    addCategory,
    updateCategory,
    deleteCategory,
    getResourceCountByCategory
  } = useDataCatalog();

  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: undefined,
    icon: '',
    color: '#1976d2'
  });
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryNode | null>(null);

  // 获取当前维度信息
  const currentDimension = dimensions.find(d => d.id === dimensionId);
  const categories = dimensionId ? getCategoriesByDimension(dimensionId as DimensionType) : [];

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: undefined,
      icon: '',
      color: '#1976d2'
    });
    setEditingCategory(null);
    setIsCreating(false);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!dimensionId || !formData.name.trim()) return;

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        parentId: formData.parentId || undefined,
        icon: formData.icon,
        color: formData.color,
        path: '', // 将由后端计算
        level: 0  // 将由后端计算
      };

      if (editingCategory) {
        await updateCategory(dimensionId as DimensionType, editingCategory.id, categoryData);
      } else {
        await addCategory(dimensionId as DimensionType, categoryData);
      }

      resetForm();
    } catch (error) {
      console.error('保存分类失败:', error);
    }
  };

  // 处理编辑
  const handleEdit = (category: CategoryNode) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId,
      icon: category.icon || '',
      color: category.color || '#1976d2'
    });
    setIsCreating(false);
  };

  // 处理删除确认
  const handleDeleteConfirm = (category: CategoryNode) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  // 执行删除
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(dimensionId as DimensionType, categoryToDelete.id);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('删除分类失败:', error);
    }
  };

  // 处理节点展开/收起
  const handleNodeToggle = (_event: React.SyntheticEvent, itemIds: string[]) => {
    setExpandedNodes(itemIds);
  };

  // 获取可选父分类（排除自身和子分类）
  const getAvailableParents = (excludeId?: string): CategoryNode[] => {
    const filterCategories = (cats: CategoryNode[]): CategoryNode[] => {
      return cats.filter(cat => {
        if (excludeId && (cat.id === excludeId || isDescendant(cat, excludeId))) {
          return false;
        }
        return true;
      }).map(cat => ({
        ...cat,
        children: filterCategories(cat.children)
      }));
    };

    return filterCategories(categories);
  };

  // 检查是否为子分类
  const isDescendant = (category: CategoryNode, ancestorId: string): boolean => {
    if (category.parentId === ancestorId) return true;
    const parent = categories.find(c => c.id === category.parentId);
    return parent ? isDescendant(parent, ancestorId) : false;
  };

  // 渲染分类树节点
  const renderTreeNode = (category: CategoryNode) => {
    const resourceCount = getResourceCountByCategory(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <TreeItem
        key={category.id}
        itemId={category.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {category.icon ? (
                <Box sx={{ mr: 1, color: category.color }}>
                  {category.icon}
                </Box>
              ) : (
                <CategoryIcon sx={{ mr: 1, color: category.color }} />
              )}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {category.name}
              </Typography>
              <Chip
                label={resourceCount}
                size="small"
                variant="outlined"
                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="编辑">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(category);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfirm(category);
                  }}
                  disabled={resourceCount > 0 || hasChildren}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
        sx={{
          '& .MuiTreeItem-content': {
            padding: '4px 8px',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }
        }}
      >
        {category.children?.map(child => renderTreeNode(child))}
      </TreeItem>
    );
  };

  // 渲染父分类选择器
  const renderParentSelector = () => {
    const availableParents = getAvailableParents(editingCategory?.id);
    
    const flattenCategories = (cats: CategoryNode[], level = 0): Array<CategoryNode & { level: number }> => {
      return cats.reduce((acc, cat) => {
        acc.push({ ...cat, level });
        if (cat.children) {
          acc.push(...flattenCategories(cat.children, level + 1));
        }
        return acc;
      }, [] as Array<CategoryNode & { level: number }>);
    };

    const flatParents = flattenCategories(availableParents);

    return (
      <FormControl fullWidth margin="normal">
        <InputLabel>父分类</InputLabel>
        <Select
          value={formData.parentId || ''}
          label="父分类"
          onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
        >
          <MenuItem value="">
            <em>无（顶级分类）</em>
          </MenuItem>
          {flatParents.map((parent) => (
            <MenuItem key={parent.id} value={parent.id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: parent.level * 20 }} />
                {parent.icon && (
                  <Box sx={{ mr: 1, color: parent.color }}>
                    {parent.icon}
                  </Box>
                )}
                <Typography>{parent.name}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              管理分类 - {currentDimension?.name}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={() => {
                resetForm();
                setIsCreating(true);
              }}
            >
              新建分类
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
            {/* 左侧：分类树 */}
            <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                分类结构
              </Typography>
              {categories.length > 0 ? (
                <TreeView
                  slots={{
                    collapseIcon: ExpandMoreIcon,
                    expandIcon: ChevronRightIcon
                  }}
                  expandedItems={expandedNodes}
                  onExpandedItemsChange={handleNodeToggle}
                  sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                  {categories.map(category => renderTreeNode(category))}
                </TreeView>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <CategoryIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>暂无分类</Typography>
                  <Typography variant="body2">点击右上角按钮创建新分类</Typography>
                </Box>
              )}
            </Paper>

            {/* 右侧：表单 */}
            {(isCreating || editingCategory) && (
              <Paper sx={{ width: 400, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {editingCategory ? '编辑分类' : '新建分类'}
                </Typography>
                
                <TextField
                  fullWidth
                  label="分类名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={3}
                />
                
                {renderParentSelector()}
                
                <TextField
                  fullWidth
                  label="颜色"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  margin="normal"
                />
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={!formData.name.trim()}
                    fullWidth
                  >
                    保存
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={resetForm}
                    fullWidth
                  >
                    取消
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            确认删除
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除分类 "{categoryToDelete?.name}" 吗？
          </Typography>
          {categoryToDelete && getResourceCountByCategory(categoryToDelete.id) > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              该分类下还有 {getResourceCountByCategory(categoryToDelete.id)} 个资源，无法删除。
            </Alert>
          )}
          {categoryToDelete && categoryToDelete.children.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              该分类下还有子分类，无法删除。
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>取消</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={
              !categoryToDelete ||
              getResourceCountByCategory(categoryToDelete.id) > 0 ||
              categoryToDelete.children.length > 0
            }
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryManagementDialog;