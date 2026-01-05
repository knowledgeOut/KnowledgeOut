/**
 * 스크롤 관련 유틸리티 함수
 */

/**
 * 페이지 스크롤을 맨 위로 초기화
 * 브라우저 호환성을 위해 여러 방법을 사용합니다.
 */
export function resetScroll() {
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
}

/**
 * 스크롤을 초기화하고 다음 프레임에서도 실행
 * 레이아웃 완료 후 스크롤을 확실히 초기화하기 위해 사용합니다.
 */
export function resetScrollWithAnimation() {
  // 즉시 실행
  resetScroll();
  
  // 다음 프레임에서도 실행 (레이아웃 완료 후)
  requestAnimationFrame(() => {
    resetScroll();
    // 한 번 더 실행 (모든 리소스 로드 후)
    setTimeout(resetScroll, 0);
  });
}

