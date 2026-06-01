import { memo } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user } = useAuth();

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <PageHeader title="Profile" subtitle="Your account information" />
        <Card>
          <dl className="space-y-4 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="font-medium text-gray-500">Name</dt>
              <dd className="text-gray-900">{user?.name || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="font-medium text-gray-500">Email</dt>
              <dd className="break-all text-gray-900">{user?.email || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-medium text-gray-500">Role</dt>
              <dd>
                <Badge variant={user?.role === 'admin' ? 'info' : 'default'}>
                  {user?.role || 'user'}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </section>
  );
}

export default memo(Profile);
