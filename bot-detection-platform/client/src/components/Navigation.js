export const Navigation = () => {
  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-container">
          <a href="/" class="navbar-logo">
            BotGuard
          </a>
          <ul class="navbar-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/dashboard" style="font-weight: 600; color: #20c997;">Dashboard</a>
            </li>
          </ul>
          <div class="navbar-auth">
            <a href="/login" class="btn btn-outline">
              Login
            </a>
            <a href="/register" class="btn btn-primary">
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  `;
};

export default Navigation;
