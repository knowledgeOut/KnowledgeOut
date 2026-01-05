"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/common/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDisplayName } from "@/utils/user";

export function Header() {
  const router = useRouter();
  const { currentUser, isCheckingAuth, login, signup, logout } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState("login");

  const handleLogin = (user) => {
    login(user);
    setShowAuthDialog(false);
  };

  const handleSignup = (user) => {
    signup(user);
    setShowAuthDialog(false);
  };

  const handleLogout = async () => {
    await logout();
    // 홈으로 이동
    router.push("/");
  };

  const handleMyPage = () => {
    router.push("/?mypage=true");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="cursor-pointer"
              onClick={() => router.push("/")}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                질의응답 게시판
              </h1>
              <p className="text-sm text-gray-600">
                궁금한 점을 자유롭게 질문하고 답변을 나눠보세요
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {isCheckingAuth ? (
                <div className="text-sm text-gray-400">로딩 중...</div>
              ) : currentUser ? (
                <>
                  <span className="flex items-center gap-2 text-gray-700 text-sm">
                    <UserIcon className="w-4 h-4" />
                    {getUserDisplayName(currentUser.name)}님
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMyPage}
                  >
                    마이페이지
                  </Button>
                  {currentUser.role === "ROLE_ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/admin/dashboard")}
                      className="gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      대시보드
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAuthDialogTab("login");
                      setShowAuthDialog(true);
                    }}
                  >
                    로그인
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAuthDialogTab("signup");
                      setShowAuthDialog(true);
                    }}
                  >
                    회원가입
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultTab={authDialogTab}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </>
  );
}

