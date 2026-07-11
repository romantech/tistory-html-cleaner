import { DEFAULT_CLEAN_OPTIONS, LOG_PREFIX } from './constants.js';
import { CLEANERS } from './cleaners/index.js';
import { createContainer } from './cleaners/dom.js';

const warn = (...args) => console.warn(LOG_PREFIX, ...args);

export function runCleanPipeline(html, options = DEFAULT_CLEAN_OPTIONS) {
  const originalHtml = String(html ?? '');
  const container = createContainer(originalHtml);
  const changes = [];

  for (const option of options) {
    const cleaner = CLEANERS[option];
    if (!cleaner) {
      warn(`알 수 없는 정리 옵션: ${option}`);
      continue;
    }

    const change = cleaner(container);
    if (change) changes.push(change);
  }

  return {
    html: changes.length ? container.innerHTML : originalHtml,
    changes,
  };
}
