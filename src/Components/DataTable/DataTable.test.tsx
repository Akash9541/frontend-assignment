import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DataTable from './DataTable';

describe('DataTable', () => {
  interface TestData {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  const testData: TestData[] = [
    { id: 1, name: 'Vishavjeet Singh', email: 'vishav@example.com', role: 'Admin' },
    { id: 2, name: 'Akash Thakur', email: 'akash@example.com', role: 'Editor' },
    { id: 3, name: 'Vinay Thakur', email: 'vinay@example.com', role: 'Viewer' },
  ];

  const testColumns = [
    { key: 'name', title: 'Name', dataIndex: 'name' as keyof TestData, sortable: true },
    { key: 'email', title: 'Email', dataIndex: 'email' as keyof TestData, sortable: true },
    { key: 'role', title: 'Role', dataIndex: 'role' as keyof TestData, sortable: false },
  ];

  it('renders table with data', () => {
    render(<DataTable data={testData} columns={testColumns} rowKey="id" />);

    expect(screen.getByText('Vishavjeet Singh')).toBeInTheDocument();
    expect(screen.getByText('vishav@example.com')).toBeInTheDocument();
    expect(screen.getByText('Viewer')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={testData} columns={testColumns} rowKey="id" loading={true} />);

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={testColumns} rowKey="id" />);

    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('sorts data when column header is clicked', async () => {
    const user = userEvent.setup();
    render(<DataTable data={testData} columns={testColumns} rowKey="id" />);

    const nameHeader = screen.getByText('Name');

    // Click to sort ascending
    await user.click(nameHeader);
    const rowsAsc = screen.getAllByRole('row');
    
    // Check the first data row (skip header row)
    const firstRowCells = within(rowsAsc[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('Akash Thakur'); // ascending (A comes first)
    
    const secondRowCells = within(rowsAsc[2]).getAllByRole('cell');
    expect(secondRowCells[0]).toHaveTextContent('Vinay Thakur'); // V comes next
    
    const thirdRowCells = within(rowsAsc[3]).getAllByRole('cell');
    expect(thirdRowCells[0]).toHaveTextContent('Vishavjeet Singh'); // V comes next, but Vishavjeet after Vinay

    // Click to sort descending
    await user.click(nameHeader);
    const rowsDesc = screen.getAllByRole('row');
    
    const firstRowCellsDesc = within(rowsDesc[1]).getAllByRole('cell');
    expect(firstRowCellsDesc[0]).toHaveTextContent('Vishavjeet Singh'); // descending (V comes first)
    
    const secondRowCellsDesc = within(rowsDesc[2]).getAllByRole('cell');
    expect(secondRowCellsDesc[0]).toHaveTextContent('Vinay Thakur'); // V comes next
    
    const thirdRowCellsDesc = within(rowsDesc[3]).getAllByRole('cell');
    expect(thirdRowCellsDesc[0]).toHaveTextContent('Akash Thakur'); // A comes last
  });

  it('handles row selection when selectable', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <DataTable
        data={testData}
        columns={testColumns}
        rowKey="id"
        selectable={true}
        onRowSelect={handleSelect}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // Select first row

    expect(handleSelect).toHaveBeenCalledWith([testData[0]]);
  });

  it('handles select all', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <DataTable
        data={testData}
        columns={testColumns}
        rowKey="id"
        selectable={true}
        onRowSelect={handleSelect}
      />
    );

    const selectAll = screen.getByLabelText(/select all rows/i);
    await user.click(selectAll);

    expect(handleSelect).toHaveBeenCalledWith(testData);
  });

  it('shows selection count when rows are selected', async () => {
    const user = userEvent.setup();

    render(
      <DataTable
        data={testData}
        columns={testColumns}
        rowKey="id"
        selectable={true}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    expect(screen.getByText(/1 row selected/i)).toBeInTheDocument();
  });

  it('uses custom row key function', () => {
    const customData = testData.map(item => ({ ...item, customId: `custom-${item.id}` }));

    render(
      <DataTable
        data={customData}
        columns={testColumns}
        rowKey="id"
      />
    );

    expect(screen.getByText('Vishavjeet Singh')).toBeInTheDocument();
  });

  it('renders custom cell content', () => {
    const columnsWithRender = [
      {
        key: 'role',
        title: 'Role',
        dataIndex: 'role' as keyof TestData,
        render: (value: string) => <span className="badge">{value}</span>
      }
    ];

    render(<DataTable data={testData} columns={columnsWithRender} rowKey="id" />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    const { container } = render(
      <DataTable data={testData} columns={testColumns} rowKey="id" className="custom-table" />
    );

    expect(container.firstChild).toHaveClass('custom-table');
  });
});