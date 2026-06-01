/**
 * Render chart containers for dashboard
 */
export const renderCharts = () => {
  return `
    <div class="chart-card">
      <h3>📊 Classification Distribution</h3>
      <div class="chart-container" id="pie-chart-container">
        <canvas id="pie-chart" width="300" height="200"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <h3>📈 Risk Score Distribution</h3>
      <div class="chart-container" id="bar-chart-container">
        <canvas id="bar-chart" width="300" height="200"></canvas>
      </div>
    </div>

    <div class="chart-card">
      <h3>📉 Detection Trends</h3>
      <div class="chart-container" id="line-chart-container">
        <canvas id="line-chart" width="300" height="200"></canvas>
      </div>
    </div>
  `;
};

/**
 * Simple pie chart renderer
 */
const drawPieChart = (ctx, data, labels, colors) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;

  const total = data.reduce((a, b) => a + b, 0);

  let currentAngle = -Math.PI / 2;

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;

    // Draw slice
    ctx.fillStyle = colors[index];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const percentage = ((value / total) * 100).toFixed(1);
    ctx.fillText(`${percentage}%`, labelX, labelY);

    currentAngle += sliceAngle;
  });

  // Draw legend
  let legendY = height - 40;
  labels.forEach((label, index) => {
    ctx.fillStyle = colors[index];
    ctx.fillRect(20, legendY, 15, 15);

    ctx.fillStyle = '#111827';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${label}: ${data[index]}`, 40, legendY + 12);

    legendY += 20;
  });
};

/**
 * Simple bar chart renderer
 */
const drawBarChart = (ctx, data, labels, colors) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);
  const barWidth = chartWidth / (labels.length * 1.5);
  const gap = barWidth * 0.5;

  // Draw background
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(padding, padding, chartWidth, chartHeight);

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(((maxValue / 5) * (5 - i)).toFixed(0), padding - 10, y + 4);
  }

  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * (barWidth + gap);
    const y = padding + chartHeight - barHeight;

    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, barWidth, barHeight);

    // Label
    ctx.fillStyle = '#111827';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + barWidth / 2, height - 15);

    // Value on bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(value, x + barWidth / 2, y + 20);
  });

  // Draw axes
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
};

/**
 * Simple line chart renderer
 */
const drawLineChart = (ctx, data, labels) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...data);
  const step = chartWidth / (labels.length - 1 || 1);

  // Draw background
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(padding, padding, chartWidth, chartHeight);

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw line
  ctx.strokeStyle = '#20c997';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + index * step;
    const y = padding + chartHeight - (value / maxValue) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  data.forEach((value, index) => {
    const x = padding + index * step;
    const y = padding + chartHeight - (value / maxValue) * chartHeight;

    ctx.fillStyle = '#1dd1a1';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw axes
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // X-axis labels
  labels.forEach((label, index) => {
    const x = padding + index * step;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, height - 15);
  });
};

/**
 * Update pie chart with classification data
 */
export const updatePieChart = (stats) => {
  const canvas = document.getElementById('pie-chart');
  if (!canvas || !stats.classification) return;

  const ctx = canvas.getContext('2d');

  const data = [
    stats.classification.human || 0,
    stats.classification.suspicious || 0,
    stats.classification.bot || 0,
  ];

  const labels = ['Human', 'Suspicious', 'Bot'];
  const colors = ['#1dd1a1', '#ff6b6b', '#20c997'];

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPieChart(ctx, data, labels, colors);
};

/**
 * Update bar chart with risk distribution
 */
export const updateBarChart = (distribution) => {
  const canvas = document.getElementById('bar-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Sort by risk range
  const sorted = (distribution || []).sort((a, b) => {
    const aOrder = { '0-29 (Human)': 0, '30-59 (Suspicious)': 1, '60-100 (Bot)': 2 };
    const bOrder = { '0-29 (Human)': 0, '30-59 (Suspicious)': 1, '60-100 (Bot)': 2 };
    return (aOrder[a._id] || 3) - (bOrder[b._id] || 3);
  });

  const data = sorted.map((item) => item.count);
  const labels = sorted.map((item) => item._id.split(' ')[0]); // Get range part
  const colors = ['#1dd1a1', '#ff6b6b', '#20c997'];

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBarChart(ctx, data, labels, colors);
};

/**
 * Update line chart with trends
 */
export const updateLineChart = (trends) => {
  const canvas = document.getElementById('line-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Extract dates and human counts
  const labels = (trends || []).map((t) => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const data = (trends || []).map((t) => (t.human || 0) + (t.suspicious || 0) + (t.bot || 0));

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLineChart(ctx, data, labels);
};

/**
 * Initialize all charts
 */
export const initializeCharts = (stats, distribution, trends) => {
  updatePieChart(stats);
  updateBarChart(distribution);
  updateLineChart(trends);
};
