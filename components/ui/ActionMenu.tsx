// ============================================================
// ACTION MENU DROPDOWN - Style Monday.com
// ============================================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Copy, Archive, Eye, Share2 } from 'lucide-react';

interface ActionMenuItem {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  align?: 'left' | 'right';
}

export function ActionMenu({ items, align = 'right' }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        aria-label="Menu d'actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'} w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 animate-fade-in`}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isDisabled = item.disabled;
            const isDanger = item.variant === 'danger';

            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={isDisabled}
                className={`w-full px-3 py-2 flex items-center gap-3 transition-colors text-sm ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isDanger
                    ? 'hover:bg-red-500/10 text-red-400'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Quick Actions Templates
export const projectActions = (
  onEdit: () => void,
  onDelete: () => void,
  onDuplicate: () => void,
  onArchive: () => void
): ActionMenuItem[] => [
  { icon: Edit, label: 'Modifier', onClick: onEdit },
  { icon: Copy, label: 'Dupliquer', onClick: onDuplicate },
  { icon: Eye, label: 'Voir détails', onClick: () => {} },
  { icon: Archive, label: 'Archiver', onClick: onArchive },
  { icon: Trash2, label: 'Supprimer', onClick: onDelete, variant: 'danger' }
];

export const riskActions = (
  onEdit: () => void,
  onDelete: () => void,
  onMitigate: () => void
): ActionMenuItem[] => [
  { icon: Edit, label: 'Modifier', onClick: onEdit },
  { icon: Share2, label: 'Assigner mitigation', onClick: onMitigate },
  { icon: Archive, label: 'Marquer résolu', onClick: () => {} },
  { icon: Trash2, label: 'Supprimer', onClick: onDelete, variant: 'danger' }
];
