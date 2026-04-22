import { useMutation } from '@tanstack/react-query';
import { login, register } from '../api/auth';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => setAuth(data),
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => setAuth(data),
  });
};
