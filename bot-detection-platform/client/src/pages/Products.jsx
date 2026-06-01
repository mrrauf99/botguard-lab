import { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

const products = [
  {
    slug: 'behavioral-engine',
    title: 'Behavioral Detection Engine',
    desc: 'ML-based detection analyzing mouse movement, clicks, and scroll patterns.',
  },
  {
    slug: 'session-tracking',
    title: 'Session Tracking',
    desc: 'Monitor duration, idle time, and navigation patterns.',
  },
  {
    slug: 'admin-dashboard',
    title: 'Admin Dashboard',
    desc: 'Real-time analytics, charts, and reporting capabilities.',
  },
];

function Products() {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Products"
          subtitle="Comprehensive bot detection and analysis tools for web application security"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.slug}>
              <h3 className="mb-2 text-lg font-semibold text-coral">{p.title}</h3>
              <p className="mb-4 text-sm text-gray-600">{p.desc}</p>
              <Link to={`/products/${p.slug}`}>
                <Button className="w-full">Learn More</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Products);
