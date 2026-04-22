import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '../hooks/useAuth';
import styles from './AuthPage.module.css';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const mutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate('/dashboard');
    }
  }, [mutation.isSuccess, navigate]);

  return (
    <main className={styles.shell}>
      <section className={styles.art}>
        <h1>Welcome Back to Vanaspati</h1>
        <p>Enter your account and continue your healing-plant journey.</p>
      </section>
      <section className={styles.formPane}>
        <form className={styles.form} onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <h2>Login</h2>
          <input className={styles.input} placeholder="Email" {...register('email')} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input className={styles.input} type="password" placeholder="Password" {...register('password')} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          <button className={styles.button} disabled={mutation.isPending} type="submit">{mutation.isPending ? 'Signing in...' : 'Sign In'}</button>
          <Link to="/register">Need an account? Register</Link>
        </form>
      </section>
    </main>
  );
}
