export const ContactPage = () => {
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
          <h1 class="hero-title">Get in Touch</h1>
          <p class="hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="grid grid-2">
            <div>
              <h2 style="margin-bottom: 1.5rem; color: var(--coral);">Contact Information</h2>
              <div class="card" style="margin-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem;">Email</h4>
                <p style="color: var(--gray-600);">support@botguard.com</p>
              </div>
              <div class="card" style="margin-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem;">Phone</h4>
                <p style="color: var(--gray-600);">+1 (555) 123-4567</p>
              </div>
              <div class="card" style="margin-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem;">Office</h4>
                <p style="color: var(--gray-600);">
                  123 Security Avenue<br />
                  San Francisco, CA 94103<br />
                  United States
                </p>
              </div>
              <div class="card">
                <h4 style="margin-bottom: 0.5rem;">Business Hours</h4>
                <p style="color: var(--gray-600);">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>

            <div>
              <h2 style="margin-bottom: 1.5rem; color: var(--teal);">Send us a Message</h2>
              <form class="card" id="contact-form">
                <div class="form-group">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" id="name" class="form-input" placeholder="Your name" required />
                </div>
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" id="email" class="form-input" placeholder="your@email.com" required />
                </div>
                <div class="form-group">
                  <label for="subject" class="form-label">Subject</label>
                  <input type="text" id="subject" class="form-input" placeholder="How can we help?" required />
                </div>
                <div class="form-group">
                  <label for="message" class="form-label">Message</label>
                  <textarea id="message" class="form-textarea" placeholder="Your message..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
              </form>
            </div>
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

export default ContactPage;
