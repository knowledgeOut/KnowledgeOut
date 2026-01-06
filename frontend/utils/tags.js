/**
 * 태그 관련 유틸리티 함수
 */

/**
 * 텍스트에서 태그를 추출합니다.
 * #태그이름 형식의 태그를 찾아 배열로 반환합니다.
 * 
 * @param {string} text - 태그를 추출할 텍스트
 * @returns {string[]} 추출된 태그 배열 (예: ['React', 'JavaScript'])
 * 
 * @example
 * extractTagsFromContent('이것은 #React #JavaScript 예제입니다')
 * // ['React', 'JavaScript']
 */
export function extractTagsFromContent(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const tagRegex = /#(\S+)/g;
  const matches = text.match(tagRegex);
  if (!matches) return [];
  
  return matches.map(tag => tag.substring(1));
}

