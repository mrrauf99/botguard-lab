export const LoginPage = () => {
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
      <section class="hero" style="padding-top: 2rem; padding-bottom: 2rem;">
        <div class="container" style="max-width: 400px;">
          <h1 class="hero-title">Login</h1>
          <p class="hero-subtitle" style="margin-bottom: 2rem;">Sign in to your BotGuard account</p>

          <form class="card" id="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                class="form-input"
                placeholder="admin@botguard.local"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                class="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.875rem;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" style="margin-right: 0.5rem;" />
                Remember me
              </label>
              <a href="#" style="color: var(--coral); text-decoration: none;">Forgot password?</a>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Sign In</button>

            <p style="text-align: center; color: var(--gray-600); font-size: 0.875rem;">
              Don't have an account? 
              <a href="/register" style="color: var(--coral); text-decoration: none; font-weight: 600;">Register here</a>
            </p>
          </form>

          <div style="margin-top: 2rem; padding: 1.5rem; background-color: var(--gray-50); border-radius: 0.5rem; font-size: 0.875rem; color: var(--gray-600);">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@botguard.local</p>
            <p>Password: Admin@123</p>
          </div>
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

export default LoginPage;
