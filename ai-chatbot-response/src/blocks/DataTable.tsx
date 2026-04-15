import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { DataTableData, BadgeValue, ScoreValue } from '../types';

function isBadge(val: unknown): val is BadgeValue {
  return typeof val === 'object' && val !== null && 'text' in val && 'color' in val;
}

function isScore(val: unknown): val is ScoreValue {
  return typeof val === 'object' && val !== null && 'value' in val && typeof (val as ScoreValue).value === 'number';
}

const SCORE_COLORS = {
  danger: 'var(--color-brq-error)',
  warning: '#EA580C',
  normal: 'var(--color-brq-accent)',
} as const;

function getScoreColor(score: number): string {
  if (score >= 90) return SCORE_COLORS.danger;
  if (score >= 80) return SCORE_COLORS.warning;
  return SCORE_COLORS.normal;
}

const PAGE_SIZES = [10, 20, 50];

export default function DataTable({ title, columns, rows }: DataTableData) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIdx = (currentPage - 1) * pageSize;
  const displayRows = rows.slice(startIdx, startIdx + pageSize);

  const goTo = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="bg-brq-white border border-brq-border rounded overflow-hidden">
      {/* Header: title + pagination info */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brq-gray-100">
        <div className="flex items-center gap-3">
          {title && <span className="text-[16px] font-semibold text-brq-gray-900">{title}</span>}
          <span className="flex items-center gap-1.5 text-[13px] text-brq-gray-500">
            페이지당
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="h-7 px-1.5 border border-brq-border rounded text-[13px] bg-white outline-none cursor-pointer"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}건</option>
              ))}
            </select>
          </span>
        </div>
        <span className="text-[13px] text-brq-gray-500">
          총 <strong className="text-brq-gray-700 font-number">{totalRows}</strong>건
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-brq-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-2.5 px-3.5 text-[13px] font-semibold text-brq-gray-700 whitespace-nowrap border-b border-brq-border tracking-wide
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, ri) => (
              <tr key={ri} className={`hover:bg-[#f1f5f9] transition-colors ${ri % 2 === 1 ? 'bg-brq-gray-50' : ''}`}>
                {columns.map((col) => {
                  const val = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={`py-2.5 px-3.5 border-b border-brq-gray-100 whitespace-nowrap text-brq-gray-700 leading-relaxed
                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                    >
                      {isBadge(val) ? (
                        <span
                          className="inline-flex items-center gap-1 text-[13px] font-semibold px-2.5 py-0.5 rounded"
                          style={{ backgroundColor: val.color + '18', color: val.color }}
                        >
                          {val.text}
                        </span>
                      ) : isScore(val) ? (
                        <span
                          className="text-[20px] font-bold font-number"
                          style={{ color: getScoreColor(val.value) }}
                        >
                          {val.value}
                        </span>
                      ) : col.align === 'right' ? (
                        <span className="font-number font-bold text-brq-gray-900">
                          {String(val)}
                        </span>
                      ) : (
                        <span>{String(val)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1 px-4 py-2.5 border-t border-brq-gray-100">
          <button onClick={() => goTo(1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center rounded border border-brq-border bg-white text-brq-gray-400 hover:text-brq-gray-700 disabled:opacity-30 transition-colors">
            <ChevronsLeft size={14} />
          </button>
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center rounded border border-brq-border bg-white text-brq-gray-400 hover:text-brq-gray-700 disabled:opacity-30 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <span className="px-2.5 text-[13px] font-number text-brq-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center rounded border border-brq-border bg-white text-brq-gray-400 hover:text-brq-gray-700 disabled:opacity-30 transition-colors">
            <ChevronRight size={14} />
          </button>
          <button onClick={() => goTo(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center rounded border border-brq-border bg-white text-brq-accent hover:text-brq-accent-dark disabled:opacity-30 transition-colors">
            <ChevronsRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
