"use client";

import { useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { signup, login } from "@/features/auth/api";
import { getCurrentUser } from "@/features/member/api";
import { getErrorMessage, ErrorCode, isErrorCode } from "@/lib/errorCodes";

// 초기 상태
const initialState = {
  login: {
    email: "",
    password: "",
    error: "",
    isSubmitting: false,
  },
  signup: {
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    fieldErrors: {
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    isSubmitting: false,
  },
};

// Action types
const ActionType = {
  // Login actions
  SET_LOGIN_EMAIL: "SET_LOGIN_EMAIL",
  SET_LOGIN_PASSWORD: "SET_LOGIN_PASSWORD",
  SET_LOGIN_ERROR: "SET_LOGIN_ERROR",
  SET_LOGIN_SUBMITTING: "SET_LOGIN_SUBMITTING",
  RESET_LOGIN: "RESET_LOGIN",
  
  // Signup actions
  SET_SIGNUP_NICKNAME: "SET_SIGNUP_NICKNAME",
  SET_SIGNUP_EMAIL: "SET_SIGNUP_EMAIL",
  SET_SIGNUP_PASSWORD: "SET_SIGNUP_PASSWORD",
  SET_SIGNUP_CONFIRM_PASSWORD: "SET_SIGNUP_CONFIRM_PASSWORD",
  SET_SIGNUP_ERROR: "SET_SIGNUP_ERROR",
  SET_SIGNUP_FIELD_ERROR: "SET_SIGNUP_FIELD_ERROR",
  SET_SIGNUP_FIELD_ERRORS: "SET_SIGNUP_FIELD_ERRORS",
  SET_SIGNUP_SUBMITTING: "SET_SIGNUP_SUBMITTING",
  RESET_SIGNUP: "RESET_SIGNUP",
  
  // Reset all
  RESET_ALL: "RESET_ALL",
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    // Login actions
    case ActionType.SET_LOGIN_EMAIL:
      return {
        ...state,
        login: {
          ...state.login,
          email: action.payload,
          error: "", // 입력 시 에러 초기화
        },
      };
    case ActionType.SET_LOGIN_PASSWORD:
      return {
        ...state,
        login: {
          ...state.login,
          password: action.payload,
          error: "", // 입력 시 에러 초기화
        },
      };
    case ActionType.SET_LOGIN_ERROR:
      return {
        ...state,
        login: {
          ...state.login,
          error: action.payload,
        },
      };
    case ActionType.SET_LOGIN_SUBMITTING:
      return {
        ...state,
        login: {
          ...state.login,
          isSubmitting: action.payload,
        },
      };
    case ActionType.RESET_LOGIN:
      return {
        ...state,
        login: initialState.login,
      };
    
    // Signup actions
    case ActionType.SET_SIGNUP_NICKNAME:
      return {
        ...state,
        signup: {
          ...state.signup,
          nickname: action.payload,
          fieldErrors: {
            ...state.signup.fieldErrors,
            nickname: "", // 입력 시 에러 초기화
          },
        },
      };
    case ActionType.SET_SIGNUP_EMAIL:
      return {
        ...state,
        signup: {
          ...state.signup,
          email: action.payload,
          fieldErrors: {
            ...state.signup.fieldErrors,
            email: "", // 입력 시 에러 초기화
          },
        },
      };
    case ActionType.SET_SIGNUP_PASSWORD:
      return {
        ...state,
        signup: {
          ...state.signup,
          password: action.payload,
          fieldErrors: {
            ...state.signup.fieldErrors,
            password: "", // 입력 시 에러 초기화
          },
        },
      };
    case ActionType.SET_SIGNUP_CONFIRM_PASSWORD:
      return {
        ...state,
        signup: {
          ...state.signup,
          confirmPassword: action.payload,
          fieldErrors: {
            ...state.signup.fieldErrors,
            confirmPassword: "", // 입력 시 에러 초기화
          },
        },
      };
    case ActionType.SET_SIGNUP_ERROR:
      return {
        ...state,
        signup: {
          ...state.signup,
          error: action.payload,
        },
      };
    case ActionType.SET_SIGNUP_FIELD_ERROR:
      return {
        ...state,
        signup: {
          ...state.signup,
          fieldErrors: {
            ...state.signup.fieldErrors,
            [action.payload.field]: action.payload.error,
          },
        },
      };
    case ActionType.SET_SIGNUP_FIELD_ERRORS:
      return {
        ...state,
        signup: {
          ...state.signup,
          fieldErrors: action.payload,
        },
      };
    case ActionType.SET_SIGNUP_SUBMITTING:
      return {
        ...state,
        signup: {
          ...state.signup,
          isSubmitting: action.payload,
        },
      };
    case ActionType.RESET_SIGNUP:
      return {
        ...state,
        signup: initialState.signup,
      };
    
    case ActionType.RESET_ALL:
      return initialState;
    
    default:
      return state;
  }
}

export function AuthDialog({
  open,
  onClose,
  defaultTab = "login",
  onLogin,
  onSignup,
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 창이 닫힐 때 입력값 초기화
  useEffect(() => {
    if (!open) {
      dispatch({ type: ActionType.RESET_ALL });
    }
  }, [open]);

  // 탭 변경 핸들러
  const handleTabChange = (value) => {
    dispatch({ type: ActionType.RESET_ALL });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: ActionType.SET_LOGIN_ERROR, payload: "" });
    dispatch({ type: ActionType.SET_LOGIN_SUBMITTING, payload: true });

    try {
      await login({
        email: state.login.email,
        password: state.login.password,
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
          onLogin({ email: state.login.email });
        }
      } catch (userError) {
        // 사용자 정보 가져오기 실패 시 이메일만 전달
        if (onLogin) {
          onLogin({ email: state.login.email });
        }
      }

      dispatch({ type: ActionType.RESET_LOGIN });
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

      dispatch({ type: ActionType.SET_LOGIN_ERROR, payload: errorMessage });
    } finally {
      dispatch({ type: ActionType.SET_LOGIN_SUBMITTING, payload: false });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch({ type: ActionType.SET_SIGNUP_ERROR, payload: "" });
    dispatch({
      type: ActionType.SET_SIGNUP_FIELD_ERRORS,
      payload: {
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

    // 닉네임 검증
    if (!state.signup.nickname || state.signup.nickname.trim().length < 2) {
      dispatch({
        type: ActionType.SET_SIGNUP_FIELD_ERROR,
        payload: {
          field: "nickname",
          error: ErrorCode.NICKNAME_LENGTH_VIOLATION,
        },
      });
      return;
    }

    // 비밀번호 길이 검증
    if (state.signup.password.length < 8) {
      dispatch({
        type: ActionType.SET_SIGNUP_FIELD_ERROR,
        payload: {
          field: "password",
          error: ErrorCode.PASSWORD_POLICY_VIOLATION,
        },
      });
      return;
    }

    if (state.signup.password !== state.signup.confirmPassword) {
      dispatch({
        type: ActionType.SET_SIGNUP_FIELD_ERROR,
        payload: {
          field: "confirmPassword",
          error: ErrorCode.PASSWORD_MISMATCH,
        },
      });
      return;
    }

    dispatch({ type: ActionType.SET_SIGNUP_SUBMITTING, payload: true });

    try {
      // 회원가입 요청
      await signup({
        email: state.signup.email,
        password: state.signup.password,
        nickname: state.signup.nickname,
      });

      // 회원가입 성공 후 자동 로그인하여 사용자 정보 가져오기
      try {
        await login({
          email: state.signup.email,
          password: state.signup.password,
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
              email: state.signup.email,
              nickname: state.signup.nickname,
            });
          }
        } catch (userError) {
          // 사용자 정보 가져오기 실패 시 기본 정보만 전달
          if (onSignup) {
            onSignup({
              email: state.signup.email,
              nickname: state.signup.nickname,
            });
          }
        }
      } catch (loginError) {
        // 자동 로그인 실패 시 회원가입 정보만 전달
        if (onSignup) {
          onSignup({
            email: state.signup.email,
            nickname: state.signup.nickname,
          });
        }
      }

      dispatch({ type: ActionType.RESET_SIGNUP });
      onClose();
      alert("회원가입이 완료되었습니다!");
      router.push("/");
    } catch (error) {
      const errorMessage = getErrorMessage(error.message);
      
      // 서버 에러를 개별 필드에 매핑
      if (isErrorCode(errorMessage, "DUPLICATE_EMAIL")) {
        dispatch({
          type: ActionType.SET_SIGNUP_FIELD_ERROR,
          payload: {
            field: "email",
            error: errorMessage,
          },
        });
      } else if (isErrorCode(errorMessage, "NICKNAME_DUPLICATED")) {
        dispatch({
          type: ActionType.SET_SIGNUP_FIELD_ERROR,
          payload: {
            field: "nickname",
            error: errorMessage,
          },
        });
      } else if (isErrorCode(errorMessage, "PASSWORD_POLICY_VIOLATION")) {
        dispatch({
          type: ActionType.SET_SIGNUP_FIELD_ERROR,
          payload: {
            field: "password",
            error: errorMessage,
          },
        });
      } else {
        dispatch({ type: ActionType.SET_SIGNUP_ERROR, payload: errorMessage });
      }
    } finally {
      dispatch({ type: ActionType.SET_SIGNUP_SUBMITTING, payload: false });
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
            <LoginForm
              email={state.login.email}
              password={state.login.password}
              error={state.login.error}
              isSubmitting={state.login.isSubmitting}
              onEmailChange={(value) => {
                dispatch({ type: ActionType.SET_LOGIN_EMAIL, payload: value });
              }}
              onPasswordChange={(value) => {
                dispatch({ type: ActionType.SET_LOGIN_PASSWORD, payload: value });
              }}
              onSubmit={handleLogin}
            />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm
              nickname={state.signup.nickname}
              email={state.signup.email}
              password={state.signup.password}
              confirmPassword={state.signup.confirmPassword}
              fieldErrors={state.signup.fieldErrors}
              error={state.signup.error}
              isSubmitting={state.signup.isSubmitting}
              onNicknameChange={(value) => {
                dispatch({ type: ActionType.SET_SIGNUP_NICKNAME, payload: value });
              }}
              onEmailChange={(value) => {
                dispatch({ type: ActionType.SET_SIGNUP_EMAIL, payload: value });
              }}
              onPasswordChange={(value) => {
                dispatch({ type: ActionType.SET_SIGNUP_PASSWORD, payload: value });
              }}
              onConfirmPasswordChange={(value) => {
                dispatch({ type: ActionType.SET_SIGNUP_CONFIRM_PASSWORD, payload: value });
              }}
              onSubmit={handleSignup}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
