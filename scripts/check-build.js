import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
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

console.log('userscript build metadata: ok');
