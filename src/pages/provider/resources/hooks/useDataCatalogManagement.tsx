import { useState, useCallback} from 'react';
import { useDataCatalog } from '../../../../contexts/DataCatalogContext';
import type {
  CatalogViewType,
  CatalogFilterState,
  CategoryNode
} from '../../../../contexts/DataCatalogContext';

interface UseDataCatalogManagementOptions {
  defaultView?: CatalogViewType;
  autoSave?: boolean;
  enableHistory?: boolean;
}

interface ViewState {
  currentView: CatalogViewType;
  previousView?: CatalogViewType;
  viewHistory: CatalogViewType[];
}

interface SelectionState {
  selectedResources: string[];
  selectedCategories: string[];
  selectedTags: string[];
  selectedDimensions: string[];
}

interface OperationState {
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;
  isImporting: boolean;
  lastOperation?: string;
  operationProgress?: number;
}

interface BulkOperations {
  assignCategories: (resourceIds: string[], categoryIds: string[]) => Promise<void>;
  assignTags: (resourceIds: string[], tagIds: string[]) => Promise<void>;
  updateQuality: (resourceIds: string[], qualityScore: number) => Promise<void>;
  updateStatus: (resourceIds: string[], status: string) => Promise<void>;
  deleteResources: (resourceIds: string[]) => Promise<void>;
  exportResources: (resourceIds: string[], format: 'json' | 'csv' | 'excel') => Promise<void>;
}

interface SearchAndFilter {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  advancedFilters: CatalogFilterState;
  setAdvancedFilters: (filters: CatalogFilterState) => void;
  resetFilters: () => void;
  saveFilterPreset: (name: string, filters: CatalogFilterState) => void;
  loadFilterPreset: (name: string) => void;
  getFilterPresets: () => Array<{ name: string; filters: CatalogFilterState }>;
}

interface DataManagement {
  refreshData: () => Promise<void>;
  importData: (file: File, format: 'json' | 'csv' | 'excel') => Promise<void>;
  exportData: (format: 'json' | 'csv' | 'excel') => Promise<void>;
  backupData: () => Promise<void>;
  restoreData: (backupFile: File) => Promise<void>;
}

interface UseDataCatalogManagementReturn {
  // 视图管理
  viewState: ViewState;
  setCurrentView: (view: CatalogViewType) => void;
  goToPreviousView: () => void;
  
