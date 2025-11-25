# Mamas Chat Widget

Preact 기반의 경량 임베디드 채팅 위젯 라이브러리입니다. **워드프레스를 포함한 모든 웹사이트**에 단일 스크립트만 추가하면 바로 사용할 수 있습니다.

## 주요 기능

- **즉시 사용 가능**: 단일 JS 파일만 추가하면 바로 동작
- **완전한 커스터마이징**: 색상, 위치, 텍스트 등 모든 요소 커스터마이징 가능
- **스타일 격리**: Shadow DOM을 사용하여 기존 웹사이트 스타일과 충돌 없음
- **경량화**: Preact 기반으로 최소한의 번들 크기 (~50KB)
- **반응형**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **TypeScript**: 완전한 타입 지원

## 빌드

```bash
# 의존성 설치
npm install

# 프로덕션 빌드 (dist/widget.js 생성)
npm run build

# 개발 서버 실행
npm run dev
```

빌드 후 `dist/widget.js` 파일이 생성됩니다. 이 파일을 웹서버에 업로드하여 사용하세요.

---

## 워드프레스에서 사용하기

### 방법 1: 테마 파일에 직접 추가 (권장)

1. `dist/widget.js` 파일을 워드프레스 서버에 업로드합니다.
   - 예: `/wp-content/themes/your-theme/js/widget.js`

2. 테마의 `functions.php` 파일에 다음 코드를 추가합니다:

```php
function add_chat_widget_script() {
    // 위젯 스크립트 로드
    wp_enqueue_script(
        'mamas-chat-widget',
        get_template_directory_uri() . '/js/widget.js',
        array(),
        '1.0.0',
        true // footer에 로드
    );

    // 위젯 초기화 스크립트
    wp_add_inline_script('mamas-chat-widget', '
        document.addEventListener("DOMContentLoaded", function() {
            if (typeof ChatWidget !== "undefined") {
                ChatWidget.init({
                    apiUrl: "https://your-api-server.com/chat",
                    title: "AI Assistant",
                    subtitle: "무엇을 도와드릴까요?",
                    launcherLabel: "채팅으로 문의하기",
                    theme: {
                        primaryColor: "#2563eb"
                    }
                });
            }
        });
    ');
}
add_action('wp_enqueue_scripts', 'add_chat_widget_script');
```

### 방법 2: HTML 블록으로 추가

워드프레스 편집기에서 "사용자 정의 HTML" 블록을 추가하고 다음 코드를 입력합니다:

```html
<script src="https://your-server.com/path/to/widget.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    ChatWidget.init({
        apiUrl: 'https://your-api-server.com/chat',
        title: 'AI Assistant',
        subtitle: '무엇을 도와드릴까요?',
        launcherLabel: '채팅으로 문의하기'
    });
});
</script>
```

### 방법 3: 플러그인 사용 (Header/Footer 삽입)

"Insert Headers and Footers" 같은 플러그인을 사용하여 Footer에 스크립트를 추가합니다:

```html
<script src="https://your-server.com/path/to/widget.js"></script>
<script>
ChatWidget.init({
    apiUrl: 'https://your-api-server.com/chat',
    title: 'AI Assistant'
});
</script>
```

---

## 일반 웹사이트에서 사용하기

HTML 파일의 `</body>` 태그 직전에 다음 코드를 추가합니다:

```html
<script src="https://your-server.com/path/to/widget.js"></script>
<script>
ChatWidget.init({
    apiUrl: 'https://your-api-server.com/chat',
    title: 'AI Assistant',
    subtitle: '온라인',
    position: 'bottom-right',
    launcherLabel: '채팅으로 문의하기',
    theme: {
        primaryColor: '#2563eb',
        userBubbleColor: '#2563eb',
        assistantBubbleColor: '#f1f5f9',
        backgroundColor: '#ffffff'
    }
});
</script>
```

---

## 설정 옵션

