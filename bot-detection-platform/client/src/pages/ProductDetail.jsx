import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

const DETAILS = {
  'behavioral-engine': {
    title: 'Behavioral Detection Engine',
    body: 'Advanced ML-based detection analyzing mouse movement, clicks, and scroll patterns in real time.',
  },
  'session-tracking': {
    title: 'Session Tracking',
    body: 'Comprehensive session monitoring with duration, idle time, and navigation tracking.',
  },
  'admin-dashboard': {
    title: 'Admin Dashboard',
    body: 'Real-time dashboard with analytics, charts, session lists, and high-risk alerts.',
  },
};

function ProductDetail() {
  const { slug } = useParams();
  const product = DETAILS[slug] || {
    title: slug?.replace(/-/g, ' ') || 'Product',
    body: 'Detailed product information coming soon.',
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/products" className="text-sm text-teal hover:underline">
          ← Back to Products
        </Link>
        <PageHeader title={product.title} />
        <Card>
          <p className="text-gray-600 leading-relaxed">{product.body}</p>
        </Card>
      </div>
    </section>
  );
}

export default memo(ProductDetail);
