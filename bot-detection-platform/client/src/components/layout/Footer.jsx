import { Link } from 'react-router-dom';
import { memo } from 'react';

function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">BotGuard</h4>
            <p className="text-sm text-gray-600">
              AI-powered bot detection platform protecting your web applications.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-teal">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-teal">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-teal">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-teal">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-teal">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-teal">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BotGuard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default memo(Footer);
