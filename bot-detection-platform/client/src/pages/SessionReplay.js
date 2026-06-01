export const SessionReplayPage = (sessionId = '') => {
  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-container">
          <a href="/" class="navbar-logo">BotGuard</a>
          <ul class="navbar-nav">
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <main>
      <section class="section">
        <div class="container">
          <a href="/dashboard" style="color: var(--teal); text-decoration: none;">← Back to Dashboard</a>
          <h1 style="margin: 1rem 0;">Session Replay</h1>
          <p style="color: var(--gray-600); margin-bottom: 1rem;">Session: <code id="replay-session-id">${sessionId}</code></p>
          <div id="replay-status" style="color: var(--gray-600); margin-bottom: 1rem;">Loading session data...</div>
          <div class="card" style="padding: 0; overflow: hidden;">
            <canvas id="replay-canvas" width="900" height="500" style="width: 100%; display: block; background: #f9fafb;"></canvas>
          </div>
          <div class="card" style="margin-top: 1.5rem;">
            <h3 style="margin-bottom: 1rem;">Navigation Timeline</h3>
            <ul id="replay-timeline" style="list-style: none; padding: 0; margin: 0;"></ul>
          </div>
        </div>
      </section>
    </main>
  `;
};

export default SessionReplayPage;
