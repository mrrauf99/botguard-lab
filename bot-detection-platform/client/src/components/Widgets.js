/**
 * Render stat widgets for dashboard
 */
export const renderStatWidgets = () => {
  return `
    <div class="stat-widget total" id="widget-total">
      <div class="stat-label">Total Sessions</div>
      <p class="stat-value" id="stat-total">0</p>
      <div class="stat-change">All time</div>
    </div>

    <div class="stat-widget human" id="widget-human">
      <div class="stat-label">✓ Human Visitors</div>
      <p class="stat-value" id="stat-human">0</p>
      <div class="stat-change" id="change-human">0%</div>
    </div>

    <div class="stat-widget bot" id="widget-bot">
      <div class="stat-label">🤖 Bot Traffic</div>
      <p class="stat-value" id="stat-bot">0</p>
      <div class="stat-change" id="change-bot">0%</div>
    </div>

    <div class="stat-widget suspicious" id="widget-suspicious">
      <div class="stat-label">❓ Suspicious</div>
      <p class="stat-value" id="stat-suspicious">0</p>
      <div class="stat-change" id="change-suspicious">0%</div>
    </div>

    <div class="stat-widget active" id="widget-active">
      <div class="stat-label">🟢 Active Now</div>
      <p class="stat-value" id="stat-active">0</p>
      <div class="stat-change">Real-time</div>
    </div>
  `;
};

/**
 * Update stat widgets with data
 */
export const updateStatWidgets = (stats) => {
  if (!stats.classification) return;

  const { total, human, bot, suspicious, active } = {
    total: stats.overview?.totalSessions || 0,
    human: stats.classification?.human || 0,
    bot: stats.classification?.bot || 0,
    suspicious: stats.classification?.suspicious || 0,
    active: stats.overview?.activeSessions || 0,
  };

  // Update values
  const totalEl = document.getElementById('stat-total');
  if (totalEl) totalEl.textContent = total;

  const humanEl = document.getElementById('stat-human');
  if (humanEl) humanEl.textContent = human;

  const botEl = document.getElementById('stat-bot');
  if (botEl) botEl.textContent = bot;

  const suspiciousEl = document.getElementById('stat-suspicious');
  if (suspiciousEl) suspiciousEl.textContent = suspicious;

  const activeEl = document.getElementById('stat-active');
  if (activeEl) activeEl.textContent = active;

  // Update percentages
  const getPercentage = (value, total) => {
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
  };

  const humanPercentage = getPercentage(human, total);
  const botPercentage = getPercentage(bot, total);
  const suspiciousPercentage = getPercentage(suspicious, total);

  const changeHuman = document.getElementById('change-human');
  if (changeHuman) changeHuman.textContent = `${humanPercentage}%`;

  const changeBot = document.getElementById('change-bot');
  if (changeBot) changeBot.textContent = `${botPercentage}%`;

  const changeSuspicious = document.getElementById('change-suspicious');
  if (changeSuspicious) changeSuspicious.textContent = `${suspiciousPercentage}%`;
};

/**
 * Create session row for table
 */
export const createSessionRow = (session) => {
  const row = document.createElement('tr');

  const duration = session.duration ? `${(session.duration / 1000).toFixed(1)}s` : 'N/A';

  const startDate = new Date(session.startTime).toLocaleString();

  const classification = session.classification || 'PENDING';
  const classificationClass = classification.toLowerCase();
  const sessionId = session._id?.toString?.() || session._id;

  row.innerHTML = `
    <td>${String(sessionId).slice(0, 8)}...</td>
    <td>
      <span class="classification-badge ${classificationClass}">
        ${classification}
      </span>
    </td>
    <td>
      <strong>${session.riskScore || 0}</strong>/100
    </td>
    <td>${duration}</td>
    <td>${session.eventCount || 0}</td>
    <td>${startDate}</td>
    <td>
      <a href="/replay/${sessionId}" class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Replay</a>
    </td>
  `;

  return row;
};

/**
 * Update sessions table with data
 */
export const updateSessionsTable = (sessions) => {
  const tbody = document.getElementById('sessions-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!sessions || sessions.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'loading-row';
    emptyRow.innerHTML = '<td colspan="7">No sessions yet</td>';
    tbody.appendChild(emptyRow);
    return;
  }

  sessions.forEach((session) => {
    const row = createSessionRow(session);
    tbody.appendChild(row);
  });
};

/**
 * Add alert item to list
 */
export const addAlertItem = (session) => {
  const alertsList = document.getElementById('alerts-list');
  if (!alertsList) return;

  const alertItem = document.createElement('div');
  alertItem.className = `alert-item ${session.riskScore > 80 ? 'high' : ''}`;

  const startDate = new Date(session.startTime).toLocaleTimeString();

  alertItem.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 0.5rem;">Risk: ${session.riskScore}/100</div>
    <div style="font-size: 0.75rem; opacity: 0.8;">Session: ${session._id.slice(0, 8)}...</div>
    <div style="font-size: 0.75rem; opacity: 0.8;">Detected at: ${startDate}</div>
  `;

  // Insert at beginning
  if (alertsList.firstChild) {
    alertsList.insertBefore(alertItem, alertsList.firstChild);
  } else {
    alertsList.appendChild(alertItem);
  }

  // Keep only last 10 alerts
  while (alertsList.children.length > 10) {
    alertsList.removeChild(alertsList.lastChild);
  }
};

/**
 * Clear alerts list
 */
export const clearAlerts = () => {
  const alertsList = document.getElementById('alerts-list');
  if (alertsList) {
    alertsList.innerHTML = '';
  }
};
