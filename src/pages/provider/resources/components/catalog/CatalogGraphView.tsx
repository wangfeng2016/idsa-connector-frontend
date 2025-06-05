import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  GetApp as ExportIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { useDataCatalog } from '../../../../../contexts/DataCatalogContext';
import type { CatalogDataResource, ResourceRelation } from '../../../../../contexts/DataCatalogContext';
import useResponsive from '../../../../../hooks/useResponsive';

interface CatalogGraphViewProps {
  showRelationsOnly?: boolean;
  onResourceSelect?: (resource: CatalogDataResource) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'resource' | 'category';
  data: CatalogDataResource | any;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
  color: string;
}

/**
 * 数据目录关系图视图组件
 * 使用力导向图展示资源间的关联关系
 */
const CatalogGraphView: React.FC<CatalogGraphViewProps> = ({
  showRelationsOnly = false,
  onResourceSelect
}) => {
  const responsive = useResponsive();
  const {
    getFilteredResources,
    getResourceRelations,
    dimensions,
    getResourceCategories,
    getResourceQualityColor
  } = useDataCatalog();

  // 画布引用
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 本地状态
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<null | HTMLElement>(null);
  
  // 图形设置
  const [showLabels, setShowLabels] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [relationStrength, setRelationStrength] = useState(50);
  const [nodeSize, setNodeSize] = useState(20);
  const [selectedRelationTypes, setSelectedRelationTypes] = useState<string[]>(['all']);

  // 关系类型配置
  const relationTypes = [
    { value: 'all', label: '全部关系', color: '#666' },
    { value: 'dependency', label: '依赖关系', color: '#f44336' },
    { value: 'similarity', label: '相似关系', color: '#2196f3' },
    { value: 'derivation', label: '派生关系', color: '#4caf50' },
    { value: 'usage', label: '使用关系', color: '#ff9800' },
    { value: 'composition', label: '组合关系', color: '#9c27b0' }
  ];

  // 初始化图形数据
  useEffect(() => {
    const resources = getFilteredResources();
    const relations = getResourceRelations();
    
    // 创建节点
    const graphNodes: GraphNode[] = resources.map((resource, index) => {
      const angle = (index / resources.length) * 2 * Math.PI;
      const radius = Math.min(300, resources.length * 10);
      
      return {
        id: resource.id,
        label: resource.name,
        type: 'resource',
        data: resource,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.max(nodeSize, (resource.qualityScore || 0) / 5),
        color: getResourceQualityColor(resource.qualityScore || 0)
      };
    });
    
    // 如果显示分类，添加分类节点
    if (showCategories && !showRelationsOnly) {
      dimensions.forEach((dimension, dimIndex) => {
        const categories = dimension.categories || [];
        categories.forEach((category, catIndex) => {
          const angle = ((dimIndex * 10 + catIndex) / (dimensions.length * 10)) * 2 * Math.PI;
          const radius = 150;
          
          graphNodes.push({
            id: `category-${category.id}`,
            label: category.name,
            type: 'category',
            data: category,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            size: nodeSize * 0.8,
            color: '#90a4ae'
          });
        });
      });
    }
    
    // 创建边
    const graphEdges: GraphEdge[] = [];
    
    // 添加资源关系边
    relations.forEach(relation => {
      if (selectedRelationTypes.includes('all') || selectedRelationTypes.includes(relation.type)) {
        const relationConfig = relationTypes.find(rt => rt.value === relation.type);
        graphEdges.push({
          id: `${relation.sourceId}-${relation.targetId}`,
          source: relation.sourceId,
          target: relation.targetId,
          type: relation.type,
          weight: relation.strength || 1,
          color: relationConfig?.color || '#666'
        });
      }
    });
    
    // 添加资源到分类的边
    if (showCategories && !showRelationsOnly) {
      resources.forEach(resource => {
        dimensions.forEach(dimension => {
          const categories = getResourceCategories(resource.id, dimension.id);
          categories.forEach(category => {
            graphEdges.push({
              id: `${resource.id}-category-${category.id}`,
              source: resource.id,
              target: `category-${category.id}`,
              type: 'classification',
              weight: 0.5,
              color: '#e0e0e0'
            });
          });
        });
      });
    }
    
    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [getFilteredResources, getResourceRelations, dimensions, showCategories, selectedRelationTypes, nodeSize, showRelationsOnly]);

  // 力导向布局算法
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const animate = () => {
      const newNodes = [...nodes];
      const dt = 0.1;
      const repulsion = 1000;
      const attraction = relationStrength / 100;
      
      // 计算节点间的力
      newNodes.forEach((node, i) => {
        let fx = 0, fy = 0;
        
        // 排斥力
        newNodes.forEach((other, j) => {
          if (i !== j) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repulsion / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        });
        
        // 吸引力（基于边）
        edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = newNodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = attraction * edge.weight;
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
          if (edge.target === node.id) {
            const source = newNodes.find(n => n.id === edge.source);
            if (source) {
              const dx = source.x - node.x;
              const dy = source.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = attraction * edge.weight;
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
        });
        
        // 更新位置
        node.x += fx * dt;
        node.y += fy * dt;
        
        // 边界约束
        const maxDistance = 400;
        const distance = Math.sqrt(node.x * node.x + node.y * node.y);
        if (distance > maxDistance) {
          node.x = (node.x / distance) * maxDistance;
          node.y = (node.y / distance) * maxDistance;
        }
      });
      
      setNodes(newNodes);
    };
    
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, [nodes.length, edges, relationStrength]);

  // 绘制图形
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 应用变换
    ctx.save();
    ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    
    // 绘制边
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = edge.color;
        ctx.lineWidth = edge.weight * 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
    
    // 绘制节点
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      
      // 节点圆圈
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // 选中或悬停效果
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = isSelected ? '#1976d2' : '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // 节点标签
      if (showLabels && (isHovered || isSelected || zoom > 0.8)) {
        ctx.fillStyle = '#333';
        ctx.font = `${12 / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.size + 15);
      }
    });
    
    ctx.restore();
  }, [nodes, edges, zoom, pan, selectedNode, hoveredNode, showLabels]);

  // 处理鼠标事件
  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 转换到图形坐标
    const graphX = (x - canvas.width / 2 - pan.x) / zoom;
    const graphY = (y - canvas.height / 2 - pan.y) / zoom;
    
    // 检查是否点击了节点
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(
        (node.x - graphX) ** 2 + (node.y - graphY) ** 2
      );
      return distance <= node.size;
    });
    
    if (clickedNode) {
      setSelectedNode(clickedNode);
      if (clickedNode.type === 'resource') {
        onResourceSelect?.(clickedNode.data as CatalogDataResource);
      }
    } else {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (isDragging) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x, y });
    } else {
      // 检查悬停的节点
      const graphX = (x - canvas.width / 2 - pan.x) / zoom;
      const graphY = (y - canvas.height / 2 - pan.y) / zoom;
      
      const hoveredNode = nodes.find(node => {
        const distance = Math.sqrt(
          (node.x - graphX) ** 2 + (node.y - graphY) ** 2
        );
        return distance <= node.size;
      });
      
      setHoveredNode(hoveredNode || null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理右键菜单
  const handleContextMenu = (event: React.MouseEvent) => {
    if (selectedNode) {
      event.preventDefault();
      setContextMenuAnchor(event.currentTarget as HTMLElement);
    }
  };

  // 缩放控制
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  // 居中视图
  const handleCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏 */}
      <Paper sx={{ p: 1, mb: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 缩放控制 */}
            <Tooltip title="放大">
              <IconButton size="small" onClick={() => handleZoom(0.1)}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="缩小">
              <IconButton size="small" onClick={() => handleZoom(-0.1)}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="居中">
              <IconButton size="small" onClick={handleCenter}>
                <CenterIcon />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem />
            
            {/* 关系类型过滤 */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>关系类型</InputLabel>
              <Select
                multiple
                value={selectedRelationTypes}
                onChange={(e) => setSelectedRelationTypes(e.target.value as string[])}
                label="关系类型"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      const type = relationTypes.find(rt => rt.value === value);
                      return (
                        <Chip key={value} label={type?.label} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {relationTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: type.color
                        }}
                      />
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 设置 */}
            <Tooltip title="设置">
              <IconButton
                size="small"
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            {/* 刷新 */}
            <Tooltip title="刷新布局">
              <IconButton size="small" onClick={() => window.location.reload()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      {/* 图形画布 */}
      <Box 
        ref={containerRef}
        sx={{ 
          flex: 1, 
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ 
            width: '100%', 
            height: '100%',
            cursor: isDragging ? 'grabbing' : hoveredNode ? 'pointer' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
        />
        
        {/* 选中节点信息 */}
        {selectedNode && (
          <Card sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            minWidth: 250,
            maxWidth: 300
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedNode.label}
              </Typography>
              {selectedNode.type === 'resource' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {(selectedNode.data as CatalogDataResource).description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={(selectedNode.data as CatalogDataResource).type} 
                      size="small" 
                      color="primary"
                    />
                    <Chip 
                      label={`质量: ${(selectedNode.data as CatalogDataResource).qualityScore || 0}%`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* 设置菜单 */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            显示设置
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                size="small"
              />
            }
            label="显示标签"
            sx={{ display: 'block', mb: 1 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={showCategories}
                onChange={(e) => setShowCategories(e.target.checked)}
                size="small"
              />
            }
            label="显示分类"
            sx={{ display: 'block', mb: 2 }}
          />
          
          <Typography variant="body2" gutterBottom>
            关系强度: {relationStrength}%
          </Typography>
          <Slider
            value={relationStrength}
            onChange={(_, value) => setRelationStrength(value as number)}
            min={10}
            max={100}
            size="small"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" gutterBottom>
            节点大小: {nodeSize}
          </Typography>
          <Slider
            value={nodeSize}
            onChange={(_, value) => setNodeSize(value as number)}
            min={10}
            max={40}
            size="small"
          />
        </Box>
      </Menu>
      
      {/* 右键菜单 */}
      <Menu
        anchorEl={contextMenuAnchor}
        open={Boolean(contextMenuAnchor)}
        onClose={() => setContextMenuAnchor(null)}
      >
        <MenuItem onClick={() => setContextMenuAnchor(null)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>查看详情</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setContextMenuAnchor(null)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>编辑</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setContextMenuAnchor(null)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>删除</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CatalogGraphView;