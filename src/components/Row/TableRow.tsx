import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Row, Column } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { ColumnCell } from '../Column/ColumnCell';
import { Button } from '../UI/Button';

interface TableRowProps {
  row: Row;
  columns: Column[];
  groupId: string;
  isEven?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ row, columns, groupId, isEven }) => {
  const { activeBoard, updateCell, deleteRow } = useBoardContext();
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const getCellValue = (columnId: string) => {
    const cell = row.cells.find(c => c.columnId === columnId);
    return cell?.value || '';
  };

  const handleCellChange = (columnId: string, value: string | number) => {
    if (activeBoard) {
      updateCell(activeBoard.id, groupId, row.id, columnId, value);
    }
  };

  const handleDeleteRow = () => {
    if (activeBoard) {
      deleteRow(activeBoard.id, groupId, row.id);
    }
  };

  return (
    <tr className={`hover:bg-white/80 group transition-all duration-200 ${isEven ? 'bg-white/20' : 'bg-transparent'}`}>
      {columns.map((column: Column) => (
        <td
          key={column.id}
          className="px-4 py-3 border-r border-slate-200/50 align-top"
          style={{ width: column.width || 'auto' }}
        >
          <ColumnCell
            column={column}
            value={getCellValue(column.id)}
            onChange={(value) => handleCellChange(column.id, value)}
            isEditing={editingCell === column.id}
            onEditingChange={(editing) => setEditingCell(editing ? column.id : null)}
          />
        </td>
      ))}
      <td className="px-4 py-3 w-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteRow}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </Button>
      </td>
    </tr>
  );
};