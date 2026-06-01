const ARTICLES = {
  'bot-traffic-patterns': {
    title: 'Understanding Bot Traffic Patterns',
    category: 'Security',
    date: 'May 28, 2026',
    readTime: '5 min read',
    body: `
      <p>Bot traffic often follows predictable patterns: rapid page transitions, uniform timing between clicks, and absence of natural mouse curves.</p>
      <p>BotGuard combines behavioral signals with session metadata to classify traffic before it impacts your infrastructure.</p>
    `,
  },
  'ml-bot-detection': {
    title: 'Machine Learning in Bot Detection',
    category: 'Technology',
    date: 'May 25, 2026',
    readTime: '8 min read',
    body: `
      <p>Machine learning models learn from labeled sessions to distinguish humans from automated agents.</p>
      <p>Feature vectors include scroll depth variance, keystroke intervals, and navigation entropy.</p>
    `,
  },
  'web-security-practices': {
    title: 'Best Practices for Web Application Security',
    category: 'Best Practices',
    date: 'May 22, 2026',
    readTime: '12 min read',
    body: `
      <p>Layer bot detection with rate limiting, CAPTCHA fallbacks, and account lockout policies for defense in depth.</p>
      <p>Monitor session replay data to tune detection thresholds without blocking legitimate users.</p>
    `,
  },
};

export const ArticleDetailPage = (slug = '') => {
  const article = ARTICLES[slug] || {
    title: 'BotGuard Insights',
    category: 'Blog',
    date: '2026',
    readTime: '5 min read',
    body: '<p>Stay tuned for more articles on bot detection and web security.</p>',
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
        </div>
      </div>
    </nav>
    <main>
      <section class="section">
        <div class="container" style="max-width: 800px;">
          <a href="/blog" style="color: var(--teal); text-decoration: none;">← Back to Blog</a>
          <span class="card-badge" style="display: inline-block; margin-top: 1rem;">${article.category}</span>
          <h1 style="margin: 1rem 0 0.5rem; font-size: 2rem;">${article.title}</h1>
          <p style="color: var(--gray-500); margin-bottom: 2rem;">${article.date} · ${article.readTime}</p>
          <div class="card" style="line-height: 1.8; color: var(--gray-700);">
            ${article.body}
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

export default ArticleDetailPage;
