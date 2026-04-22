import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRegister } from '../hooks/useAuth';
import styles from './AuthPage.module.css';

const schema = z
  .object({
    name: z.string().min(2, 'Name required'),
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const mutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate('/dashboard');
    }
  }, [mutation.isSuccess, navigate]);

  return (
    <main className={styles.shell}>
      <section className={styles.art}>
        <h1>Create Your Vanaspati Account</h1>
        <p>Track plants, quizzes, and your personalized herbal journey.</p>
      </section>
      <section className={styles.formPane}>
        <form className={styles.form} onSubmit={handleSubmit((values) => mutation.mutate({ name: values.name, email: values.email, password: values.password }))}>
          <h2>Register</h2>
          <input className={styles.input} placeholder="Name" {...register('name')} />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          <input className={styles.input} placeholder="Email" {...register('email')} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <input className={styles.input} type="password" placeholder="Password" {...register('password')} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          <input className={styles.input} type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
          <button className={styles.button} disabled={mutation.isPending} type="submit">{mutation.isPending ? 'Creating account...' : 'Create Account'}</button>
          <Link to="/login">Already have an account? Login</Link>
        </form>
      </section>
    </main>
  );
}