  // 选择管理
  selectionState: SelectionState;
  selectResource: (resourceId: string, multi?: boolean) => void;
  selectCategory: (categoryId: string, multi?: boolean) => void;
  selectTag: (tagId: string, multi?: boolean) => void;
  selectDimension: (dimensionId: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // 操作状态
  operationState: OperationState;
  
  // 批量操作
  bulkOperations: BulkOperations;
  
  // 搜索和过滤
  searchAndFilter: SearchAndFilter;
  
  // 数据管理
  dataManagement: DataManagement;
  
  // 统计信息
  getSelectionStats: () => {
    resourceCount: number;
    categoryCount: number;
    tagCount: number;
    dimensionCount: number;
  };
  
  // 验证
  validateSelection: () => {
    isValid: boolean;
    errors: string[];
  };
}

/**
 * 数据目录管理的自定义Hook
 * 提供完整的数据目录管理功能
 */
export const useDataCatalogManagement = (
  options: UseDataCatalogManagementOptions = {}
): UseDataCatalogManagementReturn => {
  const {
    defaultView = 'hierarchy',
    autoSave = true,
    enableHistory = true
  } = options;

  const {
    catalogResources: resources,
    dimensions,
    tags,
    filterState,
    updateFilterState: setFilterState,
     searchResources: getFilteredResources,
    // updateDimension,
    // addCategory,
    // updateCategory,
    // deleteCategory,
    // moveCategory,
    // addTag,
    // updateTag,
    // deleteTag,
    assignResourceToCategory,
    // removeResourceFromCategory,
    addTagToResource,
    // removeTagFromResource,
    // updateResourceRelation,
    // addResourceRelation: addRelation,
    // deleteResourceRelation: removeRelation
  } = useDataCatalog();

  // 视图状态
  const [viewState, setViewState] = useState<ViewState>({
    currentView: defaultView,
    viewHistory: [defaultView]
  });

  // 选择状态
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedResources: [],
    selectedCategories: [],
    selectedTags: [],
    selectedDimensions: []
  });

  // 操作状态
  const [operationState, setOperationState] = useState<OperationState>({
    isLoading: false,
    isSaving: false,
    isExporting: false,
    isImporting: false
  });

  // 搜索查询
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤器预设
  const [filterPresets, setFilterPresets] = useState<Array<{ name: string; filters: CatalogFilterState }>>([]);

  // 设置当前视图
  const setCurrentView = useCallback((view: CatalogViewType) => {
    setViewState(prev => ({
      currentView: view,
      previousView: prev.currentView,
      viewHistory: enableHistory 
        ? [...prev.viewHistory.slice(-9), view] // 保留最近10个视图
        : [view]
    }));
  }, [enableHistory]);

  // 返回上一个视图
  const goToPreviousView = useCallback(() => {
    if (viewState.previousView) {
      setCurrentView(viewState.previousView);
    }
  }, [viewState.previousView, setCurrentView]);

  // 选择资源
  const selectResource = useCallback((resourceId: string, multi = false) => {
    setSelectionState(prev => {
      if (multi) {
        const isSelected = prev.selectedResources.includes(resourceId);
        return {
          ...prev,
          selectedResources: isSelected
            ? prev.selectedResources.filter(id => id !== resourceId)
            : [...prev.selectedResources, resourceId]
        };
      } else {
        return {
          ...prev,
          selectedResources: [resourceId]
        };
      }
    });
  }, []);

  // 选择分类
  const selectCategory = useCallback((categoryId: string, multi = false) => {
    setSelectionState(prev => {
      if (multi) {
        const isSelected = prev.selectedCategories.includes(categoryId);
        return {
          ...prev,
          selectedCategories: isSelected
            ? prev.selectedCategories.filter(id => id !== categoryId)
            : [...prev.selectedCategories, categoryId]
        };
      } else {
        return {
          ...prev,
          selectedCategories: [categoryId]
        };
      }
    });
  }, []);

  // 选择标签
  const selectTag = useCallback((tagId: string, multi = false) => {
    setSelectionState(prev => {
      if (multi) {
        const isSelected = prev.selectedTags.includes(tagId);
        return {
          ...prev,
          selectedTags: isSelected
            ? prev.selectedTags.filter(id => id !== tagId)
            : [...prev.selectedTags, tagId]
        };
      } else {
        return {
          ...prev,
          selectedTags: [tagId]
        };
      }
    });
  }, []);

  // 选择维度
  const selectDimension = useCallback((dimensionId: string, multi = false) => {
    setSelectionState(prev => {
      if (multi) {
        const isSelected = prev.selectedDimensions.includes(dimensionId);
        return {
          ...prev,
          selectedDimensions: isSelected
            ? prev.selectedDimensions.filter(id => id !== dimensionId)
            : [...prev.selectedDimensions, dimensionId]
        };
      } else {
        return {
          ...prev,
          selectedDimensions: [dimensionId]
        };
      }
    });
  }, []);

  // 清除选择
  const clearSelection = useCallback(() => {
    setSelectionState({
      selectedResources: [],
      selectedCategories: [],
      selectedTags: [],
      selectedDimensions: []
    });
  }, []);

  // 全选
  const selectAll = useCallback(() => {
    const filteredResources = getFilteredResources('');
    setSelectionState(prev => ({
      ...prev,
      selectedResources: filteredResources.map(r => r.id.toString())
    }));
  }, [getFilteredResources]);

  // 批量分配分类
  const assignCategories = useCallback(async (resourceIds: string[], categoryIds: string[]) => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'assignCategories' }));
    
    try {
      for (const resourceId of resourceIds) {
        for (const categoryId of categoryIds) {
          await assignResourceToCategory(parseInt(resourceId), 'business', categoryId);
        }
      }
      
      if (autoSave) {
        // 这里可以添加自动保存逻辑
        console.log('Auto-saving category assignments...');
      }
    } catch (error) {
      console.error('Failed to assign categories:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, [assignResourceToCategory, autoSave]);

  // 批量分配标签
  const assignTags = useCallback(async (resourceIds: string[], tagIds: string[]) => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'assignTags' }));
    
    try {
      for (const resourceId of resourceIds) {
        for (const tagId of tagIds) {
          await addTagToResource(parseInt(resourceId), tagId);
        }
      }
      
      if (autoSave) {
        console.log('Auto-saving tag assignments...');
      }
    } catch (error) {
      console.error('Failed to assign tags:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, [addTagToResource, autoSave]);

  // 批量更新质量分数
  const updateQuality = useCallback(async (resourceIds: string[], qualityScore: number) => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'updateQuality' }));
    
    try {
      for (const resourceId of resourceIds) {
        const resource = resources.find(r => r.id === parseInt(resourceId));
        if (resource) {
          // 模拟更新质量分数
          console.log(`Updating quality score for resource ${resourceId} to ${qualityScore}`);
        }
      }
    } catch (error) {
      console.error('Failed to update quality scores:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, [resources]);

  // 批量更新状态
  const updateStatus = useCallback(async (resourceIds: string[], status: string) => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'updateStatus' }));
    
    try {
      for (const resourceId of resourceIds) {
        const resource = resources.find(r => r.id === parseInt(resourceId));
        if (resource) {
          // 模拟更新状态
          console.log(`Updating status for resource ${resourceId} to ${status}`);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, [resources]);

  // 批量删除资源
  const deleteResources = useCallback(async (resourceIds: string[]) => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'deleteResources' }));
    
    try {
      // 这里应该调用实际的删除API
      console.log('Deleting resources:', resourceIds);
      
      // 清除选择中被删除的资源
      setSelectionState(prev => ({
        ...prev,
        selectedResources: prev.selectedResources.filter(id => !resourceIds.includes(id))
      }));
    } catch (error) {
      console.error('Failed to delete resources:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, []);

  // 批量导出资源
  const exportResources = useCallback(async (resourceIds: string[], format: 'json' | 'csv' | 'excel') => {
    setOperationState(prev => ({ ...prev, isExporting: true, lastOperation: 'exportResources' }));
    
    try {
      const resourcesToExport = resources.filter(r => resourceIds.includes(r.id.toString()));
      
      // 这里应该实现实际的导出逻辑
      console.log(`Exporting ${resourcesToExport.length} resources in ${format} format`);
      
      // 模拟导出过程
      for (let i = 0; i <= 100; i += 10) {
        setOperationState(prev => ({ ...prev, operationProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Failed to export resources:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isExporting: false, operationProgress: undefined }));
    }
  }, [resources]);

  // 批量操作对象
  const bulkOperations: BulkOperations = {
    assignCategories,
    assignTags,
    updateQuality,
    updateStatus,
    deleteResources,
    exportResources
  };

  // 重置过滤器
  const resetFilters = useCallback(() => {
    setFilterState({
      selectedDimensions: [],
      selectedCategories: {},
      selectedTags: [],
      searchTerm: '',
      showRelations: false,
      relationTypes: [],
      qualityThreshold: 0,
      timeRange: {}
    });
    setSearchQuery('');
  }, [setFilterState]);

  // 保存过滤器预设
  const saveFilterPreset = useCallback((name: string, filters: CatalogFilterState) => {
    setFilterPresets(prev => {
      const existing = prev.find(p => p.name === name);
      if (existing) {
        return prev.map(p => p.name === name ? { name, filters } : p);
      } else {
        return [...prev, { name, filters }];
      }
    });
  }, []);

  // 加载过滤器预设
  const loadFilterPreset = useCallback((name: string) => {
    const preset = filterPresets.find(p => p.name === name);
    if (preset) {
      setFilterState(preset.filters);
      setSearchQuery(preset.filters.searchTerm || '');
    }
  }, [filterPresets, setFilterState]);

  // 获取过滤器预设
  const getFilterPresets = useCallback(() => {
    return filterPresets;
  }, [filterPresets]);

  // 搜索和过滤对象
  const searchAndFilter: SearchAndFilter = {
    searchQuery,
    setSearchQuery,
    advancedFilters: filterState,
    setAdvancedFilters: setFilterState,
    resetFilters,
    saveFilterPreset,
    loadFilterPreset,
    getFilterPresets
  };

  // 刷新数据
  const refreshData = useCallback(async () => {
    setOperationState(prev => ({ ...prev, isLoading: true, lastOperation: 'refreshData' }));
    
    try {
      // 这里应该调用实际的数据刷新API
      console.log('Refreshing catalog data...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
    } catch (error) {
      console.error('Failed to refresh data:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // 导入数据
  const importData = useCallback(async (file: File, format: 'json' | 'csv' | 'excel') => {
    setOperationState(prev => ({ ...prev, isImporting: true, lastOperation: 'importData' }));
    
    try {
      console.log(`Importing data from ${file.name} in ${format} format`);
      
      // 模拟导入过程
      for (let i = 0; i <= 100; i += 10) {
        setOperationState(prev => ({ ...prev, operationProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isImporting: false, operationProgress: undefined }));
    }
  }, []);

  // 导出数据
  const exportData = useCallback(async (format: 'json' | 'csv' | 'excel') => {
    setOperationState(prev => ({ ...prev, isExporting: true, lastOperation: 'exportData' }));
    
    try {
      console.log(`Exporting all catalog data in ${format} format`);
      
      // 模拟导出过程
      for (let i = 0; i <= 100; i += 10) {
        setOperationState(prev => ({ ...prev, operationProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isExporting: false, operationProgress: undefined }));
    }
  }, []);

  // 备份数据
  const backupData = useCallback(async () => {
    setOperationState(prev => ({ ...prev, isSaving: true, lastOperation: 'backupData' }));
    
    try {
      console.log('Creating data backup...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟备份过程
    } catch (error) {
      console.error('Failed to backup data:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isSaving: false }));
    }
  }, []);

  // 恢复数据
  const restoreData = useCallback(async (backupFile: File) => {
    setOperationState(prev => ({ ...prev, isImporting: true, lastOperation: 'restoreData' }));
    
    try {
      console.log(`Restoring data from backup: ${backupFile.name}`);
      
      // 模拟恢复过程
      for (let i = 0; i <= 100; i += 10) {
        setOperationState(prev => ({ ...prev, operationProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    } catch (error) {
      console.error('Failed to restore data:', error);
      throw error;
    } finally {
      setOperationState(prev => ({ ...prev, isImporting: false, operationProgress: undefined }));
    }
  }, []);

  // 数据管理对象
  const dataManagement: DataManagement = {
    refreshData,
    importData,
    exportData,
    backupData,
    restoreData
  };

  // 辅助函数：递归获取分类树中的所有分类
  const getAllCategoriesFromTree = useCallback((categories: CategoryNode[]): CategoryNode[] => {
    const result: CategoryNode[] = [];
    
    const traverse = (nodes: CategoryNode[]) => {
      for (const node of nodes) {
        result.push(node);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    };
    
    traverse(categories);
    return result;
  }, []);

  // 获取选择统计
  const getSelectionStats = useCallback(() => {
    return {
      resourceCount: selectionState.selectedResources.length,
      categoryCount: selectionState.selectedCategories.length,
      tagCount: selectionState.selectedTags.length,
      dimensionCount: selectionState.selectedDimensions.length
    };
  }, [selectionState]);

  // 验证选择
  const validateSelection = useCallback(() => {
    const errors: string[] = [];
    
    // 检查是否有选择的资源
    if (selectionState.selectedResources.length === 0) {
      errors.push('请至少选择一个资源');
    }
    
    // 检查选择的资源是否存在
    const invalidResources = selectionState.selectedResources.filter(
      id => !resources.find(r => r.id === parseInt(id))
    );
    if (invalidResources.length > 0) {
      errors.push(`选择的资源中有 ${invalidResources.length} 个不存在`);
    }
    
    // 检查选择的分类是否存在
    const allCategories = dimensions.flatMap(d => 
      d.categories ? getAllCategoriesFromTree(d.categories) : []
    );
    const invalidCategories = selectionState.selectedCategories.filter(
      id => !allCategories.find(c => c.id === id)
    );
    if (invalidCategories.length > 0) {
      errors.push(`选择的分类中有 ${invalidCategories.length} 个不存在`);
    }
    
    // 检查选择的标签是否存在
    const invalidTags = selectionState.selectedTags.filter(
      id => !tags.find(t => t.id === id)
    );
    if (invalidTags.length > 0) {
      errors.push(`选择的标签中有 ${invalidTags.length} 个不存在`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [selectionState, resources, dimensions, tags]);

  return {
    viewState,
    setCurrentView,
    goToPreviousView,
    selectionState,
    selectResource,
    selectCategory,
    selectTag,
    selectDimension,
    clearSelection,
    selectAll,
    operationState,
    bulkOperations,
    searchAndFilter,
    dataManagement,
    getSelectionStats,
    validateSelection
  };
};

export default useDataCatalogManagement;