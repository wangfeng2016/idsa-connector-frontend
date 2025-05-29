import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  History as HistoryIcon,
} from '@mui/icons-material';

// 类型定义
interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  status: 'success' | 'failure' | 'warning';
  ipAddress: string;
}

// 模拟数据
const mockLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '2024-01-20 10:30:00',
    user: 'admin@example.com',
    action: '数据访问',
    resource: '/api/data/dataset-1',
    details: '读取数据集',
    status: 'success',
    ipAddress: '192.168.1.100',
  },
  {
    id: 2,
    timestamp: '2024-01-20 11:15:00',
    user: 'user1@example.com',
    action: '策略修改',
    resource: 'access-policy-1',
    details: '更新访问策略',
    status: 'success',
    ipAddress: '192.168.1.101',
  },
  {
    id: 3,
    timestamp: '2024-01-20 14:20:00',
    user: 'user2@example.com',
    action: '认证',
    resource: 'auth-service',
    details: '登录失败',
    status: 'failure',
    ipAddress: '192.168.1.102',
  },
];

// 定义列配置
const columns: GridColDef[] = [
  { field: 'timestamp', headerName: '时间', width: 180 },
  { field: 'user', headerName: '用户', width: 180 },
  { field: 'action', headerName: '操作', width: 120 },
  { field: 'resource', headerName: '资源', width: 180 },
  { field: 'details', headerName: '详细信息', width: 200 },
  {
    field: 'status',
    headerName: '状态',
    width: 120,
    renderCell: (params) => (
      <Box
        sx={{
          backgroundColor:
            params.value === 'success' ? '#e6f4ea' :
            params.value === 'failure' ? '#fce8e6' :
            '#fff3e0',
          color:
            params.value === 'success' ? '#1e4620' :
            params.value === 'failure' ? '#c62828' :
            '#e65100',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.875rem',
        }}
      >
        {params.value === 'success' ? '成功' :
         params.value === 'failure' ? '失败' :
         '警告'}
      </Box>
    ),
  },
  { field: 'ipAddress', headerName: 'IP地址', width: 130 },
];

const AuditLogs = () => {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [timeRange, setTimeRange] = useState('today');
  const [actionType, setActionType] = useState('all');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  审计日志
                </Typography>
              </Box>

              {/* 筛选器 */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 3,
                  '& > *': {
                    flex: '1 1 200px',
                    minWidth: 200
                  }
                }}
              >
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>时间范围</InputLabel>
                    <Select
                      value={timeRange}
                      label="时间范围"
                      onChange={(e) => setTimeRange(e.target.value)}
                    >
                      <MenuItem value="today">今天</MenuItem>
                      <MenuItem value="week">最近7天</MenuItem>
                      <MenuItem value="month">最近30天</MenuItem>
                      <MenuItem value="custom">自定义范围</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel>操作类型</InputLabel>
                    <Select
                      value={actionType}
                      label="操作类型"
                      onChange={(e) => setActionType(e.target.value)}
                    >
                      <MenuItem value="all">全部</MenuItem>
                      <MenuItem value="data_access">数据访问</MenuItem>
                      <MenuItem value="policy_change">策略修改</MenuItem>
                      <MenuItem value="auth">认证操作</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="搜索用户"
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* 日志表格 */}
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={logs}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </div>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

export default AuditLogs;