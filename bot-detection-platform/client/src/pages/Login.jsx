import { memo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FormField, { Input } from '../components/ui/FormField';
import PasswordInput from '../components/ui/PasswordInput';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <PageHeader title="Login" subtitle="Sign in to your BotGuard account" />
        <Card>
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Email Address" id="email" error={error && !email ? error : ''}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@botguard.local"
                required
                autoComplete="email"
              />
            </FormField>
            <FormField label="Password" id="password">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </FormField>
            {error && (
              <p className="mb-4 text-sm text-coral" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="cursor-pointer font-semibold text-teal hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </Card>
        <Card className="mt-6 !bg-gray-50 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">Demo Credentials</p>
          <p>Email: admin@botguard.local</p>
          <p>Password: Admin@123</p>
        </Card>
      </div>
    </section>
  );
}

export default memo(Login);
