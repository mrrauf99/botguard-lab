import { memo } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';

function Settings() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <PageHeader
          title="Settings"
          subtitle="Manage your notification and dashboard preferences"
        />
        <Card>
          <h3 className="mb-2 font-semibold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-600">
            Real-time alerts are delivered via the notification bell in the navigation bar.
            Browser notifications are requested when you first sign in.
          </p>
        </Card>
        <Card className="mt-4">
          <h3 className="mb-2 font-semibold text-gray-900">API</h3>
          <p className="text-sm text-gray-600">
            API base URL:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
              {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
            </code>
          </p>
        </Card>
      </div>
    </section>
  );
}

export default memo(Settings);
