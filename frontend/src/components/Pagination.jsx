export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  isLoading = false,
  label = 'items',
}) {
  if (totalPages <= 1 && total === 0) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-700/50">
      <p className="text-sm text-slate-500">
        {total === 0 ? (
          `No ${label}`
        ) : (
          <>
            Page <span className="text-slate-300">{page}</span> of{' '}
            <span className="text-slate-300">{totalPages}</span>
            <span className="hidden sm:inline">
              {' '}
              · {total} {label}
            </span>
          </>
        )}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          {start > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className="min-w-[36px] px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                1
              </button>
              {start > 2 && <span className="text-slate-600 px-1">…</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={isLoading}
              className={`min-w-[36px] px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <span className="text-slate-600 px-1">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={isLoading}
                className="min-w-[36px] px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
