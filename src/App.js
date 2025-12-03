// App.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import Filters from './Filters';
import Summary from './Summary';
import DataTable from './DataTable';
import MonthlyChart from './MonthlyChart';
import DetailModal from './DetailModal';
import './index.css';

function App() {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ month: 'All', cloud: 'All', team: 'All', env: 'All', search: '' });
  const [sort, setSort] = useState({ field: 'date', direction: 'asc' });
  const [selectedRow, setSelectedRow] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetch('/cloud_spend_data.json')
      .then(res => res.json())
      .then(setRawData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...rawData];

    if (filters.month !== 'All') result = result.filter(row => row.date.substring(0, 7) === filters.month);
    if (filters.cloud !== 'All') result = result.filter(row => row.cloud_provider === filters.cloud);
    if (filters.team !== 'All') result = result.filter(row => row.team === filters.team);
    if (filters.env !== 'All') result = result.filter(row => row.env === filters.env);
    if (filters.search) result = result.filter(row => 
      row.service.toLowerCase().includes(filters.search.toLowerCase()) || 
      row.team.toLowerCase().includes(filters.search.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sort.field], bVal = b[sort.field];
      if (sort.field === 'cost_usd') return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      return sort.direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

    setFilteredData(result);
  }, [rawData, filters, sort]);

  const exportCSV = () => {
    const exportData = filteredData.map(row => ({
      date: row.date,
      cloud_provider: row.cloud_provider,
      service: row.service,
      team: row.team,
      env: row.env,
      cost_usd: row.cost_usd,
      anomaly: row.anomaly ? 'Yes' : 'No'
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kco-cloud-spend-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const total = filteredData.reduce((sum, row) => sum + row.cost_usd, 0);
    const anomalies = filteredData.filter(r => r.anomaly).length;
    doc.text(`K&Co. Spend Summary: $${total.toFixed(2)}`, 20, 20);
    doc.text(`Filtered: ${filteredData.length} rows | Anomalies: ${anomalies}`, 20, 30);
    doc.text('Top Tip: Check anomalies for quick wins!', 20, 40);
    doc.save(`spend-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (loading) return <div className="loading skeleton">Loading cloud spend data...</div>;

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <header className="header">
        <h1>K&Co. Cloud Spend Viewer ☁️</h1>
        <p>Filter, spot waste, optimize—FinOps made simple.</p>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <Filters filters={filters} onFiltersChange={setFilters} data={rawData} />
      <div className="export-buttons">
        <button className="export-btn" onClick={exportCSV}>📊 Export CSV</button>
        <button className="export-btn" onClick={exportPDF}>📄 Export PDF</button>
      </div>
      <Summary data={filteredData} theme={theme} />
      <div className="chart-container">
        <MonthlyChart data={filteredData} theme={theme} />
      </div>
      <div className="table-container">
        <DataTable
          data={filteredData}
          sort={sort}
          onSortChange={setSort}
          onRowClick={setSelectedRow}
        />
      </div>
      {selectedRow && (
        <DetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
      {filteredData.length === 0 && !loading && <div className="empty">No data found for this filter. Try broadening your search!</div>}
    </div>
  );
}

export default App;