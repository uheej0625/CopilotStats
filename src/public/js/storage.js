// storage.js - localStorage 관리

export const TokenStorage = {
  // 토큰 저장
  saveToken(token) {
    localStorage.setItem("copilot-api-token", token);
  },

  // 토큰 로드
  loadToken() {
    return localStorage.getItem("copilot-api-token");
  },

  // 토큰 삭제
  removeToken() {
    localStorage.removeItem("copilot-api-token");
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
