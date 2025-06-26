import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Grid3X3 } from 'lucide-react';
import { Group } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { EditableText } from '../common/EditableText';

interface GroupHeaderProps {
  group: Group;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({ group }) => {
  const { activeBoard, updateGroup, deleteGroup, addColumn } = useBoardContext();
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newColumn, setNewColumn] = useState<{
    title: string;
    type: 'text' | 'number' | 'dropdown' | 'status';
    options: string[];
  }>({
    title: '',
    type: 'text',
    options: [],
  });
  const [optionsText, setOptionsText] = useState('');

  const handleToggleCollapse = () => {
    if (activeBoard) {
      updateGroup(activeBoard.id, group.id, { isCollapsed: !group.isCollapsed });
    }
  };

  const handleToggleCollapseV2 = () => {
    if (activeBoard) {
      updateGroup(activeBoard.id, group.id, { isCollapsed: false });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (activeBoard && newTitle.trim()) {
      updateGroup(activeBoard.id, group.id, { title: newTitle.trim() });
    }
  };

  const handleAddColumn = () => {
    if (activeBoard && newColumn.title.trim()) {
      const columnData = {
        ...newColumn,
        id: crypto.randomUUID(),
        options: (newColumn.type === 'dropdown' || newColumn.type === 'status')
          ? optionsText.split('\n').map(opt => opt.trim()).filter(opt => opt)
          : undefined,
      };

      addColumn(activeBoard.id, group.id, columnData);
      setNewColumn({ title: '', type: 'text', options: [] });
      setOptionsText('');
      setShowColumnModal(false);
      // for (let i = 0; i < group.rows.length; i++) {
      //   const row = group.rows[i];
      //   addCell(activeBoard.id, group.id, row.id, columnData.id, columnData);
      // }
    }
  };

  const handleDeleteGroup = () => {
    if (activeBoard) {
      deleteGroup(activeBoard.id, group.id);
      setShowDeleteConfirm(false);
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
      <div className="bg-white/80 border-white/20 rounded-2xl shadow-lg">
        {/* <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg"> */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleCollapse}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200"
            >
              {group.isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>

            <div>
              <EditableText
                value={group.title}
                onChange={handleTitleChange}
                className="text-xl font-bold text-slate-800"
                placeholder="Group name"
              />
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-500">
                  {group.rows.length} item{group.rows.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { handleToggleCollapseV2(); setShowColumnModal(true) }}
              className="hover:bg-blue-50 text-blue-600"
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { handleToggleCollapseV2(); setShowDeleteConfirm(true) }}
              className="hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </Button>
            {/* <Button variant="ghost" size="sm" className="hover:bg-slate-100">
              <MoreHorizontal size={16} />
            </Button> */}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        title="Add New Column"
      >
        <div className="space-y-6">
          <Input
            label="Column Name"
            value={newColumn.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewColumn({ ...newColumn, title: e.target.value })}
            placeholder="Enter column name..."
          />

          <Select
            label="Column Type"
            value={newColumn.type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewColumn({ ...newColumn, type: e.target.value as 'text' | 'number' | 'dropdown' | 'status' })}
            options={columnTypeOptions}
          />

          {(newColumn.type === 'dropdown' || newColumn.type === 'status') && (
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
            <Button variant="secondary" onClick={() => setShowColumnModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn} disabled={!newColumn.title.trim()}>
              Add Column
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Group"
      >
        <div className="space-y-6">
          <p className="text-base text-slate-600 leading-relaxed">
            Are you sure you want to delete the group "{group.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteGroup}>
              Delete Group
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};