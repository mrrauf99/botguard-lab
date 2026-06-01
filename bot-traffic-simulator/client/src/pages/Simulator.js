const SimulatorPage = () => {
  return `
    <div class="simulator-container">
      <header class="simulator-header">
        <h1>🤖 Bot Traffic Simulator</h1>
        <p>Generate realistic bot and human traffic patterns to test the detection system</p>
      </header>

      <main class="simulator-main">
        <!-- Status Section -->
        <section class="simulator-section">
          <h2>📊 Traffic Status</h2>
          <div class="status-grid">
            <div class="status-card">
              <span class="status-label">Bot Traffic</span>
              <span class="status-value" id="bot-status">Stopped</span>
              <span class="status-indicator" id="bot-indicator"></span>
            </div>
            <div class="status-card">
              <span class="status-label">Human Traffic</span>
              <span class="status-value" id="human-status">Stopped</span>
              <span class="status-indicator" id="human-indicator"></span>
            </div>
          </div>
        </section>

        <!-- Statistics Section -->
        <section class="simulator-section">
          <h2>📈 Statistics</h2>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Bot Sessions</div>
              <div class="stat-value" id="stat-bot-sessions">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Human Sessions</div>
              <div class="stat-value" id="stat-human-sessions">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Bot Events</div>
              <div class="stat-value" id="stat-bot-events">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Human Events</div>
              <div class="stat-value" id="stat-human-events">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Sessions</div>
              <div class="stat-value" id="stat-total-sessions">0</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Events</div>
              <div class="stat-value" id="stat-total-events">0</div>
            </div>
          </div>
        </section>

        <!-- Bot Traffic Section -->
        <section class="simulator-section">
          <h2>🤖 Bot Traffic Generation</h2>
          <div class="control-panel">
            <div class="control-group">
              <label for="bot-duration">Duration (seconds)</label>
              <input type="number" id="bot-duration" value="60" min="10" max="600" />
            </div>
            <div class="control-group">
              <label for="bot-rate">Bots Per Interval</label>
              <input type="number" id="bot-rate" value="2" min="1" max="10" />
            </div>
            <div class="control-group">
              <label for="bot-interval">Interval (ms)</label>
              <input type="number" id="bot-interval" value="5000" min="1000" max="30000" step="1000" />
            </div>
            <button class="btn-start" id="btn-start-bot">Start Bot Traffic</button>
            <button class="btn-stop" id="btn-stop-bot" disabled>Stop Bot Traffic</button>
          </div>

          <div class="bot-types">
            <h3>Single Bot Types</h3>
            <div class="button-group">
              <button class="btn-bot-type" data-type="fast-navigation">⚡ Fast Navigation</button>
              <button class="btn-bot-type" data-type="no-interaction">🔇 No Interaction</button>
              <button class="btn-bot-type" data-type="form-spam">📝 Form Spam</button>
              <button class="btn-bot-type" data-type="click-spam">🖱️ Click Spam</button>
              <button class="btn-bot-type" data-type="suspicious">❓ Suspicious</button>
            </div>
          </div>
        </section>

        <!-- Human Traffic Section -->
        <section class="simulator-section">
          <h2>👥 Human Traffic Generation</h2>
          <div class="control-panel">
            <div class="control-group">
              <label for="human-duration">Duration (seconds)</label>
              <input type="number" id="human-duration" value="60" min="10" max="600" />
            </div>
            <div class="control-group">
              <label for="human-rate">Sessions Per Minute</label>
              <input type="number" id="human-rate" value="3" min="1" max="10" />
            </div>
            <button class="btn-start" id="btn-start-human">Start Human Traffic</button>
            <button class="btn-stop" id="btn-stop-human" disabled>Stop Human Traffic</button>
          </div>

          <div class="human-types">
            <h3>Single Human Types</h3>
            <div class="button-group">
              <button class="btn-human-type" data-type="normal">👤 Normal Session</button>
              <button class="btn-human-type" data-type="bouncer">⏱️ Quick Bouncer</button>
            </div>
          </div>
        </section>

        <!-- Phase 8 Attack Simulation -->
        <section class="simulator-section attack-section">
          <h2>🎯 Attack Simulation (Phase 8)</h2>
          <p style="color: #6b7280; margin-bottom: 1rem;">Max 10 requests per attack. Stops when BOT detected or session blocked.</p>
          <div class="control-panel">
            <div class="control-group" style="flex: 1 1 100%;">
              <label for="attack-target-url">Target URL</label>
              <input type="url" id="attack-target-url" value="http://localhost:3000" placeholder="http://localhost:3000" />
            </div>
            <div class="control-group" style="flex: 1 1 100%;">
              <label for="attack-api-url">Detection API URL</label>
              <input type="url" id="attack-api-url" value="http://localhost:5000" placeholder="http://localhost:5000" />
            </div>
          </div>
          <div class="button-group" style="margin-bottom: 1rem;">
            <button class="btn-attack" data-attack="login-attack">🔐 Login Attack</button>
            <button class="btn-attack" data-attack="spam-bot">📝 Spam Bot</button>
            <button class="btn-attack" data-attack="scraper-bot">🕷️ Scraper Bot</button>
          </div>
          <div class="attack-result card" id="attack-result" style="display: none; background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h3 style="margin-bottom: 0.75rem; color: #ff6b6b;">Attack Result</h3>
            <p><strong>Status:</strong> <span id="attack-status">—</span></p>
            <p><strong>Requests sent:</strong> <span id="attack-requests">0</span></p>
            <p><strong>Stopped reason:</strong> <span id="attack-stopped">—</span></p>
            <p><strong>Classification:</strong> <span id="attack-classification">—</span></p>
            <p><strong>Risk score:</strong> <span id="attack-score">—</span></p>
          </div>
        </section>

        <!-- Combined Traffic Section -->
        <section class="simulator-section">
          <h2>🔀 Combined Traffic</h2>
          <div class="control-panel">
            <div class="control-group">
              <label for="combined-duration">Duration (seconds)</label>
              <input type="number" id="combined-duration" value="120" min="10" max="600" />
            </div>
            <button class="btn-combined" id="btn-start-combined">Start Combined Traffic</button>
            <button class="btn-stop" id="btn-stop-combined" disabled>Stop Combined Traffic</button>
          </div>
        </section>

        <!-- Actions Section -->
        <section class="simulator-section">
          <h2>🎛️ Actions</h2>
          <div class="action-buttons">
            <button class="btn-action" id="btn-reset-stats">🔄 Reset Statistics</button>
            <button class="btn-action" id="btn-refresh-status">🔄 Refresh Status</button>
          </div>
        </section>

        <!-- Log Section -->
        <section class="simulator-section">
          <h2>📝 Activity Log</h2>
          <div class="activity-log" id="activity-log">
            <div class="log-entry">Simulator ready</div>
          </div>
        </section>
      </main>

      <style>
        .simulator-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          padding: 2rem 0;
        }

        .simulator-header {
          background: white;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .simulator-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .simulator-header p {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
        }

        .simulator-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .simulator-section {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .simulator-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .simulator-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin: 1rem 0 0.75rem 0;
        }

        /* Status Section */
        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-card {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          padding: 1.5rem;
          border-radius: 0.5rem;
          border-left: 4px solid #20c997;
          position: relative;
        }

        .status-label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .status-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .status-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d5db;
          transition: background-color 0.3s ease;
        }

        .status-indicator.active {
          background: #20c997;
          box-shadow: 0 0 8px rgba(32, 201, 151, 0.5);
        }

        /* Statistics Section */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-box {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          padding: 1.5rem;
          border-radius: 0.5rem;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #1e40af;
        }

        /* Control Panel */
        .control-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
        }

        .control-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .control-group input {
          padding: 0.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .control-group input:focus {
          outline: none;
          border-color: #20c997;
          box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
        }

        /* Buttons */
        .btn-start,
        .btn-stop,
        .btn-combined,
        .btn-action {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-attack {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          background: #ff6b6b;
          color: white;
          cursor: pointer;
        }

        .btn-attack:hover {
          background: #ee5a52;
        }

        .btn-attack:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-start {
          background: #20c997;
          color: white;
        }

        .btn-start:hover:not(:disabled) {
          background: #0ca678;
          transform: translateY(-1px);
        }

        .btn-start:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-stop {
          background: #ff6b6b;
          color: white;
        }

        .btn-stop:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .btn-stop:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-combined {
          background: #1e90ff;
          color: white;
          grid-column: auto;
        }

        .btn-combined:hover {
          background: #1070d0;
          transform: translateY(-1px);
        }

        .btn-action {
          background: #9ca3af;
          color: white;
          padding: 0.75rem 1.5rem;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .btn-action:hover {
          background: #6b7280;
          transform: translateY(-1px);
        }

        /* Bot/Human Types */
        .bot-types,
        .human-types {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .button-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .btn-bot-type,
        .btn-human-type {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.375rem;
          background: white;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-bot-type:hover,
        .btn-human-type:hover {
          border-color: #20c997;
          background: #f0fdf4;
          transform: translateY(-2px);
        }

        /* Activity Log */
        .activity-log {
          background: #1f2937;
          color: #d1d5db;
          padding: 1rem;
          border-radius: 0.375rem;
          max-height: 300px;
          overflow-y: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .log-entry {
          padding: 0.25rem 0;
        }

        .log-entry.success {
          color: #20c997;
        }

        .log-entry.error {
          color: #ff6b6b;
        }

        .log-entry.info {
          color: #1e90ff;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .control-panel {
            grid-template-columns: 1fr;
          }

          .simulator-section {
            padding: 1rem;
          }

          .simulator-section h2 {
            font-size: 1.25rem;
          }

          .status-grid,
          .stats-grid,
          .button-group {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </div>
  `;
};

export default SimulatorPage;
