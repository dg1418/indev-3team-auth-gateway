# Indev 3팀 - 인증 게이트웨이 서버

## 📖 설명

이 서버는 메인 서버(Spring)로 요청을 전달하기 전에 모든 인증 및 인가 관련 작업을 처리하는 인증 게이트웨이입니다.

## 🌊 요청 흐름

### 1. 소셜 로그인 (카카오) 및 회원가입 흐름

최초 로그인 또는 회원가입 시의 흐름입니다.

1.  **클라이언트 → 인증 서버**: 클라이언트가 카카오 로그인을 요청합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 46 18" src="https://github.com/user-attachments/assets/028e4fe9-f801-46d7-914f-5d1e8d6a7fe1" />
2.  **인증 서버**: 카카오 콜백(callback)을 통해 인증을 처리합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 47 15" src="https://github.com/user-attachments/assets/f7a699d0-31e6-4410-9157-f152e2843433" />

3.  **인증 서버 → 메인 서버**: 카카오로부터 받은 사용자 정보를 이용해 우리 서비스에 이미 가입된 유저인지 메인 서버에 조회를 요청합니다.
4.  **메인 서버 → 인증 서버**:
    *   **기존 유저**: 유저 정보를 응답합니다.
    *   **신규 유저**: 유저가 없음을 응답합니다. 이 경우, 인증 서버는 메인 서버에 새로운 유저 생성을 요청합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 48 20" src="https://github.com/user-attachments/assets/89800bfc-f60c-4d4e-a6eb-2cad3d548f98" />

5.  **인증 서버 → 클라이언트**: 유저 정보 확인 또는 생성이 완료되면, 서비스 전용 토큰(Access Token, Refresh Token)을 생성하여 클라이언트에게 전달합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 53 35" src="https://github.com/user-attachments/assets/6880ce93-3bc8-48ae-aaf4-b891de87a087" />
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 55 16" src="https://github.com/user-attachments/assets/9ee3b40b-cf8e-47d2-8d5c-74f9c3842c93" />

### 2. 인증 후 API 요청 흐름

Access Token을 발급받은 이후의 일반적인 API 요청 흐름입니다.

1.  **클라이언트 → 인증 서버**: 클라이언트가 Access Token을 헤더에 담아 API를 요청합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 58 00" src="https://github.com/user-attachments/assets/18fe1da8-3b0a-41f0-bdd5-7e7ca69c67d4" />

2.  **인증 서버**: 전달받은 Access Token의 유효성을 검증합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 58 33" src="https://github.com/user-attachments/assets/f0b687b0-dfe8-43c1-9005-ed142459983e" />

3.  **인증 서버 → 메인 서버**: 토큰 검증이 완료되면, 해당 요청을 메인 서버로 전달합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 59 30" src="https://github.com/user-attachments/assets/4ccadb30-feed-47c6-bddb-c491f66f5213" />

4.  **메인 서버 → 인증 서버 → 클라이언트**: 메인 서버의 처리 결과를 인증 서버를 거쳐 클라이언트에게 최종 응답합니다.
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 5 59 53" src="https://github.com/user-attachments/assets/b7b6fa8a-dfd7-42e5-b178-9c628543662d" />
<img width="1440" height="900" alt="스크린샷 2025-09-11 오후 6 00 32" src="https://github.com/user-attachments/assets/860b4b73-ca15-4978-be2d-4eeb2518d974" />


---

## 프로젝트 설정

```bash
$ pnpm install
```

## 프로젝트 컴파일 및 실행

```bash
# 개발 모드
$ pnpm run start

# 관찰 모드 (파일 변경 감지)
$ pnpm run start:dev

# 프로덕션 모드
$ pnpm run start:prod
```

## 테스트 실행

```bash
# 유닛 테스트
$ pnpm run test

# E2E 테스트
$ pnpm run test:e2e

# 테스트 커버리지
$ pnpm run test:cov
```
