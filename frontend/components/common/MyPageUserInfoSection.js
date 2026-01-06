'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import * as authApi from '@/features/auth/api';
import { updateMember, withdraw } from '@/features/member/api';
import { getErrorMessage, ErrorCode, isErrorCode } from '@/lib/errorCodes';
import { getUserDisplayName } from '@/utils/user';

export function MyPageUserInfoSection({ user, onLogout }) {
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        nickname: user?.nickname || user?.name || '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // 사용자 정보가 변경되면 폼 초기화
    useEffect(() => {
        setEditForm({
            nickname: user?.nickname || user?.name || '',
            password: '',
            confirmPassword: '',
        });
        setPasswordError('');
        setNicknameError('');
    }, [user]);

    const handleSubmit = async () => {
        const originalNickname = user?.nickname || user?.name || '';
        const nicknameChanged = editForm.nickname.trim() !== originalNickname;
        const passwordChanged = editForm.password && editForm.password.trim().length > 0;

        // 최소 하나는 변경되어야 함
        if (!nicknameChanged && !passwordChanged) {
            alert(ErrorCode.NO_CHANGES_DETECTED);
            return;
        }

        // 유효성 검사
        if (nicknameChanged) {
            if (!editForm.nickname || editForm.nickname.trim().length < 2) {
                setNicknameError(ErrorCode.NICKNAME_LENGTH_VIOLATION);
                return;
            }
        }

        if (passwordChanged) {
            if (editForm.password.length < 8) {
                setPasswordError(ErrorCode.PASSWORD_POLICY_VIOLATION);
                return;
            }

            if (editForm.password !== editForm.confirmPassword) {
                setPasswordError(ErrorCode.PASSWORD_MISMATCH);
                return;
            }
        }

        try {
            setIsSubmitting(true);
            
            // 수정할 데이터 준비 (변경된 필드만 포함)
            const updateData = {};
            
            // 닉네임이 변경된 경우에만 포함
            if (nicknameChanged) {
                updateData.nickname = editForm.nickname.trim();
            }
            
            // 비밀번호가 변경된 경우에만 포함
            if (passwordChanged) {
                updateData.password = editForm.password;
            }

            await updateMember(updateData);
            
            alert('회원 정보가 수정되었습니다.');
            setIsEditDialogOpen(false);
            setPasswordError('');
            setNicknameError('');

            // 비밀번호가 변경된 경우 로그아웃
            if (passwordChanged) {
                if (onLogout) {
                    onLogout();
                }
                router.push('/');
            } else {
                // 닉네임만 변경된 경우 마이페이지 유지 (페이지 새로고침)
                window.location.reload();
            }
        } catch (error) {
            // ErrorCode를 사용하여 일관된 에러 메시지 처리
            const errorMessage = getErrorMessage(error.message);

            // 비밀번호 변경 시도 시 발생한 에러인 경우 비밀번호 입력창에 표시
            if (passwordChanged && (
                isErrorCode(errorMessage, 'PASSWORD_POLICY_VIOLATION') ||
                isErrorCode(errorMessage, 'PASSWORD_MISMATCH') ||
                isErrorCode(errorMessage, 'PASSWORD_SAME_AS_CURRENT')
            )) {
                setPasswordError(errorMessage);
                // 에러 발생 시 비밀번호 입력창 비우기
                setEditForm({
                    ...editForm,
                    password: '',
                    confirmPassword: '',
                });
            }
            // 닉네임 변경 시도 시 발생한 에러인 경우 닉네임 입력창에 표시
            else if (nicknameChanged && (
                isErrorCode(errorMessage, 'NICKNAME_LENGTH_VIOLATION') ||
                isErrorCode(errorMessage, 'NICKNAME_DUPLICATED')
            )) {
                setNicknameError(errorMessage);
            }
            else {
                alert(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEditDialogOpen(false);
        setEditForm({
            nickname: user?.nickname || user?.name || '',
            password: '',
            confirmPassword: '',
        });
        setPasswordError('');
        setNicknameError('');
    };

    const handleWithdraw = async () => {
        // 확인 다이얼로그
        const confirmed = window.confirm('정말 회원 탈퇴를 하시겠습니까? 탈퇴한 계정은 복구할 수 없습니다.');
        if (!confirmed) {
            return;
        }

        try {
            setIsWithdrawing(true);
            
            // 백엔드 회원 탈퇴 API 호출
            await withdraw();
            
            // 로그아웃 처리
            try {
                await authApi.logout();
            } catch (logoutError) {
                console.error('로그아웃 중 오류:', logoutError);
                // 로그아웃 실패해도 계속 진행
            }
            
            // 로그아웃 콜백 호출 (상태 초기화)
            if (onLogout) {
                onLogout();
            }
            
            alert('회원 탈퇴가 완료되었습니다.');
            
            // 메인페이지로 리다이렉트 후 페이지 새로고침하여 상태 완전히 초기화
            router.push('/');
            
            // 약간의 지연 후 페이지 새로고침하여 모든 상태 초기화
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            const errorMessage = getErrorMessage(error.message);
            alert(errorMessage);
        } finally {
            setIsWithdrawing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        회원 정보
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    수정
                                </Button>
                            </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>회원 정보 수정</DialogTitle>
                                <DialogDescription>
                                    닉네임과 비밀번호를 수정할 수 있습니다. 비밀번호는 변경하지 않으려면 비워두세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">이메일</Label>
                                    <Input
                                        id="edit-email"
                                        value={user.email}
                                        disabled
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-nickname">닉네임</Label>
                                    <Input
                                        id="edit-nickname"
                                        value={editForm.nickname}
                                        onChange={(e) => {
                                            setEditForm({ ...editForm, nickname: e.target.value });
                                            setNicknameError('');
                                        }}
                                        placeholder="닉네임을 입력하세요"
                                        minLength={2}
                                        className={nicknameError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {nicknameError ? (
                                        <p className="text-xs text-red-500">{nicknameError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500">닉네임은 2자 이상이어야 합니다.</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-password">새 비밀번호</Label>
                                    <Input
                                        id="edit-password"
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => {
                                            setEditForm({ ...editForm, password: e.target.value });
                                            setPasswordError('');
                                        }}
                                        placeholder="비밀번호를 변경하지 않으려면 비워두세요"
                                        minLength={8}
                                        className={passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {passwordError ? (
                                        <p className="text-xs text-red-500">{passwordError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500">비밀번호는 8자 이상이어야 합니다.</p>
                                    )}
                                </div>
                                {editForm.password && (
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-confirm-password">비밀번호 확인</Label>
                                        <Input
                                            id="edit-confirm-password"
                                            type="password"
                                            value={editForm.confirmPassword}
                                            onChange={(e) => {
                                                setEditForm({ ...editForm, confirmPassword: e.target.value });
                                                setPasswordError('');
                                            }}
                                            placeholder="비밀번호를 다시 입력하세요"
                                            className={passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    취소
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '수정 중...' : '수정'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleWithdraw}
                        disabled={isWithdrawing}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isWithdrawing ? '처리 중...' : '회원탈퇴'}
                    </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 w-16">닉네임</span>
                        <span className="font-medium">{getUserDisplayName(user.nickname || user.name)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 w-16">이메일</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

