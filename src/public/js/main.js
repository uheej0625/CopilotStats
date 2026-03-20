// main.js - 메인 로직 및 이벤트 처리

import { TokenStorage } from "./storage.js";
import {
  displayData,
  displayModels,
  setLoading,
  showError,
  hideError,
  displayMultipleAccountsData,
} from "./ui.js";
import { TokenGenerator } from "./token-generator.js";
import { fetchCopilotData, fetchCopilotModels } from "./api.js";
import { initI18n, t } from "./i18n.js";

// 전역 변수
let apiData = null;
let accountDataArray = []; // 다중 계정 데이터 저장

// DOM 요소들
const tokenInput = document.getElementById("token-input");
const fetchButton = document.getElementById("fetch-button");
const generateTokenButton = document.getElementById("generate-token-button");
const addAccountButton = document.getElementById("add-account-button");
const saveTokenToggle = document.getElementById("save-token-toggle");
const toggleTokenVisibility = document.getElementById(
  "toggle-token-visibility",
);
const eyeIcon = document.getElementById("eye-icon");
const eyeOffIcon = document.getElementById("eye-off-icon");
const fetchModelsButton = document.getElementById("fetch-models-button");
const additionalTokensContainer = document.getElementById(
  "additional-tokens-container",
);

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  initI18n();
  loadSavedToken();
  setupEventListeners();
  updateAddAccountButtonVisibility();
  applyDynamicLanguage();
  window.addEventListener("languagechange", handleLanguageChange);
});

function handleLanguageChange() {
  applyDynamicLanguage();
  if (accountDataArray.length > 0) {
    displayMultipleAccountsData(accountDataArray);
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  fetchButton.addEventListener("click", fetchAllApiData);
  generateTokenButton.addEventListener("click", () => generateToken(0));
  addAccountButton.addEventListener("click", addAccountSlot);
  toggleTokenVisibility.addEventListener("click", () =>
    togglePasswordVisibility(0),
  );
  fetchModelsButton?.addEventListener("click", fetchModels);
  tokenInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      fetchAllApiData();
    }
  });
  tokenInput.addEventListener("input", handleTokenChange);
  saveTokenToggle.addEventListener("change", handleSaveTokenChange);
}

// 토큰 표시/숨기기 토글
function togglePasswordVisibility(index) {
  const tokenInputEl =
    index === 0
      ? tokenInput
      : document.querySelector(`input[data-index="${index}"]`);
  const wrapper = tokenInputEl.closest(".token-input-wrapper");
  const toggleBtn = wrapper.querySelector(".toggle-visibility");
  const eyeIconEl = toggleBtn.querySelector("#eye-icon, [data-eye-icon]");
  const eyeOffIconEl = toggleBtn.querySelector(
    "#eye-off-icon, [data-eye-off-icon]",
  );

  if (tokenInputEl.type === "password") {
    tokenInputEl.type = "text";
    eyeIconEl.classList.add("hidden");
    eyeOffIconEl.classList.remove("hidden");
  } else {
    tokenInputEl.type = "password";
    eyeIconEl.classList.remove("hidden");
    eyeOffIconEl.classList.add("hidden");
  }
}

// 계정 슬롯 추가
function addAccountSlot() {
  const currentSlots = document.querySelectorAll(".token-input-wrapper").length;

  const newIndex = currentSlots;
  const newSlot = createAccountSlot(newIndex);
  additionalTokensContainer.appendChild(newSlot);
}

