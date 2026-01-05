'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signup } from '@/features/auth/api';
import { getErrorMessage, ErrorCode, isErrorCode } from '@/lib/errorCodes';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // 필드 변경 시 해당 필드의 에러 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
        setSubmitError('');
    };

    const validate = () => {
        const newErrors = {};

        // 이메일 검증
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        // 비밀번호 검증
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 8) {
            newErrors.password = ErrorCode.PASSWORD_POLICY_VIOLATION;
        }

        // 닉네임 검증
        if (!formData.nickname) {
            newErrors.nickname = '닉네임을 입력해주세요.';
        } else if (formData.nickname.length < 2) {
            newErrors.nickname = ErrorCode.NICKNAME_LENGTH_VIOLATION;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await signup(formData);
            // 회원가입 성공 시 로그인 페이지로 리다이렉트
            router.push('/login?signup=success');
        } catch (error) {
            // ErrorCode를 사용하여 일관된 에러 메시지 처리
            const errorMessage = getErrorMessage(error.message);
            
            // 서버 에러를 개별 필드에 매핑
            if (isErrorCode(errorMessage, 'DUPLICATE_EMAIL')) {
                setErrors(prev => ({
                    ...prev,
                    email: errorMessage,
                }));
            } else if (isErrorCode(errorMessage, 'NICKNAME_DUPLICATED')) {
                setErrors(prev => ({
                    ...prev,
                    nickname: errorMessage,
                }));
            } else if (isErrorCode(errorMessage, 'PASSWORD_POLICY_VIOLATION')) {
                setErrors(prev => ({
                    ...prev,
                    password: errorMessage,
                }));
            } else {
                setSubmitError(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        회원가입
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            로그인
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'border-red-500' : ''}
                                placeholder="example@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
                                닉네임
                            </label>
                            <Input
                                id="nickname"
                                name="nickname"
                                type="text"
                                autoComplete="nickname"
                                required
                                value={formData.nickname}
                                onChange={handleChange}
                                className={errors.nickname ? 'border-red-500' : ''}
                                placeholder="닉네임을 입력하세요"
                            />
                            {errors.nickname && (
                                <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                비밀번호
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'border-red-500' : ''}
                                placeholder="8자 이상 입력하세요"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '가입 중...' : '회원가입'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

