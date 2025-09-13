// Put your shared types here
export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  status?: 'active' | 'inactive';
  joinDate?: string;
  lastLogin?: string;
};

// Add more shared types as needed
export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type SortOrder = 'asc' | 'desc' | null;

// Export this to make it a module
export {};