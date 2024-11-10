// src/components/ui/Modal.tsx

'use client';

import { ReactNode, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react'; // クローズアイコン
import { cn } from '@/lib/utils'; // クラス名を結合するユーティリティ関数（必要に応じて定義）

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children }) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 max-w-md w-full bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 p-6">
          <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </DialogPrimitive.Close>
          {title && <DialogPrimitive.Title className="text-xl font-semibold mb-2">{title}</DialogPrimitive.Title>}
          {description && <DialogPrimitive.Description className="text-gray-500 mb-4">{description}</DialogPrimitive.Description>}
          <div>{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Modal;
