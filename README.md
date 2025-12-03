---

## 워드프레스에서 사용하기

### 방법 1: 테마 파일에 직접 추가 (권장)

1. `dist/widget_rerank.js` 파일을 워드프레스 서버에 업로드합니다.
   - 예: `/wp-content/themes/your-theme/js/widget_rerank.js`

2. 테마의 `functions.php` 파일에 다음 코드를 추가합니다:

```php
function add_chat_widget_script() {
    // 위젯 스크립트 로드
    wp_enqueue_script(
        'mamas-chat-widget',
        get_template_directory_uri() . '/js/widget_rerank.js',
        array(),
        '1.0.0',
        true // footer에 로드
    );

    // 위젯 초기화 스크립트
    wp_add_inline_script('mamas-chat-widget', '
        document.addEventListener("DOMContentLoaded", function() {
            if (typeof ChatWidget !== "undefined") {
                ChatWidget.init({
                    apiUrl: "https://port-0-mamas-be-mieafczw4deece5f.sel3.cloudtype.app/api/chat",
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


3. 만약 현재 수정중인 function.php가 자식테마(child theme)의 파일이라면...

```php
function add_chat_widget_script() {
    // 위젯 스크립트 로드
    wp_enqueue_script(
        'mamas-chat-widget',
        get_stylesheet_directory_uri() . '/js/widget_rerank.js',
        array(),
        '1.0.0',
        true // footer에 로드
    );

    // 위젯 초기화 스크립트
    wp_add_inline_script('mamas-chat-widget', '
        document.addEventListener("DOMContentLoaded", function() {
            if (typeof ChatWidget !== "undefined") {
                ChatWidget.init({
                    apiUrl: "https://port-0-mamas-be-mieafczw4deece5f.sel3.cloudtype.app/api/chat",
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
