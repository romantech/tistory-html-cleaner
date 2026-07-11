import { readFile } from 'node:fs/promises';

const script = await readFile('dist/tistory-editor-cleaner.user.js', 'utf8');
const meta = await readFile('dist/tistory-editor-cleaner.meta.js', 'utf8');

for (const [key, value] of [
  ['version', '1.2.0'],
  ['grant', 'GM_registerMenuCommand'],
  ['grant', 'unsafeWindow'],
  ['sandbox', 'raw'],
  ['updateURL', 'https://romantech.github.io/tistory-editor-cleaner/tistory-editor-cleaner.meta.js'],
  ['downloadURL', 'https://romantech.github.io/tistory-editor-cleaner/tistory-editor-cleaner.user.js'],
]) {
  const line = new RegExp(`^// @${key}\\s+${value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}$`, 'm');
  if (!line.test(script) || !line.test(meta)) {
    throw new Error(`빌드 메타데이터 누락: @${key} ${value}`);
  }
}

console.log('userscript build metadata: ok');
