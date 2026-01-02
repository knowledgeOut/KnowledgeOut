'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { updateMember } from '@/features/member/api';

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

    // 사용자 정보가 변경되면 폼 초기화
    useEffect(() => {
        setEditForm({
            nickname: user?.nickname || user?.name || '',
            password: '',
            confirmPassword: '',
        });
        setPasswordError('');
    }, [user]);

    const handleSubmit = async () => {
        const originalNickname = user?.nickname || user?.name || '';
        const nicknameChanged = editForm.nickname.trim() !== originalNickname;
        const passwordChanged = editForm.password && editForm.password.trim().length > 0;

        // 최소 하나는 변경되어야 함
        if (!nicknameChanged && !passwordChanged) {
            alert('변경할 내용이 없습니다.');
            return;
        }

        // 유효성 검사
        if (nicknameChanged) {
            if (!editForm.nickname || editForm.nickname.trim().length < 2) {
                alert('닉네임은 2자 이상이어야 합니다.');
                return;
            }
        }

        if (passwordChanged) {
            if (editForm.password.length < 8) {
                setPasswordError('비밀번호는 8자 이상이어야 합니다.');
                return;
            }

            if (editForm.password !== editForm.confirmPassword) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
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
            // 비밀번호 변경 시도 시 발생한 에러인 경우 비밀번호 입력창에 표시
            if (passwordChanged && (error.message?.includes('비밀번호') || error.message?.includes('동일한'))) {
                setPasswordError(error.message);
                // 에러 발생 시 비밀번호 입력창 비우기
                setEditForm({
                    ...editForm,
                    password: '',
                    confirmPassword: '',
                });
            } else {
                alert(error.message || '회원 정보 수정에 실패했습니다.');
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
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        회원 정보
                    </CardTitle>
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
                                        onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                                        placeholder="닉네임을 입력하세요"
                                        minLength={2}
                                    />
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
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 w-16">닉네임</span>
                        <span className="font-medium">{user.nickname || user.name}</span>
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

