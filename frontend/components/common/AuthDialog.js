'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { signup, login } from '../../features/auth/api';
import { useRouter } from 'next/navigation';

export function AuthDialog({ open, onClose, defaultTab = 'login', onLogin, onSignup }) {
    const router = useRouter();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupNickname, setSignupNickname] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoginSubmitting(true);

        try {
            await login({
                email: loginEmail,
                password: loginPassword,
            });
            
            // 로그인 성공
            if (onLogin) {
                onLogin({ email: loginEmail });
            }
            setLoginEmail('');
            setLoginPassword('');
            onClose();
            router.push('/');
        } catch (error) {
            setLoginError(error.message || '로그인에 실패했습니다.');
        } finally {
            setIsLoginSubmitting(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupError('');
        
        if (signupPassword !== signupConfirmPassword) {
            setSignupError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsSubmitting(true);

        try {
            await signup({
                email: signupEmail,
                password: signupPassword,
                nickname: signupNickname,
            });
            
            // 회원가입 성공
            if (onSignup) {
                onSignup({ email: signupEmail, nickname: signupNickname });
            }
            setSignupEmail('');
            setSignupPassword('');
            setSignupNickname('');
            setSignupConfirmPassword('');
            onClose();
            alert('회원가입이 완료되었습니다!');
        } catch (error) {
            setSignupError(error.message || '회원가입에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>계정</DialogTitle>
                    <DialogDescription>
                        로그인하거나 새 계정을 만들어보세요.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={defaultTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">로그인</TabsTrigger>
                        <TabsTrigger value="signup">회원가입</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4 pt-4">
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                    {loginError}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="login-email">이메일</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="login-password">비밀번호</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="비밀번호"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoginSubmitting}>
                                {isLoginSubmitting ? '로그인 중...' : '로그인'}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignup} className="space-y-4 pt-4">
                            {signupError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                    {signupError}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="signup-nickname">닉네임</Label>
                                <Input
                                    id="signup-nickname"
                                    value={signupNickname}
                                    onChange={(e) => setSignupNickname(e.target.value)}
                                    placeholder="닉네임을 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="signup-email">이메일</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="signup-password">비밀번호</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    placeholder="8자 이상 입력하세요"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                                <Input
                                    id="signup-confirm-password"
                                    type="password"
                                    value={signupConfirmPassword}
                                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                    placeholder="비밀번호 확인"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? '가입 중...' : '회원가입'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

