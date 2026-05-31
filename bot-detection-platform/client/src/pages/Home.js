export const HomePage = () => {
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
          <h1 class="hero-title">Protect Your Website from Bot Attacks</h1>
          <p class="hero-subtitle">
            Advanced AI-powered detection system that identifies and blocks malicious bots
            in real-time, safeguarding your users and data.
          </p>
          <div class="hero-buttons">
            <a href="/products" class="btn btn-primary">Explore Features</a>
            <a href="/contact" class="btn btn-outline">Get Started</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Why Choose BotGuard?</h2>
          <p class="section-subtitle">Industry-leading bot detection with proven results</p>
          <div class="grid grid-3">
            <div class="card">
              <h3 style="color: var(--coral); margin-bottom: 0.5rem;">⚡ Real-time Detection</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                Detect and block suspicious activity instantly with our advanced machine learning algorithms.
              </p>
            </div>
            <div class="card">
              <h3 style="color: var(--teal); margin-bottom: 0.5rem;">🎯 High Accuracy</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                99.8% detection accuracy with minimal false positives, ensuring legitimate users aren't affected.
              </p>
            </div>
            <div class="card">
              <h3 style="color: var(--emerald); margin-bottom: 0.5rem;">🔒 Secure & Compliant</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                GDPR and CCPA compliant with end-to-end encryption protecting user data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background-color: var(--gray-50);">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <p class="section-subtitle">Everything you need to protect your web application</p>
          <div class="grid grid-2">
            <div class="card">
              <h3 style="margin-bottom: 0.5rem;">Behavioral Analysis</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                Analyze user behavior patterns including mouse movement, scroll activity, and click patterns.
              </p>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem;">Session Tracking</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                Monitor session duration, idle time, and navigation patterns to identify suspicious activity.
              </p>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem;">Admin Dashboard</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                Real-time dashboard with detailed analytics, charts, and reporting capabilities.
              </p>
            </div>
            <div class="card">
              <h3 style="margin-bottom: 0.5rem;">Session Replay</h3>
              <p style="color: var(--gray-600); line-height: 1.6;">
                Review recorded user sessions with full replay of mouse movements, clicks, and scrolls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container" style="text-align: center;">
          <h2 class="section-title">Ready to Get Started?</h2>
          <p class="section-subtitle">Join thousands of businesses protecting their applications with BotGuard</p>
          <a href="/register" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
            Start Free Trial
          </a>
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

export default HomePage;
