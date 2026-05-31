export const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <a href="/" className="navbar-logo">BotGuard</a>
          <ul className="navbar-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div className="navbar-auth">
            <a href="/login" className="btn btn-outline">Login</a>
            <a href="/register" className="btn btn-primary">Register</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
