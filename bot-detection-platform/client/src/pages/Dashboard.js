import Navigation from '../components/Navigation.js';
import Footer from '../components/Footer.js';
import { renderStatWidgets } from '../components/Widgets.js';
import { renderCharts } from '../components/Charts.js';

const Dashboard = () => {
  return `
    <div class="dashboard-container">
      ${Navigation()}
      
      <main class="dashboard-main">
        <div class="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p class="dashboard-subtitle">Real-time bot detection analytics and session monitoring</p>
        </div>

        <!-- Statistics Section -->
        <section class="stats-section">
          <div class="stats-grid" id="stats-grid">
            ${renderStatWidgets()}
          </div>
        </section>

        <!-- Charts Section -->
        <section class="charts-section">
          <div class="charts-grid" id="charts-grid">
            ${renderCharts()}
          </div>
        </section>

        <!-- Sessions List Section -->
        <section class="sessions-section">
          <div class="sessions-container">
            <h2>Recent Sessions</h2>
            <div class="sessions-table-wrapper">
              <table class="sessions-table" id="sessions-table">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Classification</th>
                    <th>Risk Score</th>
                    <th>Duration</th>
                    <th>Events</th>
                    <th>Started</th>
                  </tr>
                </thead>
                <tbody id="sessions-tbody">
                  <tr class="loading-row">
                    <td colspan="6">Loading sessions...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- High Risk Alerts Section -->
        <section class="alerts-section">
          <div class="alerts-container">
            <h2>⚠️ High Risk Sessions</h2>
            <div class="alerts-list" id="alerts-list">
              <div class="alert-item">Loading high-risk sessions...</div>
            </div>
          </div>
        </section>
      </main>

      ${Footer()}
    </div>

    <style>
      .dashboard-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      }

      .dashboard-main {
        flex: 1;
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
      }

      .dashboard-header {
        margin-bottom: 2.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #e5e7eb;
      }

      .dashboard-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #111827;
        margin: 0 0 0.5rem 0;
      }

      .dashboard-subtitle {
        font-size: 1rem;
        color: #6b7280;
        margin: 0;
      }

      /* Stats Section */
      .stats-section {
        margin-bottom: 2.5rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .stat-widget {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border-left: 4px solid;
      }

      .stat-widget:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .stat-widget.total {
        border-left-color: #111827;
      }

      .stat-widget.human {
        border-left-color: #1dd1a1;
      }

      .stat-widget.suspicious {
        border-left-color: #ff6b6b;
      }

      .stat-widget.bot {
        border-left-color: #1e90ff;
      }

      .stat-widget.active {
        border-left-color: #20c997;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 600;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-value {
        font-size: 2.25rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }

      .stat-change {
        font-size: 0.875rem;
        margin-top: 0.5rem;
        color: #6b7280;
      }

      /* Charts Section */
      .charts-section {
        margin-bottom: 2.5rem;
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .chart-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .chart-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 1.5rem 0;
      }

      .chart-container {
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Sessions Section */
      .sessions-section {
        margin-bottom: 2.5rem;
      }

      .sessions-container {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .sessions-container h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 1.5rem 0;
      }

      .sessions-table-wrapper {
        overflow-x: auto;
      }

      .sessions-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .sessions-table thead {
        background: #f3f4f6;
      }

      .sessions-table th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 1px solid #e5e7eb;
      }

      .sessions-table td {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .sessions-table tbody tr:hover {
        background: #f9fafb;
      }

      .sessions-table tbody tr:last-child td {
        border-bottom: none;
      }

      .classification-badge {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .classification-badge.human {
        background: #d1fae5;
        color: #065f46;
      }

      .classification-badge.suspicious {
        background: #fee2e2;
        color: #991b1b;
      }

      .classification-badge.bot {
        background: #dbeafe;
        color: #1e40af;
      }

      /* Alerts Section */
      .alerts-section {
        margin-bottom: 2.5rem;
      }

      .alerts-container {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .alerts-container h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 1.5rem 0;
      }

      .alerts-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }

      .alert-item {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        border-left: 4px solid #dc2626;
        padding: 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        color: #7f1d1d;
      }

      .alert-item.high {
        background: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
        color: #7f1d1d;
        font-weight: 600;
      }

      .loading-row {
        text-align: center;
        color: #9ca3af;
      }

      .loading-row td {
        padding: 2rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .dashboard-main {
          padding: 1rem;
        }

        .dashboard-header h1 {
          font-size: 1.875rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .charts-grid {
          grid-template-columns: 1fr;
        }

        .alerts-list {
          grid-template-columns: 1fr;
        }

        .sessions-table {
          font-size: 0.75rem;
        }

        .sessions-table th,
        .sessions-table td {
          padding: 0.5rem;
        }
      }
    </style>

    <!-- Notification Center -->
    <div class="notification-center" id="notification-center">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button class="notification-close-btn" id="notification-close">×</button>
      </div>
      <div class="notification-actions">
        <button class="notification-btn" id="mark-all-read-btn">Mark all as read</button>
        <button class="notification-btn secondary" id="clear-all-btn">Clear</button>
      </div>
      <div class="notification-list" id="notification-list">
        <div class="notification-empty">No notifications yet</div>
      </div>
    </div>

    <div class="notification-badge-container" id="notification-badge-container">
      <button class="notification-toggle-btn" id="notification-toggle">
        🔔
        <span class="notification-badge" id="notification-badge">0</span>
      </button>
    </div>
  `;
};

export default Dashboard;
