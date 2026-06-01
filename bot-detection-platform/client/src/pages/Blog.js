export const BlogPage = () => {
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
          <h1 class="hero-title">BotGuard Blog</h1>
          <p class="hero-subtitle">
            Latest insights on bot detection, security, and web application protection
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid grid-2">
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Security</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Understanding Bot Traffic Patterns</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Learn how to identify common bot attack patterns and protect your application.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 28, 2026</span>
                <span>5 min read</span>
              </div>
              <a href="/blog/bot-traffic-patterns" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Technology</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Machine Learning in Bot Detection</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Explore how machine learning algorithms improve bot detection accuracy.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 25, 2026</span>
                <span>8 min read</span>
              </div>
              <a href="/blog/ml-bot-detection" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Best Practices</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Best Practices for Web Application Security</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Comprehensive guide to securing your web applications against automated attacks.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 22, 2026</span>
                <span>12 min read</span>
              </div>
              <a href="/blog/web-security-practices" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Security</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Real-time Detection vs Reactive Security</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Why real-time bot detection is crucial for modern web applications.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 20, 2026</span>
                <span>6 min read</span>
              </div>
              <a href="#" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Technology</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Session Analysis and Bot Behavior</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                Deep dive into session tracking and behavioral analysis techniques.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 18, 2026</span>
                <span>7 min read</span>
              </div>
              <a href="#" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
            <div class="card">
              <div style="margin-bottom: 0.75rem;">
                <span class="card-badge">Case Study</span>
              </div>
              <h3 style="margin-bottom: 0.5rem; color: var(--gray-900);">Case Study: Protecting E-commerce Platforms</h3>
              <p style="color: var(--gray-600); margin-bottom: 1rem; line-height: 1.6;">
                How BotGuard helped reduce fraudulent transactions by 98%.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--gray-500); margin-bottom: 1rem;">
                <span>May 15, 2026</span>
                <span>10 min read</span>
              </div>
              <a href="#" class="btn btn-secondary" style="width: 100%;">Read Article</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background-color: var(--gray-50);">
        <div class="container" style="text-align: center;">
          <h2 class="section-title">Subscribe to Our Newsletter</h2>
          <p class="section-subtitle">
            Get the latest security insights and best practices delivered to your inbox
          </p>
          <form style="max-width: 500px; margin: 0 auto; display: flex; gap: 1rem;">
            <input
              type="email"
              placeholder="your@email.com"
              class="form-input"
              style="flex: 1;"
            />
            <button type="submit" class="btn btn-primary">Subscribe</button>
          </form>
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

export default BlogPage;
