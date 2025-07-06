import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type GridSortModel } from '@mui/x-data-grid';

// 数据资源类型定义
export interface DataResource {
  id: number;
  name: string;
  description: string;
  type: string;
  domain: string;
  owner: string;
  accessLevel: string;
  status: string;
  tags: string[];
  qualityScore: number;
  usageFrequency: number;
  dataVolume: string;
  lastAccessed: string;
  isFavorite: boolean;
}

// 过滤状态类型定义
export interface FilterState {
  searchTerm: string;
  status: string;
  domain: string;
  onlyFavorites: boolean;
  dataType: string;
  accessLevel: string;
  owner: string;
  qualityScore: number | null;
  usageFrequency: number | null;
  tags: string[];
  showAdvancedFilter: boolean;
}

// 资源上下文类型定义
interface ResourceContextType {
  // 资源数据
  resources: DataResource[];
  filteredResources: DataResource[];
  loading: boolean;
  
  // 视图状态
  viewType: 'list' | 'card' | 'tree';
  setViewType: (type: 'list' | 'card' | 'tree') => void;
  
  // 过滤状态
  filterState: FilterState;
  updateFilterState: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // 排序状态
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
  
  // 分页状态
  pageSize: number;
  setPageSize: (size: number) => void;
  
  // 选择状态
  selectedResources: DataResource[];
  setSelectedResources: (resources: DataResource[]) => void;
  
  // 收藏功能
  toggleFavorite: (id: number) => void;
  
  // 删除功能
  deleteResources: (ids: number[]) => void;
  
  // 详情面板
  detailPanelResource: DataResource | null;
  setDetailPanelResource: (resource: DataResource | null) => void;
}

// 创建上下文
const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

// 默认过滤状态
const defaultFilterState: FilterState = {
  searchTerm: '',
  status: 'all',
  domain: 'all',
  onlyFavorites: false,
  dataType: 'all',
  accessLevel: 'all',
  owner: 'all',
  qualityScore: null,
  usageFrequency: null,
  tags: [],
  showAdvancedFilter: false,
};

// 模拟数据
export const mockResources: DataResource[] = [
  {
    id: 1,
    name: '客户信息资源',
    description: '包含客户基本信息、联系方式和交易历史的综合资源',
    type: '结构化数据',
    domain: '销售',
    owner: '张三',
    accessLevel: '受限',
    status: '已发布',
    tags: ['客户', '核心数据'],
    qualityScore: 4.5,
    usageFrequency: 89,
    dataVolume: '2.3 GB',
    lastAccessed: '2023-12-15',
    isFavorite: true,
  },
  {
    id: 2,
    name: '产品目录',
    description: '所有产品的详细信息和规格',
    type: '结构化数据',
    domain: '产品',
    owner: '李四',
    accessLevel: '公开',
    status: '已发布',
    tags: ['产品', '目录'],
    qualityScore: 4.8,
    usageFrequency: 120,
    dataVolume: '500 MB',
    lastAccessed: '2023-12-20',
    isFavorite: false,
  },
  {
    id: 3,
    name: '销售报告',
    description: '月度和季度销售数据分析',
    type: '报表',
    domain: '销售',
    owner: '王五',
    accessLevel: '内部',
    status: '已发布',
    tags: ['销售', '报告', '分析'],
    qualityScore: 4.2,
    usageFrequency: 45,
    dataVolume: '350 MB',
    lastAccessed: '2023-12-10',
    isFavorite: true,
  },
  {
    id: 4,
    name: '市场调研数据',
    description: '竞争对手分析和市场趋势研究',
    type: '非结构化数据',
    domain: '市场',
    owner: '赵六',
    accessLevel: '机密',
    status: '草稿',
    tags: ['市场', '研究', '竞争'],
    qualityScore: 3.9,
    usageFrequency: 28,
    dataVolume: '1.7 GB',
    lastAccessed: '2023-11-30',
    isFavorite: false,
  },
  {
    id: 5,
    name: '员工记录',
    description: '员工个人信息和绩效评估',
    type: '结构化数据',
    domain: '人力资源',
    owner: '钱七',
    accessLevel: '机密',
    status: '已发布',
    tags: ['员工', 'HR', '机密'],
    qualityScore: 4.7,
    usageFrequency: 35,
    dataVolume: '800 MB',
    lastAccessed: '2023-12-18',
    isFavorite: false,
  },
  {
    id: 6,
    name: '财务报表',
    description: '公司财务状况和预算报告',
    type: '报表',
    domain: '财务',
    owner: '孙八',
    accessLevel: '机密',
    status: '已发布',
    tags: ['财务', '报表', '预算'],
    qualityScore: 4.9,
    usageFrequency: 42,
    dataVolume: '250 MB',
    lastAccessed: '2023-12-19',
    isFavorite: true,
  },
  {
    id: 7,
    name: '供应链数据',
    description: '供应商信息和物流跟踪',
    type: '结构化数据',
    domain: '供应链',
    owner: '周九',
    accessLevel: '内部',
    status: '已发布',
    tags: ['供应链', '物流', '供应商'],
    qualityScore: 4.0,
    usageFrequency: 56,
    dataVolume: '1.2 GB',
    lastAccessed: '2023-12-14',
    isFavorite: false,
  },
  {
    id: 8,
    name: '客户反馈',
    description: '客户满意度调查和产品反馈',
    type: '非结构化数据',
    domain: '客户服务',
    owner: '吴十',
    accessLevel: '内部',
    status: '草稿',
    tags: ['客户', '反馈', '调查'],
    qualityScore: 3.8,
    usageFrequency: 30,
    dataVolume: '900 MB',
    lastAccessed: '2023-12-05',
    isFavorite: false,
  },
  {
    id: 9,
    name: '产品开发计划',
    description: '新产品开发路线图和时间表',
    type: '文档',
    domain: '产品',
    owner: '郑十一',
    accessLevel: '受限',
    status: '已发布',
    tags: ['产品', '开发', '计划'],
    qualityScore: 4.3,
    usageFrequency: 38,
    dataVolume: '150 MB',
    lastAccessed: '2023-12-12',
    isFavorite: true,
  },
  {
    id: 10,
    name: '营销活动数据',
    description: '各营销渠道的效果分析和ROI计算',
    type: '结构化数据',
    domain: '市场',
    owner: '王五',
    accessLevel: '内部',
    status: '已发布',
    tags: ['营销', '分析', 'ROI'],
    qualityScore: 4.1,
    usageFrequency: 65,
    dataVolume: '750 MB',
    lastAccessed: '2023-12-17',
    isFavorite: false,
  },
  {
    id: 11,
    name: '研发项目文档',
    description: '研发项目的技术规范和进度报告',
    type: '文档',
    domain: '研发',
    owner: '李四',
    accessLevel: '受限',
    status: '草稿',
    tags: ['研发', '项目', '技术'],
    qualityScore: 4.4,
    usageFrequency: 25,
    dataVolume: '1.5 GB',
    lastAccessed: '2023-12-08',
    isFavorite: false,
  },
  {
    id: 12,
    name: '质量控制报告',
    description: '产品质量检测和问题跟踪',
    type: '报表',
    domain: '质量',
    owner: '张三',
    accessLevel: '内部',
    status: '已发布',
    tags: ['质量', '控制', '报告'],
    qualityScore: 4.6,
    usageFrequency: 40,
    dataVolume: '600 MB',
    lastAccessed: '2023-12-16',
    isFavorite: true,
  },
];

