# 💬 Mamas Chat Widget

Preact 기반의 경량 임베디드 채팅 위젯 라이브러리입니다. 어떤 웹사이트에도 쉽게 통합할 수 있는 커스터마이징 가능한 AI/챗봇 위젯을 제공합니다.

## ✨ 주요 기능

- 🎨 **완전한 커스터마이징**: 색상, 위치, 텍스트 등 모든 요소 커스터마이징 가능
- 🔒 **스타일 격리**: Shadow DOM을 사용하여 기존 웹사이트 스타일과 충돌 없음
- ⚡ **경량화**: Preact 기반으로 최소한의 번들 크기
- 📱 **반응형**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- 🌍 **다국어**: 한국어 기본 지원
- 🎯 **TypeScript**: 완전한 타입 지원

## 📦 설치

```bash
npm install
```

## 🚀 빌드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 💻 사용 방법

### 기본 사용법

빌드된 위젯을 웹사이트에 통합하려면 다음과 같이 스크립트를 추가하세요:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- 웹사이트 콘텐츠 -->

  <!-- 채팅 위젯 스크립트 -->
  <script src="path/to/mamas-widget.js"></script>
  <script>
    ChatWidget.init({
      apiUrl: 'https://your-api.com/chat',
      title: 'AI Assistant',
      subtitle: '무엇을 도와드릴까요?',
      position: 'bottom-right',
      launcherLabel: '채팅으로 문의하기'
    });
  </script>
</body>
</html>
```

### 상세 설정 옵션

```javascript
ChatWidget.init({
  // 필수 옵션
  apiUrl: 'https://your-api.com/chat',  // 채팅 API 엔드포인트 (필수)

  // 기본 설정
  title: 'AI Assistant',                // 채팅창 헤더 타이틀
  subtitle: '온라인',                   // 헤더 서브타이틀
  position: 'bottom-right',             // 위치: 'bottom-right' | 'bottom-left'
  launcherLabel: '채팅으로 문의하기',    // 런처 버튼 텍스트
  startOpen: false,                     // 페이지 로드시 자동 오픈 여부

  // 아바타 설정
  avatarUrl: 'https://example.com/avatar.jpg',  // 헤더 아바타 이미지

  // 초기 메시지 설정
  initialMessages: [
    {
      role: 'assistant',
      content: '안녕하세요! 무엇을 도와드릴까요?'
    }
  ],

  // 테마 커스터마이징
  theme: {
    primaryColor: '#2563eb',            // 주 색상 (버튼, 런처)
    userBubbleColor: '#2563eb',         // 사용자 메시지 배경색
    assistantBubbleColor: '#f1f5f9',    // AI 메시지 배경색
    backgroundColor: '#ffffff'           // 채팅창 배경색
  },

  // API 요청 커스터마이징
  metadata: {                            // API에 전달할 추가 메타데이터
    userId: 'user123',
    source: 'website'
  },
  headers: {                             // API 요청에 포함할 커스텀 헤더
    'Authorization': 'Bearer token'
  },

  // 대화 지속성
  conversationId: 'conversation-uuid',   // 기존 대화 이어가기

  // 이벤트 핸들러
  onOpen: () => {
    console.log('채팅 열림');
  },
  onClose: () => {
    console.log('채팅 닫힘');
  },
  onError: (error) => {
    console.error('에러 발생:', error);
  }
});
```

### 위젯 제어

```javascript
// 위젯 인스턴스 저장
const widget = ChatWidget.init({ /* options */ });

// 위젯 제거
widget.destroy();

// 또는 전역 메서드 사용
ChatWidget.destroy();
```

## 🔌 API 연동

위젯은 지정된 `apiUrl`로 POST 요청을 보냅니다. 서버는 다음 형식의 응답을 반환해야 합니다:

### 요청 형식

```typescript
POST /chat
Content-Type: application/json

