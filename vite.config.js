import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { userscriptVersion } from './version.js';

const baseUrl = 'https://romantech.github.io/tistory-html-cleaner';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'Tistory HTML Cleaner',
        namespace: 'https://romantech.net/',
        version: userscriptVersion,
        description: '티스토리 에디터 HTML 정리',
        homepageURL: 'https://github.com/romantech/tistory-html-cleaner',
        source: 'https://github.com/romantech/tistory-html-cleaner',
        match: [
          'https://*.tistory.com/manage/newpost*',
          'https://*.tistory.com/manage/post*',
        ],
        grant: [
          'GM_registerMenuCommand',
          'GM.registerMenuCommand',
          'unsafeWindow',
        ],
        'run-at': 'document-idle',
        noframes: true,
        updateURL: `${baseUrl}/tistory-html-cleaner.meta.js`,
        downloadURL: `${baseUrl}/tistory-html-cleaner.user.js`,
        $extra: { sandbox: 'raw' },
      },
      build: {
        fileName: 'tistory-html-cleaner.user.js',
        metaFileName: true,
      },
    }),
  ],
});
