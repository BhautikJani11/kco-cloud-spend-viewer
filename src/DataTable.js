// DataTable.js
import React from 'react';

function DataTable({ data, sort, onSortChange, onRowClick }) {
  const handleSort = (field) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  if (data.length === 0) return null;

  const sortArrow = (field) => {
    if (sort.field !== field) return '';
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-container">
      <table role="table" aria-label="Cloud Spend Data">
        <thead>
          <tr>
            <th onClick={() => handleSort('date')} role="columnheader">Date {sortArrow('date')}</th>
            <th role="columnheader">Cloud Provider</th>
            <th role="columnheader">Service</th>
            <th role="columnheader">Team</th>
            <th role="columnheader">Env</th>
            <th onClick={() => handleSort('cost_usd')} role="columnheader">Cost (USD) {sortArrow('cost_usd')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} onClick={() => onRowClick(row)} className={row.anomaly ? 'warning' : ''} role="row" style={{ cursor: 'pointer' }}>
              <td title={row.date}>{row.date}</td>
              <td title={row.cloud_provider}>{row.cloud_provider}</td>
              <td title={row.service}>{row.service}</td>
              <td title={row.team}>{row.team}</td>
              <td title={row.env}>{row.env}</td>
              <td title={`$${row.cost_usd.toFixed(2)}`}>
                ${row.cost_usd.toFixed(2)} {row.anomaly && <span className="badge" aria-label="Anomaly flagged">⚠️</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;