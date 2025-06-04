import { useState } from 'react';
import { type DataResource } from '../contexts/ResourceContext';

/**
 * 自定义Hook，用于处理资源操作，如收藏、删除等
 */
export const useResourceActions = (initialResources: DataResource[] = []) => {
  // 资源数据状态
  const [resources, setResources] = useState<DataResource[]>(initialResources);
  
  // 选择状态
  const [selectedResources, setSelectedResources] = useState<DataResource[]>([]);
  
  // 详情面板
  const [detailPanelResource, setDetailPanelResource] = useState<DataResource | null>(null);
  
  // 删除对话框
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourcesForDeletion, setResourcesForDeletion] = useState<number[]>([]);

  // 更新资源数据
  const updateResources = (newResources: DataResource[]) => {
    setResources(newResources);
  };

  // 切换收藏状态
  const toggleFavorite = (id: number) => {
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === id
          ? { ...resource, isFavorite: !resource.isFavorite }
          : resource
      )
    );
  };

  // 打开删除对话框
  const openDeleteDialog = (ids: number[]) => {
    setResourcesForDeletion(ids);
    setDeleteDialogOpen(true);
  };

  // 关闭删除对话框
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setResourcesForDeletion([]);
  };

  // 删除资源
  const deleteResources = (ids: number[]) => {
    setResources(prevResources =>
      prevResources.filter(resource => !ids.includes(resource.id))
    );
    // 如果删除的资源中包含当前选中的资源，清空选中状态
    setSelectedResources(prev => prev.filter(resource => !ids.includes(resource.id)));
    // 如果删除的资源中包含当前详情面板的资源，关闭详情面板
    if (detailPanelResource && ids.includes(detailPanelResource.id)) {
      setDetailPanelResource(null);
    }
    closeDeleteDialog();
  };

  // 确认删除
  const confirmDelete = () => {
    deleteResources(resourcesForDeletion);
  };

  // 查看资源详情
  const viewResourceDetails = (resource: DataResource) => {
    setDetailPanelResource(resource);
  };

  // 关闭详情面板
  const closeDetailPanel = () => {
    setDetailPanelResource(null);
  };

  // 批量操作
  const bulkDelete = () => {
    if (selectedResources.length > 0) {
      openDeleteDialog(selectedResources.map(r => r.id));
    }
  };

  // 导出资源
  const exportResources = (ids: number[]) => {
    // 实际应用中，这里会调用API进行导出
    console.log('Exporting resources:', ids);
    // 可以返回一个Promise或其他值表示导出状态
    return Promise.resolve({ success: true, message: '导出成功' });
  };

  return {
    resources,
    updateResources,
    selectedResources,
    setSelectedResources,
    detailPanelResource,
    setDetailPanelResource,
    deleteDialogOpen,
    resourcesForDeletion,
    toggleFavorite,
    openDeleteDialog,
    closeDeleteDialog,
    deleteResources,
    confirmDelete,
    viewResourceDetails,
    closeDetailPanel,
    bulkDelete,
    exportResources,
  };
};