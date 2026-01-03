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
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboard();
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
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">대시보드 데이터를 불러오는 중...</div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 최근 인기 태그 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🔥 누적 인기 태그 (Top 5)</h2>
            <ul className="list-disc list-inside">
              {dashboardData.topTags.map((tag, index) => (
                <li key={index} className="text-lg text-gray-700">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* 최근 인기 카테고리 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📂 누적 인기 카테고리 (Top 5)</h2>
            <ul className="list-disc list-inside">
              {dashboardData.topCategories.map((category, index) => (
                <li key={index} className="text-lg text-gray-700">
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 카테고리별 질문 수 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📊 카테고리별 질문 분포</h2>
            <div className="h-64 flex justify-center">
              <Pie data={categoryChartData} />
            </div>
          </div>

          {/* 태그별 질문 수 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🏷️ 태그별 질문 수 (Top 10)</h2>
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
