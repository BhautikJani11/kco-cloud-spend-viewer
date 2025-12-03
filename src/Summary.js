// Summary.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function Summary({ data, theme = 'light' }) {
  const total = data.reduce((sum, row) => sum + row.cost_usd, 0);
  const savingsEst = total * 0.15;
  const byCloud = data.reduce((acc, row) => {
    acc[row.cloud_provider] = (acc[row.cloud_provider] || 0) + row.cost_usd;
    return acc;
  }, {});
  const byService = data.reduce((acc, row) => {
    acc[row.service] = (acc[row.service] || 0) + row.cost_usd;
    return acc;
  }, {});
  const topServices = Object.entries(byService)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([service, cost]) => ({ service, cost }));
  const pieData = Object.entries(byCloud).map(([name, value]) => ({ 
    name, 
    value, 
    percent: (value / total * 100).toFixed(1) 
  }));

  const COLORS = theme === 'dark' ? ['#3B82F6', '#10B981'] : ['#0088FE', '#00C49F'];

  const customLegendFormatter = (value) => {
    const entry = pieData.find(d => d.name === value);
    return entry ? `${value} (${entry.percent}%)` : value;
  };

  return (
    <div className="summary">
      <h3>Quick Glance</h3>
      <p><strong>Total Spend:</strong> ${total.toFixed(2)} | <em>Est. Savings: $${savingsEst.toFixed(2)} (15% from prod tweaks)</em></p>
      <div className="charts-row">
        <div className="pie-wrapper" style={{ minWidth: '300px' }}>
          <h4>By Provider</h4>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                paddingAngle={5}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `$${value.toFixed(2)} (${pieData.find(d => d.name === name)?.percent}%)`, 
                  name
                ]} 
                labelFormatter={(label) => `Provider: ${label}`}
                contentStyle={{ 
                  fontSize: '14px', 
                  backgroundColor: theme === 'dark' ? '#334155' : 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={80}
                wrapperStyle={{ 
                  paddingTop: '25px', 
                  fontSize: '0.95rem',
                  backgroundColor: 'transparent'
                }}
                formatter={customLegendFormatter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, paddingLeft: '1.5rem' }}>  
          <p><strong>By Provider:</strong></p>
          <ul>
            {Object.entries(byCloud).map(([provider, cost]) => (
              <li key={provider}>{provider}: ${cost.toFixed(2)} ({((cost / total) * 100).toFixed(1)}%)</li>
            ))}
          </ul>
          <p><strong>Top 5 Services:</strong></p>
          <ul>
            {topServices.map(({ service, cost }) => (
              <li key={service}>{service}: ${cost.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Summary;