import { useState, useEffect } from 'react';
import { Column } from '../../types';

interface ColumnCellProps {
  column: Column;
  value: string | number;
  onChange: (value: string | number) => void;
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
}

export const ColumnCell: React.FC<ColumnCellProps> = ({
  column,
  value,
  onChange,
  isEditing,
  onEditingChange,
}) => {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (column.type === 'number') {
      const numValue = Number(editValue);
      onChange(isNaN(numValue) ? 0 : numValue);
    } else {
      onChange(editValue);
    }
    onEditingChange(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    onEditingChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'To Do': 'bg-slate-100 text-slate-700 border-slate-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'Done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Low': 'bg-slate-100 text-slate-700 border-slate-200',
      'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
      'High': 'bg-red-100 text-red-700 border-red-200',
    };
    return statusColors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (isEditing) {
    if (column.type === 'dropdown' || column.type === 'status') {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border-none outline-none bg-transparent text-sm font-medium rounded-lg focus:bg-white focus:shadow-sm"
          autoFocus
        >
          <option value="">Select...</option>
          {column.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={column.type === 'number' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border-none outline-none bg-transparent text-sm font-medium rounded-lg focus:bg-white focus:shadow-sm"
        autoFocus
      />
    );
  }

  const displayValue = value?.toString() || '';

  if (column.type === 'status' && displayValue) {
    return (
      <div
        onClick={() => onEditingChange(true)}
        className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all duration-200 hover:shadow-sm ${getStatusColor(displayValue)}`}
      >
        {displayValue}
      </div>
    );
  }

  return (
    <div
      onClick={() => onEditingChange(true)}
      className="cursor-pointer hover:bg-white/60 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center transition-all duration-200 text-sm font-medium text-slate-700"
      title="Click to edit"
    >
      {displayValue || (
        <span className="text-slate-400 italic font-normal">Click to add...</span>
      )}
    </div>
  );
};