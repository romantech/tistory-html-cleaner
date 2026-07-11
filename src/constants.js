export const LOG_PREFIX = '[TistoryCleaner]';

export const CLEAN_OPTION = Object.freeze({
  BLOCKQUOTE: 'blockquote',
  SPAN: 'span',
  DIV: 'div',
  NBSP: 'nbsp',
  HTTP_LINKS: 'httpLinks',
  BACKTICK_CODE: 'backtickCode',
  SMART_QUOTES: 'smartQuotes',
  P_STYLE: 'pStyle',
  H_STYLE: 'hStyle',
  CODE_STYLE: 'codeStyle',
  PRE_STYLE: 'preStyle',
  A_ATTRIBUTES: 'aAttributes',
});

export const CLEAN_OPTION_LABEL = Object.freeze({
  [CLEAN_OPTION.BLOCKQUOTE]: 'blockquote 태그 제거',
  [CLEAN_OPTION.SPAN]: 'span 태그 제거',
  [CLEAN_OPTION.DIV]: 'div 태그 제거',
  [CLEAN_OPTION.NBSP]: '특수 공백 치환',
  [CLEAN_OPTION.HTTP_LINKS]: 'HTTP 링크를 HTTPS로 변경',
  [CLEAN_OPTION.BACKTICK_CODE]: '백틱 코드 변환',
  [CLEAN_OPTION.SMART_QUOTES]: '스마트 따옴표 치환',
  [CLEAN_OPTION.P_STYLE]: '문단 스타일 제거',
  [CLEAN_OPTION.H_STYLE]: '제목 스타일 제거',
  [CLEAN_OPTION.CODE_STYLE]: 'code 스타일 제거',
  [CLEAN_OPTION.PRE_STYLE]: 'pre 스타일 제거',
  [CLEAN_OPTION.A_ATTRIBUTES]: '링크 속성 정리',
});

export const DEFAULT_CLEAN_OPTIONS = Object.freeze([
  CLEAN_OPTION.SPAN,
  CLEAN_OPTION.DIV,
  CLEAN_OPTION.NBSP,
  CLEAN_OPTION.HTTP_LINKS,
  CLEAN_OPTION.BACKTICK_CODE,
  CLEAN_OPTION.SMART_QUOTES,
  CLEAN_OPTION.P_STYLE,
  CLEAN_OPTION.H_STYLE,
  CLEAN_OPTION.CODE_STYLE,
  CLEAN_OPTION.PRE_STYLE,
  CLEAN_OPTION.A_ATTRIBUTES,
]);

export const EDITOR_MODE = Object.freeze({
  DEFAULT: '기본모드',
  MARKDOWN: '마크다운',
  HTML: 'HTML',
});

export const MODE_SELECTOR = Object.freeze({
  [EDITOR_MODE.DEFAULT]: '#editor-mode-kakao-tistory',
  [EDITOR_MODE.MARKDOWN]: '#editor-mode-markdown-tistory',
  [EDITOR_MODE.HTML]: '#editor-mode-html-tistory',
});

export const WAIT_CONFIG = Object.freeze({
  MENU_OPEN: Object.freeze({ timeout: 1500, interval: 50 }),
  MENU_CLOSE: Object.freeze({ timeout: 1000, interval: 50 }),
  MODE_SWITCH: Object.freeze({ timeout: 3000, interval: 150 }),
  READY: Object.freeze({ timeout: 15000, interval: 200 }),
});
