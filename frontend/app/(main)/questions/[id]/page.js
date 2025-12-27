export default function QuestionDetailPage({ params }) {
    const { id } = params;

    return (
        <div>
            <h1>질문 상세</h1>
            <p>질문 ID: {id}</p>
            {/* TODO: 질문 상세 정보, 답변 목록, 추천 기능 구현 */}
        </div>
    );
}

