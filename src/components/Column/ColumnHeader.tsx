import { useState } from 'react';
import { MoreHorizontal, Trash2, Edit2, Type, Hash, ChevronDown, Target } from 'lucide-react';
import { Column } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { EditableText } from '../common/EditableText';

interface ColumnHeaderProps {
  column: Column;
  groupId: string;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, groupId }) => {
  const { activeBoard, updateColumn, deleteColumn } = useBoardContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editColumn, setEditColumn] = useState({
    title: column.title,
    type: column.type,
    options: column.options || [],
  });
  const [optionsText, setOptionsText] = useState((column.options || []).join('\n'));

  const handleTitleChange = (newTitle: string) => {
    if (activeBoard && newTitle.trim()) {
      updateColumn(activeBoard.id, groupId, column.id, { title: newTitle.trim() });
    }
  };

  const handleUpdateColumn = () => {
    if (activeBoard && editColumn.title.trim()) {
      const columnData = {
        ...editColumn,
        options: (editColumn.type === 'dropdown' || editColumn.type === 'status')
          ? optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt)
          : undefined,
      };

      updateColumn(activeBoard.id, groupId, column.id, columnData);
      setShowEditModal(false);
    }
  };

  const handleDeleteColumn = () => {
    if (activeBoard) {
      deleteColumn(activeBoard.id, groupId, column.id);
      setShowDeleteConfirm(false);
    }
  };

  const getColumnIcon = () => {
    switch (column.type) {
      case 'text': return <Type size={14} className="text-blue-500" />;
      case 'number': return <Hash size={14} className="text-green-500" />;
      case 'dropdown': return <ChevronDown size={14} className="text-purple-500" />;
      case 'status': return <Target size={14} className="text-orange-500" />;
      default: return <Type size={14} className="text-gray-500" />;
    }
  };

  const columnTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <>
      <th className="px-4 py-4 bg-slate-50/80 text-left border-r border-slate-200/50 relative group" style={{ width: column.width || 'auto' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getColumnIcon()}
            <EditableText
              value={column.title}
              onChange={handleTitleChange}
              className="text-sm font-semibold text-slate-700"
              placeholder="Column name"
            />
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/60"
            >
              <MoreHorizontal size={14} />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 size={14} className="mr-3" />
                    Edit Column
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="mr-3" />
                    Delete Column
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </th>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Column">
        <div className="space-y-6">
          <Input
            label="Column Name"
            value={editColumn.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditColumn({ ...editColumn, title: e.target.value })}
            placeholder="Enter column name..."
          />
          <Select
            label="Column Type"
            value={editColumn.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditColumn({ ...editColumn, type: e.target.value as 'text' | 'number' | 'dropdown' | 'status' })}
            options={columnTypeOptions}
          />
          {(editColumn.type === 'dropdown' || editColumn.type === 'status') && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Options (one per line)
              </label>
              <textarea
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateColumn} disabled={!editColumn.title.trim()}>
              Update Column
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Column"
      >
        <div className="space-y-6">
          <p className="text-base text-slate-600 leading-relaxed">
            Are you sure you want to delete the column "{column.title}"? This action cannot be undone and will permanently remove all data in this column.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteColumn}>
              Delete Column
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};