import { createContext, useContext, useEffect, useState } from 'react';
import { Board, BoardContextType, Group, Column, Row } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};

const defaultColumns: Column[] = [
  { id: '1', title: 'Title', type: 'text', width: 200 },
  { id: '2', title: 'Seller', type: 'text', width: 200 },
  { id: '3', title: 'Buyer', type: 'text', width: 200 },
  { id: '4', title: 'Status', type: 'status', options: ['To Do', 'In Progress', 'Done'], width: 120 },
  { id: '5', title: 'Priority', type: 'dropdown', options: ['Low', 'Medium', 'High'], width: 100 },
];

const createDefaultBoard = (): Board => ({
  id: crypto.randomUUID(),
  title: 'My Board',
  groups: [
    {
      id: crypto.randomUUID(),
      title: 'Main Tasks',
      columns: defaultColumns,
      rows: [],
      isCollapsed: false,
      order: 0,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useLocalStorage<Board[]>('taskBoards', [createDefaultBoard()]);
  const [activeBoard, setActiveBoardState] = useState<Board | null>(null);

  useEffect(() => {
    if (boards.length > 0 && !activeBoard) {
      setActiveBoardState(boards[0]);
    }
  }, [boards, activeBoard]);

  const setActiveBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setActiveBoardState(board);
    }
  };

  const createBoard = (title: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title,
      groups: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardState(newBoard);
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    ));
    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteBoard = (boardId: string) => {
    setBoards(prev => prev.filter(board => board.id !== boardId));
    if (activeBoard?.id === boardId) {
      const remaining = boards.filter(board => board.id !== boardId);
      setActiveBoardState(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const createGroup = (boardId: string, title: string) => {
    const board = boards.find(b => b.id === boardId);
    const newOrder = board ? board.groups.length : 0;

    const newGroup: Group = {
      id: crypto.randomUUID(),
      title,
      columns: [...defaultColumns],
      rows: [],
      isCollapsed: false,
      order: newOrder,
    };

    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? { ...board, groups: [...board.groups, newGroup], updatedAt: new Date() }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: [...prev.groups, newGroup],
        updatedAt: new Date()
      } : null);
    }
  };

  const updateGroup = (boardId: string, groupId: string, updates: Partial<Group>) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId ? { ...group, ...updates } : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId ? { ...group, ...updates } : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const deleteGroup = (boardId: string, groupId: string) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.filter(group => group.id !== groupId),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.filter(group => group.id !== groupId),
        updatedAt: new Date()
      } : null);
    }
  };

  const reorderGroups = (boardId: string, sourceIndex: number, destinationIndex: number) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;

      const newGroups = [...board.groups];
      const [movedGroup] = newGroups.splice(sourceIndex, 1);
      newGroups.splice(destinationIndex, 0, movedGroup);

      // Update order property for all groups
      const reorderedGroups = newGroups.map((group, index) => ({
        ...group,
        order: index
      }));

      return {
        ...board,
        groups: reorderedGroups,
        updatedAt: new Date()
      };
    }));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => {
        if (!prev) return null;

        const newGroups = [...prev.groups];
        const [movedGroup] = newGroups.splice(sourceIndex, 1);
        newGroups.splice(destinationIndex, 0, movedGroup);

        const reorderedGroups = newGroups.map((group, index) => ({
          ...group,
          order: index
        }));

        return {
          ...prev,
          groups: reorderedGroups,
          updatedAt: new Date()
        };
      });
    }
  };

  // const addColumn = (boardId: string, groupId: string, column: Column,) => {
  //   const newColumn: Column = {
  //     ...column,

  //   };

  //   setBoards(prev => prev.map(board =>
  //     board.id === boardId
  //       ? {
  //         ...board,
  //         groups: board.groups.map(group =>
  //           group.id === groupId
  //             ? { ...group, columns: [...group.columns, newColumn] }
  //             : group
  //         ),
  //         updatedAt: new Date()
  //       }
  //       : board
  //   ));

  //   if (activeBoard?.id === boardId) {
  //     setActiveBoardState(prev => prev ? {
  //       ...prev,
  //       groups: prev.groups.map(group =>
  //         group.id === groupId
  //           ? { ...group, columns: [...group.columns, newColumn] }
  //           : group
  //       ),
  //       updatedAt: new Date()
  //     } : null);
  //   }
  // };


  const addColumn = (boardId: string, groupId: string, column: Column) => {
    const newColumn: Column = { ...column };

    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                columns: [...group.columns, newColumn],
                rows: group.rows.map(row => ({
                  ...row,
                  cells: [
                    ...row.cells,
                    {
                      columnId: newColumn.id,
                      value: newColumn.type === 'number' ? 0 : ''
                    }
                  ]
                }))
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              columns: [...group.columns, newColumn],
              rows: group.rows.map(row => ({
                ...row,
                cells: [
                  ...row.cells,
                  {
                    columnId: newColumn.id,
                    value: newColumn.type === 'number' ? 0 : ''
                  }
                ]
              }))
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };


  const updateColumn = (boardId: string, groupId: string, columnId: string, updates: Partial<Column>) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                columns: group.columns.map(col =>
                  col.id === columnId ? { ...col, ...updates } : col
                )
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              columns: group.columns.map(col =>
                col.id === columnId ? { ...col, ...updates } : col
              )
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const deleteColumn = (boardId: string, groupId: string, columnId: string) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                columns: group.columns.filter(col => col.id !== columnId),
                rows: group.rows.map(row => ({
                  ...row,
                  cells: row.cells.filter(cell => cell.columnId !== columnId)
                }))
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              columns: group.columns.filter(col => col.id !== columnId),
              rows: group.rows.map(row => ({
                ...row,
                cells: row.cells.filter(cell => cell.columnId !== columnId)
              }))
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const addRow = (boardId: string, groupId: string) => {
    const group = activeBoard?.groups.find(g => g.id === groupId);
    if (!group) return;

    const newRow: Row = {
      id: crypto.randomUUID(),
      cells: group.columns.map(col => ({
        columnId: col.id,
        value: col.type === 'number' ? 0 : ''
      }))
    };

    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? { ...group, rows: [...group.rows, newRow] }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? { ...group, rows: [...group.rows, newRow] }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const updateRow = (boardId: string, groupId: string, rowId: string, updates: Partial<Row>) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                rows: group.rows.map(row =>
                  row.id === rowId ? { ...row, ...updates } : row
                )
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              rows: group.rows.map(row =>
                row.id === rowId ? { ...row, ...updates } : row
              )
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const deleteRow = (boardId: string, groupId: string, rowId: string) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? { ...group, rows: group.rows.filter(row => row.id !== rowId) }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? { ...group, rows: group.rows.filter(row => row.id !== rowId) }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const addCell = (boardId: string, groupId: string, columnId: string, defaultValue: string | number = '') => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                rows: group.rows.map(row => ({
                  ...row,
                  cells: [...row.cells, { columnId, value: defaultValue }]
                }))
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              rows: group.rows.map(row => ({
                ...row,
                cells: [...row.cells, { columnId, value: defaultValue }]
              }))
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };


  const updateCell = (boardId: string, groupId: string, rowId: string, columnId: string, value: string | number) => {
    setBoards(prev => prev.map(board =>
      board.id === boardId
        ? {
          ...board,
          groups: board.groups.map(group =>
            group.id === groupId
              ? {
                ...group,
                rows: group.rows.map(row =>
                  row.id === rowId
                    ? {
                      ...row,
                      cells: row.cells.map(cell => {
                        return cell.columnId === columnId
                          ? { ...cell, value }
                          : cell
                      }
                      )
                    }
                    : row
                )
              }
              : group
          ),
          updatedAt: new Date()
        }
        : board
    ));

    if (activeBoard?.id === boardId) {
      setActiveBoardState(prev => prev ? {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? {
              ...group,
              rows: group.rows.map(row =>
                row.id === rowId
                  ? {
                    ...row,
                    cells: row.cells.map(cell =>
                      cell.columnId === columnId
                        ? { ...cell, value }
                        : cell
                    )
                  }
                  : row
              )
            }
            : group
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const value: BoardContextType = {
    boards,
    activeBoard,
    setActiveBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    createGroup,
    updateGroup,
    deleteGroup,
    reorderGroups,
    addColumn,
    updateColumn,
    deleteColumn,
    addRow,
    updateRow,
    deleteRow,
    addCell,
    updateCell,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};