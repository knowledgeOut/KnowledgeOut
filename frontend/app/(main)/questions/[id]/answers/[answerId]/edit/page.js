export default function EditAnswerPage({ params }) {
    const { id, answerId } = params;

    return (
        <div>
            <h1>답변 수정</h1>
            <p>질문 ID: {id}</p>
            <p>답변 ID: {answerId}</p>
            {/* TODO: 답변 수정 폼 구현 */}
        </div>
    );
}

