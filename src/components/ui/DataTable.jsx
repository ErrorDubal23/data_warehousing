// Generic table shell — callers supply <tbody> content (often animated)
// as children so each block controls its own row transitions.
export default function DataTable({ columns, children, maxHeight = "22rem", dense = false }) {
  return (
    <div className="scroll-thin overflow-auto border border-slate-200" style={{ maxHeight }}>
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-slate-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border-b border-slate-200 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500 ${
                  dense ? "px-3 py-2" : "px-4 py-3"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}
