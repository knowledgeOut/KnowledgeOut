/**
 * 인증 관련 커스텀 훅
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from './api';
import { isAuthenticated } from '../../lib/auth';

/**
 * 로그인 훅
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      router.push('/');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

/**
 * 회원가입 훅
 */
export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const signup = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.signup(data);
      router.push('/login');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}

/**
 * 로그아웃 훅
 */
export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      router.push('/login');
    } catch (err) {
      // 에러가 나도 로그아웃 처리
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}

/**
 * 인증 상태 확인 훅
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return { authenticated };
}

