import { Navigate } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Loading…" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
