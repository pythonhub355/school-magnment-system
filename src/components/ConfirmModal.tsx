import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  icon?: 'trash' | 'alert' | 'check';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon = 'trash'
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          headerBg: 'bg-rose-50 border-rose-200 text-rose-900',
          iconBg: 'bg-rose-100 text-rose-600',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
        };
      case 'warning':
        return {
          headerBg: 'bg-amber-50 border-amber-200 text-amber-900',
          iconBg: 'bg-amber-100 text-amber-600',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20'
        };
      case 'success':
        return {
          headerBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          iconBg: 'bg-emerald-100 text-emerald-600',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
        };
      default:
        return {
          headerBg: 'bg-blue-50 border-blue-200 text-blue-900',
          iconBg: 'bg-blue-100 text-blue-600',
          btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${styles.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${styles.iconBg}`}>
              {icon === 'trash' && <Trash2 className="w-5 h-5" />}
              {icon === 'alert' && <AlertTriangle className="w-5 h-5" />}
              {icon === 'check' && <CheckCircle2 className="w-5 h-5" />}
            </div>
            <h3 className="font-extrabold text-base tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Message */}
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${styles.btnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
