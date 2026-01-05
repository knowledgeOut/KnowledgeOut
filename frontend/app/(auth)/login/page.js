'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '../../../features/auth/api';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { getErrorMessage, ErrorCode, isErrorCode } from '../../../lib/errorCodes';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            await login(formData);
            // 로그인 성공 시 세션 쿠키(JSESSIONID)가 자동으로 저장됩니다
            // Spring Security 세션 기반 인증을 사용하므로 클라이언트에서 사용자 정보를 저장하지 않습니다
            // 로그인 성공 시 쿼리 파라미터 없이 메인 페이지로 이동
            router.push('/');
            router.refresh();
        } catch (error) {
            // ErrorCode를 사용하여 일관된 에러 메시지 처리
            let errorMessage = getErrorMessage(error.message);

            // 로그인 관련 에러인 경우 통일된 메시지로 변환
            if (
                isErrorCode(errorMessage, 'LOGIN_REQUIRED') ||
                isErrorCode(errorMessage, 'AUTHENTICATION_FAILED') ||
                isErrorCode(errorMessage, 'INVALID_EMAIL_OR_PASSWORD') ||
                (error.response && error.response.status === 401)
            ) {
                errorMessage = ErrorCode.INVALID_EMAIL_OR_PASSWORD;
            }
            
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        로그인
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        계정이 없으신가요?{' '}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            회원가입
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
                                placeholder="example@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
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
                            {isSubmitting ? '로그인 중...' : '로그인'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
