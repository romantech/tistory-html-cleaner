# Tistory Editor Cleaner

티스토리 에디터의 HTML을 정리하는 Tampermonkey userscript입니다.

## 설치

[userscript 설치](https://github.com/romantech/tistory-editor-cleaner/releases/latest/download/tistory-editor-cleaner.user.js)

한 번 설치하면 Tampermonkey가 원격 메타데이터의 버전을 확인하고 업데이트합니다.

## 정리 항목

- `blockquote`, `span`, `div` 태그 제거(내부 내용 유지)
- 특수 공백 치환, HTTP 링크의 HTTPS 전환
- 백틱 코드 변환, 스마트 따옴표 치환
- 문단, 제목, `code`, `pre`의 인라인 스타일 제거
- 링크의 불필요한 속성 제거 및 외부 링크 보안 속성 추가

`전체` 실행에서는 `blockquote` 태그 제거를 제외한 항목을 적용합니다.

## 개발

```sh
pnpm install
pnpm dev
```

개발 서버가 열리면 안내에 따라 개발용 userscript를 Tampermonkey에 설치합니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 빌드 번호를 patch 버전으로 사용하고 GitHub Release를 생성합니다. 예를 들어 `package.json`이 `1.2.0`이고 빌드 번호가 `3`이면 userscript 버전은 `1.2.3`이 됩니다. major 또는 minor 버전을 올릴 때만 `package.json`을 변경합니다.

```sh
pnpm check
```
