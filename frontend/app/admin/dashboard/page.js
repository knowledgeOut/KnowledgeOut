"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Button } from "@/components/ui/button";
// [추가] 기간 선택을 위한 Select 컴포넌트 임포트 (shadcn/ui)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboard } from "@/features/admin/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // [추가] 기간 선택 상태 (기본값: 7일)
  const [period, setPeriod] = useState("7"); 
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 기간이 변경될 때마다 로딩 상태로 전환
      setLoading(true); 
      try {
        // [수정] 선택된 period를 숫자로 변환하여 API에 전달
        const data = await getDashboard(Number(period));
        setDashboardData(data);
        setError(null);
      } catch (error) {
        console.error("대시보드 데이터 로딩 실패:", error);
        setError(error.message);
        if (error.message?.includes("권한") || error.response?.status === 403) {
          alert("관리자 권한이 없습니다.");
          router.push("/");
        } else if (error.message?.includes("로그인") || error.response?.status === 401) {
          alert("로그인이 필요합니다.");
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, period]); // [수정] period가 변경될 때마다 useEffect 재실행

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            메인으로 돌아가기
          </Button>
          <div className="bg-red-50 text-red-600 p-6 rounded-lg">
            {error || "데이터를 불러올 수 없습니다."}
          </div>
        </div>
      </div>
    );
  }

  // 카테고리별 질문 수 (Pie Chart)
  const categoryChartData = {
    labels: Object.keys(dashboardData.categoryCount),
    datasets: [
      {
        label: "질문 수",
        data: Object.values(dashboardData.categoryCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 태그별 질문 수 (Bar Chart)
  const tagChartData = {
    labels: Object.keys(dashboardData.tagCount),
    datasets: [
      {
        label: "질문 수",
        data: Object.values(dashboardData.tagCount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // 기간에 따른 텍스트 표시 헬퍼
  const getPeriodText = () => {
    if (period === "1") return "최근 24시간";
    if (period === "7") return "최근 7일";
    return "최근 30일";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              메인으로
            </Button>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          </div>

          {/* [추가] 기간 선택 드롭다운 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">조회 기간:</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">최근 24시간</SelectItem>
                <SelectItem value="7">최근 7일</SelectItem>
                <SelectItem value="30">최근 30일</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 인기 태그 (기간 적용) */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">🔥 인기 태그 ({getPeriodText()})</h2>
            
            {/* 데이터 유무에 따른 조건부 렌더링 */}
            {dashboardData.topTags && dashboardData.topTags.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2">
                {dashboardData.topTags.map((item, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    <span className="font-bold mr-2">{item.name}</span>
                    <span className="text-gray-500 text-sm">({item.count}회)</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                해당 기간에 등록된 태그가 없습니다.
              </div>
            )}
          </div>

          {/* 인기 카테고리 (기간 적용) */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">📂 인기 카테고리 ({getPeriodText()})</h2>
            
             {/* 데이터 유무에 따른 조건부 렌더링 */}
             {dashboardData.topCategories && dashboardData.topCategories.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2">
                {dashboardData.topCategories.map((item, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    <span className="font-bold mr-2">{item.name}</span>
                    <span className="text-gray-500 text-sm">({item.count}회)</span>
                  </li>
                ))}
              </ol>
             ) : (
               <div className="flex-1 flex items-center justify-center text-gray-400">
                해당 기간에 등록된 카테고리가 없습니다.
              </div>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 차트는 현재 백엔드 로직상 전체 기간 누적 데이터가 표시됩니다. */}
          {/* 카테고리별 질문 수 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📊 카테고리별 질문 분포 (전체 누적)</h2>
            <div className="h-64 flex justify-center">
              <Pie data={categoryChartData} />
            </div>
          </div>

          {/* 태그별 질문 수 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🏷️ 태그별 질문 수 (Top 10 누적)</h2>
            <div className="h-64">
              <Bar
                data={tagChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}