"use client"; // Next.js App Router에서 useState 사용 시 필수

import { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  // 모드 상태: 'login' 또는 'signup'
  const [mode, setMode] = useState("login");

  // 입력 데이터 상태
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러 (로그인/회원가입 분기)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 회원가입 로직
    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      try {
        // 백엔드 API 호출
        const res = await fetch(
          "http://localhost:8080/api/knowledgeout/members/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              nickname: formData.nickname, // 화면엔 '이름'으로 보이지만 백엔드엔 nickname으로 전송
            }),
          }
        );

        if (res.ok) {
          alert("회원가입이 완료되었습니다! 로그인해주세요.");
          setMode("login"); // 가입 성공 시 로그인 탭으로 전환
          setFormData({
            nickname: "",
            email: "",
            password: "",
            confirmPassword: "",
          }); // 폼 초기화
        } else {
          // 에러 처리 (예: 중복 이메일)
          const errorMsg = await res.text(); // 혹은 res.json()
          alert(`가입 실패: ${errorMsg}`);
        }
      } catch (err) {
        console.error(err);
        alert("서버와 연결할 수 없습니다.");
      }
    }

    // 2. 로그인 로직 (추후 구현 예정)
    else {
      console.log("로그인 시도:", formData.email);
      alert("로그인 기능은 아직 구현 중입니다.");
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 배경 오버레이 (클릭 시 닫힘)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 모달 박스 (내부 클릭 시 닫힘 방지) */}
      <div
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 & 닫기 버튼 */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">계정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <p className="text-gray-500 mb-6 text-sm">
          로그인하거나 새 계정을 만들어보세요.
        </p>

        {/* 탭 전환 버튼 (로그인 vs 회원가입) */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-6">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("login")}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
              mode === "signup"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("signup")}
          >
            회원가입
          </button>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 회원가입일 때만 이름(닉네임) 표시 */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                이름
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
              required
            />
          </div>

          {/* 회원가입일 때만 비밀번호 확인 표시 */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 mt-6"
          >
            {mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
