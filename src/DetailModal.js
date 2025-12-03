// DetailModal.js
import React from 'react';

function DetailModal({ row, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Details</h2>
        <p><strong>Date:</strong> {row.date}</p>
        <p><strong>Cloud Provider:</strong> {row.cloud_provider}</p>
        <p><strong>Service:</strong> {row.service}</p>
        <p><strong>Team:</strong> {row.team}</p>
        <p><strong>Environment:</strong> {row.env}</p>
        <p><strong>Cost (USD):</strong> ${row.cost_usd.toFixed(2)}</p>
        <p>This is {row.cloud_provider} {row.service} spend from the {row.team} team in {row.env} environment.</p>
      </div>
    </div>
  );
}

export default DetailModal;