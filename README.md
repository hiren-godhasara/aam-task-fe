# Vite React TypeScript Starter

This is a minimal starter template for building React applications with TypeScript using Vite.

## 🚀 Features

* ⚡ Fast build and development with [Vite](https://vitejs.dev/)
* ⚛️ React 18
* 🛠 TypeScript
* 💨 Tailwind CSS for utility-first styling
* 🔍 ESLint for linting

## 📦 Tech Stack

* **Vite** for frontend tooling
* **React** 18 for UI
* **TypeScript** for static typing
* **Tailwind CSS** for styling
* **ESLint** with React plugins

## 📂 Host URL FOR DEMO

```bash
https://aam.hiren.work
```

## 🛠 Scripts

| Script    | Description                           |
| --------- | ------------------------------------- |
| `dev`     | Start development server on port 3131 |
| `build`   | Build the application                 |
| `preview` | Preview the production build          |
| `lint`    | Run ESLint to check code quality      |

## 🧾 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hiren-godhasara/aam-task-fe.git
cd aam-task-fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

### 6. Lint the Project

```bash
npm run lint
```

## 🧩 Functional Documentation

### 🎯 Objective

Develop a dynamic, board-style task management interface where users can efficiently manage and interact with boards, groups, columns, and rows.

### 🧪 Tech Requirements

* **React.js** (required)
* Functional components with hooks
* Optional tools:

  * **TypeScript** for type safety
  * **TailwindCSS** for UI styling
  * **Redux** or **Context API** for state management
  * **localStorage** or a mock API for data persistence

### 🔍 Feature Overview

#### 1. Board Management

* ✅ Create new boards
* ✏️ Rename existing boards
* 🗑️ Delete boards

#### 2. Group Management

* ➕ Add groups within a board
* ✏️ Rename groups
* 🗑️ Delete groups
* 🔀 Groups are **drag-and-drop sortable** for easy organization

#### 3. Column Management

* ➕ Add or ➖ remove columns
* 📊 Supported column types:

  * **Text**: Free-form text input
  * **Number**: Numeric input only
  * **Dropdown**: Select from predefined values
  * **Status**: Selectable labels (e.g., To Do, In Progress, Done)

#### 4. Row (Item) Management

* ➕ Create rows (representing tasks or items)
* ✏️ Edit row content inline
* 🗑️ Delete rows

#### 5. Cell Editing

* 🔤 **Text**: Direct text input
* 🔢 **Number**: Editable number field
* 🔽 **Dropdown**: Choose from options
* 🎯 **Status**: Color-coded or styled status options (e.g., badges or chips)

## 📄 License

This project is licensed under the MIT License.
