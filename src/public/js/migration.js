import { TokenStorage } from "./storage.js";

function getTokensToMigrate() {
  const singleToken = TokenStorage.loadToken();
  const multiTokens = TokenStorage.loadTokens() || [];

  const allTokens = new Set([...multiTokens]);
  if (singleToken) {
    allTokens.add(singleToken);
  }

  return Array.from(allTokens);
}

export function checkDomainMigration() {
  const hostname = window.location.hostname;
  // 실제 라이브 환경에서는 'copilotstats.com'으로 한정
  // 개발 테스트 시 로컬호스트나 기타 환경에서도 볼 수 있게 임시 확인 조건을 부여할 수도 있습니다.
  const isLegacy =
    hostname === "copilotstats.com" || hostname === "www.copilotstats.com";

  if (!isLegacy) return;

  const savedTokens = getTokensToMigrate();

  // 토큰이 존재하거나 레거시 도메인이면 모달을 띄웁니다.
  showMigrationModal(savedTokens);
}

function showMigrationModal(tokens) {
  // 모달 오버레이 생성
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4";
  overlay.style.backdropFilter = "blur(4px)";

  // 모달 컨테이너 생성
  const modal = document.createElement("div");
  modal.className =
    "bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full transform transition-all";

  // 안내 텍스트
  const title = document.createElement("h2");
  title.className = "text-2xl font-bold text-red-600 mb-4";
  title.innerText = "⚠️ 서비스 도메인 이전 안내";

  const description = document.createElement("p");
  description.className = "text-gray-700 leading-relaxed mb-4";
  description.innerHTML = `
    현재 접속 중인 <strong>copilotstats.com</strong> 도메인은 곧 사용 기간이 만료되어 접속이 중단될 예정입니다.<br/><br/>
    새로운 주소인 <a href="https://copilotstats.vercel.com" class="text-blue-600 underline font-semibold">copilotstats.vercel.com</a> 로 이동하여 서비스를 계속 이용하실 수 있습니다.<br/><br/>
    <span class="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-semibold inline-block mb-2">보안 주의</span><br/>
    보안을 위해 이 확인 메세지를 닫거나 동의하시면, 현재 브라우저에 저장된 <strong>모든 토큰 데이터는 즉시 삭제</strong>됩니다. 아래에서 기존 토큰을 확인하고 복사할 수 있습니다.
  `;

  modal.appendChild(title);
  modal.appendChild(description);

  // 저장된 토큰 영역
  if (tokens.length > 0) {
    const tokensContainer = document.createElement("div");
    tokensContainer.className =
      "bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-3";

    tokens.forEach((token, index) => {
      const tokenRow = document.createElement("div");
      tokenRow.className = "flex items-center gap-2";

      const tokenInput = document.createElement("input");
      tokenInput.type = "password";
      tokenInput.value = token;
      tokenInput.readOnly = true;
      tokenInput.className =
        "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm";

      // 토글 버튼
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className =
        "px-3 py-2 text-sm text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors";
      toggleBtn.innerText = "표시";
      toggleBtn.onclick = () => {
        if (tokenInput.type === "password") {
          tokenInput.type = "text";
          toggleBtn.innerText = "숨김";
        } else {
          tokenInput.type = "password";
          toggleBtn.innerText = "표시";
        }
      };

      // 복사 버튼
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className =
        "px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors";
      copyBtn.innerText = "복사";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(token).then(() => {
          const originalText = copyBtn.innerText;
          copyBtn.innerText = "완료!";
          setTimeout(() => {
            copyBtn.innerText = originalText;
          }, 2000);
        });
      };

      tokenRow.appendChild(tokenInput);
      tokenRow.appendChild(toggleBtn);
      tokenRow.appendChild(copyBtn);
      tokensContainer.appendChild(tokenRow);
    });

    modal.appendChild(tokensContainer);
  }

  // 액션 버튼 영역
  const actions = document.createElement("div");
  actions.className =
    "flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100";

  const clearAndMoveBtn = document.createElement("button");
  clearAndMoveBtn.className =
    "w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors";
  clearAndMoveBtn.innerText = "토큰 삭제 및 Vercel 로 이동";
  clearAndMoveBtn.onclick = () => {
    // LocalStorage 초기화
    localStorage.removeItem("copilot-api-token");
    localStorage.removeItem("copilot-api-tokens");
    localStorage.removeItem("save-copilot-token");
    localStorage.clear(); // 전체 초기화 (혹시 다른 잔여 데이터도 삭제)

    // 리다이렉트
    window.location.href = "https://copilotstats.vercel.com/";
  };

  const closeBtn = document.createElement("button");
  closeBtn.className =
    "w-full py-3 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors";
  closeBtn.innerText = "지금은 삭제만 하고 닫기";
  closeBtn.onclick = () => {
    localStorage.removeItem("copilot-api-token");
    localStorage.removeItem("copilot-api-tokens");
    localStorage.removeItem("save-copilot-token");
    localStorage.clear();
    document.body.removeChild(overlay);
  };

  actions.appendChild(closeBtn);
  actions.appendChild(clearAndMoveBtn);
  modal.appendChild(actions);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
