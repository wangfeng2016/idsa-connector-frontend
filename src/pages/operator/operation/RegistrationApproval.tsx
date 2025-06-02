import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

interface RegistrationData {
  id: string;
  companyName: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  selected: boolean;
}

const RegistrationApproval: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([
    {
      id: '1',
      companyName: '东方航空股份有限公司',
      submissionDate: '2024-07-11 10:44:50',
      status: 'pending',
      selected: false,
    },
    {
      id: '2',
      companyName: '中航油料集团有限公司',
      submissionDate: '2024-07-11 10:44:50',
      status: 'pending',
      selected: false,
    },
    {
      id: '3',
      companyName: '携程旅行网络技术有限公司',
      submissionDate: '2024-07-11 10:44:50',
      status: 'pending',
      selected: false,
    },
    {
      id: '4',
      companyName: '海南航空控股股份有限公司',
      submissionDate: '2024-07-11 10:44:50',
      status: 'approved',
      selected: false,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);

  const handleSelectAll = (checked: boolean) => {
    setRegistrations(prev => 
      prev.map(reg => ({ ...reg, selected: checked }))
    );
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, selected: checked } : reg
      )
    );
  };

  const handleBatchApprove = () => {
    const selectedIds = registrations.filter(reg => reg.selected).map(reg => reg.id);
    setRegistrations(prev => 
      prev.map(reg => 
        selectedIds.includes(reg.id) ? { ...reg, status: 'approved', selected: false } : reg
      )
    );
  };

  const handleApprove = (id: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: 'approved' } : reg
      )
    );
  };

  const handleReject = (id: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: 'rejected' } : reg
      )
    );
  };

  const handleViewDetail = (registration: RegistrationData) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="待审核" size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }} />;
      case 'approved':
        return <Chip label="已通过" size="small" sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }} />;
      case 'rejected':
        return <Chip label="已拒绝" size="small" sx={{ backgroundColor: '#ffebee', color: '#d32f2f' }} />;
      default:
        return null;
    }
  };

  const getActionButtons = (registration: RegistrationData) => {
    if (registration.status === 'pending') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="text"
            size="small"
            sx={{ color: '#00bcd4', minWidth: 'auto', padding: '4px 8px' }}
            onClick={() => handleApprove(registration.id)}
          >
            待审批
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{ color: '#1976d2', minWidth: 'auto', padding: '4px 8px' }}
            onClick={() => handleViewDetail(registration)}
          >
            详情
          </Button>
        </Box>
      );
    } else if (registration.status === 'approved') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="text"
            size="small"
            sx={{ color: '#9e9e9e', minWidth: 'auto', padding: '4px 8px' }}
            disabled
          >
            审批通过
          </Button>
          <Button
            variant="text"
            size="small"
            sx={{ color: '#1976d2', minWidth: 'auto', padding: '4px 8px' }}
            onClick={() => handleViewDetail(registration)}
          >
            详情
          </Button>
        </Box>
      );
    }
    return null;
  };

  const filteredRegistrations = registrations.filter(reg => {
    if (filterStatus === 'all') return true;
    return reg.status === filterStatus;
  });

  const selectedCount = registrations.filter(reg => reg.selected).length;
  const allSelected = registrations.length > 0 && selectedCount === registrations.length;
  const someSelected = selectedCount > 0 && selectedCount < registrations.length;

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
        机构注册审核
      </Typography>

      {/* 操作栏 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        p: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            审批 / 注册登录
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#00bcd4',
              color: '#fff',
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: '#00acc1'
              }
            }}
            onClick={handleBatchApprove}
            disabled={selectedCount === 0}
          >
            批量通过
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>筛选条件</InputLabel>
            <Select
              value={filterStatus}
              label="筛选条件"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: '20px' }}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="pending">待审核</MenuItem>
              <MenuItem value="approved">已通过</MenuItem>
              <MenuItem value="rejected">已拒绝</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 表格 */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0f7fa' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ color: '#00bcd4' }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>照片</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>公司/用户</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>提交日期</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistrations.map((registration) => (
              <TableRow 
                key={registration.id}
                sx={{ 
                  '&:hover': { backgroundColor: '#f8f9fa' },
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={registration.selected}
                    onChange={(e) => handleSelectOne(registration.id, e.target.checked)}
                    sx={{ color: '#00bcd4' }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: '#e0e0e0',
                      border: '2px solid #f0f0f0'
                    }}
                  >
                    <BusinessIcon sx={{ color: '#999' }} />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {registration.companyName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {registration.submissionDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  {getActionButtons(registration)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 详情对话框 */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#00bcd4', color: '#fff' }}>
          机构注册详情
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRegistration && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="公司名称"
                value={selectedRegistration.companyName}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="提交日期"
                value={selectedRegistration.submissionDate}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">状态：</Typography>
                {getStatusChip(selectedRegistration.status)}
              </Box>
              <TextField
                label="备注"
                multiline
                rows={4}
                fullWidth
                placeholder="请输入审核备注..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            取消
          </Button>
          {selectedRegistration?.status === 'pending' && (
            <>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
                onClick={() => {
                  if (selectedRegistration) {
                    handleReject(selectedRegistration.id);
                    setDetailDialogOpen(false);
                  }
                }}
              >
                拒绝
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                onClick={() => {
                  if (selectedRegistration) {
                    handleApprove(selectedRegistration.id);
                    setDetailDialogOpen(false);
                  }
                }}
              >
                通过
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrationApproval;