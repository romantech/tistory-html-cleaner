import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { sanitizeAnchorAttributes } from '../src/cleaners/sanitize-anchor-attributes.js';
import { EDITOR_MODE, MODE_SELECTOR } from '../src/constants.js';
import { getModeMenuItems, readCurrentMode } from '../src/editor.js';
import { userscriptVersion } from '../version.js';

const script = await readFile('dist/tistory-html-cleaner.user.js', 'utf8');
const meta = await readFile('dist/tistory-html-cleaner.meta.js', 'utf8');

for (const [key, value] of [
  ['version', userscriptVersion],
  ['grant', 'GM_registerMenuCommand'],
  ['grant', 'GM.registerMenuCommand'],
  ['grant', 'unsafeWindow'],
  ['sandbox', 'raw'],
  ['homepageURL', 'https://github.com/romantech/tistory-html-cleaner'],
  ['source', 'https://github.com/romantech/tistory-html-cleaner'],
  [
    'updateURL',
    'https://romantech.github.io/tistory-html-cleaner/tistory-html-cleaner.meta.js',
  ],
  [
    'downloadURL',
    'https://romantech.github.io/tistory-html-cleaner/tistory-html-cleaner.user.js',
  ],
]) {
  const line = new RegExp(
    `^// @${key}\\s+${value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}$`,
    'm',
  );
  if (!line.test(script) || !line.test(meta)) {
    throw new Error(`빌드 메타데이터 누락: @${key} ${value}`);
  }
}

for (const manager of ['Tampermonkey', 'Greasemonkey']) {
  const commands = [];
  function register(name) {
    commands.push(name);
  }
  const globals =
    manager === 'Tampermonkey'
      ? { GM_registerMenuCommand: register }
      : { GM: { registerMenuCommand: register } };
  runInNewContext(script, globals);
  if (!commands.includes('전체 정리')) {
    throw new Error(`${manager} 메뉴 등록 실패`);
  }
}

const attributes = new Set(['href', 'class', 'style', 'data-v-test']);
const toggleLink = {
  classList: { contains: (name) => name === 'btn-toggle-moreless' },
  getAttributeNames: () => [...attributes],
  hasAttribute: (name) => attributes.has(name),
  removeAttribute: (name) => attributes.delete(name),
};
const change = sanitizeAnchorAttributes({
  querySelectorAll: () => [toggleLink],
});
if (
  change?.count !== 1 ||
  !attributes.has('class') ||
  attributes.has('style') ||
  attributes.has('data-v-test')
) {
  throw new Error('토글 링크 속성 정리 실패');
}

const modeItem = {};
const unrelatedMenuItem = {};
globalThis.document = {
  querySelector: (selector) => {
    if (selector === MODE_SELECTOR[EDITOR_MODE.DEFAULT]) return modeItem;
    if (`${MODE_SELECTOR[EDITOR_MODE.DEFAULT]}.mce-menu-active` === selector) {
      return modeItem;
    }
    if (selector === '.mce-menu-item.mce-menu-active .mce-text') {
      return { textContent: '글꼴' };
    }
    return null;
  },
  querySelectorAll: (selector) =>
    selector === '.mce-menu-item' ? [unrelatedMenuItem] : [],
};
if (
  getModeMenuItems()[0] !== modeItem ||
  readCurrentMode() !== EDITOR_MODE.DEFAULT
) {
  throw new Error('에디터 모드 메뉴 범위 확인 실패');
}
delete globalThis.document;

console.log('userscript build metadata: ok');
