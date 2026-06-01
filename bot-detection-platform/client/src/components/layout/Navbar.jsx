import { memo, useCallback, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-teal' : 'text-gray-600 hover:text-gray-900'
  }`;

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    setMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-gray-900" onClick={closeMenu}>
          Bot<span className="text-teal">Guard</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && <NotificationBell />}

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <span className="max-w-[120px] truncate text-sm text-gray-600 lg:max-w-none">
                  Hi, {user?.name}
                </span>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-gray-200 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-gray-100 bg-white px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {[
              ['/', 'Home'],
              ['/products', 'Products'],
              ['/blog', 'Blog'],
              ['/contact', 'Contact'],
              ...(isAuthenticated ? [['/dashboard', 'Dashboard']] : []),
              ...(isAuthenticated ? [['/profile', 'Profile']] : []),
              ...(isAuthenticated ? [['/settings', 'Settings']] : []),
            ].map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass} onClick={closeMenu} end={to === '/'}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default memo(Navbar);
