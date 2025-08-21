import React, { useMemo, useState } from 'react';
import './DataTable.css';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

type SortOrder = 'asc' | 'desc' | null;

function compareValues(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === 'number' && typeof b === 'number') return a - b;

  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);

  const da = new Date(String(a));
  const db = new Date(String(b));
  if (!isNaN(da.getTime()) && !isNaN(db.getTime())) {
    return da.getTime() - db.getTime();
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;
    const copy = [...data];
    copy.sort((r1, r2) => {
      const cmp = compareValues(r1[sortKey], r2[sortKey]);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [data, sortKey, sortOrder]);

  const toggleSort = (key: keyof T) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder('asc');
    } else {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortOrder === null) setSortKey(key);
    }
  };

  const allVisibleSelected = selectable && sortedData.length > 0 && sortedData.every((_, i) => selected.has(i));
  const someVisibleSelected = selectable && !allVisibleSelected && sortedData.some((_, i) => selected.has(i));

  const notifySelection = (set: Set<number>) => {
    if (!onRowSelect) return;
    const selectedRows = Array.from(set).map(i => sortedData[i]).filter(Boolean);
    onRowSelect(selectedRows);
  };

  const toggleRowCheckbox = (rowIndex: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(rowIndex)) next.delete(rowIndex);
      else next.add(rowIndex);
      notifySelection(next);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        sortedData.forEach((_, i) => next.delete(i));
      } else {
        sortedData.forEach((_, i) => next.add(i));
      }
      notifySelection(next);
      return next;
    });
  };

  const handleRowClickSingleSelect = (rowIndex: number) => {
    if (!selectable) return;
    setSelected(() => {
      const next = new Set<number>([rowIndex]);
      notifySelection(next);
      return next;
    });
  };

  return (
    <div className="dt-container" role="region" aria-label="Data table container">
      <table className="dt-table" role="table" aria-busy={loading}>
        <thead className="dt-thead">
          <tr role="row">
            {selectable && (
              <th className="dt-th dt-th-select" scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={!!allVisibleSelected}
                  ref={el => {
                    if (el) el.indeterminate = !!someVisibleSelected;
                  }}
                  onChange={selectAllVisible}
                />
              </th>
            )}
            {columns.map(col => {
              const isSorted = sortKey === col.dataIndex && !!sortOrder;
              const ariaSort =
                !col.sortable ? 'none' :
                !isSorted ? 'none' :
                sortOrder === 'asc' ? 'ascending' : 'descending';

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`dt-th ${col.sortable ? 'dt-th-sortable' : ''}`}
                  aria-sort={ariaSort as React.AriaAttributes['aria-sort']}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="dt-sort-btn"
                      onClick={() => toggleSort(col.dataIndex)}
                      aria-label={`Sort by ${col.title}`}
                    >
                      <span>{col.title}</span>
                      <span className="dt-sort-icon">
                        {sortKey !== col.dataIndex || !sortOrder ? '↕' : sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    </button>
                  ) : (
                    col.title
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="dt-tbody">
          {loading ? (
            <tr>
              <td className="dt-loading" colSpan={columns.length + (selectable ? 1 : 0)} role="status" aria-live="polite">
                <div className="dt-spinner" aria-hidden="true"></div>
                <span>Loading…</span>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td className="dt-empty" colSpan={columns.length + (selectable ? 1 : 0)} role="status" aria-live="polite">
                No data to display.
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => {
              const isSelected = selected.has(i);
              return (
                <tr
                  key={i}
                  role="row"
                  className={`dt-tr ${isSelected ? 'dt-tr--selected' : ''}`}
                  onClick={() => handleRowClickSingleSelect(i)}
                  aria-selected={isSelected}
                  tabIndex={0}
                >
                  {selectable && (
                    <td className="dt-td dt-td-select">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${i + 1}`}
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowCheckbox(i);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="dt-td">
                      {String(row[col.dataIndex] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
