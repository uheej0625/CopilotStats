// main.js - 메인 로직 및 이벤트 처리

import { TokenStorage } from "./storage.js";
import { displayData, setLoading, showError, hideError } from "./ui.js";
import { TokenGenerator } from "./token-generator.js";

// 전역 변수
let apiData = null;

// DOM 요소들
const tokenInput = document.getElementById("token-input");
const fetchButton = document.getElementById("fetch-button");
const generateTokenButton = document.getElementById("generate-token-button");
const saveTokenToggle = document.getElementById("save-token-toggle");
const toggleTokenVisibility = document.getElementById(
  "toggle-token-visibility"
);
const eyeIcon = document.getElementById("eye-icon");
const eyeOffIcon = document.getElementById("eye-off-icon");

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  loadSavedToken();
  setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
  fetchButton.addEventListener("click", fetchApiData);
  generateTokenButton.addEventListener("click", generateToken);
  toggleTokenVisibility.addEventListener("click", togglePasswordVisibility);
  tokenInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      fetchApiData();
    }
  });
  tokenInput.addEventListener("input", handleTokenChange);
  saveTokenToggle.addEventListener("change", handleSaveTokenChange);
}

// 토큰 표시/숨기기 토글
function togglePasswordVisibility() {
  if (tokenInput.type === "password") {
    tokenInput.type = "text";
    eyeIcon.classList.add("hidden");
    eyeOffIcon.classList.remove("hidden");
  } else {
    tokenInput.type = "password";
    eyeIcon.classList.remove("hidden");
    eyeOffIcon.classList.add("hidden");
  }
}

// 저장된 토큰 로드
function loadSavedToken() {
  const savedToken = TokenStorage.loadToken();
  const shouldSave = TokenStorage.getSaveOption();

  if (savedToken && shouldSave) {
    tokenInput.value = savedToken;
    saveTokenToggle.checked = true;
    fetchApiDataWithToken(savedToken);
  }
}

// 토큰 입력 변경 처리
function handleTokenChange() {
  if (saveTokenToggle.checked && tokenInput.value) {
    TokenStorage.saveToken(tokenInput.value);
  }
}

// 토큰 저장 토글 변경 처리
function handleSaveTokenChange() {
  const checked = saveTokenToggle.checked;
  TokenStorage.setSaveOption(checked);

  if (checked && tokenInput.value) {
    TokenStorage.saveToken(tokenInput.value);
  } else if (!checked) {
    TokenStorage.removeToken();
  }
}

// API 데이터 가져오기
function fetchApiData() {
  fetchApiDataWithToken(tokenInput.value);
}

// 토큰으로 API 데이터 가져오기
async function fetchApiDataWithToken(token) {
  setLoading(true);
  hideError();

  try {
    const data = await window.fetchCopilotData(token);
    apiData = data;
    displayData(data);
    setLoading(false);
  } catch (err) {
    console.error("API 호출 에러:", err);
    showError(err.message || "데이터를 가져오는데 실패했습니다.");
    setLoading(false);
  }
}

// 토큰 자동 생성
async function generateToken() {
  try {
    generateTokenButton.disabled = true;
    generateTokenButton.innerHTML =
      '<svg class="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

    // Step 1: Device Code 요청
    const deviceCodeData = await TokenGenerator.getDeviceCode();

    // Step 2: 사용자에게 인증 안내
    const modal = createAuthModal(deviceCodeData);
    document.body.appendChild(modal);

    // Step 3: 자동 폴링으로 토큰 대기
    try {
      const token = await TokenGenerator.pollForToken(
        deviceCodeData.device_code
      );

      // 성공: 토큰 저장 및 입력
      tokenInput.value = token;
      TokenStorage.saveToken(token);
      TokenStorage.setSaveOption(true);
      saveTokenToggle.checked = true;

      modal.remove();
      showSuccess("토큰이 성공적으로 생성되었습니다!");

      // 자동으로 데이터 가져오기
      fetchApiDataWithToken(token);
    } catch (error) {
      modal.remove();
      showError(error.message || "토큰 생성에 실패했습니다.");
    }
  } catch (error) {
    showError(error.message || "토큰 생성에 실패했습니다.");
  } finally {
    generateTokenButton.disabled = false;
    generateTokenButton.innerHTML =
      '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>';
  }
}

// 인증 모달 생성
function createAuthModal(deviceCodeData) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">GitHub 인증</h3>
        <button class="close-modal text-gray-400 hover:text-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800 mb-3">
            <strong>1.</strong> 아래 링크를 클릭하여 GitHub로 이동하세요
          </p>
          <a href="${deviceCodeData.verification_uri}" target="_blank" 
             class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            GitHub 인증 페이지 열기
          </a>
        </div>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-700 mb-2">
            <strong>2.</strong> 다음 코드를 입력하세요
          </p>
          <div class="flex items-center justify-between bg-white border border-gray-300 rounded-md p-3">
            <code class="text-2xl font-mono font-bold tracking-wider">${deviceCodeData.user_code}</code>
            <button class="copy-code px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors">
              복사
            </button>
          </div>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-800">
            <strong>3.</strong> 인증을 완료하면 자동으로 토큰이 생성됩니다
          </p>
          <div class="mt-2 flex items-center justify-center space-x-2 text-green-600">
            <svg class="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">인증 대기 중...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 모달 닫기
  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  // 코드 복사
  modal.querySelector(".copy-code").addEventListener("click", () => {
    navigator.clipboard.writeText(deviceCodeData.user_code).then(() => {
      const btn = modal.querySelector(".copy-code");
      const originalText = btn.textContent;
      btn.textContent = "✓ 복사됨";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });

  // ESC 키로 닫기
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modal;
}

// 성공 메시지 표시
function showSuccess(message) {
  const alert = document.createElement("div");
  alert.className =
    "fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg";
  alert.innerHTML = `
    <div class="flex items-center">
      <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-sm text-green-800">${message}</p>
    </div>
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}
