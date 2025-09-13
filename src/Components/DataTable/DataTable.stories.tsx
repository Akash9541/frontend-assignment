import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DataTable from './DataTable';

// Define the types inline since they need to match your DataTable component
interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  rowKey?: keyof T | ((record: T) => string | number);
}

export default {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen', // Changed from 'centered' for better table display
    docs: {
      description: {
        component: 'A modern, feature-rich data table component with sorting, selection, and search capabilities.'
      }
    }
  },
  argTypes: {
    loading: { control: 'boolean' },
    selectable: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    pageSize: { control: 'number' },
    emptyMessage: { control: 'text' },
  },
} as Meta<typeof DataTable>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const sampleData: User[] = [
  { id: 1, name: 'Akash Sharma', email: 'akash@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Vishasv Patel', email: 'vishasv@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Vinay Kumar', email: 'vinay@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'Athrav Singh', email: 'athrav@example.com', role: 'Editor', status: 'active' },
  { id: 5, name: 'Ram Gupta', email: 'ram@example.com', role: 'Admin', status: 'active' },
  { id: 6, name: 'Priya Shah', email: 'priya@example.com', role: 'Viewer', status: 'active' },
  { id: 7, name: 'Karan Mehta', email: 'karan@example.com', role: 'Editor', status: 'inactive' },
  { id: 8, name: 'Neha Joshi', email: 'neha@example.com', role: 'Admin', status: 'active' }
];

const columns: Column<User>[] = [
  { 
    key: 'name', 
    title: 'Name', 
    dataIndex: 'name', 
    sortable: true, 
    width: '200px',
    render: (value: string, record: User) => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
          {value.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="font-medium">{value}</span>
      </div>
    )
  },
  { 
    key: 'email', 
    title: 'Email', 
    dataIndex: 'email', 
    sortable: true, 
    width: '250px',
    render: (value: string) => (
      <span className="text-slate-600 dark:text-slate-400">{value}</span>
    )
  },
  { 
    key: 'role', 
    title: 'Role', 
    dataIndex: 'role', 
    sortable: true,
    width: '120px',
    render: (value: string) => (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
        value === 'Admin' 
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
          : value === 'Editor'
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
      }`}>
        {value}
      </span>
    )
  },
  { 
    key: 'status', 
    title: 'Status', 
    dataIndex: 'status', 
    sortable: true,
    width: '120px',
    render: (value: string) => (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          value === 'active' ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        }`}>
          {value}
        </span>
      </div>
    )
  }
];

const Template: StoryFn<DataTableProps<User>> = (args) => {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            User Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your team members and their roles
          </p>
        </div>

        <DataTable
          {...args}
          onRowSelect={setSelectedRows}
        />
        
        {selectedRows.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Selected: {selectedRows.length} user{selectedRows.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedRows.slice(0, 3).map(user => (
                  <span key={user.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md font-medium">
                    {user.name}
                  </span>
                ))}
                {selectedRows.length > 3 && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-md font-medium">
                    +{selectedRows.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: sampleData,
  columns,
  rowKey: 'id'
};

export const WithSelection = Template.bind({});
WithSelection.args = {
  data: sampleData,
  columns,
  rowKey: 'id',
  selectable: true
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  data: sampleData,
  columns,
  rowKey: 'id',
  selectable: true,
  showSearch: true,
  searchPlaceholder: 'Search users...'
};

export const WithPagination = Template.bind({});
WithPagination.args = {
  data: sampleData,
  columns,
  rowKey: 'id',
  selectable: true,
  showSearch: true,
  pageSize: 5
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  data: sampleData,
  columns,
  rowKey: 'id',
  loading: true,
  selectable: true
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  data: [],
  columns,
  rowKey: 'id',
  emptyMessage: 'No users found. Try adding some team members!',
  showSearch: true
};

export const BasicTable = Template.bind({});
BasicTable.args = {
  data: sampleData.slice(0, 3),
  columns: columns.slice(0, 2),
  rowKey: 'id',
  selectable: false
};

// Interactive demo with all features
export const AllFeatures = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  const handleLoadingToggle = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Interactive DataTable Demo
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Test all features and interactions
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLoadingToggle}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Trigger Loading</span>
            )}
          </button>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Search</span>
          </label>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Page Size:
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={0}>No pagination</option>
            </select>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Selected Users ({selectedUsers.length})
              </h3>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  <span>{user.name}</span>
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span className="text-xs opacity-75">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DataTable
          data={sampleData}
          columns={columns}
          rowKey="id"
          loading={loading}
          selectable={true}
          showSearch={showSearch}
          searchPlaceholder="Search by name, email, or role..."
          pageSize={pageSize || undefined}
          onRowSelect={setSelectedUsers}
          emptyMessage="No team members found. Start by adding some users!"
        />
      </div>
    </div>
  );
};
