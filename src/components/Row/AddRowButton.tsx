import { Plus } from 'lucide-react';
import { useBoardContext } from '../../context/BoardContext';
import { Button } from '../UI/Button';

interface AddRowButtonProps {
  groupId: string;
  colSpan: number;
}

export const AddRowButton: React.FC<AddRowButtonProps> = ({ groupId, colSpan }) => {
  const { activeBoard, addRow } = useBoardContext();

  const handleAddRow = () => {
    if (activeBoard) {
      addRow(activeBoard.id, groupId);
    }
  };

  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-4">
        <Button
          variant="ghost"
          onClick={handleAddRow}
          className="w-full justify-center text-slate-500 hover:text-slate-700 hover:bg-white/60 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-all duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add Row
        </Button>
      </td>
    </tr>
  );
};