## Tech Stack
- **Frontend**: Html,CSS,Javascript
- **Charts**: Recharts
- **Exports**: PapaParse (CSV), jsPDF (PDF)
- **Styling**: CSS with dark/light themes
- **Data**: Static JSON (cloud_spend_data.json)

## Quick Start
1. Clone the repo: `git clone https://github.com/yourusername/kco-cloud-spend-viewer.git`
2. Install dependencies: `cd kco-cloud-spend-viewer && npm install`
3. Run locally: `npm start` (opens at http://localhost:3000)
4. Build for production: `npm run build`

## Features
- **Filters**: By month, cloud provider (AWS/GCP), team, env, search.
- **Visuals**: Pie chart for providers, bar/line charts for monthly spend/trends.
- **Table**: Sortable, clickable rows with modals; anomaly flagging.
- **Exports**: CSV/PDF summaries.
- **UX**: Responsive, theme switcher, sticky headers.

## Approach
- Structured as a single-page app for simplicity.
- Focused on clean UX: Intuitive filters, tooltips, mobile-responsive.
- Trends calculate MoM % changes only with 2+ months.
- Edge cases: Empty states, loading skeletons.

## Potential Improvements
- Integrate real API (e.g., AWS Cost Explorer).
- Add user auth for multi-tenant.
- ML-based anomaly detection.

Built for K&Co. Full-Stack Intern Assignment. Questions? Reach out!
