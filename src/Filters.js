// Filters.js
import React from 'react';

function Filters({ filters, onFiltersChange, data = [] }) {
  const teams = [...new Set(data.map(d => d.team))].sort();
  const envs = [...new Set(data.map(d => d.env))].sort();
  const clouds = ['All', 'AWS', 'GCP'];

  const monthSet = new Set(data.map(d => d.date ? d.date.substring(0, 7) : ''));
  const months = ['All', ...Array.from(monthSet)].sort();

  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="filters">
      <select value={filters.month || 'All'} onChange={e => handleChange('month', e.target.value)}>
        {months.map(m => <option key={m} value={m}>{m === 'All' ? 'All Months' : m}</option>)}
      </select>
      <select value={filters.cloud || 'All'} onChange={e => handleChange('cloud', e.target.value)}>
        {clouds.map(c => <option key={c} value={c}>{c === 'All' ? 'All Providers' : c}</option>)}
      </select>
      <select value={filters.team || 'All'} onChange={e => handleChange('team', e.target.value)}>
        <option>All Teams</option>
        {teams.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select value={filters.env || 'All'} onChange={e => handleChange('env', e.target.value)}>
        <option>All Environments</option>
        {envs.map(e => <option key={e} value={e}>{capitalize(e)}</option>)}
      </select>
      <input
        type="text"
        placeholder="Search services or teams..."
        value={filters.search}
        onChange={e => handleChange('search', e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default Filters;