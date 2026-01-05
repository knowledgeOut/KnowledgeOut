'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupForm({
  nickname,
  email,
  password,
  confirmPassword,
  fieldErrors,
  error,
  isSubmitting,
  onNicknameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="signup-nickname">닉네임</Label>
        <Input
          id="signup-nickname"
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          placeholder="닉네임을 입력하세요"
          required
          className={fieldErrors.nickname ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {fieldErrors.nickname && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.nickname}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signup-email">이메일</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="example@email.com"
          required
          className={fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signup-password">비밀번호</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="8자 이상 입력하세요"
          required
          className={fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>
      <div>
        <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          placeholder="비밀번호 확인"
          required
          className={fieldErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}