// Provider组件
interface ResourceProviderProps {
  children: ReactNode;
}

export const ResourceProvider: React.FC<ResourceProviderProps> = ({ children }) => {
  // 资源数据状态
  const [resources, setResources] = useState<DataResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<DataResource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 视图状态
  const [viewType, setViewType] = useState<'list' | 'card' | 'tree'>('list');
  
  // 过滤状态
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  
  // 排序状态
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  
  // 分页状态
  const [pageSize, setPageSize] = useState(10);
  
  // 选择状态
  const [selectedResources, setSelectedResources] = useState<DataResource[]>([]);
  
  // 详情面板
  const [detailPanelResource, setDetailPanelResource] = useState<DataResource | null>(null);

  // 初始化数据
  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      setLoading(true);
      try {
        // 在实际应用中，这里会是一个API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        setResources(mockResources);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤资源
  useEffect(() => {
    if (resources.length === 0) return;

    let filtered = [...resources];

    // 搜索词过滤
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(
        resource =>
          resource.name.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 状态过滤
    if (filterState.status !== 'all') {
      filtered = filtered.filter(resource => resource.status === filterState.status);
    }

    // 业务域过滤
    if (filterState.domain !== 'all') {
      filtered = filtered.filter(resource => resource.domain === filterState.domain);
    }

    // 收藏过滤
    if (filterState.onlyFavorites) {
      filtered = filtered.filter(resource => resource.isFavorite);
    }

    // 数据类型过滤
    if (filterState.dataType !== 'all') {
      filtered = filtered.filter(resource => resource.type === filterState.dataType);
    }

    // 访问级别过滤
    if (filterState.accessLevel !== 'all') {
      filtered = filtered.filter(resource => resource.accessLevel === filterState.accessLevel);
    }

    // 所有者过滤
    if (filterState.owner !== 'all') {
      filtered = filtered.filter(resource => resource.owner === filterState.owner);
    }

    // 质量评分过滤
    if (filterState.qualityScore !== null) {
      filtered = filtered.filter(resource => resource.qualityScore >= filterState.qualityScore!);
    }

    // 使用频率过滤
    if (filterState.usageFrequency !== null) {
      filtered = filtered.filter(resource => resource.usageFrequency >= filterState.usageFrequency!);
    }

    // 标签过滤
    if (filterState.tags.length > 0) {
      filtered = filtered.filter(resource =>
        filterState.tags.some(tag => resource.tags.includes(tag))
      );
    }

    setFilteredResources(filtered);
  }, [resources, filterState]);

  // 更新过滤状态
  const updateFilterState = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  // 重置过滤器
  const resetFilters = () => {
    setFilterState(defaultFilterState);
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
  };

  // 提供上下文值
  const contextValue: ResourceContextType = {
    resources,
    filteredResources,
    loading,
    viewType,
    setViewType,
    filterState,
    updateFilterState,
    resetFilters,
    sortModel,
    setSortModel,
    pageSize,
    setPageSize,
    selectedResources,
    setSelectedResources,
    toggleFavorite,
    deleteResources,
    detailPanelResource,
    setDetailPanelResource,
  };

  return (
    <ResourceContext.Provider value={contextValue}>
      {children}
    </ResourceContext.Provider>
  );
};

// 自定义Hook
export const useResourceContext = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
};