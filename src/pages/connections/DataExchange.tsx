import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import {
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

// 模拟数据
interface DataExchangeRecord {
  id: number;
  sourceConnector: string;
  targetConnector: string;
  resourceName: string;
  resourceType: string;
  exchangeType: 'push' | 'pull';
  status: 'completed' | 'failed' | 'in_progress' | 'pending';
  startTime: string;
  endTime: string;
  dataSize: string;
  transferRate: string;
  errorMessage?: string;
}

const mockExchangeRecords: DataExchangeRecord[] = [
  {
    id: 1001,
    sourceConnector: '主数据连接器',
    targetConnector: '财务数据连接器',
    resourceName: '月度销售数据',
    resourceType: 'CSV',
    exchangeType: 'push',
    status: 'completed',
    startTime: '2023-10-15 09:30:15',
    endTime: '2023-10-15 09:32:45',
    dataSize: '25.4 MB',
    transferRate: '12.7 MB/s',
  },
  {
    id: 1002,
    sourceConnector: '产品数据连接器',
    targetConnector: '主数据连接器',
    resourceName: '产品目录更新',
    resourceType: 'JSON',
    exchangeType: 'push',
    status: 'completed',
    startTime: '2023-10-15 10:15:22',
    endTime: '2023-10-15 10:16:30',
    dataSize: '8.2 MB',
    transferRate: '8.2 MB/s',
  },
  {
    id: 1003,
    sourceConnector: '合作伙伴连接器',
    targetConnector: '主数据连接器',
    resourceName: '供应商数据',
    resourceType: 'XML',
    exchangeType: 'push',
    status: 'failed',
    startTime: '2023-10-15 11:05:10',
    endTime: '2023-10-15 11:05:45',
    dataSize: '0 MB',
    transferRate: '0 MB/s',
    errorMessage: '连接超时',
  },
  {
    id: 1004,
    sourceConnector: '主数据连接器',
    targetConnector: '研发数据连接器',
    resourceName: '客户反馈数据',
    resourceType: 'JSON',
    exchangeType: 'pull',
    status: 'completed',
    startTime: '2023-10-15 13:20:05',
    endTime: '2023-10-15 13:21:15',
    dataSize: '12.7 MB',
    transferRate: '10.6 MB/s',
  },
  {
    id: 1005,
    sourceConnector: '财务数据连接器',
    targetConnector: '主数据连接器',
    resourceName: '财务报表',
    resourceType: 'PDF',
    exchangeType: 'push',
    status: 'completed',
    startTime: '2023-10-15 14:10:30',
    endTime: '2023-10-15 14:12:20',
    dataSize: '18.5 MB',
    transferRate: '9.3 MB/s',
  },
  {
    id: 1006,
    sourceConnector: '主数据连接器',
    targetConnector: '合作伙伴连接器',
    resourceName: '销售预测数据',
    resourceType: 'CSV',
    exchangeType: 'push',
    status: 'in_progress',
    startTime: '2023-10-15 15:05:10',
    endTime: '',
    dataSize: '45.2 MB',
    transferRate: '8.5 MB/s',
  },
  {
    id: 1007,
    sourceConnector: '研发数据连接器',
    targetConnector: '主数据连接器',
    resourceName: '产品开发进度',
    resourceType: 'JSON',
    exchangeType: 'push',
    status: 'pending',
    startTime: '',
    endTime: '',
    dataSize: '0 MB',
    transferRate: '0 MB/s',
  },
];

// 统计数据
const mockStats = {
  totalExchanges: 152,
  completedExchanges: 138,
  failedExchanges: 8,
  inProgressExchanges: 4,
  pendingExchanges: 2,
  totalDataTransferred: '2.7 GB',
  averageTransferRate: '10.2 MB/s',
  successRate: 90.8,
};

const DataExchange = () => {
  const [records, setRecords] = useState<DataExchangeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<DataExchangeRecord | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    exchangeType: '',
    connector: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    // 模拟API请求
    const timer = setTimeout(() => {
      setRecords(mockExchangeRecords);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (record: DataExchangeRecord) => {
    setSelectedRecord(record);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    setLoading(true);
    // 模拟过滤操作
    setTimeout(() => {
      let filteredRecords = [...mockExchangeRecords];

      if (filters.status) {
        filteredRecords = filteredRecords.filter(record => record.status === filters.status);
      }

      if (filters.exchangeType) {
        filteredRecords = filteredRecords.filter(record => record.exchangeType === filters.exchangeType);
      }

      if (filters.connector) {
        filteredRecords = filteredRecords.filter(
          record => record.sourceConnector.includes(filters.connector) || 
                   record.targetConnector.includes(filters.connector)
        );
      }

      // 日期过滤逻辑可以在这里添加

      setRecords(filteredRecords);
      setLoading(false);
      setFilterDialogOpen(false);
    }, 1000);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      exchangeType: '',
      connector: '',
      startDate: null,
      endDate: null,
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    // 模拟刷新
    setTimeout(() => {
      setRecords(mockExchangeRecords);
      setLoading(false);
    }, 1000);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="已完成" color="success" size="small" />;
      case 'failed':
        return <Chip label="失败" color="error" size="small" />;
      case 'in_progress':
        return <Chip label="进行中" color="primary" size="small" />;
      case 'pending':
        return <Chip label="等待中" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getExchangeTypeChip = (type: string) => {
    switch (type) {
      case 'push':
        return <Chip icon={<ArrowUpwardIcon fontSize="small" />} label="推送" color="primary" size="small" variant="outlined" />;
      case 'pull':
        return <Chip icon={<ArrowDownwardIcon fontSize="small" />} label="拉取" color="secondary" size="small" variant="outlined" />;
      default:
        return <Chip label={type} size="small" variant="outlined" />;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">数据交换管理</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleOpenFilterDialog}
            sx={{ mr: 1 }}
          >
            筛选
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            刷新
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>交换总数</Typography>
              <Typography variant="h3">{mockStats.totalExchanges}</Typography>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <Chip label={`成功: ${mockStats.completedExchanges}`} size="small" color="success" sx={{ mr: 1 }} />
                <Chip label={`失败: ${mockStats.failedExchanges}`} size="small" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>成功率</Typography>
              <Typography variant="h3">{mockStats.successRate}%</Typography>
              <LinearProgress
                variant="determinate"
                value={mockStats.successRate}
                color={mockStats.successRate > 90 ? 'success' : mockStats.successRate > 70 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 5, mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>数据传输量</Typography>
              <Typography variant="h3">{mockStats.totalDataTransferred}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                平均传输速率: {mockStats.averageTransferRate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>当前状态</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Chip label={`进行中: ${mockStats.inProgressExchanges}`} color="primary" />
                <Chip label={`等待中: ${mockStats.pendingExchanges}`} color="default" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 数据交换记录表格 */}
      <Paper sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>资源名称</TableCell>
                    <TableCell>源连接器</TableCell>
                    <TableCell>目标连接器</TableCell>
                    <TableCell>交换类型</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell>开始时间</TableCell>
                    <TableCell>结束时间</TableCell>
                    <TableCell>数据大小</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <TableRow hover key={record.id}>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.resourceName}</TableCell>
                        <TableCell>{record.sourceConnector}</TableCell>
                        <TableCell>{record.targetConnector}</TableCell>
                        <TableCell>{getExchangeTypeChip(record.exchangeType)}</TableCell>
                        <TableCell>{getStatusChip(record.status)}</TableCell>
                        <TableCell>{record.startTime || '-'}</TableCell>
                        <TableCell>{record.endTime || '-'}</TableCell>
                        <TableCell>{record.dataSize}</TableCell>
                        <TableCell>
                          <Tooltip title="查看详情">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(record)}
                              color="primary"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {record.status === 'completed' && (
                            <Tooltip title="下载数据">
                              <IconButton size="small" color="primary">
                                <FileDownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={records.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每页行数:"
            />
          </>
        )}
      </Paper>

      {/* 详情对话框 */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>数据交换详情</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">状态</Typography>
                <Typography variant="body1" gutterBottom>{getStatusChip(selectedRecord.status)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">资源名称</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.resourceName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">资源类型</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.resourceType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">源连接器</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.sourceConnector}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">目标连接器</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.targetConnector}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">交换类型</Typography>
                <Typography variant="body1" gutterBottom>{getExchangeTypeChip(selectedRecord.exchangeType)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">数据大小</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.dataSize}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">开始时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.startTime || '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">结束时间</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.endTime || '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">传输速率</Typography>
                <Typography variant="body1" gutterBottom>{selectedRecord.transferRate}</Typography>
              </Grid>
              {selectedRecord.errorMessage && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="error">错误信息</Typography>
                  <Typography variant="body1" color="error" gutterBottom>{selectedRecord.errorMessage}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedRecord?.status === 'completed' && (
            <Button startIcon={<FileDownloadIcon />} color="primary">
              下载数据
            </Button>
          )}
          <Button onClick={handleCloseDetailsDialog}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 筛选对话框 */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>筛选数据交换记录</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">状态</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filters.status}
                  label="状态"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as string })}
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="completed">已完成</MenuItem>
                  <MenuItem value="failed">失败</MenuItem>
                  <MenuItem value="in_progress">进行中</MenuItem>
                  <MenuItem value="pending">等待中</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="exchange-type-filter-label">交换类型</InputLabel>
                <Select
                  labelId="exchange-type-filter-label"
                  value={filters.exchangeType}
                  label="交换类型"
                  onChange={(e) => setFilters({ ...filters, exchangeType: e.target.value as string })}
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="push">推送</MenuItem>
                  <MenuItem value="pull">拉取</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="连接器名称"
                value={filters.connector}
                onChange={(e) => setFilters({ ...filters, connector: e.target.value })}
                placeholder="搜索源或目标连接器"
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="开始日期"
                value={filters.startDate}
                onChange={(newValue) => setFilters({ ...filters, startDate: newValue })}                
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="结束日期"
                value={filters.endDate}
                onChange={(newValue) => setFilters({ ...filters, endDate: newValue })}                
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>重置</Button>
          <Button onClick={handleCloseFilterDialog}>取消</Button>
          <Button onClick={handleApplyFilters} variant="contained" color="primary">
            应用筛选
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataExchange;