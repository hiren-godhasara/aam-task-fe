// import React from 'react';
// import { X } from 'lucide-react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }

// export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
//         <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
//           <h3 className="text-xl font-bold text-slate-800">{title}</h3>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200"
//           >
//             <X size={18} />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };


// import { X } from 'lucide-react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }

// export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       {/* Overlay: dark and blurred */}
//       <div
//         className="fixed inset-0 bg-black/20 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal Panel */}
//       <div className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
//           <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
//           >
//             <X size={18} className="text-slate-700" />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="px-6 py-5">{children}</div>
//       </div>
//     </div>

//   );
// };


import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={18} className="text-slate-700" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root')!);
};
