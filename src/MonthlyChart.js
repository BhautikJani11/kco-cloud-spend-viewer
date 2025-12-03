// MonthlyChart.js
import React from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  ReferenceLine 
} from 'recharts';

function MonthlyChart({ data, theme = 'light' }) {
  const monthly = data.reduce((acc, row) => {
    const month = row.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + row.cost_usd;
    return acc;
  }, {});

  let chartData = Object.entries(monthly)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));

  chartData = chartData.map((d, i) => {
    const prev = i > 0 ? chartData[i - 1].total : 0;
    return { 
      ...d, 
      trend: prev ? ((d.total - prev) / prev * 100).toFixed(1) : null
    };
  });

  if (chartData.length === 0) {
    return <div className="chart-container">No data for charts yet—apply filters!</div>;
  }

  const lineColor = theme === 'dark' ? '#fbbf24' : '#f97316';

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="1 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
        <Tooltip 
          formatter={(value) => [`$${value.toFixed(2)}`, 'Spend']} 
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData.filter(d => d.trend !== null)}>
        <CartesianGrid strokeDasharray="1 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis 
          unit="%" 
          tickFormatter={(v) => `${v}%`}
          domain={['dataMin - 5', 'dataMax + 5']} 
        />
        <Tooltip 
          labelFormatter={(label) => `${label} MoM Change`}
          formatter={(value) => [value ? `${value}%` : 'N/A', 'Trend']}
        />
        <ReferenceLine 
          y={10} 
          stroke="red" 
          strokeDasharray="5 5" 
          label={{ position: 'top', value: '+10% Alert', fill: 'red', fontSize: 10 }}
        />
        <Line 
          type="monotone" 
          dataKey="trend" 
          stroke={lineColor} 
          strokeWidth={2} 
          dot={{ fill: lineColor, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="chart-container">
      <h3>Monthly Spend + Trends</h3>
      <div className="dual-charts">
        {renderBarChart()}
        {chartData.length >= 2 ? renderLineChart() : <p className="trend-note">MoM trend available with 2+ months of data.</p>}
      </div>
    </div>
  );
}

export default MonthlyChart;