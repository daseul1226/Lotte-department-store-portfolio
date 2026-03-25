# Deploy Guide

이 폴더는 정적 웹사이트 구조입니다.

## 포함 파일

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `.nojekyll`
- `netlify.toml`
- `vercel.json`

## GitHub Pages

1. 현재 폴더를 GitHub 저장소에 업로드
2. 저장소의 `Settings` -> `Pages` 이동
3. `Build and deployment`에서 `Deploy from a branch` 선택
4. Branch는 `main` 또는 업로드한 기본 브랜치 선택
5. Folder는 `/ (root)` 선택
6. 저장 후 배포 완료까지 대기

배포 URL 예시:

- `https://<github-id>.github.io/<repository-name>/`

이 프로젝트는 상대경로(`./assets/...`)를 사용하므로 GitHub Pages의 저장소 하위 경로에서도 추가 수정 없이 동작합니다.

## Netlify

1. Netlify에서 `Add new site` -> `Deploy manually` 선택
2. 현재 폴더 전체를 드래그 앤 드롭
3. 배포 완료 후 생성된 URL 사용

Git 저장소 연결 방식이라면:

1. 이 폴더를 GitHub 저장소에 업로드
2. Netlify에서 해당 저장소 연결
3. Publish directory는 `.` 으로 유지

## Vercel

1. Vercel에서 `Add New...` -> `Project` 선택
2. GitHub 저장소 연결 또는 `vercel` CLI로 현재 폴더 배포
3. Framework Preset은 `Other` 또는 자동 감지 사용
4. Build Command는 비워두고, Output Directory도 기본값 사용

## 업로드 전 확인

- 대표 파일은 `index.html`
- 모든 경로는 상대경로(`./assets/...`)라서 추가 수정 없이 배포 가능
- 외부 링크는 `L-Insight Tracker` 페이지 1개만 포함
