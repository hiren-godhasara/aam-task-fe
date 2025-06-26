import { useState } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { DraggableGroup } from '../Group/DraggableGroup';
import { Button } from '../UI/Button';
import { Plus, Layers } from 'lucide-react';

export const Board: React.FC = () => {
  const { activeBoard, createGroup, reorderGroups } = useBoardContext();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isAfter = e.clientY > midpoint;

    // Find the group index based on the target element
    const groupElement = target.closest('[data-group-index]') as HTMLElement;
    if (groupElement) {
      const targetIndex = parseInt(groupElement.dataset.groupIndex || '0');
      setDragOverIndex(isAfter ? targetIndex + 1 : targetIndex);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex !== null && draggedIndex !== dropIndex && activeBoard) {
      const actualDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
      reorderGroups(activeBoard.id, draggedIndex, actualDropIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!activeBoard) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Layers className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">No Board Selected</h2>
          <p className="text-lg text-slate-600 leading-relaxed">Create a new board to start organizing your tasks and projects.</p>
        </div>
      </div>
    );
  }

  // Sort groups by order property
  const sortedGroups = [...activeBoard.groups].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto">
      <div className="pl-8"> {/* Add left padding for drag handles */}
        {activeBoard.groups.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Plus className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to get organized?</h3>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              Create your first group to start organizing tasks and tracking progress.
            </p>
            <Button
              onClick={() => createGroup(activeBoard.id, 'New Group')}
              className="shadow-lg px-8 py-3 text-base"
            >
              <Plus size={20} className="mr-3" />
              Create First Group
            </Button>
          </div>
        ) : (
          <div className="space-y-0"  >
            {sortedGroups.map((group, index) => (
              <div key={group.id} data-group-index={index} className='mb-16' >
                <DraggableGroup
                  key={group.id}
                  group={group}
                  index={index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggedIndex === index}
                  dragOverIndex={dragOverIndex}
                />
              </div>
            ))}

            {/* Drop zone at the end */}
            {draggedIndex !== null && (
              <div
                className="h-4 flex items-center justify-center"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(sortedGroups.length);
                }}
                onDrop={(e) => handleDrop(e, sortedGroups.length)}
              >
                {dragOverIndex === sortedGroups.length && (
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
};