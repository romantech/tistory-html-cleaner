import {
  CLEAN_OPTION,
  CLEAN_OPTION_LABEL,
  DEFAULT_CLEAN_OPTIONS,
} from './constants.js';
import { enterHtmlModeAndClean, waitUntilReady } from './editor.js';

async function runCleanCommand(options = DEFAULT_CLEAN_OPTIONS) {
  if (!(await waitUntilReady())) {
    alert('티스토리 에디터가 준비되지 않았습니다.');
    return;
  }

  const result = await enterHtmlModeAndClean(options);
  const summary = result.changes
    .map(
      ({ type, count }) => `- ${CLEAN_OPTION_LABEL[type] ?? type}: ${count}개`,
    )
    .join('\n');

  alert(
    result.success
      ? result.changed
        ? `HTML 정리를 완료했습니다.\n\n${summary}`
        : '정리할 내용이 없습니다.'
      : 'HTML 정리에 실패했습니다. 콘솔 로그를 확인하세요.',
  );
}

GM_registerMenuCommand('전체 정리', () => runCleanCommand());

for (const option of Object.values(CLEAN_OPTION)) {
  GM_registerMenuCommand(CLEAN_OPTION_LABEL[option], () =>
    runCleanCommand([option]),
  );
}