// 계정 슬롯 생성
function createAccountSlot(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "token-input-wrapper additional-token-input";
  wrapper.setAttribute("data-index", index);

  wrapper.innerHTML = `
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          type="password"
          class="token-input w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="${t("token.placeholder", { index: index + 1 })}"
          data-index="${index}"
        />
        <button
          type="button"
          class="toggle-visibility absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="${t("token.toggleVisibility")}"
          data-index="${index}"
        >
          <svg
            data-eye-icon
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
          <svg
            data-eye-off-icon
            class="h-5 w-5 hidden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            ></path>
          </svg>
        </button>
      </div>
      <button
        class="generate-token-btn px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="${t("token.generateOauth")}"
        data-index="${index}"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </button>
      <button
        class="remove-account-btn px-3 py-2 bg-white text-red-600 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        title="${t("account.remove")}"
        data-index="${index}"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  // 이벤트 리스너 추가
  const toggleBtn = wrapper.querySelector(".toggle-visibility");
  toggleBtn.addEventListener("click", () => togglePasswordVisibility(index));

  const generateBtn = wrapper.querySelector(".generate-token-btn");
  generateBtn.addEventListener("click", () => generateToken(index));

  const removeBtn = wrapper.querySelector(".remove-account-btn");
  removeBtn.addEventListener("click", () => removeAccountSlot(index));

  const inputEl = wrapper.querySelector(".token-input");
  inputEl.addEventListener("input", handleTokenChange);

  return wrapper;
}

// 계정 슬롯 제거
function removeAccountSlot(index) {
  const wrapper = document.querySelector(
    `.token-input-wrapper[data-index="${index}"]`,
  );
  if (wrapper && index !== 0) {
    wrapper.remove();
    updateAddAccountButtonVisibility();
    handleTokenChange(); // 토큰 저장 업데이트
  }
}

// 계정 추가 버튼 표시/숨김 업데이트
function updateAddAccountButtonVisibility() {
  // 무제한 계정 추가 가능하므로 항상 버튼 표시
  addAccountButton.style.display = "inline-flex";
}

// 저장된 토큰 로드
function loadSavedToken() {
  const savedTokens = TokenStorage.loadTokens();
  const shouldSave = TokenStorage.getSaveOption();

  if (savedTokens && savedTokens.length > 0 && shouldSave) {
    // 첫 번째 토큰
    tokenInput.value = savedTokens[0];
    saveTokenToggle.checked = true;

    // 추가 토큰들
    for (let i = 1; i < savedTokens.length; i++) {
      addAccountSlot();
      const inputEl = document.querySelector(`input[data-index="${i}"]`);
      if (inputEl) {
        inputEl.value = savedTokens[i];
      }
    }

    // 자동으로 데이터 가져오기
    fetchAllApiDataWithTokens(savedTokens);
  }
}

// 토큰 입력 변경 처리
function handleTokenChange() {
  if (saveTokenToggle.checked) {
    const tokens = getAllTokens();
    TokenStorage.saveTokens(tokens);
  }
}

// 모든 토큰 가져오기
function getAllTokens() {
  const tokens = [];
  const allInputs = document.querySelectorAll(".token-input");
  allInputs.forEach((input) => {
    if (input.value.trim()) {
      tokens.push(input.value.trim());
    }
  });
  return tokens;
}

// 토큰 저장 토글 변경 처리
function handleSaveTokenChange() {
  const checked = saveTokenToggle.checked;
  TokenStorage.setSaveOption(checked);

  if (checked) {
    const tokens = getAllTokens();
    TokenStorage.saveTokens(tokens);
  } else {
    TokenStorage.removeTokens();
  }
}

// 모든 API 데이터 가져오기
function fetchAllApiData() {
  const tokens = getAllTokens();
  fetchAllApiDataWithTokens(tokens);
}

// API 데이터 가져오기 (단일)
function fetchApiData() {
  fetchApiDataWithToken(tokenInput.value);
}

// 모델 목록 가져오기
async function fetchModels() {
  const token = tokenInput.value;
  if (!token.trim()) {
    showError(t("error.enterTokenFirst"));
    return;
  }

  const button = fetchModelsButton;
  const originalText = button.innerHTML;

  try {
    button.disabled = true;
    button.innerHTML =
      `<svg class="h-5 w-5 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${t("loading.fetching")}`;

    const modelsData = await fetchCopilotModels(token);
    displayModels(modelsData);

    button.innerHTML = t("loading.done");
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("모델 정보 가져오기 실패:", error);
    showError(error.message || t("error.fetchModelsFailed"));
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

// 토큰으로 API 데이터 가져오기 (다중)
async function fetchAllApiDataWithTokens(tokens) {
  if (!tokens || tokens.length === 0) {
    showError(t("error.enterAtLeastOneToken"));
    return;
  }

  setLoading(true);
  hideError();
  accountDataArray = [];

  try {
    // 모든 토큰에 대해 병렬로 데이터 가져오기
    const promises = tokens.map((token) => fetchCopilotData(token));
    const results = await Promise.allSettled(promises);

    // 성공한 결과만 수집
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        accountDataArray.push({
          accountIndex: index + 1,
          data: result.value,
        });
      } else {
        console.error(
          `계정 #${index + 1} 데이터 가져오기 실패:`,
          result.reason,
        );
      }
    });

    if (accountDataArray.length === 0) {
      showError(t("error.fetchAllFailed"));
    } else if (accountDataArray.length < tokens.length) {
      showError(
        t("error.partialFetch", {
          count: tokens.length,
          loaded: accountDataArray.length,
        }),
      );
    }

    // 데이터 표시 - 항상 displayMultipleAccountsData 사용 (1개든 여러 개든)
    if (accountDataArray.length > 0) {
      displayMultipleAccountsData(accountDataArray);
    }

    setLoading(false);
  } catch (err) {
    console.error("API 호출 에러:", err);
    showError(err.message || t("error.fetchDataFailed"));
    setLoading(false);
  }
}

