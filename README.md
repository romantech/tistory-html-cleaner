# Tistory HTML Cleaner

티스토리 글쓰기 화면에서 불필요한 HTML 태그와 속성을 정리하는 유저 스크립트입니다.

## 설치 방법

1. [Tampermonkey](https://www.tampermonkey.net/) 또는 [Greasemonkey](https://www.greasespot.net/) 브라우저 확장 프로그램을 설치합니다.
2. 아래 링크에서 스크립트를 설치합니다.
   - [Greasy Fork](https://greasyfork.org/ko/scripts/586596-tistory-html-cleaner)
   - [GitHub](https://romantech.github.io/tistory-html-cleaner/tistory-html-cleaner.user.js)

## 사용 방법

1. 티스토리 글쓰기 화면으로 이동합니다.
2. 브라우저 도구 모음에서 Tampermonkey 또는 Greasemonkey 아이콘을 클릭합니다.
3. 메뉴에서 원하는 정리 항목을 선택합니다. 정리 항목을 실행하면 에디터가 자동으로 HTML 모드로 전환되며, 정리 작업이 끝나면 다시 원래 편집 모드로 돌아갑니다.

![유저 스크립트 정리 기능 메뉴](docs/tampermonkey-menu.png)

## 주요 기능

- `blockquote`, `span`, `div` 태그 제거 (내용은 유지)
- 특수 공백(`&nbsp;`)을 일반 공백으로 치환
- HTTP 링크를 HTTPS로 변경
- 백틱으로 감싼 텍스트를 `code` 태그로 변환
- 스마트 따옴표를 일반 따옴표로 치환
- 문단, 제목, `code`, `pre`의 인라인 스타일 제거
- 링크의 불필요한 속성 제거
- 외부 링크에 보안 속성 추가

`전체 정리`를 실행하면 `blockquote` 태그 제거를 제외한 모든 항목을 적용합니다.
