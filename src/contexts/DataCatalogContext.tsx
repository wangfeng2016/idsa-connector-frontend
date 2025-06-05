import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type DataResource } from './ResourceContext';

// 分类维度类型
export type DimensionType = 'business' | 'dataType' | 'organization' | 'time' | 'security';

// 分类节点接口
export interface CategoryNode {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children: CategoryNode[];
  level: number;
  path: string; // 完整路径，如 "销售/区域销售/北方区销售"
  resourceCount: number;
  icon?: string;
  color?: string;
}

// 分类维度接口
export interface ClassificationDimension {
  id: DimensionType;
  name: string;
  description: string;
  icon: string;
  categories: CategoryNode[];
  isExpanded: boolean;
  isEnabled: boolean;
  color?: string;
}

// 标签接口
export interface Tag {
  id: string;
  name: string;
  color: string;
  category?: string;
  usageCount: number;
  description?: string;
}

// 资源关联关系接口
export interface ResourceRelation {
  id: string;
  sourceId: number;
  targetId: number;
  relationType: 'lineage' | 'business' | 'dependency' | 'similarity';
  relationName: string;
  description?: string;
  strength: number; // 关联强度 0-1
  direction: 'bidirectional' | 'source-to-target' | 'target-to-source';
}

// 数据目录视图类型
export type CatalogViewType = 'hierarchy' | 'matrix' | 'graph' | 'timeline';

// 数据目录过滤状态
export interface CatalogFilterState {
  selectedDimensions: DimensionType[];
  selectedCategories: { [dimension: string]: string[] };
  selectedTags: string[];
  searchTerm: string;
  showRelations: boolean;
  relationTypes: string[];
  qualityThreshold: number;
  timeRange: {
    start?: string;
    end?: string;
  };
}

// 扩展的数据资源接口（包含目录信息）
export interface CatalogDataResource extends DataResource {
  categories: { [dimension: string]: string[] }; // 每个维度下的分类路径
  customTags: Tag[];
  relations: ResourceRelation[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    schema?: any;
    lineage?: string[];
    businessGlossary?: string[];
  };
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
    overall: number;
  };
}

// 数据目录上下文类型
interface DataCatalogContextType {
  // 分类维度
  dimensions: ClassificationDimension[];
  updateDimension: (dimensionId: DimensionType, updates: Partial<ClassificationDimension>) => void;
  toggleDimensionExpansion: (dimensionId: DimensionType) => void;
  
  // 分类管理
  addCategory: (dimensionId: DimensionType, category: Omit<CategoryNode, 'id' | 'children' | 'resourceCount'>) => void;
  updateCategory: (dimensionId: DimensionType, categoryId: string, updates: Partial<CategoryNode>) => void;
  deleteCategory: (dimensionId: DimensionType, categoryId: string) => void;
  moveCategory: (dimensionId: DimensionType, categoryId: string, newParentId?: string) => void;
  
  // 标签管理
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id' | 'usageCount'>) => void;
  updateTag: (tagId: string, updates: Partial<Tag>) => void;
  deleteTag: (tagId: string) => void;
  getTagsByCategory: (category?: string) => Tag[];
  
  // 资源分类
  catalogResources: CatalogDataResource[];
  assignResourceToCategory: (resourceId: number, dimensionId: DimensionType, categoryPath: string) => void;
  removeResourceFromCategory: (resourceId: number, dimensionId: DimensionType, categoryPath: string) => void;
  addTagToResource: (resourceId: number, tagId: string) => void;
  removeTagFromResource: (resourceId: number, tagId: string) => void;
  
  // 关联关系
  addResourceRelation: (relation: Omit<ResourceRelation, 'id'>) => void;
  updateResourceRelation: (relationId: string, updates: Partial<ResourceRelation>) => void;
  deleteResourceRelation: (relationId: string) => void;
  getResourceRelations: (resourceId: number, relationType?: string) => ResourceRelation[];
  
