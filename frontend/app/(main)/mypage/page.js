'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowLeft, User, FileText, MessageCircle, ThumbsUp, Mail} from 'lucide-react';
import * as memberApi from '../../../features/member/api';
import {useLogout} from '../../../features/auth/hooks';

export default function MyPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('questions');
    
    // 탭별 데이터 상태
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [likedQuestions, setLikedQuestions] = useState([]);
    const [loadingTab, setLoadingTab] = useState(false);

    // 수정 폼 상태
    const [editForm, setEditForm] = useState({
        email: '',
        nickname: '',
        password: '',
    });

    const {logout: handleLogoutApi} = useLogout();

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchTabData(activeTab);
        }
    }, [activeTab, user?.id]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            // Spring Security 세션 기반 인증을 사용하므로 세션 쿠키가 자동으로 전송됩니다
            const userData = await memberApi.getMyPage();
            setUser(userData);
            setEditForm({
                email: userData.email || '',
                nickname: userData.nickname || '',
                password: '',
            });
            setError(null);
        } catch (err) {
            setError(err.message || '마이페이지 정보를 불러올 수 없습니다.');
            // 인증 에러인 경우 로그인 페이지로 리다이렉트
            if (err.message.includes('로그인') || err.response?.status === 401 || err.response?.status === 403) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchTabData = async (tab) => {
        if (!user?.id) return;
        
        try {
            setLoadingTab(true);
            switch (tab) {
                case 'questions':
                    const questionsData = await memberApi.getMyQuestions();
                    setQuestions(questionsData || []);
                    break;
                case 'answers':
                    const answersData = await memberApi.getMyAnswers();
                    setAnswers(answersData || []);
                    break;
                case 'liked':
                    const likedData = await memberApi.getMyQuestionLikes();
                    setLikedQuestions(likedData || []);
                    break;
            }
        } catch (err) {
            console.error('Failed to fetch tab data:', err);
        } finally {
            setLoadingTab(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            email: user?.email || '',
            nickname: user?.nickname || '',
            password: '',
        });
        setError(null);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            const updateData = {};

            if (editForm.nickname && editForm.nickname !== user.nickname) {
                updateData.nickname = editForm.nickname;
            }
            if (editForm.password) {
                updateData.password = editForm.password;
            }

            if (Object.keys(updateData).length === 0) {
                setIsEditing(false);
                setLoading(false);
                return;
            }

            // Spring Security 세션 기반 인증을 사용하므로 세션 쿠키가 자동으로 전송됩니다
            const updatedUser = await memberApi.updateMember(updateData);
            setUser(updatedUser);
            setIsEditing(false);
            setEditForm({
                email: updatedUser.email || '',
                nickname: updatedUser.nickname || '',
                password: '',
            });
        } catch (err) {
            setError(err.message || '회원 정보 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuestionClick = (questionId) => {
        router.push(`/questions/${questionId}`);
    };

    const handleLogout = () => {
        handleLogoutApi();
    };

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">로딩 중...</div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        로그인하러 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* 헤더 - 뒤로가기 및 로그아웃 버튼 */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        돌아가기
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>

                {/* 회원 정보 Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5"/>
                            회원 정보
                        </h2>
                    </div>
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        닉네임
                                    </label>
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={editForm.nickname}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        새 비밀번호 (변경 시에만 입력)
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={editForm.password}
                                        onChange={handleInputChange}
                                        placeholder="비밀번호를 변경하지 않으려면 비워두세요"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        저장
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 w-20">이름</span>
                                    <span className="font-medium text-gray-900">{!user?.nickname || user.nickname.startsWith('deletedUser_') ? '탈퇴한 사용자' : user.nickname}</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-500"/>
                                    <span className="text-sm text-gray-500 w-16">이메일</span>
                                    <span className="font-medium text-gray-900">{user?.email || '-'}</span>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        수정
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 내 활동 Tabs */}
                <div className="flex flex-col gap-2 space-y-4">
                    {/* Tabs Navigation */}
                    <div
                        role="tablist"
                        className="bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-3"
                    >
                        <button
                            type="button"
                            role="tab"
                            onClick={() => setActiveTab('questions')}
                            className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                                activeTab === 'questions'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            내 질문 ({questions.length})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            onClick={() => setActiveTab('answers')}
                            className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                                activeTab === 'answers'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            내 답변 ({answers.length})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            onClick={() => setActiveTab('liked')}
                            className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-2 ${
                                activeTab === 'liked'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            추천한 질문 ({likedQuestions.length})
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="flex-1 outline-none space-y-4">
                        {loadingTab ? (
                            <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 p-6">
                                <div className="text-center text-gray-500">로딩 중...</div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'questions' && (
                                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
                                        {questions.length === 0 ? (
                                            <div className="px-6 pt-6 pb-6 text-center text-gray-500">
                                                작성한 질문이 없습니다.
                                            </div>
                                        ) : (
                                            questions.map((question) => (
                                                <div
                                                    key={question.id}
                                                    onClick={() => handleQuestionClick(question.id)}
                                                    className="px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{question.content}</p>
                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                                                {question.categoryName && (
                                                                    <span className="px-2 py-1 bg-gray-100 rounded">{question.categoryName}</span>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <ThumbsUp className="w-3 h-3" />
                                                                    <span>{question.likeCount}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MessageCircle className="w-3 h-3" />
                                                                    <span>{question.answerCount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {activeTab === 'answers' && (
                                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
                                        {answers.length === 0 ? (
                                            <div className="px-6 pt-6 pb-6 text-center text-gray-500">
                                                작성한 답변이 없습니다.
                                            </div>
                                        ) : (
                                            answers.map((answer) => (
                                                <div
                                                    key={answer.answerId}
                                                    onClick={() => handleQuestionClick(answer.questionId)}
                                                    className="px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="mb-2">
                                                        <span className="text-sm text-gray-500">답변한 질문: </span>
                                                        <span className="text-sm font-medium text-gray-900">{answer.questionTitle}</span>
                                                    </div>
                                                    <p className="text-gray-700 mb-3 line-clamp-3">{answer.content}</p>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(answer.createdAt).toLocaleString('ko-KR')}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {activeTab === 'liked' && (
                                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
                                        {likedQuestions.length === 0 ? (
                                            <div className="px-6 pt-6 pb-6 text-center text-gray-500">
                                                추천한 질문이 없습니다.
                                            </div>
                                        ) : (
                                            likedQuestions.map((question) => (
                                                <div
                                                    key={question.id}
                                                    onClick={() => handleQuestionClick(question.id)}
                                                    className="px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{question.content}</p>
                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                                                                {question.categoryName && (
                                                                    <span className="px-2 py-1 bg-gray-100 rounded">{question.categoryName}</span>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <ThumbsUp className="w-3 h-3" />
                                                                    <span>{question.likeCount}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MessageCircle className="w-3 h-3" />
                                                                    <span>{question.answerCount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}