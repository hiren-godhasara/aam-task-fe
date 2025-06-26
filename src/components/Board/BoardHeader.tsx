import { useState } from 'react';
import { Plus, Sparkles, Edit2, Trash2 } from 'lucide-react';
import { useBoardContext } from '../../context/BoardContext';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';

export const BoardHeader: React.FC = () => {

  const { activeBoard, createBoard, createGroup, updateBoard, boards, setActiveBoard, deleteBoard } = useBoardContext();
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setShowNewBoardModal(false);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupTitle.trim() && activeBoard) {
      createGroup(activeBoard.id, newGroupTitle.trim());
      setNewGroupTitle('');
      setShowNewGroupModal(false);
    }
  };
  const handleTitleSubmit = () => {
    if (editingBoardId && editingTitle.trim()) {
      updateBoard(editingBoardId, { title: editingTitle.trim() });
    }
    setEditingBoardId(null);
  };

  const handleDeleteBoard = () => {
    if (activeBoard) {
      deleteBoard(activeBoard.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="glass-effect border-b border-white/20 px-8 py-6 sticky top-0 bg-white  backdrop-blur-md z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                {editingBoardId === activeBoard?.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSubmit();
                      }
                    }}
                    className="text-2xl font-bold text-slate-800 border border-gray-300 px-3 py-1 rounded-md bg-white shadow-sm"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h2
                      onClick={() => {
                        setEditingBoardId(activeBoard?.id ?? '');
                        setEditingTitle(activeBoard?.title ?? '');
                      }}
                      className="text-2xl font-bold text-slate-800 cursor-pointer hover:underline"
                    >
                      {activeBoard?.title}
                    </h2>
                    <Button variant="ghost" onClick={() => { setEditingBoardId(activeBoard?.id ?? ''); setEditingTitle(activeBoard?.title ?? ''); }}>
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" onClick={() => setShowNewBoardModal(true)}>
                      <Plus size={18} />
                    </Button>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {activeBoard && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600">
                  {activeBoard.groups.length} group{activeBoard.groups.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={activeBoard?.id || ''}
              onChange={(e) => setActiveBoard(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none cursor-pointer hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200 text-slate-800"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id} className="text-slate-800 text-sm !bg-gray-100 ">
                  {board.title}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowNewGroupModal(true)} className="shadow-lg">
              <Plus size={18} className="mr-2" />
              Add Group
            </Button>
            {/* <Button variant="ghost" size="sm" className="hover:bg-white/20">
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-white/20">
              <MoreHorizontal size={18} />
            </Button> */}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showNewBoardModal}
        onClose={() => setShowNewBoardModal(false)}
        title="Create New Board"
      >
        <div className="space-y-6">
          <Input
            label="Board Name"
            value={newBoardTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board name..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCreateBoard()}
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowNewBoardModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard} disabled={!newBoardTitle.trim()}>
              Create Board
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
        title="Create New Group"
      >
        <div className="space-y-6">
          <Input
            label="Group Name"
            value={newGroupTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGroupTitle(e.target.value)}
            placeholder="Enter group name..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCreateGroup()}
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowNewGroupModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={!newGroupTitle.trim()}>
              Create Group
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
            Are you sure you want to delete the group  "{activeBoard?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBoard}>
              Delete Board
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};