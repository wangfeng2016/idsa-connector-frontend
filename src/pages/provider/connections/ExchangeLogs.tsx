import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';

// 模拟数据交换日志数据
const rows = [
  { id: 1, timestamp: '2024-01-20 10:30:00', type: '数据请求', status: '成功', source: 'Connector A', target: 'Connector B', details: '请求资源XYZ' },
  { id: 2, timestamp: '2024-01-20 11:15:00', type: '数据传输', status: '成功', source: 'Connector B', target: 'Connector A', details: '传输资源XYZ' },
  { id: 3, timestamp: '2024-01-20 14:20:00', type: '数据请求', status: '失败', source: 'Connector C', target: 'Connector A', details: '连接超时' },
  // 更多模拟数据...
];

// 定义列配置
const columns = [
  { field: 'timestamp', headerName: '时间', width: 180 },
  { field: 'type', headerName: '交换类型', width: 120 },
  { field: 'status', headerName: '状态', width: 100 },
  { field: 'source', headerName: '源连接器', width: 150 },
  { field: 'target', headerName: '目标连接器', width: 150 },
  { field: 'details', headerName: '详细信息', width: 200 },
];

const ExchangeLogs: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          数据交换日志
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeLogs;