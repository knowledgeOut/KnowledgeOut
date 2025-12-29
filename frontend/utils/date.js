/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 날짜를 포맷팅하여 반환
 * @param {Date|string} date - 날짜 객체 또는 문자열
 * @param {string} format - 포맷 형식 (default: 'YYYY-MM-DD HH:mm')
 * @returns {string} 포맷된 날짜 문자열
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 상대 시간 표시 (예: "3분 전", "2시간 전")
 * @param {Date|string} date - 날짜 객체 또는 문자열
 * @returns {string} 상대 시간 문자열
 */
export function getRelativeTime(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}개월 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

