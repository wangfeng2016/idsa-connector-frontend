import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Grid,
  Divider,
  Tooltip,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Collapse,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Label as LabelIcon,
  ColorLens as ColorIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { Tag, CatalogDataResource } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';

interface CatalogTagManagerProps {
  onTagSelect?: (tag: Tag) => void;
  selectedResources?: CatalogDataResource[];
}

interface TagFormData {
  name: string;
  description: string;
  color: string;
  category: string;
}

/**
 * 数据目录标签管理组件
 * 提供标签的创建、编辑、删除和分配功能
 */
const CatalogTagManager: React.FC<CatalogTagManagerProps> = ({ 
  onTagSelect,
  selectedResources = []
}) => {
  const responsive = useResponsive();
  const {
    tags,
    updateTag,
    deleteTag,
    addTag: createTag,
    addTagToResource: assignTagToResource,
    removeTagFromResource: removeTagFromResource,
    getResourcesByTag,
    getFilteredResources
  } = useDataCatalog();

  // 本地状态
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    description: '',
    color: '#2196f3',
    category: 'general'
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['general']));
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTagsForAssign, setSelectedTagsForAssign] = useState<Tag[]>([]);

  // 预定义颜色
  const predefinedColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#795548', '#9e9e9e', '#607d8b'
  ];

  // 标签分类
  const tagCategories = {
    general: '通用',
    domain: '领域',
    quality: '质量',
    security: '安全',
    business: '业务',
    technical: '技术',
    custom: '自定义'
  };

  // 过滤标签
  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (tag.description ? tag.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tags, searchTerm, selectedCategory]);

  // 按分类分组标签
  const groupedTags = useMemo(() => {
    const groups: { [key: string]: Tag[] } = {};
    
    filteredTags.forEach(tag => {
      const category = tag.category || 'general';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tag);
    });
    
    return groups;
  }, [filteredTags]);

  // 获取标签使用统计
  const getTagUsageCount = (tag: Tag) => {
    return getResourcesByTag([tag.id]).length;
  };

  // 打开创建/编辑对话框
  const openDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        description: tag.description,
        color: tag.color,
        category: tag.category || 'general'
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        description: '',
        color: '#2196f3',
        category: 'general'
      });
    }
    setDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
  };

  // 保存标签
  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingTag) {
        await updateTag(editingTag.id, formData);
      } else {
        await createTag({
          id: `tag-${Date.now()}`,
          ...formData
        });
      }
      closeDialog();
    } catch (error) {
      console.error('保存标签失败:', error);
    }
  };

  // 删除标签
  const handleDelete = async (tag: Tag) => {
    if (window.confirm(`确定要删除标签 "${tag.name}" 吗？`)) {
      try {
        await deleteTag(tag.id);
        handleMenuClose();
      } catch (error) {
        console.error('删除标签失败:', error);
      }
    }
  };

  // 处理标签菜单
  const handleTagMenu = (event: React.MouseEvent, tag: Tag) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
    setSelectedTag(tag);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTag(null);
  };

  // 切换分类展开状态
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // 打开标签分配对话框
  const openAssignDialog = () => {
    if (selectedResources.length === 0) return;
    setSelectedTagsForAssign([]);
    setAssignDialogOpen(true);
  };

  // 分配标签到资源
  const handleAssignTags = async () => {
    if (selectedTagsForAssign.length === 0 || selectedResources.length === 0) return;

    try {
      for (const resource of selectedResources) {
        for (const tag of selectedTagsForAssign) {
          await addTagToResource(resource.id, tag.id);
        }
      }
      setAssignDialogOpen(false);
      setSelectedTagsForAssign([]);
    } catch (error) {
      console.error('分配标签失败:', error);
    }
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
            {/* 搜索框 */}
            <TextField
              size="small"
              placeholder="搜索标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 200 }}
            />
            
            {/* 分类过滤 */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>分类</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="分类"
              >
                <MenuItem value="all">全部</MenuItem>
                {Object.entries(tagCategories).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* 统计信息 */}
            <Typography variant="body2" color="text.secondary">
              共 {filteredTags.length} 个标签
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 批量分配按钮 */}
            {selectedResources.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<LabelIcon />}
                onClick={openAssignDialog}
                size="small"
              >
                分配标签 ({selectedResources.length})
              </Button>
            )}
            
            {/* 创建标签按钮 */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openDialog()}
              size="small"
            >
              创建标签
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* 标签列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {Object.keys(groupedTags).length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <LabelIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              暂无标签
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              创建第一个标签来开始组织您的数据资源
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openDialog()}
            >
              创建标签
            </Button>
          </Paper>
        ) : (
          Object.entries(groupedTags).map(([category, categoryTags]) => (
            <Paper key={category} sx={{ mb: 2 }}>
              {/* 分类标题 */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onClick={() => toggleCategory(category)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {tagCategories[category as keyof typeof tagCategories] || category}
                  </Typography>
                  <Badge badgeContent={categoryTags.length} color="primary" />
                </Box>
                {expandedCategories.has(category) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              
              {/* 标签列表 */}
              <Collapse in={expandedCategories.has(category)}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    justifyContent: 'flex-start'
                  }}>
                    {categoryTags.map((tag) => {
                      const usageCount = getTagUsageCount(tag);
                      
                      return (
                        <Box key={tag.id} sx={{ 
                          flex: '1 1 280px',
                          minWidth: '280px',
                          maxWidth: '320px'
                        }}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: 2,
                                transform: 'translateY(-2px)'
                              }
                            }}
                            onClick={() => onTagSelect?.(tag)}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                mb: 1
                              }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: tag.color
                                      }}
                                    />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {tag.name}
                                    </Typography>
                                  </Box>
                                  
                                  {tag.description && (
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary"
                                      sx={{ 
                                        fontSize: '0.8rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}
                                    >
                                      {tag.description}
                                    </Typography>
                                  )}
                                </Box>
                                
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleTagMenu(e, tag)}
                                >
                                  <MoreVertIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                              
                              {/* 使用统计 */}
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1,
                                pt: 1,
                                borderTop: 1,
                                borderColor: 'divider'
                              }}>
                                <Chip
                                  label={`${usageCount} 个资源`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                                
                                <Chip
                                  label={tag.color}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    bgcolor: tag.color,
                                    color: 'white'
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          ))
        )}
      </Box>
      
      {/* 创建/编辑标签对话框 */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTag ? '编辑标签' : '创建标签'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* 标签名称 */}
            <TextField
              fullWidth
              label="标签名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            
            {/* 描述 */}
            <TextField
              fullWidth
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            
            {/* 分类 */}
            <FormControl fullWidth margin="normal">
              <InputLabel>分类</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="分类"
              >
                {Object.entries(tagCategories).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* 颜色选择 */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                颜色
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {predefinedColors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid #000' : '2px solid transparent',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </Box>
              
              {/* 自定义颜色 */}
              <TextField
                label="自定义颜色"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                sx={{ mt: 2, width: 120 }}
                InputProps={{
                  startAdornment: <PaletteIcon sx={{ mr: 1 }} />
                }}
              />
            </Box>
            
            {/* 预览 */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                预览
              </Typography>
              <Chip
                label={formData.name || '标签名称'}
                sx={{
                  bgcolor: formData.color,
                  color: 'white'
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} startIcon={<CancelIcon />}>
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.name.trim()}
          >
            {editingTag ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 标签分配对话框 */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          为 {selectedResources.length} 个资源分配标签
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.name}
              value={selectedTagsForAssign}
              onChange={(_, newValue) => setSelectedTagsForAssign(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="选择标签"
                  placeholder="搜索并选择标签"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    sx={{
                      bgcolor: option.color,
                      color: 'white'
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: option.color
                      }}
                    />
                    <Typography>{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({getTagUsageCount(option)} 个资源)
                    </Typography>
                  </Box>
                </Box>
              )}
            />
            
            {selectedResources.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  选中的资源:
                </Typography>
                <List dense>
                  {selectedResources.slice(0, 5).map((resource) => (
                    <ListItem key={resource.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {resource.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={resource.name}
                        secondary={resource.type}
                      />
                    </ListItem>
                  ))}
                  {selectedResources.length > 5 && (
                    <ListItem>
                      <ListItemText
                        primary={`还有 ${selectedResources.length - 5} 个资源...`}
                        sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>
            取消
          </Button>
          <Button 
            onClick={handleAssignTags}
            variant="contained"
            disabled={selectedTagsForAssign.length === 0}
          >
            分配标签
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 标签操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedTag) openDialog(selectedTag);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>编辑</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedTag) onTagSelect?.(selectedTag);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>查看使用情况</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            if (selectedTag) handleDelete(selectedTag);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>删除</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CatalogTagManager;