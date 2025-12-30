"use client"; // 상태 관리(useState)를 위해 필수

import { useState } from "react";
// components 폴더가 app 폴더와 같은 레벨(루트)에 있다고 가정
import AuthModal from "../components/AuthModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* 1. 테스트용 제목 */}
      <h1 className="text-3xl font-bold mb-8">UI & 기능 테스트 페이지</h1>

      {/* 2. 모달 여는 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-black text-white text-lg font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
      >
        회원가입
      </button>

      {/* 3. 모달 컴포넌트 (상태 전달) */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
