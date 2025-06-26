export interface Column {
  id: string;
  title: string;
  type: 'text' | 'number' | 'dropdown' | 'status';
  options?: string[]; // For dropdown and status columns
  width?: number;
}

export interface Cell {
  columnId: string;
  value: string | number;
}

export interface Row {
  id: string;
  cells: Cell[];
}

export interface Group {
  id: string;
  title: string;
  columns: Column[];
  rows: Row[];
  isCollapsed?: boolean;
  order?: number;
}

export interface Board {
  id: string;
  title: string;
  groups: Group[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardContextType {
  boards: Board[];
  activeBoard: Board | null;
  setActiveBoard: (boardId: string) => void;
  createBoard: (title: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  createGroup: (boardId: string, title: string) => void;
  updateGroup: (boardId: string, groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (boardId: string, groupId: string) => void;
  reorderGroups: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  addColumn: (boardId: string, groupId: string, column: Column) => void;
  updateColumn: (boardId: string, groupId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, groupId: string, columnId: string) => void;
  addRow: (boardId: string, groupId: string) => void;
  addCell: (boardId: string, groupId: string, rowId: string, columnId: string) => void;
  updateRow: (boardId: string, groupId: string, rowId: string, updates: Partial<Row>) => void;
  deleteRow: (boardId: string, groupId: string, rowId: string) => void;
  updateCell: (boardId: string, groupId: string, rowId: string, columnId: string, value: string | number) => void;
}