# Frontend Assignment - React Component Library

A modern React project built with **Vite**, **TypeScript**, **Tailwind CSS**, and **Vitest**, featuring reusable UI components like `InputField` and `DataTable`. This project includes a fully tested component library and serves as a starting point for building scalable React applications.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Component Documentation](#component-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Demo

You can run the project locally to explore all the components and their functionalities, including:

- Interactive `InputField` with variants, sizes, states, and accessibility features.
- `DataTable` component with sorting, selection, and custom rendering.

---

## Features

- **Reusable Components**: `InputField`, `DataTable`, and more.  
- **Variants & Sizes**: Different styles and layouts for UI flexibility.  
- **Accessibility (ARIA)**: Fully accessible components.  
- **Dark Mode Support**: Styled for light/dark themes.  
- **Unit Testing**: Fully tested using **Vitest** and **@testing-library/react**.  
- **Interactive Features**: Password toggle, clear buttons, row selection, sorting.  

---

## Technologies Used

- **React 18**  
- **TypeScript**  
- **Vite** (Build Tool)  
- **Tailwind CSS** (Utility-first CSS)  
- **Vitest** (Unit Testing)  
- **@testing-library/react** (Testing utilities)  
- **Jest-DOM** (DOM matchers)  

---

## Getting Started

### Prerequisites

Make sure you have **Node.js (v16 or higher)** and **pnpm/npm/yarn** installed.

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend-assignment

# Install dependencies
pnpm install
# or
npm install
# or
yarn install
Development Server
# Start the development server
pnpm dev
# or
npm run dev
# or
yarn dev
Open http://localhost:5173 to view the application in the browser.
Available Scripts
Command	Description
pnpm dev	Starts the development server
pnpm build	Builds the app for production
pnpm preview	Previews the production build
pnpm test	Runs the test suite
pnpm test:watch	Runs tests in watch mode
pnpm test:coverage	Runs tests with coverage report
Testing
This project uses Vitest and React Testing Library for comprehensive testing.
Running Tests
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
Test Coverage
The project includes 33 comprehensive tests:
InputField: 23 tests covering all variants, states, and interactions
DataTable: 10 tests covering sorting, selection, and edge cases
Folder Structure
src/
├── Components/
│   ├── InputField/
│   │   ├── InputField.tsx          # Main component
│   │   ├── InputField.test.tsx     # Component tests
│   │   └── index.ts                # Component export
│   └── DataTable/
│       ├── DataTable.tsx           # Main component
│       ├── DataTable.test.tsx      # Component tests
│       └── index.ts                # Component export
├── types/                          # TypeScript type definitions
├── utils/                          # Utility functions
└── App.tsx                         # Main application component
Component Documentation
InputField Component
A flexible input component with validation states, multiple variants, and accessibility features.
import InputField from './Components/InputField/InputField';

// Basic usage
<InputField
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With validation
<InputField
  label="Password"
  type="password"
  errorMessage="Password must be at least 8 characters"
  invalid={true}
/>

// With clear button
<InputField
  value={searchTerm}
  onChange={setSearchTerm}
  showClearButton
  placeholder="Search..."
/>
DataTable Component
A powerful data table component with sorting, selection, and responsive design.
import DataTable from './Components/DataTable/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: false },
];

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

<DataTable
  data={users}
  columns={columns}
  selectable={true}
  onRowSelect={(selectedRows) => console.log(selectedRows)}
  loading={false}
/>
Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Please ensure all tests pass and add tests for any new functionality.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments
Icons provided by Lucide React
Built with Vite
Styled with Tailwind CSS
Tested with Vitest
Built with ❤️ using React, TypeScript, and TailwindCSS