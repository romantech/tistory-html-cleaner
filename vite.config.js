import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { userscriptVersion } from './version.js';

const baseUrl = 'https://romantech.github.io/tistory-editor-cleaner';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'Tistory Editor Cleaner',
        namespace: 'https://romantech.net/',
        version: userscriptVersion,
        description: '티스토리 에디터 HTML 정리 및 모드 전환 유틸',
        homepageURL: 'https://github.com/romantech/tistory-editor-cleaner',
        match: [
          'https://*.tistory.com/manage/newpost*',
          'https://*.tistory.com/manage/post*',
        ],
        grant: ['GM_registerMenuCommand', 'unsafeWindow'],
        'run-at': 'document-idle',
        noframes: true,
        updateURL: `${baseUrl}/tistory-editor-cleaner.meta.js`,
        downloadURL: `${baseUrl}/tistory-editor-cleaner.user.js`,
        $extra: { sandbox: 'raw' },
      },
      build: {
        fileName: 'tistory-editor-cleaner.user.js',
        metaFileName: true,
      },
    }),
  ],
});
