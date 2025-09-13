import React, { useState } from 'react';
import { InputField, DataTable } from './Components';
import type { Column } from './Components';
import './index.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

function App() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for each InputField
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorExample, setErrorExample] = useState('');

  // Sample data
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'active',
      joinDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Viewer',
      status: 'inactive',
      joinDate: '2023-03-10'
    }
  ];

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Admin' 
            ? 'bg-purple-100 text-purple-800'
            : value === 'Editor'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
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
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      dataIndex: 'joinDate',
      sortable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            React Components Demo
          </h1>
          <p className="text-gray-600">
            InputField and DataTable components showcase
          </p>
        </div>

        <div className="space-y-12">
          {/* InputField Demo */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              InputField Component
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                helperText="This will be displayed on your profile"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                showClearButton
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputField
                label="Error Example"
                placeholder="This field has an error"
                invalid
                errorMessage="This field is required"
                value={errorExample}
                onChange={(e) => setErrorExample(e.target.value)}
              />
            </div>
          </section>

          {/* DataTable Demo */}
          <section className="bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                DataTable Component
              </h2>
              <button
                onClick={() => setLoading(!loading)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {loading ? 'Stop Loading' : 'Show Loading'}
              </button>
            </div>

            <DataTable
              data={users}
              columns={columns}
              loading={loading}
              selectable
              onRowSelect={setSelectedUsers}
              rowKey="id"
            />

            {selectedUsers.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Selected Users: {selectedUsers.map(u => u.name).join(', ')}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
