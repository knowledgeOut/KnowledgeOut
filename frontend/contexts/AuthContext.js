"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, getCurrentUserQuestionLikes } from '@/features/member/api';
import { logout as logoutApi } from '@/features/auth/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [likedQuestionIds, setLikedQuestionIds] = useState(new Set());

  // 인증 상태 확인
  const checkAuth = useCallback(async () => {
    try {
      setIsCheckingAuth(true);
      const userData = await getCurrentUser();
      if (userData) {
        setCurrentUser({
          id: userData.id,
          email: userData.email,
          nickname: userData.nickname,
          name: userData.nickname,
          role: userData.role,
        });

        // 로그인한 사용자의 추천한 질문 목록 가져오기
        try {
          const likedData = await getCurrentUserQuestionLikes();
          const likedIds = new Set((likedData || []).map(q => String(q.id)));
          setLikedQuestionIds(likedIds);
        } catch (error) {
          console.error('추천 목록 조회 실패:', error);
          setLikedQuestionIds(new Set());
        }
      } else {
        setCurrentUser(null);
        setLikedQuestionIds(new Set());
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      setCurrentUser(null);
      setLikedQuestionIds(new Set());
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // 초기 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 로그인 처리
  const login = useCallback((user) => {
    setCurrentUser({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      name: user.nickname,
      role: user.role,
    });
    // 로그인 후 추천 목록 다시 가져오기
    getCurrentUserQuestionLikes()
      .then((likedData) => {
        const likedIds = new Set((likedData || []).map(q => String(q.id)));
        setLikedQuestionIds(likedIds);
      })
      .catch((error) => {
        console.error('추천 목록 조회 실패:', error);
        setLikedQuestionIds(new Set());
      });
  }, []);

  // 회원가입 처리 (로그인과 동일)
  const signup = useCallback((user) => {
    login(user);
  }, [login]);

  // 로그아웃 처리
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 로그아웃 API 에러가 나도 로컬 상태는 초기화
    } finally {
      // 전역 상태 초기화
      setCurrentUser(null);
      setLikedQuestionIds(new Set());
    }
  }, []);

  // 추천 상태 토글
  const toggleQuestionLike = useCallback((questionId) => {
    setLikedQuestionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(String(questionId))) {
        newSet.delete(String(questionId));
      } else {
        newSet.add(String(questionId));
      }
      return newSet;
    });
  }, []);

  const value = {
    currentUser,
    isCheckingAuth,
    likedQuestionIds,
    login,
    signup,
    logout,
    checkAuth,
    toggleQuestionLike,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