```javascript
ChatWidget.init({
    // === 필수 옵션 ===
    apiUrl: 'https://your-api.com/chat',  // 채팅 API 엔드포인트

    // === 기본 설정 ===
    title: 'AI Assistant',                // 채팅창 헤더 타이틀
    subtitle: '온라인',                   // 헤더 서브타이틀
    position: 'bottom-right',             // 위치: 'bottom-right' | 'bottom-left'
    launcherLabel: '채팅으로 문의하기',   // 런처 버튼 텍스트
    startOpen: false,                     // 페이지 로드시 자동 오픈

    // === 아바타 설정 ===
    avatarUrl: 'https://example.com/avatar.jpg',  // 헤더 아바타 이미지

    // === 초기 메시지 ===
    initialMessages: [
        {
            role: 'assistant',
            content: '안녕하세요! 무엇을 도와드릴까요?'
        }
    ],

    // === 테마 커스터마이징 ===
    theme: {
        primaryColor: '#2563eb',            // 주 색상 (버튼, 런처)
        userBubbleColor: '#2563eb',         // 사용자 메시지 배경색
        assistantBubbleColor: '#f1f5f9',    // AI 메시지 배경색
        backgroundColor: '#ffffff'           // 채팅창 배경색
    },

    // === API 요청 커스터마이징 ===
    metadata: {                             // API에 전달할 추가 메타데이터
        userId: 'user123',
        source: 'website'
    },
    headers: {                              // API 요청에 포함할 커스텀 헤더
        'Authorization': 'Bearer your-token'
    },

    // === 대화 지속성 ===
    conversationId: 'conversation-uuid',    // 기존 대화 이어가기

    // === 이벤트 핸들러 ===
    onOpen: function() {
        console.log('채팅 열림');
    },
    onClose: function() {
        console.log('채팅 닫힘');
    },
    onError: function(error) {
        console.error('에러 발생:', error);
    }
});
```

---

## 위젯 제어 API

```javascript
// 위젯 초기화 및 인스턴스 저장
var widget = ChatWidget.init({ apiUrl: '...' });

// 위젯 제거
widget.destroy();

// 또는 전역 메서드 사용
ChatWidget.destroy();
```

---

## 백엔드 API 연동

### 요청 형식

위젯은 지정된 `apiUrl`로 POST 요청을 보냅니다:

```
POST /chat
Content-Type: application/json

{
    "message": "사용자 메시지",
    "conversation_id": "대화 ID (있는 경우)",
    "history": [
        { "role": "user", "content": "이전 메시지" },
        { "role": "assistant", "content": "이전 응답" }
    ],
    // metadata에 설정한 추가 필드들
}
```

### 응답 형식

백엔드는 다음 중 하나의 형식으로 응답해야 합니다:

```javascript
// 형식 1: answer 필드 사용
{
    "answer": "AI 응답 메시지",
    "conversation_id": "대화 ID (선택)"
}

// 형식 2: reply 필드 사용
{
    "reply": "AI 응답 메시지",
    "conversation_id": "대화 ID (선택)"
}

// 형식 3: message 객체 사용
{
    "message": {
        "content": "AI 응답 메시지"
    },
    "conversation_id": "대화 ID (선택)"
}
```

---

## CORS 설정

백엔드 서버에서 CORS를 허용해야 합니다. 예시 (FastAPI):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-wordpress-site.com"],  # 또는 ["*"]
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

---

## 문제 해결

### 위젯이 표시되지 않는 경우

1. 브라우저 개발자 도구(F12)의 콘솔에서 에러 확인
2. `widget.js` 파일이 올바르게 로드되었는지 Network 탭에서 확인
3. `apiUrl`이 올바른지 확인

### API 연결 오류

1. CORS 설정 확인 (브라우저 콘솔에서 CORS 에러 확인)
2. API URL이 HTTPS인지 확인 (혼합 콘텐츠 문제)
3. API 서버가 정상 동작하는지 확인

### 스타일 충돌

위젯은 Shadow DOM을 사용하므로 기본적으로 스타일 충돌이 없습니다. 문제가 있다면:
- `z-index` 값 확인 (기본값: 2147483000)
- 다른 플러그인과의 충돌 확인

---

## 프로젝트 구조

```
mamas/
├── dist/
│   └── widget.js          # 빌드된 위젯 (이 파일만 배포)
├── src/
│   ├── components/        # Preact 컴포넌트
│   │   ├── WidgetRoot.tsx
│   │   ├── Launcher.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── Header.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputArea.tsx
│   ├── api.ts             # API 통신 로직
│   ├── init.tsx           # 초기화 로직
│   ├── types.ts           # TypeScript 타입
│   └── widget.css         # 위젯 스타일
├── vite.config.ts         # Vite 빌드 설정
├── package.json
└── README.md
```

---

## 기술 스택

- **Preact** 10.27.2 - 경량 React 대안
- **TypeScript** 5.9.3 - 타입 안전성
- **Vite** 7.2.4 - 빠른 빌드 도구
- **Lucide Preact** - 아이콘 라이브러리

---

## 라이선스

이 프로젝트는 사적 사용을 위한 것입니다.
