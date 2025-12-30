"use client";

import { useRouter } from "next/navigation";
import { QuestionForm } from "@/components/QuestionForm";

export default function QuestionPage() {
  const router = useRouter();

  const handleAddQuestion = (newQuestion) => {
    // 실제 운영 시에는 여기서 API를 호출하여 DB에 저장합니다.
    console.log("New Question with Tags:", newQuestion);
    // 메인 페이지의 handleAddQuestion 로직과 맞추기 위해 
    // 실제로는 전역 상태 관리나 서버 API를 통해 데이터가 추가되어야 합니다.
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <QuestionForm onSubmit={handleAddQuestion} onCancel={handleCancel} />
      </div>
    </div>
  );
}

