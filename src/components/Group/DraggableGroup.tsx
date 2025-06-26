import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { Group as GroupType } from '../../types';
import { GroupHeader } from './GroupHeader';
import { GroupTable } from './GroupTable';

interface DraggableGroupProps {
  group: GroupType;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

export const DraggableGroup: React.FC<DraggableGroupProps> = ({
  group,
  index,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  dragOverIndex,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, index);
  };

  const isDropTarget = dragOverIndex === index;
  const isBeingDragged = isDragging;

  return (
    <>
      <div
        className={`relative mb-16 transition-all duration-200 ${isBeingDragged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          // className={`relative mb-32 transition-all duration-200 ${isBeingDragged ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          } ${isDropTarget ? 'transform translate-y-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drop indicator */}
        {isDropTarget && (
          <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg " />
        )}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`group relative ${isBeingDragged ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {/* Drag handle */}
          <div className={`absolute -left-8 top-6 w-6 h-6 rounded-lg bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 ${isHovered || isBeingDragged ? 'opacity-100 shadow-lg' : 'opacity-0'}`}        >
            <GripVertical size={14} className="text-slate-400" />
          </div>
          <div className="mb-8">
            <GroupHeader group={group} />
            <GroupTable group={group} />
          </div>
        </div>
      </div>
    </>
  );
};