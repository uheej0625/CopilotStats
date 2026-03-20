const SUPPORTED_LANGUAGES = ["ko", "en"];

const messages = {
  ko: {
    "language.label": "언어",
    "language.ko": "한국어",
    "language.en": "English",
    "app.subtitle": "GitHub Copilot 사용량 대시보드",
    "token.title": "API 토큰 입력",
    "token.description": "GitHub Copilot 토큰을 입력하세요",
    "token.placeholder": "계정 #{index} - API 토큰을 입력하거나 생성하세요...",
    "token.toggleVisibility": "토큰 표시/숨기기",
    "token.generateOauth": "GitHub OAuth로 자동 생성",
    "account.add": "계정 추가",
    "data.fetch": "데이터 가져오기",
    "token.saveInBrowser": "브라우저에 토큰 저장하기 (새로고침 시 자동 로드)",
    "premium.coreQuota": "핵심 할당량",
    "premium.description": "프리미엄 모델을 위한 할당량",
    "premium.copyHtml": "HTML 복사",
    "quota.other": "기타 할당량",
    "quota.otherDesc": "추가 서비스별 사용량",
    "date.assigned": "할당 날짜",
    "date.reset": "할당량 리셋 날짜",
    "models.available": "사용 가능한 AI 모델",
    "models.availableDesc": "현재 계정에서 사용할 수 있는 모델 목록",
    "models.fetch": "모델 불러오기",
    "account.type": "계정 유형",
    "account.plan": "플랜",
    "account.chatStatus": "채팅 상태",
    "account.limitedSignup": "제한 가입",
    "analytics.id": "분석 추적 ID",
    "empty.title": "API 토큰을 입력하세요",
    "empty.desc":
      '할당량 정보를 확인하려면 위에서 API 토큰을 입력하고 "데이터 가져오기" 버튼을 클릭하세요.',
    "legacy.title": "이전 버전 페이지",
    "legacy.desc": "리뉴얼 이전의 레거시 디자인으로 돌아가서 사용량을 확인해보세요",
    "legacy.button": "리뉴얼 전 페이지로 보기",
    "loading": "로딩중...",
    "loading.fetching": "불러오는 중...",
    "loading.done": "✓ 불러오기 완료",
    "error.enterTokenFirst": "토큰을 먼저 입력해주세요.",
    "error.enterAtLeastOneToken": "최소 하나의 토큰을 입력해주세요.",
    "error.fetchAllFailed": "모든 토큰에서 데이터를 가져오는데 실패했습니다.",
    "error.partialFetch": "{count}개 중 {loaded}개 계정의 데이터만 가져왔습니다.",
    "error.fetchDataFailed": "데이터를 가져오는데 실패했습니다.",
    "error.fetchModelsFailed": "모델 정보를 가져오는데 실패했습니다.",
    "error.createTokenFailed": "토큰 생성에 실패했습니다.",
    "status.unlimited": "무제한",
    "status.remaining": "{percent}% 남음",
    "status.usage": "사용량: {value}",
    "status.overagePermitted": "초과 허용: {value}",
    "status.yes": "예",
    "status.no": "아니오",
    "status.enabled": "활성화",
    "status.disabled": "비활성화",
    "status.available": "가능",
    "status.unavailable": "불가능",
    "plan.none": "플랜 없음",
    "copy.success": "HTML이 복사되었습니다.",
    "copy.failed": "복사에 실패했습니다.",
    "model.none": "사용 가능한 모델이 없습니다.",
    "model.vendor": "제공사",
    "model.type": "타입",
    "model.context": "컨텍스트",
    "model.maxOutput": "최대 출력",
    "model.category.lightweight": "경량",
    "model.category.versatile": "범용",
    "model.category.powerful": "강력",
    "model.category.other": "기타",
    "model.inactive": "비활성",
    "account.remove": "계정 제거",
    "auth.github": "GitHub 인증 (계정 #{index})",
    "auth.step1": "아래 링크를 클릭하여 GitHub로 이동하세요",
    "auth.openPage": "GitHub 인증 페이지 열기",
    "auth.step2": "다음 코드를 입력하세요",
    "auth.copy": "복사",
    "auth.copied": "✓ 복사됨",
    "auth.step3": "인증을 완료하면 자동으로 토큰이 생성됩니다",
    "auth.waiting": "인증 대기 중...",
    "success.tokenCreated": "계정 #{index} 토큰이 성공적으로 생성되었습니다!",
    "api.enterToken": "토큰을 입력해주세요.",
    "api.invalidToken": "유효하지 않은 토큰입니다. 토큰을 확인해주세요.",
    "api.forbidden": "접근 권한이 없습니다. Copilot 구독을 확인해주세요.",
    "api.failed": "API 호출 실패: {status} {statusText}",
    "oauth.deviceCodeFailed": "디바이스 코드 요청 실패: {status}",
    "oauth.accessTokenFailed": "액세스 토큰 요청 실패: {status}",
    "oauth.tokenRequestFailed": "토큰 요청 실패: {error}",
    "oauth.noAccessToken": "액세스 토큰을 찾을 수 없습니다",
    "oauth.timeout": "인증 시간이 초과되었습니다",
    "multi.noPlan": "플랜 없음",
    "multi.noPlanDesc": "이 계정에는 활성화된 Copilot 플랜이 없습니다.",
    "multi.account": "계정 #{index}",
    "multi.totalAccounts": "전체 {count}개 계정",
    "multi.reset": "리셋: {date}",
    "multi.used": "사용: ",
    "multi.overage": "초과: ",
    "multi.overageYes": "가능",
    "multi.overageNo": "불가",
    "multi.total": "🎯 전체 합계",
    "multi.totalUsage": "총 사용량",
  },
  en: {
    "language.label": "Language",
    "language.ko": "한국어",
    "language.en": "English",
    "app.subtitle": "GitHub Copilot usage dashboard",
    "token.title": "API token",
    "token.description": "Enter your GitHub Copilot token",
    "token.placeholder": "Account #{index} - Enter or generate an API token...",
    "token.toggleVisibility": "Show/hide token",
    "token.generateOauth": "Auto-generate via GitHub OAuth",
    "account.add": "Add account",
    "data.fetch": "Fetch data",
    "token.saveInBrowser": "Save token in browser (auto-load after refresh)",
    "premium.coreQuota": "Core quota",
    "premium.description": "Quota for premium models",
    "premium.copyHtml": "Copy HTML",
    "quota.other": "Other quotas",
    "quota.otherDesc": "Usage by additional services",
    "date.assigned": "Assigned date",
    "date.reset": "Quota reset date",
    "models.available": "Available AI models",
    "models.availableDesc": "Models currently available for this account",
    "models.fetch": "Load models",
    "account.type": "Account type",
    "account.plan": "Plan",
    "account.chatStatus": "Chat status",
    "account.limitedSignup": "Limited signup",
    "analytics.id": "Analytics tracking ID",
    "empty.title": "Enter an API token",
    "empty.desc":
      'To check quota info, enter an API token above and click "Fetch data".',
    "legacy.title": "Legacy page",
    "legacy.desc": "Go back to the legacy design before the renewal",
    "legacy.button": "View legacy page",
    "loading": "Loading...",
    "loading.fetching": "Loading...",
    "loading.done": "✓ Loaded",
    "error.enterTokenFirst": "Please enter a token first.",
    "error.enterAtLeastOneToken": "Please enter at least one token.",
    "error.fetchAllFailed": "Failed to fetch data from all tokens.",
    "error.partialFetch": "Loaded data for {loaded} of {count} accounts.",
    "error.fetchDataFailed": "Failed to fetch data.",
    "error.fetchModelsFailed": "Failed to fetch model info.",
    "error.createTokenFailed": "Failed to create token.",
    "status.unlimited": "Unlimited",
    "status.remaining": "{percent}% remaining",
    "status.usage": "Usage: {value}",
    "status.overagePermitted": "Overage allowed: {value}",
    "status.yes": "Yes",
    "status.no": "No",
    "status.enabled": "Enabled",
    "status.disabled": "Disabled",
    "status.available": "Available",
    "status.unavailable": "Unavailable",
    "plan.none": "No plan",
    "copy.success": "HTML copied.",
    "copy.failed": "Copy failed.",
    "model.none": "No available models.",
    "model.vendor": "Vendor",
    "model.type": "Type",
    "model.context": "Context",
    "model.maxOutput": "Max output",
    "model.category.lightweight": "Lightweight",
    "model.category.versatile": "Versatile",
    "model.category.powerful": "Powerful",
    "model.category.other": "Other",
    "model.inactive": "Inactive",
    "account.remove": "Remove account",
    "auth.github": "GitHub auth (account #{index})",
    "auth.step1": "Click the link below and go to GitHub",
    "auth.openPage": "Open GitHub auth page",
    "auth.step2": "Enter the following code",
    "auth.copy": "Copy",
    "auth.copied": "✓ Copied",
    "auth.step3": "Token will be generated automatically after auth",
    "auth.waiting": "Waiting for authentication...",
    "success.tokenCreated": "Token for account #{index} was created successfully!",
    "api.enterToken": "Please enter a token.",
    "api.invalidToken": "Invalid token. Please check your token.",
    "api.forbidden": "Access denied. Please check your Copilot subscription.",
    "api.failed": "API call failed: {status} {statusText}",
    "oauth.deviceCodeFailed": "Device code request failed: {status}",
    "oauth.accessTokenFailed": "Access token request failed: {status}",
    "oauth.tokenRequestFailed": "Token request failed: {error}",
    "oauth.noAccessToken": "Access token not found",
    "oauth.timeout": "Authentication timed out",
    "multi.noPlan": "No plan",
    "multi.noPlanDesc": "No active Copilot plan for this account.",
    "multi.account": "Account #{index}",
    "multi.totalAccounts": "{count} accounts total",
    "multi.reset": "Reset: {date}",
    "multi.used": "Used: ",
    "multi.overage": "Overage: ",
    "multi.overageYes": "Yes",
    "multi.overageNo": "No",
    "multi.total": "🎯 Total",
    "multi.totalUsage": "Total usage",
  },
};

function detectLanguage() {
  const language = navigator.language?.toLowerCase() || "en";
  return language.startsWith("ko") ? "ko" : "en";
}

let currentLanguage = detectLanguage();

export function getCurrentLanguage() {
  return currentLanguage;
}

export function getLocale() {
  return currentLanguage === "ko" ? "ko-KR" : "en-US";
}

export function t(key, variables = {}) {
  const currentMessages = messages[currentLanguage] ?? messages.ko;
  const fallbackMessages = currentLanguage === "ko" ? messages.en : messages.ko;
  const template = currentMessages[key] ?? fallbackMessages[key] ?? key;
  return Object.entries(variables).reduce(
    (result, [k, value]) => result.replaceAll(`{${k}}`, String(value)),
    template,
  );
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder, {
      index: Number(el.dataset.accountIndex || "1"),
    });
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });

  document.documentElement.lang = currentLanguage;
}

export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  currentLanguage = lang;
  applyStaticTranslations();
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

export function initI18n() {
  applyStaticTranslations();
}
