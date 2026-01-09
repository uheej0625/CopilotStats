// storage.js - localStorage 관리

export const TokenStorage = {
  // 토큰 저장 (단일)
  saveToken(token) {
    localStorage.setItem("copilot-api-token", token);
  },

  // 토큰 로드 (단일)
  loadToken() {
    return localStorage.getItem("copilot-api-token");
  },

  // 토큰 삭제 (단일)
  removeToken() {
    localStorage.removeItem("copilot-api-token");
  },

  // 다중 토큰 저장
  saveTokens(tokens) {
    if (Array.isArray(tokens)) {
      localStorage.setItem("copilot-api-tokens", JSON.stringify(tokens));
    }
  },

  // 다중 토큰 로드
  loadTokens() {
    const tokensStr = localStorage.getItem("copilot-api-tokens");
    if (tokensStr) {
      try {
        return JSON.parse(tokensStr);
      } catch (e) {
        console.error("토큰 파싱 실패:", e);
        return [];
      }
    }
    // 하위 호환성: 기존 단일 토큰이 있으면 배열로 반환
    const singleToken = this.loadToken();
    return singleToken ? [singleToken] : [];
  },

  // 다중 토큰 삭제
  removeTokens() {
    localStorage.removeItem("copilot-api-tokens");
    localStorage.removeItem("copilot-api-token"); // 기존 단일 토큰도 삭제
  },

  // 토큰 저장 옵션 설정
  setSaveOption(shouldSave) {
    localStorage.setItem("save-copilot-token", shouldSave.toString());
  },

  // 토큰 저장 옵션 로드
  getSaveOption() {
    return localStorage.getItem("save-copilot-token") === "true";
  },
};
