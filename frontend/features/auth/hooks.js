/**
 * 인증 관련 커스텀 훅
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from './api';

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
 * @deprecated 세션 기반 인증을 사용하므로 더 이상 사용하지 않습니다.
 * 인증 상태는 백엔드 API 호출로 확인해야 합니다.
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  // 세션 기반 인증이므로 클라이언트에서 직접 확인할 수 없음
  // 백엔드 API를 호출하여 인증 상태를 확인해야 합니다.
  // TODO: 백엔드에 인증 상태 확인 API를 추가하고 여기서 호출하도록 수정 필요

  return { authenticated };
}