  // 视图和过滤
  viewType: CatalogViewType;
  setViewType: (type: CatalogViewType) => void;
  filterState: CatalogFilterState;
  updateFilterState: (updates: Partial<CatalogFilterState>) => void;
  resetFilters: () => void;
  
  // 搜索和发现
  searchResources: (query: string, options?: any) => CatalogDataResource[];
  getResourcesByCategory: (dimensionId: DimensionType, categoryPath: string) => CatalogDataResource[];
  getResourcesByTag: (tagIds: string[]) => CatalogDataResource[];
  getSimilarResources: (resourceId: number, limit?: number) => CatalogDataResource[];
  getCategoriesByDimension: (dimensionId: DimensionType) => CategoryNode[];
  getFilteredResources: () => CatalogDataResource[];
  getFavoriteResources: () => CatalogDataResource[];
  getDimensionStats: () => any;
  getCategoryStats: () => any;
  getTagStats: () => any;
  getResourceQualityColor: (quality: number) => string;
  
  // 统计信息
  getCatalogStats: () => {
    totalResources: number;
    categorizedResources: number;
    taggedResources: number;
    relationCount: number;
    dimensionStats: { [dimension: string]: number };
  };
  
  // 导入导出
  exportCatalog: () => Promise<string>;
  importCatalog: (data: string) => Promise<void>;
}

// 默认分类维度数据
const defaultDimensions: ClassificationDimension[] = [
  {
    id: 'business',
    name: '业务维度',
    description: '按业务领域和功能分类',
    icon: 'business',
    isExpanded: true,
    isEnabled: true,
    color: '#1976d2',
    categories: [
      {
        id: 'sales',
        name: '销售',
        parentId: undefined,
        children: [
          {
            id: 'regional-sales',
            name: '区域销售',
            parentId: 'sales',
            children: [
              {
                id: 'north-sales',
                name: '北方区销售',
                parentId: 'regional-sales',
                children: [],
                level: 2,
                path: '销售/区域销售/北方区销售',
                resourceCount: 0
              }
            ],
            level: 1,
            path: '销售/区域销售',
            resourceCount: 0
          }
        ],
        level: 0,
        path: '销售',
        resourceCount: 0
      },
      {
        id: 'marketing',
        name: '市场营销',
        parentId: undefined,
        children: [],
        level: 0,
        path: '市场营销',
        resourceCount: 0
      },
      {
        id: 'finance',
        name: '财务',
        parentId: undefined,
        children: [],
        level: 0,
        path: '财务',
        resourceCount: 0
      }
    ]
  },
  {
    id: 'dataType',
    name: '数据类型',
    description: '按数据格式和结构分类',
    icon: 'data',
    isExpanded: false,
    isEnabled: true,
    color: '#388e3c',
    categories: [
      {
        id: 'structured',
        name: '结构化数据',
        parentId: undefined,
        children: [],
        level: 0,
        path: '结构化数据',
        resourceCount: 0
      },
      {
        id: 'unstructured',
        name: '非结构化数据',
        parentId: undefined,
        children: [],
        level: 0,
        path: '非结构化数据',
        resourceCount: 0
      }
    ]
  },
  {
    id: 'organization',
    name: '组织维度',
    description: '按部门和团队分类',
    icon: 'organization',
    isExpanded: false,
    isEnabled: true,
    color: '#f57c00',
    categories: [
      {
        id: 'it-dept',
        name: 'IT部门',
        parentId: undefined,
        children: [],
        level: 0,
        path: 'IT部门',
        resourceCount: 0
      },
      {
        id: 'business-dept',
        name: '业务部门',
        parentId: undefined,
        children: [],
        level: 0,
        path: '业务部门',
        resourceCount: 0
      }
    ]
  },
  {
    id: 'time',
    name: '时间维度',
    description: '按数据时效性分类',
    icon: 'time',
    isExpanded: false,
    isEnabled: true,
    color: '#9c27b0',
    categories: [
      {
        id: 'realtime',
        name: '实时数据',
        parentId: undefined,
        children: [],
        level: 0,
        path: '实时数据',
        resourceCount: 0
      },
      {
        id: 'historical',
        name: '历史数据',
        parentId: undefined,
        children: [],
        level: 0,
        path: '历史数据',
        resourceCount: 0
      }
    ]
  },
  {
    id: 'security',
    name: '安全维度',
    description: '按敏感度级别分类',
    icon: 'security',
    isExpanded: false,
    isEnabled: true,
    color: '#d32f2f',
    categories: [
      {
        id: 'public',
        name: '公开',
        parentId: undefined,
        children: [],
        level: 0,
        path: '公开',
        resourceCount: 0
      },
      {
        id: 'internal',
        name: '内部',
        parentId: undefined,
        children: [],
        level: 0,
        path: '内部',
        resourceCount: 0
      },
      {
        id: 'confidential',
        name: '机密',
        parentId: undefined,
        children: [],
        level: 0,
        path: '机密',
        resourceCount: 0
      }
    ]
  }
];

