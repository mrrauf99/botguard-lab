export const RegisterPage = () => {
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
          <h1 class="hero-title">Create Account</h1>
          <p class="hero-subtitle" style="margin-bottom: 2rem;">Join BotGuard to protect your applications</p>

          <form class="card" onsubmit="alert('Registration functionality will be implemented with backend integration.'); return false;">
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                class="form-input"
                placeholder="Your name"
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                class="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                class="form-input"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                class="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <label style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--gray-700);">
              <input type="checkbox" style="margin-top: 0.25rem;" required />
              <span>
                I agree to the 
                <a href="#" style="color: var(--coral); text-decoration: none;">Terms of Service</a>
                and 
                <a href="#" style="color: var(--coral); text-decoration: none;">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Create Account</button>

            <p style="text-align: center; color: var(--gray-600); font-size: 0.875rem;">
              Already have an account?
              <a href="/login" style="color: var(--coral); text-decoration: none; font-weight: 600;">Login here</a>
            </p>
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

export default RegisterPage;
