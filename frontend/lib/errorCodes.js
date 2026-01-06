/**
 * 에러 코드 및 메시지 상수
 * 백엔드 ErrorCode enum과 일치하도록 유지
 */
export const ErrorCode = {
  // 인증 관련
  INVALID_EMAIL_OR_PASSWORD: "이메일 또는 비밀번호가 올바르지 않습니다.",
  AUTHENTICATION_FAILED: "인증에 실패했습니다.",
  LOGIN_REQUIRED: "로그인이 필요합니다.",

  // 권한 관련
  ACCESS_DENIED: "본인만 수정할 수 있습니다.",

  // 회원 관련
  MEMBER_NOT_FOUND: "회원을 찾을 수 없습니다.",
  MEMBER_ALREADY_WITHDRAWN: "이미 탈퇴 처리된 회원입니다.",

  // 중복 관련
  DUPLICATE_EMAIL: "이미 가입된 이메일입니다.",
  NICKNAME_DUPLICATED: "이미 사용 중인 닉네임입니다.",
  NICKNAME_LENGTH_VIOLATION: "닉네임은 2자 이상이어야 합니다.",
  NO_CHANGES_DETECTED: "변경할 내용이 없습니다.",

  // 비밀번호 관련
  PASSWORD_POLICY_VIOLATION: "비밀번호는 8자 이상이어야 합니다.",
  PASSWORD_MISMATCH: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  PASSWORD_SAME_AS_CURRENT: "현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.",
};

/**
 * 서버에서 받은 에러 메시지를 ErrorCode와 매칭
 * @param {string} message - 서버에서 받은 에러 메시지
 * @returns {string} - 매칭된 ErrorCode 메시지 또는 원본 메시지
 */
export function getErrorMessage(message) {
  if (!message) return "요청에 실패했습니다.";

  // ErrorCode 값 중에서 일치하는 메시지 찾기
  const matchedCode = Object.values(ErrorCode).find((codeMessage) => codeMessage === message);
  
  // 일치하는 ErrorCode가 있으면 그대로 반환, 없으면 원본 메시지 반환
  return matchedCode || message;
}

/**
 * 특정 ErrorCode인지 확인
 * @param {string} message - 에러 메시지
 * @param {string} errorCode - 확인할 ErrorCode 키
 * @returns {boolean}
 */
export function isErrorCode(message, errorCode) {
  return ErrorCode[errorCode] === message;
}

