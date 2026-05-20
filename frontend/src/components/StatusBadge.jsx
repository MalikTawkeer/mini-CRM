const styles = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  qualified: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  closed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
        styles[status] || styles.new
      }`}
    >
      {status}
    </span>
  );
}
