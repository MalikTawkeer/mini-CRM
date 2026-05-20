import { useEffect, useState } from 'react';

export default function ConfirmDeleteDialog({
  open,
  onClose,
  itemName,
  onConfirm,
  isDeleting = false,
  title = 'Delete lead',
  description,
}) {
  const [input, setInput] = useState('');
  const matches = itemName != null && input.trim() === itemName.trim();

  useEffect(() => {
    if (!open) setInput('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !itemName) return null;

  const handleConfirm = async () => {
    if (!matches || isDeleting) return;
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 id="confirm-delete-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {description ||
                'This action cannot be undone. Type the lead name below to confirm.'}
            </p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-500 mb-1">Lead to delete</p>
          <p className="text-white font-medium break-all">{itemName}</p>
        </div>

        <label className="block text-sm font-medium text-slate-400 mb-2">
          Type <span className="text-white font-semibold">{itemName}</span> to confirm
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={itemName}
          autoFocus
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 mb-6"
        />

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {matches && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete lead'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
