import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FormField, { Input } from '../components/ui/FormField';
import PasswordInput from '../components/ui/PasswordInput';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <PageHeader title="Create Account" subtitle="Join BotGuard to protect your applications" />
        <Card>
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Full Name" id="name">
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </FormField>
            <FormField label="Email" id="email">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Password" id="password">
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </FormField>
            <FormField label="Confirm Password" id="confirm">
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </FormField>
            {error && (
              <p className="mb-4 text-sm text-coral" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Register'}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="cursor-pointer font-semibold text-teal hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default memo(Register);
