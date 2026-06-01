export const drawPieChart = (ctx, data, labels, colors) => {
  const { width, height } = ctx.canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;
  const total = data.reduce((a, b) => a + b, 0) || 1;
  let currentAngle = -Math.PI / 2;

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    ctx.fillStyle = colors[index];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, labelX, labelY);
    currentAngle += sliceAngle;
  });

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

export const drawBarChart = (ctx, data, labels, colors) => {
  const { width, height } = ctx.canvas;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data, 1);
  const barWidth = chartWidth / (labels.length * 1.5);
  const gap = barWidth * 0.5;

  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(padding, padding, chartWidth, chartHeight);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(((maxValue / 5) * (5 - i)).toFixed(0), padding - 10, y + 4);
  }

  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * (barWidth + gap);
    const y = padding + chartHeight - barHeight;
    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#111827';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + barWidth / 2, height - 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(value, x + barWidth / 2, y + 20);
  });

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
};

export const drawLineChart = (ctx, data, labels) => {
  const { width, height } = ctx.canvas;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data, 1);
  const step = chartWidth / (labels.length - 1 || 1);

  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(padding, padding, chartWidth, chartHeight);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#20c997';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((value, index) => {
    const x = padding + index * step;
    const y = padding + chartHeight - (value / maxValue) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  data.forEach((value, index) => {
    const x = padding + index * step;
    const y = padding + chartHeight - (value / maxValue) * chartHeight;
    ctx.fillStyle = '#1dd1a1';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  labels.forEach((label, index) => {
    const x = padding + index * step;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, height - 15);
  });
};
