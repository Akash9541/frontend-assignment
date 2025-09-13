import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2, Search, FileX } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
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

type SortOrder = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  order: SortOrder;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className = '',
  emptyMessage = 'No data available',
  showSearch = false,
  searchPlaceholder = 'Search...',
  pageSize,
  rowKey = 'id'
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortState, setSortState] = useState<SortState>({ key: null, order: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter(record =>
      columns.some(column => {
        const value = record[column.dataIndex];
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.order) return filteredData;

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[column.dataIndex];
      const bVal = b[column.dataIndex];
      
      // Handle null/undefined values
      if (aVal == null) return sortState.order === 'asc' ? -1 : 1;
      if (bVal == null) return sortState.order === 'asc' ? 1 : -1;
      
      // Compare values
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortState.order === 'asc' ? comparison : -comparison;
      }
      
      if (aVal < bVal) return sortState.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortState.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortState, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pageSize) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(prev => {
      if (prev.key !== column.key) {
        return { key: column.key, order: 'asc' };
      }
      if (prev.order === 'asc') {
        return { key: column.key, order: 'desc' };
      }
      return { key: null, order: null };
    });
  };

  // Handle row selection
  const handleRowSelect = (record: T, checked: boolean, index: number) => {
    const key = getRowKey(record, index);
    const newSelected = new Set(selectedRows);

    if (checked) newSelected.add(key);
    else newSelected.delete(key);

    setSelectedRows(newSelected);

    if (onRowSelect) {
      const selectedData = data.filter((item, idx) => newSelected.has(getRowKey(item, idx)));
      onRowSelect(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(paginatedData.map((record, index) => getRowKey(record, index)));
      setSelectedRows(allKeys);
      if (onRowSelect) {
        onRowSelect(paginatedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onRowSelect) {
        onRowSelect([]);
      }
    }
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every((record, index) => selectedRows.has(getRowKey(record, index)));
  
  const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

  // Pagination info
  const totalPages = pageSize ? Math.ceil(sortedData.length / pageSize) : 1;
  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : 1;
  const endItem = pageSize ? Math.min(currentPage * pageSize, sortedData.length) : sortedData.length;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header with search */}
      {showSearch && (
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table header */}
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {selectable && (
                <th className="w-12 px-6 py-4 text-left">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      aria-label="Select all rows"
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 transition-all duration-200
                      flex items-center justify-center
                      ${isAllSelected || isIndeterminate
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                      }
                    `}>
                      {(isAllSelected || isIndeterminate) && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {isIndeterminate ? (
                            <rect x="4" y="9" width="12" height="2" />
                          ) : (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </label>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100
                    ${column.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 select-none' : ''}
                    ${column.width ? `w-[${column.width}]` : ''}
                  `}
                  onClick={() => column.sortable && handleSort(column)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 -mb-1 transition-colors ${
                            sortState.key === column.key && sortState.order === 'asc'
                              ? 'text-blue-600' 
                              : 'text-slate-400'
                          }`}
                        />
                        <ChevronDown 
                          className={`w-3 h-3 transition-colors ${
                            sortState.key === column.key && sortState.order === 'desc'
                              ? 'text-blue-600' 
                              : 'text-slate-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="animate-spin" role="img" aria-label="Loading" />
                    <span className="text-slate-500 dark:text-slate-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <FileX className="w-12 h-12 text-slate-400" />
                    <div className="text-slate-500 dark:text-slate-400">
                      <p className="font-medium">{emptyMessage}</p>
                      {searchQuery && (
                        <p className="text-sm mt-1">Try adjusting your search criteria</p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.has(key);
                
                return (
                  <tr
                    key={key}
                    className={`
                      transition-colors duration-150
                      hover:bg-slate-50 dark:hover:bg-slate-800/50
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                    `}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleRowSelect(record, e.target.checked, index)}
                            className="sr-only"
                          />
                          <div className={`
                            w-5 h-5 rounded border-2 transition-all duration-200
                            flex items-center justify-center
                            ${isSelected
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                            }
                          `}>
                            {isSelected && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td 
                        key={`${key}-${column.key}`}
                        className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100"
                      >
                        {column.render 
                          ? column.render(record[column.dataIndex], record, index)
                          : String(record[column.dataIndex] ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-700 dark:text-slate-300">
            Showing <span className="font-semibold">{startItem}</span> to{' '}
            <span className="font-semibold">{endItem}</span> of{' '}
            <span className="font-semibold">{sortedData.length}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                      ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Selection info */}
      {selectable && selectedRows.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => {
                setSelectedRows(new Set());
                if (onRowSelect) onRowSelect([]);
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;