// 토큰으로 API 데이터 가져오기 (단일)
async function fetchApiDataWithToken(token) {
  setLoading(true);
  hideError();

  try {
    const data = await fetchCopilotData(token);
    apiData = data;
    displayData(data);
    setLoading(false);
  } catch (err) {
    console.error("API 호출 에러:", err);
    showError(err.message || t("error.fetchDataFailed"));
    setLoading(false);
  }
}

// 토큰 자동 생성
async function generateToken(index) {
  const generateBtn = document.querySelector(
    `.generate-token-btn[data-index="${index}"]`,
  );
  const tokenInputEl =
    index === 0
      ? tokenInput
      : document.querySelector(`input[data-index="${index}"]`);

  try {
    generateBtn.disabled = true;
    generateBtn.innerHTML =
      '<svg class="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

    // Step 1: Device Code 요청
    const deviceCodeData = await TokenGenerator.getDeviceCode();

    // Step 2: 사용자에게 인증 안내
    const modal = createAuthModal(deviceCodeData, index);
    document.body.appendChild(modal);

    // Step 3: 자동 폴링으로 토큰 대기
    try {
      const token = await TokenGenerator.pollForToken(
        deviceCodeData.device_code,
      );

      // 성공: 토큰 저장 및 입력
      tokenInputEl.value = token;

      if (saveTokenToggle.checked) {
        const tokens = getAllTokens();
        TokenStorage.saveTokens(tokens);
      }

      modal.remove();
      showSuccess(t("success.tokenCreated", { index: index + 1 }));

      // 단일 계정인 경우 자동으로 데이터 가져오기
      if (index === 0 && getAllTokens().length === 1) {
        fetchApiDataWithToken(token);
      }
    } catch (error) {
      modal.remove();
      showError(error.message || t("error.createTokenFailed"));
    }
  } catch (error) {
    showError(error.message || t("error.createTokenFailed"));
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML =
      '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>';
  }
}

// 인증 모달 생성
function createAuthModal(deviceCodeData, accountIndex) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">${t("auth.github", {
          index: accountIndex + 1,
        })}</h3>
        <button class="close-modal text-gray-400 hover:text-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800 mb-3">
            <strong>1.</strong> ${t("auth.step1")}
          </p>
          <a href="${deviceCodeData.verification_uri}" target="_blank" 
             class="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
             ${t("auth.openPage")}
           </a>
        </div>
        
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-700 mb-2">
            <strong>2.</strong> ${t("auth.step2")}
          </p>
          <div class="flex items-center justify-between bg-white border border-gray-300 rounded-md p-3">
            <code class="text-2xl font-mono font-bold tracking-wider">${
              deviceCodeData.user_code
            }</code>
            <button class="copy-code px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors">
              ${t("auth.copy")}
            </button>
          </div>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-800">
            <strong>3.</strong> ${t("auth.step3")}
          </p>
          <div class="mt-2 flex items-center justify-center space-x-2 text-green-600">
            <svg class="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">${t("auth.waiting")}</span>
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
      btn.textContent = t("auth.copied");
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

function applyDynamicLanguage() {
  document.querySelectorAll(".token-input").forEach((input) => {
    const index = Number(input.dataset.index || "0") + 1;
    input.placeholder = t("token.placeholder", { index });
  });

  document.querySelectorAll(".toggle-visibility").forEach((button) => {
    button.title = t("token.toggleVisibility");
  });

  document.querySelectorAll(".generate-token-btn").forEach((button) => {
    button.title = t("token.generateOauth");
  });

  document.querySelectorAll(".remove-account-btn").forEach((button) => {
    button.title = t("account.remove");
  });
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
