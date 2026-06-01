import { memo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="bg-gradient-to-r from-coral to-teal bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
            Protect Your Website from Bot Attacks
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Advanced AI-powered detection that identifies and blocks malicious bots in real-time,
            safeguarding your users and data.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/products">
              <Button size="lg">Explore Features</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Why Choose BotGuard?</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
            Industry-leading bot detection with proven results
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['⚡', 'Real-time Detection', 'Detect suspicious activity instantly with ML algorithms.', 'text-coral'],
              ['🎯', 'High Accuracy', '99.8% detection accuracy with minimal false positives.', 'text-teal'],
              ['🔒', 'Secure & Compliant', 'GDPR and CCPA compliant with end-to-end encryption.', 'text-emerald'],
            ].map(([icon, title, desc, color]) => (
              <Card key={title}>
                <h3 className={`mb-2 text-lg font-semibold ${color}`}>
                  {icon} {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Key Features</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ['Behavioral Analysis', 'Mouse movement, scroll activity, and click patterns.'],
              ['Session Tracking', 'Duration, idle time, and navigation patterns.'],
              ['Admin Dashboard', 'Real-time analytics, charts, and reporting.'],
              ['Session Replay', 'Full replay of mouse movements, clicks, and scrolls.'],
            ].map(([title, desc]) => (
              <Card key={title}>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 text-center sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
          <Link to="/register" className="mt-6 inline-block">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default memo(Home);
