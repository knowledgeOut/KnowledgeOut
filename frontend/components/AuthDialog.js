"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AuthDialog({ open, onClose, defaultTab = 'login', onLogin, onSignup }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 데모 버전: 저장된 사용자 목록에서 찾기
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = savedUsers.find((u) => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      onLogin({ name: user.name, email: user.email });
      setLoginEmail('');
      setLoginPassword('');
      onClose();
    } else {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 데모 버전: localStorage에 사용자 정보 저장
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 이메일 중복 체크
    if (savedUsers.some((u) => u.email === signupEmail)) {
      alert('이미 등록된 이메일입니다.');
      return;
    }
    
    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(savedUsers));
    
    onSignup({ name: signupName, email: signupEmail });
    setSignupEmail('');
    setSignupPassword('');
    setSignupName('');
    setSignupConfirmPassword('');
    onClose();
    alert('회원가입이 완료되었습니다!');
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
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="signup-name">이름</Label>
                <Input
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="홍길동"
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
                  placeholder="비밀번호"
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
              <Button type="submit" className="w-full">
                회원가입
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

