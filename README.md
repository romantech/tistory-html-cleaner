# Tistory Editor Cleaner

티스토리 에디터의 HTML을 정리하는 Tampermonkey userscript입니다.

## 설치

[userscript 설치](https://romantech.github.io/tistory-editor-cleaner/tistory-editor-cleaner.user.js)

한 번 설치하면 Tampermonkey가 원격 메타데이터의 버전을 확인하고 업데이트합니다.

## 개발

```sh
pnpm install
pnpm dev
```

개발 서버가 열리면 안내에 따라 개발용 userscript를 Tampermonkey에 설치합니다.

## 배포

`package.json`의 `version`을 올리고 `main` 브랜치에 푸시합니다. GitHub Actions가 빌드 결과를 GitHub Pages에 배포합니다.

```sh
pnpm check
```
