# Org Hierarchy Manager

A React-based organization hierarchy management system that allows you to visualize and manage your organization's structure.

## Features

- Hire and manage organization owners
- Hire and fire employees
- Visualize organization hierarchy in a tree structure
- Real-time updates with toast notifications
- Interactive tree visualization with zoom and pan controls

## Tech Stack

- React + TypeScript
- Vite
- react-d3-tree for hierarchy visualization
- Sonner for toast notifications
- Tailwind CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

The application connects to a backend server running at `http://localhost:8080/api` with the following endpoints:

- `GET /toJson` - Fetch the current organization hierarchy
- `POST /hireOwner` - Hire a new owner
- `POST /hireEmployee` - Hire a new employee under a boss
- `DELETE /fireEmployee/:id` - Fire an employee
- `POST /reset` - Reset the organization structure

## Usage

1. **Hire Owner**: Enter the owner ID and click "Hire Owner"
2. **Hire Employee**: Enter both employee ID and boss ID, then click "Hire Employee"
3. **Fire Employee**: Enter employee ID and click "Fire Employee"
4. **View Hierarchy**: Click "Get Hierarchy" to visualize the current structure
5. **Reset**: Click "Reset Organization" to clear all data

## Development

This project uses Vite for development with HMR (Hot Module Replacement) support. The project structure follows standard React + TypeScript conventions with additional UI components from a custom component library.