{
  "message": "사용자 메시지",
  "conversationId": "optional-conversation-id",
  "metadata": { /* 선택적 메타데이터 */ }
}
```

### 응답 형식

```typescript
{
  "reply": "AI 응답 메시지",
  "conversationId": "conversation-uuid"  // 선택적
}
```

### 에러 처리

API 요청 실패시 위젯은 사용자에게 에러 메시지를 표시하고 `onError` 콜백을 호출합니다.

## 🎨 스타일 커스터마이징

### CSS 변수 사용

Shadow DOM 내부에서 CSS 변수를 통해 스타일이 적용됩니다:

```javascript
theme: {
  primaryColor: '#2563eb',        // --cw-primary
  userBubbleColor: '#2563eb',     // --cw-user-bubble
  assistantBubbleColor: '#f1f5f9', // --cw-assistant-bubble
  backgroundColor: '#ffffff'       // --cw-surface
}
```

### 위치 조정

```javascript
position: 'bottom-right'  // 우측 하단 (기본값)
position: 'bottom-left'   // 좌측 하단
```

## 📱 반응형 디자인

- **데스크톱**: 360px 너비, 최대 640px 높이
- **모바일** (600px 이하): 화면 너비에 맞춰 자동 조정
- 모든 디바이스에서 스크롤 가능한 메시지 리스트

## 🏗️ 프로젝트 구조

```
mamase/
├── src/
│   ├── components/         # Preact 컴포넌트
│   │   ├── WidgetRoot.tsx  # 루트 컴포넌트
│   │   ├── Launcher.tsx    # 런처 버튼
│   │   ├── ChatWindow.tsx  # 채팅 메인 창
│   │   ├── Header.tsx      # 헤더
│   │   ├── MessageList.tsx # 메시지 리스트
│   │   ├── MessageBubble.tsx # 메시지 버블
│   │   └── InputArea.tsx   # 입력 영역
│   ├── init.tsx            # 초기화 로직
│   ├── types.ts            # TypeScript 타입 정의
│   ├── widget.css          # 위젯 스타일
│   └── vite-env.d.ts       # Vite 타입 정의
├── tsconfig.app.json       # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── package.json
```

## 🔧 기술 스택

- **Preact** 10.27.2 - 경량 React 대안
- **TypeScript** 5.9.3 - 타입 안전성
- **Vite** 7.2.4 - 빠른 빌드 도구
- **Lucide Preact** - 아이콘 라이브러리

## 🌟 핵심 특징

### Shadow DOM 격리

위젯은 Shadow DOM을 사용하여 완전히 격리된 환경에서 실행됩니다:

```javascript
const shadowRoot = container.attachShadow({ mode: 'open' });
```

- 기존 웹사이트의 CSS와 충돌 없음
- 위젯 스타일이 외부에 영향을 주지 않음
- 독립적인 컴포넌트 생태계

### 자동 스크롤

새 메시지가 추가될 때 자동으로 최신 메시지로 스크롤됩니다.

### 타이핑 인디케이터

AI가 응답을 생성하는 동안 타이핑 애니메이션이 표시됩니다.

### 접근성

- 시맨틱 HTML 사용
- 키보드 네비게이션 지원
- ARIA 레이블 제공
- 스크린 리더 지원

## 📝 TypeScript 지원

완전한 TypeScript 지원으로 자동완성과 타입 체크를 제공합니다:

```typescript
import type { WidgetOptions, ChatMessage } from 'mamas-widget';

const options: WidgetOptions = {
  apiUrl: 'https://api.example.com/chat',
  theme: {
    primaryColor: '#2563eb'
  }
};
```

## 🐛 문제 해결

### TypeScript 오류

TypeScript 오류가 발생하면 의존성을 재설치하세요:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 스타일 충돌

위젯은 Shadow DOM을 사용하므로 기본적으로 스타일 충돌이 없어야 합니다. 문제가 있다면 `z-index` 값을 확인하세요 (기본값: 2147483000).

### API 연동 문제

- API URL이 올바른지 확인
- CORS 설정 확인 (브라우저 콘솔 확인)
- 응답 형식이 올바른지 확인
- `onError` 콜백으로 에러 로깅

## 📄 라이선스

이 프로젝트는 사적 사용을 위한 것입니다.

## 🤝 기여

이슈나 개선사항이 있다면 GitHub Issues를 통해 제보해주세요.

---

Made with ❤️ using Preact
