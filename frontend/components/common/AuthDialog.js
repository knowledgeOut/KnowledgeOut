"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signup, login } from "@/features/auth/api";
import { getCurrentUser } from "@/features/member/api";
import { getErrorMessage, ErrorCode, isErrorCode } from "@/lib/errorCodes";

export function AuthDialog({
  open,
  onClose,
  defaultTab = "login",
  onLogin,
  onSignup,
}) {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupNickname, setSignupNickname] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupFieldErrors, setSignupFieldErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 입력값 초기화 함수
  const resetFormFields = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupNickname("");
    setSignupConfirmPassword("");
    setLoginError("");
    setSignupError("");
    setSignupFieldErrors({
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // 창이 닫힐 때 입력값 초기화
  useEffect(() => {
    if (!open) {
      resetFormFields();
    }
  }, [open]);

  // 탭 변경 핸들러
  const handleTabChange = (value) => {
    resetFormFields();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginSubmitting(true);

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
      });

      // 로그인 성공 후 사용자 정보 가져오기 (Spring Security 세션 기반)
      try {
        const userData = await getCurrentUser();
        if (userData && onLogin) {
          onLogin({
            id: userData.id,
            email: userData.email,
            nickname: userData.nickname,
            name: userData.nickname, // name 필드도 nickname으로 설정
            role: userData.role, // 관리자 권한 확인을 위해 role 추가
          });
        } else if (onLogin) {
          // 사용자 정보 가져오기 실패 시 이메일만 전달
          onLogin({ email: loginEmail });
        }
      } catch (userError) {
        // 사용자 정보 가져오기 실패 시 이메일만 전달
        if (onLogin) {
          onLogin({ email: loginEmail });
        }
      }

      setLoginEmail("");
      setLoginPassword("");
      onClose();
      // 로그인 성공 시 쿼리 파라미터 없이 메인 페이지로 이동
      router.push("/");
      router.refresh();
    } catch (error) {
      // ErrorCode를 사용하여 일관된 에러 메시지 처리
      let errorMessage = getErrorMessage(error.message);

      // 로그인 관련 에러인 경우 통일된 메시지로 변환
      if (
        isErrorCode(errorMessage, "LOGIN_REQUIRED") ||
        isErrorCode(errorMessage, "AUTHENTICATION_FAILED") ||
        isErrorCode(errorMessage, "INVALID_EMAIL_OR_PASSWORD") ||
        (error.response && error.response.status === 401)
      ) {
        errorMessage = ErrorCode.INVALID_EMAIL_OR_PASSWORD;
      }

      setLoginError(errorMessage);
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupFieldErrors({
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // 닉네임 검증
    if (!signupNickname || signupNickname.trim().length < 2) {
      setSignupFieldErrors(prev => ({
        ...prev,
        nickname: ErrorCode.NICKNAME_LENGTH_VIOLATION,
      }));
      return;
    }

    // 비밀번호 길이 검증
    if (signupPassword.length < 8) {
      setSignupFieldErrors(prev => ({
        ...prev,
        password: ErrorCode.PASSWORD_POLICY_VIOLATION,
      }));
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupFieldErrors(prev => ({
        ...prev,
        confirmPassword: ErrorCode.PASSWORD_MISMATCH,
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // 회원가입 요청
      await signup({
        email: signupEmail,
        password: signupPassword,
        nickname: signupNickname,
      });

      // 회원가입 성공 후 자동 로그인하여 사용자 정보 가져오기
      try {
        await login({
          email: signupEmail,
          password: signupPassword,
        });

        // 로그인 성공 후 사용자 정보 가져오기
        try {
          const userData = await getCurrentUser();
          if (userData && onSignup) {
            onSignup({
              id: userData.id,
              email: userData.email,
              nickname: userData.nickname,
              name: userData.nickname, // name 필드도 nickname으로 설정
              role: userData.role, // 관리자 권한 확인을 위해 role 추가
            });
          } else if (onSignup) {
            // 사용자 정보 가져오기 실패 시 기본 정보만 전달
            onSignup({
              email: signupEmail,
              nickname: signupNickname,
            });
          }
        } catch (userError) {
          // 사용자 정보 가져오기 실패 시 기본 정보만 전달
          if (onSignup) {
            onSignup({
              email: signupEmail,
              nickname: signupNickname,
            });
          }
        }
      } catch (loginError) {
        // 자동 로그인 실패 시 회원가입 정보만 전달
        if (onSignup) {
          onSignup({
            email: signupEmail,
            nickname: signupNickname,
          });
        }
      }

      setSignupEmail("");
      setSignupPassword("");
      setSignupNickname("");
      setSignupConfirmPassword("");
      setSignupFieldErrors({
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      onClose();
      alert("회원가입이 완료되었습니다!");
      router.push("/");
    } catch (error) {
      const errorMessage = getErrorMessage(error.message);
      
      // 서버 에러를 개별 필드에 매핑
      if (isErrorCode(errorMessage, "DUPLICATE_EMAIL")) {
        setSignupFieldErrors(prev => ({
          ...prev,
          email: errorMessage,
        }));
      } else if (isErrorCode(errorMessage, "NICKNAME_DUPLICATED")) {
        setSignupFieldErrors(prev => ({
          ...prev,
          nickname: errorMessage,
        }));
      } else if (isErrorCode(errorMessage, "PASSWORD_POLICY_VIOLATION")) {
        setSignupFieldErrors(prev => ({
          ...prev,
          password: errorMessage,
        }));
      } else {
        setSignupError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>계정</DialogTitle>
          <DialogDescription>
            로그인하거나 새 계정을 만들어보세요.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="login-email">이메일</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="비밀번호"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-500 text-sm">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoginSubmitting}
              >
                {isLoginSubmitting ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="signup-nickname">닉네임</Label>
                <Input
                  id="signup-nickname"
                  value={signupNickname}
                  onChange={(e) => {
                    setSignupNickname(e.target.value);
                    setSignupFieldErrors(prev => ({ ...prev, nickname: "" }));
                  }}
                  placeholder="닉네임을 입력하세요"
                  required
                  className={signupFieldErrors.nickname ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {signupFieldErrors.nickname && (
                  <p className="text-xs text-red-500 mt-1">{signupFieldErrors.nickname}</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-email">이메일</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    setSignupFieldErrors(prev => ({ ...prev, email: "" }));
                  }}
                  placeholder="example@email.com"
                  required
                  className={signupFieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {signupFieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{signupFieldErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    setSignupFieldErrors(prev => ({ ...prev, password: "" }));
                  }}
                  placeholder="8자 이상 입력하세요"
                  required
                  className={signupFieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {signupFieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{signupFieldErrors.password}</p>
                )}
              </div>
              <div>
                <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => {
                    setSignupConfirmPassword(e.target.value);
                    setSignupFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="비밀번호 확인"
                  required
                  className={signupFieldErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {signupFieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{signupFieldErrors.confirmPassword}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
