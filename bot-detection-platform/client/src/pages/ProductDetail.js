const PRODUCTS = {
  'behavioral-engine': {
    title: 'Behavioral Detection Engine',
    description:
      'Advanced ML-based detection analyzing mouse movement, clicks, and scroll patterns in real time.',
    features: ['Real-time Analysis', 'Pattern Recognition', 'Machine Learning'],
  },
  'session-tracking': {
    title: 'Session Tracking',
    description:
      'Comprehensive session monitoring with duration, idle time, and navigation tracking.',
    features: ['Duration Metrics', 'Idle Detection', 'Navigation Maps'],
  },
  'session-replay': {
    title: 'Session Replay',
    description:
      'Replay user sessions to investigate suspicious behavior with full interaction history.',
    features: ['Replay Engine', 'Timeline View', 'Event Filtering'],
  },
};

export const ProductDetailPage = (slug = '') => {
  const product = PRODUCTS[slug] || {
    title: 'Product',
    description: 'Explore BotGuard capabilities for modern web application security.',
    features: ['Detection', 'Analytics', 'Protection'],
  };

  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-container">
          <a href="/" class="navbar-logo">BotGuard</a>
          <ul class="navbar-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div class="navbar-auth">
            <a href="/login" class="btn btn-outline">Login</a>
            <a href="/register" class="btn btn-primary">Register</a>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <section class="hero">
        <div class="container">
          <a href="/products" style="color: var(--teal); text-decoration: none;">← Back to Products</a>
          <h1 class="hero-title" style="margin-top: 1rem;">${product.title}</h1>
          <p class="hero-subtitle">${product.description}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="card">
            <h2 style="margin-bottom: 1rem; color: var(--coral);">Key Capabilities</h2>
            <ul style="list-style: none; padding: 0;">
              ${product.features.map((f) => `<li style="padding: 0.5rem 0; color: var(--gray-700);">✓ ${f}</li>`).join('')}
            </ul>
            <a href="/contact" class="btn btn-primary" style="margin-top: 1.5rem;">Request Demo</a>
          </div>
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-bottom">
          <p>&copy; 2026 BotGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
};

export default ProductDetailPage;
