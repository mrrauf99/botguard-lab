export const ProductsPage = () => {
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
          <h1 class="hero-title">Our Products</h1>
          <p class="hero-subtitle">
            Comprehensive bot detection and analysis tools for complete web application security
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Feature Set</h2>
          <p class="section-subtitle">Powerful tools to detect, analyze, and prevent bot attacks</p>
          <div class="grid grid-3">
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">⚡ Behavioral Detection Engine</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Advanced ML-based detection analyzing mouse movement, clicks, and scroll patterns.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Real-time Analysis</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Pattern Recognition</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Machine Learning</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">📊 Session Tracking</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Comprehensive session monitoring with duration, idle time, and navigation tracking.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Session Duration</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Idle Tracking</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Navigation Analysis</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">📈 Admin Dashboard</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Real-time analytics dashboard with charts, statistics, and detailed reporting.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Real-time Data</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Charts & Graphs</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Export Reports</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">▶️ Session Replay</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Replay user sessions to investigate suspicious behavior with full interaction history.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Replay Engine</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Full History</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Playback Controls</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">🔌 API Integration</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Simple REST API for seamless integration with your existing applications.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ REST API</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Webhooks</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ SDKs</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem; color: var(--coral);">⚙️ Custom Rules</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Define custom detection rules based on your specific business requirements.
              </p>
              <ul style="list-style: none; font-size: 0.875rem;">
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Rule Builder</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Custom Logic</li>
                <li style="color: var(--gray-600); margin-bottom: 0.25rem;">✓ Testing Tools</li>
              </ul>
              <a href="#" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background-color: var(--gray-50);">
        <div class="container" style="text-align: center;">
          <h2 class="section-title">Enterprise Solutions</h2>
          <p class="section-subtitle">Custom packages available for large-scale deployments</p>
          <a href="/contact" class="btn btn-primary">Contact Sales</a>
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>BotGuard</h4>
            <p>AI-powered bot detection platform protecting your web applications.</p>
          </div>
          <div class="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="/products">Features</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/docs">Documentation</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/security">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 BotGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
};

export default ProductsPage;