// 默认标签数据
const defaultTags: Tag[] = [
  { id: 'customer-data', name: '客户数据', color: '#1976d2', category: 'business', usageCount: 0 },
  { id: 'financial', name: '财务', color: '#388e3c', category: 'business', usageCount: 0 },
  { id: 'pii', name: '个人信息', color: '#f57c00', category: 'security', usageCount: 0 },
  { id: 'high-quality', name: '高质量', color: '#7b1fa2', category: 'quality', usageCount: 0 },
  { id: 'deprecated', name: '已废弃', color: '#d32f2f', category: 'status', usageCount: 0 }
];

// 默认过滤状态
const defaultFilterState: CatalogFilterState = {
  selectedDimensions: [],
  selectedCategories: {},
  selectedTags: [],
  searchTerm: '',
  showRelations: false,
  relationTypes: [],
  qualityThreshold: 0,
  timeRange: {}
};

// 创建上下文
const DataCatalogContext = createContext<DataCatalogContextType | undefined>(undefined);

// Provider组件
export const DataCatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 状态管理
  const [dimensions, setDimensions] = useState<ClassificationDimension[]>(defaultDimensions);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [catalogResources, setCatalogResources] = useState<CatalogDataResource[]>([]);
  const [viewType, setViewType] = useState<CatalogViewType>('hierarchy');
  const [filterState, setFilterState] = useState<CatalogFilterState>(defaultFilterState);

  // 分类维度管理
  const updateDimension = (dimensionId: DimensionType, updates: Partial<ClassificationDimension>) => {
    setDimensions(prev => prev.map(dim => 
      dim.id === dimensionId ? { ...dim, ...updates } : dim
    ));
  };

  const toggleDimensionExpansion = (dimensionId: DimensionType) => {
    updateDimension(dimensionId, { 
      isExpanded: !dimensions.find(d => d.id === dimensionId)?.isExpanded 
    });
  };

  // 分类管理
  const addCategory = (dimensionId: DimensionType, category: Omit<CategoryNode, 'id' | 'children' | 'resourceCount'>) => {
    const newCategory: CategoryNode = {
      ...category,
      id: `${dimensionId}-${Date.now()}`,
      children: [],
      resourceCount: 0
    };

    setDimensions(prev => prev.map(dim => {
      if (dim.id !== dimensionId) return dim;
      
      const addToCategories = (categories: CategoryNode[]): CategoryNode[] => {
        if (!category.parentId) {
          return [...categories, newCategory];
        }
        
        return categories.map(cat => {
          if (cat.id === category.parentId) {
            return { ...cat, children: [...cat.children, newCategory] };
          }
          return { ...cat, children: addToCategories(cat.children) };
        });
      };
      
      return { ...dim, categories: addToCategories(dim.categories) };
    }));
  };

  const updateCategory = (dimensionId: DimensionType, categoryId: string, updates: Partial<CategoryNode>) => {
    setDimensions(prev => prev.map(dim => {
      if (dim.id !== dimensionId) return dim;
      
      const updateInCategories = (categories: CategoryNode[]): CategoryNode[] => {
        return categories.map(cat => {
          if (cat.id === categoryId) {
            return { ...cat, ...updates };
          }
          return { ...cat, children: updateInCategories(cat.children) };
        });
      };
      
      return { ...dim, categories: updateInCategories(dim.categories) };
    }));
  };

  const deleteCategory = (dimensionId: DimensionType, categoryId: string) => {
    setDimensions(prev => prev.map(dim => {
      if (dim.id !== dimensionId) return dim;
      
      const removeFromCategories = (categories: CategoryNode[]): CategoryNode[] => {
        return categories
          .filter(cat => cat.id !== categoryId)
          .map(cat => ({ ...cat, children: removeFromCategories(cat.children) }));
      };
      
      return { ...dim, categories: removeFromCategories(dim.categories) };
    }));
  };

  const moveCategory = (dimensionId: DimensionType, categoryId: string, newParentId?: string) => {
    // 实现分类移动逻辑
    console.log('Move category:', { dimensionId, categoryId, newParentId });
  };

  // 标签管理
  const addTag = (tag: Omit<Tag, 'id' | 'usageCount'>) => {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
      usageCount: 0
    };
    setTags(prev => [...prev, newTag]);
  };

  const updateTag = (tagId: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(tag => 
      tag.id === tagId ? { ...tag, ...updates } : tag
    ));
  };

  const deleteTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const getTagsByCategory = (category?: string) => {
    return category ? tags.filter(tag => tag.category === category) : tags;
  };

  // 资源分类
  const assignResourceToCategory = (resourceId: number, dimensionId: DimensionType, categoryPath: string) => {
    setCatalogResources(prev => prev.map(resource => {
      if (resource.id !== resourceId) return resource;
      
      const categories = { ...resource.categories };
      if (!categories[dimensionId]) {
        categories[dimensionId] = [];
      }
      if (!categories[dimensionId].includes(categoryPath)) {
        categories[dimensionId].push(categoryPath);
      }
      
      return { ...resource, categories };
    }));
  };

  const removeResourceFromCategory = (resourceId: number, dimensionId: DimensionType, categoryPath: string) => {
    setCatalogResources(prev => prev.map(resource => {
      if (resource.id !== resourceId) return resource;
      
      const categories = { ...resource.categories };
      if (categories[dimensionId]) {
        categories[dimensionId] = categories[dimensionId].filter(path => path !== categoryPath);
      }
      
      return { ...resource, categories };
    }));
  };

  const addTagToResource = (resourceId: number, tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return;
    
    setCatalogResources(prev => prev.map(resource => {
      if (resource.id !== resourceId) return resource;
      
      const customTags = [...resource.customTags];
      if (!customTags.find(t => t.id === tagId)) {
        customTags.push(tag);
      }
      
      return { ...resource, customTags };
    }));
    
    // 更新标签使用计数
    updateTag(tagId, { usageCount: tag.usageCount + 1 });
  };

  const removeTagFromResource = (resourceId: number, tagId: string) => {
    setCatalogResources(prev => prev.map(resource => {
      if (resource.id !== resourceId) return resource;
      
      const customTags = resource.customTags.filter(tag => tag.id !== tagId);
      return { ...resource, customTags };
    }));
    
    // 更新标签使用计数
    const tag = tags.find(t => t.id === tagId);
    if (tag && tag.usageCount > 0) {
      updateTag(tagId, { usageCount: tag.usageCount - 1 });
    }
  };

  // 关联关系管理
  const addResourceRelation = (relation: Omit<ResourceRelation, 'id'>) => {
    const newRelation: ResourceRelation = {
      ...relation,
      id: `relation-${Date.now()}`
    };
    
    setCatalogResources(prev => prev.map(resource => {
      if (resource.id === relation.sourceId || resource.id === relation.targetId) {
        return {
          ...resource,
          relations: [...resource.relations, newRelation]
        };
      }
      return resource;
    }));
  };

  const updateResourceRelation = (relationId: string, updates: Partial<ResourceRelation>) => {
    setCatalogResources(prev => prev.map(resource => ({
      ...resource,
      relations: resource.relations.map(rel => 
        rel.id === relationId ? { ...rel, ...updates } : rel
      )
    })));
  };

  const deleteResourceRelation = (relationId: string) => {
    setCatalogResources(prev => prev.map(resource => ({
      ...resource,
      relations: resource.relations.filter(rel => rel.id !== relationId)
    })));
  };

  const getResourceRelations = (resourceId: number, relationType?: string) => {
    const resource = catalogResources.find(r => r.id === resourceId);
    if (!resource) return [];
    
    return relationType 
      ? resource.relations.filter(rel => rel.relationType === relationType)
      : resource.relations;
  };

  // 过滤状态管理
  const updateFilterState = (updates: Partial<CatalogFilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  // 搜索和发现
  const searchResources = (query: string, options?: any) => {
    const searchLower = query.toLowerCase();
    return catalogResources.filter(resource => 
      resource.name.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      resource.customTags.some(tag => tag.name.toLowerCase().includes(searchLower))
    );
  };

  const getResourcesByCategory = (dimensionId: DimensionType, categoryPath: string) => {
    return catalogResources.filter(resource => 
      resource.categories[dimensionId]?.includes(categoryPath)
    );
  };

  const getResourcesByTag = (tagIds: string[]) => {
    return catalogResources.filter(resource => 
      resource.customTags.some(tag => tagIds.includes(tag.id))
    );
  };

  const getSimilarResources = (resourceId: number, limit = 5) => {
    const targetResource = catalogResources.find(r => r.id === resourceId);
    if (!targetResource) return [];
    
    // 简单的相似度计算（基于标签和分类）
    const similar = catalogResources
      .filter(r => r.id !== resourceId)
      .map(resource => {
        let similarity = 0;
        
        // 基于标签的相似度
        const commonTags = resource.customTags.filter(tag => 
          targetResource.customTags.some(t => t.id === tag.id)
        ).length;
        similarity += commonTags * 0.3;
        
        // 基于分类的相似度
        Object.keys(resource.categories).forEach(dimension => {
          const commonCategories = resource.categories[dimension].filter(cat => 
            targetResource.categories[dimension]?.includes(cat)
          ).length;
          similarity += commonCategories * 0.2;
        });
        
        return { resource, similarity };
      })
      .filter(item => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.resource);
    
    return similar;
  };

  // 获取指定维度的分类
  const getCategoriesByDimension = (dimensionId: DimensionType) => {
    const dimension = dimensions.find(d => d.id === dimensionId);
    return dimension?.categories || [];
  };

  // 获取过滤后的资源
  const getFilteredResources = () => {
    let filtered = catalogResources;
    
    // 根据搜索词过滤
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower)
      );
    }
    
    // 根据选中的维度过滤
    if (filterState.selectedDimensions.length > 0) {
      filtered = filtered.filter(resource => 
        filterState.selectedDimensions.some(dimId => 
          resource.categories[dimId]?.length > 0
        )
      );
    }
    
    // 根据选中的标签过滤
    if (filterState.selectedTags.length > 0) {
      filtered = filtered.filter(resource => 
        filterState.selectedTags.some(tagId => 
          resource.customTags.some(tag => tag.id === tagId)
        )
      );
    }
    
    return filtered;
  };

  // 获取收藏的资源
  const getFavoriteResources = () => {
    return catalogResources.filter(resource => resource.isFavorite);
  };

  // 获取维度统计
  const getDimensionStats = () => {
    return dimensions.map(dim => ({
      id: dim.id,
      name: dim.name,
      resourceCount: catalogResources.filter(r => r.categories[dim.id]?.length > 0).length,
      categoryCount: dim.categories.length
    }));
  };

  // 获取分类统计
  const getCategoryStats = () => {
    const stats: any[] = [];
    dimensions.forEach(dim => {
      dim.categories.forEach(cat => {
        const resourceCount = catalogResources.filter(r => 
          r.categories[dim.id]?.includes(cat.path)
        ).length;
        stats.push({
          dimensionId: dim.id,
          categoryId: cat.id,
          name: cat.name,
          path: cat.path,
          resourceCount
        });
      });
    });
    return stats;
  };

  // 获取标签统计
  const getTagStats = () => {
    return tags.map(tag => ({
      ...tag,
      resourceCount: catalogResources.filter(r => 
        r.customTags.some(t => t.id === tag.id)
      ).length
    }));
  };

  // 获取资源质量颜色
  const getResourceQualityColor = (quality: number) => {
    if (quality >= 90) return '#4caf50'; // 绿色
    if (quality >= 70) return '#ff9800'; // 橙色
    if (quality >= 50) return '#f44336'; // 红色
    return '#9e9e9e'; // 灰色
  };

  // 统计信息
  const getCatalogStats = () => {
    const totalResources = catalogResources.length;
    const categorizedResources = catalogResources.filter(r => 
      Object.keys(r.categories).some(dim => r.categories[dim].length > 0)
    ).length;
    const taggedResources = catalogResources.filter(r => r.customTags.length > 0).length;
    const relationCount = catalogResources.reduce((sum, r) => sum + r.relations.length, 0);
    
    const dimensionStats: { [dimension: string]: number } = {};
    dimensions.forEach(dim => {
      dimensionStats[dim.id] = catalogResources.filter(r => 
        r.categories[dim.id]?.length > 0
      ).length;
    });
    
    return {
      totalResources,
      categorizedResources,
      taggedResources,
      relationCount,
      dimensionStats
    };
  };

  // 导入导出
  const exportCatalog = async () => {
    const catalogData = {
      dimensions,
      tags,
      catalogResources,
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(catalogData, null, 2);
  };

  const importCatalog = async (data: string) => {
    try {
      const catalogData = JSON.parse(data);
      setDimensions(catalogData.dimensions || defaultDimensions);
      setTags(catalogData.tags || defaultTags);
      setCatalogResources(catalogData.catalogResources || []);
    } catch (error) {
      console.error('Failed to import catalog:', error);
      throw new Error('导入数据格式错误');
    }
  };

  const contextValue: DataCatalogContextType = {
    // 分类维度
    dimensions,
    updateDimension,
    toggleDimensionExpansion,
    
    // 分类管理
    addCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    
    // 标签管理
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagsByCategory,
    
    // 资源分类
    catalogResources,
    assignResourceToCategory,
    removeResourceFromCategory,
    addTagToResource,
    removeTagFromResource,
    
    // 关联关系
    addResourceRelation,
    updateResourceRelation,
    deleteResourceRelation,
    getResourceRelations,
    
    // 视图和过滤
    viewType,
    setViewType,
    filterState,
    updateFilterState,
    resetFilters,
    
    // 搜索和发现
    searchResources,
    getResourcesByCategory,
    getResourcesByTag,
    getSimilarResources,
    getCategoriesByDimension,
    getFilteredResources,
    getFavoriteResources,
    getDimensionStats,
    getCategoryStats,
    getTagStats,
    getResourceQualityColor,
    
    // 统计信息
    getCatalogStats,
    
    // 导入导出
    exportCatalog,
    importCatalog
  };

  return (
    <DataCatalogContext.Provider value={contextValue}>
      {children}
    </DataCatalogContext.Provider>
  );
};

// Hook for using the context
export const useDataCatalog = () => {
  const context = useContext(DataCatalogContext);
  if (context === undefined) {
    throw new Error('useDataCatalog must be used within a DataCatalogProvider');
  }
  return context;
};