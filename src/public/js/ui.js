// ui.js - UI 렌더링 및 업데이트

// 날짜 포맷팅
function formatDate(dateString, includeTime = true) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString("ko-KR", options);
}

// 할당량 색상 반환
function getQuotaColor(percentRemaining) {
  if (percentRemaining > 70) return "text-green-600";
  if (percentRemaining > 30) return "text-yellow-600";
  return "text-red-600";
}

// 할당량 아이콘 SVG 반환
function getQuotaIconSvg(quotaId) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "h-4 w-4");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("viewBox", "0 0 24 24");

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "2");

  let d;
  switch (quotaId) {
    case "chat":
      d =
        "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z";
      break;
    case "completions":
      d = "M13 10V3L4 14h7v7l9-11h-7z";
      break;
    case "premium_interactions":
      d =
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
      break;
    default:
      d =
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z";
  }

  path.setAttribute("d", d);
  svg.appendChild(path);
  return svg;
}

// 기타 할당량 요소 생성
function createQuotaElement(quota) {
  const container = document.createElement("div");
  container.className = "space-y-2 p-3 bg-gray-50 rounded-lg";

  const topRow = document.createElement("div");
  topRow.className = "flex items-center justify-between";
  container.appendChild(topRow);

  const left = document.createElement("div");
  left.className = "flex items-center gap-2";
  topRow.appendChild(left);

  const icon = getQuotaIconSvg(quota.quota_id);
  left.appendChild(icon);

  const nameSpan = document.createElement("span");
  nameSpan.className = "font-medium capitalize text-sm";
  nameSpan.textContent = quota.quota_id.replace("_", " ");
  left.appendChild(nameSpan);

  if (quota.unlimited) {
    const unlimitedSpan = document.createElement("span");
    unlimitedSpan.className =
      "text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded-md";
    unlimitedSpan.textContent = "무제한";
    left.appendChild(unlimitedSpan);
  }

  const right = document.createElement("div");
  right.className = "text-right";
  topRow.appendChild(right);

  if (quota.unlimited) {
    const unlimitedText = document.createElement("span");
    unlimitedText.className = "text-sm text-green-600 font-medium";
    unlimitedText.textContent = "무제한";
    right.appendChild(unlimitedText);
  } else {
    const rightWrapper = document.createElement("div");
    rightWrapper.className = "space-y-1";
    right.appendChild(rightWrapper);

    const topLine = document.createElement("div");
    topLine.className = "text-sm font-medium";
    rightWrapper.appendChild(topLine);

    const colorSpan = document.createElement("span");
    colorSpan.className = getQuotaColor(quota.percent_remaining);
    colorSpan.textContent = `${quota.remaining} / ${quota.entitlement}`;
    topLine.appendChild(colorSpan);

    const percentDiv = document.createElement("div");
    percentDiv.className = "text-xs text-gray-500";
    percentDiv.textContent = `${quota.percent_remaining.toFixed(1)}% 남음`;
    rightWrapper.appendChild(percentDiv);
  }

  if (!quota.unlimited) {
    const bottom = document.createElement("div");
    bottom.className = "space-y-1";
    container.appendChild(bottom);

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar h-2";
    bottom.appendChild(progressBar);

    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill-default";
    progressFill.style.width = `${quota.percent_remaining}%`;
    progressBar.appendChild(progressFill);

    const usageDiv = document.createElement("div");
    usageDiv.className = "flex justify-between text-xs text-gray-500";
    bottom.appendChild(usageDiv);

    const usageSpan = document.createElement("span");
    usageSpan.textContent = `사용량: ${quota.entitlement - quota.remaining}`;
    usageDiv.appendChild(usageSpan);

    const overageSpan = document.createElement("span");
    overageSpan.className = "hidden sm:inline";
    overageSpan.textContent = `초과 허용: ${
      quota.overage_permitted ? "예" : "아니오"
    }`;
    usageDiv.appendChild(overageSpan);
  }

  return container;
}

// 데이터 표시
export function displayData(data) {
  const noDataMessage = document.getElementById("no-data-message");
  const dataContainer = document.getElementById("data-container");

  noDataMessage.classList.add("hidden");
  dataContainer.classList.remove("hidden");

  // Premium Interactions 표시
  if (data.quota_snapshots && data.quota_snapshots.premium_interactions) {
    const premium = data.quota_snapshots.premium_interactions;
    document.getElementById(
      "premium-quota"
    ).textContent = `${premium.remaining} / ${premium.entitlement}`;
    document.getElementById(
      "premium-percent"
    ).textContent = `${premium.percent_remaining.toFixed(1)}% 남음`;
    document.getElementById("premium-usage").textContent = `사용량: ${
      premium.entitlement - premium.remaining
    }`;
    document.getElementById("premium-overage").textContent = `초과 허용: ${
      premium.overage_permitted ? "예" : "아니오"
    }`;
    document.getElementById(
      "premium-progress"
    ).style.width = `${premium.percent_remaining}%`;

    // 공유 버튼 이벤트 리스너 설정
    const shareButton = document.getElementById("share-premium-button");
    if (shareButton) {
      shareButton.onclick = () => copyPremiumCardHTML(premium);
    }
  }

  // 기타 할당량 표시
  const otherQuotasContainer = document.getElementById("other-quotas");
  otherQuotasContainer.replaceChildren();

  if (data.quota_snapshots) {
    Object.entries(data.quota_snapshots)
      .filter(([key]) => key !== "premium_interactions")
      .forEach(([key, quota]) => {
        const quotaElement = createQuotaElement(quota);
        otherQuotasContainer.appendChild(quotaElement);
      });
  }

  // 날짜 정보 표시
  if (data.assigned_date) {
    document.getElementById("assigned-date").textContent = formatDate(
      data.assigned_date
    );
  }
  if (data.quota_reset_date) {
    document.getElementById("reset-date").textContent = formatDate(
      data.quota_reset_date,
      false
    );
  }

  // 계정 정보 표시
  if (data.access_type_sku) {
    document.getElementById("account-type").textContent = data.access_type_sku
      .replace("_", " ")
      .toUpperCase();
  }
  if (data.copilot_plan) {
    document.getElementById("plan-type").textContent =
      data.copilot_plan.toUpperCase();
  } else if (data._noPlan) {
    document.getElementById("plan-type").textContent = "플랜 없음";
  }

  const chatStatus = document.getElementById("chat-status");
  if (typeof data.chat_enabled !== "undefined") {
    chatStatus.textContent = data.chat_enabled ? "활성화" : "비활성화";
    chatStatus.className = `text-xs px-2 py-1 rounded-md ${
      data.chat_enabled
        ? "bg-blue-100 text-blue-800"
        : "bg-red-100 text-red-800"
    }`;
  }

  const signupStatus = document.getElementById("signup-status");
  if (typeof data.can_signup_for_limited !== "undefined") {
    signupStatus.textContent = data.can_signup_for_limited ? "가능" : "불가능";
    signupStatus.className = `text-xs px-2 py-1 rounded-md ${
      data.can_signup_for_limited
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800"
    }`;
  }

  // Analytics ID 표시
  if (data.analytics_tracking_id) {
    document.getElementById("analytics-id").textContent =
      data.analytics_tracking_id;
  }
}

// 로딩 상태 설정
export function setLoading(loading) {
  const buttonText = document.getElementById("button-text");
  const loadingIcon = document.getElementById("loading-icon");
  const fetchButton = document.getElementById("fetch-button");

  if (loading) {
    buttonText.textContent = "로딩중...";
    loadingIcon.classList.remove("hidden");
    fetchButton.disabled = true;
  } else {
    buttonText.textContent = "데이터 가져오기";
    loadingIcon.classList.add("hidden");
    fetchButton.disabled = false;
  }
}

// 에러 표시
export function showError(message) {
  const errorMessage = document.getElementById("error-message");
  const errorAlert = document.getElementById("error-alert");

  errorMessage.textContent = message;
  errorAlert.classList.remove("hidden");
}

// 에러 숨기기
export function hideError() {
  const errorAlert = document.getElementById("error-alert");
  errorAlert.classList.add("hidden");
}

// Premium Interactions 카드 HTML 복사
function copyPremiumCardHTML(premium) {
  const remaining = premium.remaining;
  const entitlement = premium.entitlement;
  const percentRemaining = premium.percent_remaining.toFixed(1);
  const usage = entitlement - remaining;
  const overage = premium.overage_permitted ? "예" : "아니오";

  const html = `<div style="max-width: 800px; margin: 1em auto; padding: 2em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; border-radius: 16px; background: linear-gradient(to right, #faf5ff, #eef2ff); border: 2px solid #e9d5ff; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);">
  <div style="margin-bottom: 1.5em;">
    <div style="display: flex; align-items: center; gap: 0.75em; margin-bottom: 0.5em;">
      <svg style="width: 1.5em; height: 1.5em; color: #9333ea;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <span style="font-size: 1.25em; font-weight: 600; color: #6b21a8;">Premium Interactions</span>
      <span style="font-size: 0.875em; background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; padding: 0.25em 0.5em; border-radius: 0.375em;">핵심 할당량</span>
    </div>
    <p style="margin: 0; color: #4b5563; font-size: 1em;">프리미엄 모델을 위한 할당량</p>
  </div>
  <div style="margin-bottom: 1.5em;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1em;">
      <div>
        <div style="font-size: 1.875em; font-weight: 700; color: #7e22ce; margin-bottom: 0.25em;">${remaining} / ${entitlement}</div>
        <div style="font-size: 1.125em; color: #9333ea;">${percentRemaining}% 남음</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.125em; font-weight: 500; color: #374151; margin-bottom: 0.5em;">사용량: ${usage}</div>
        <div style="font-size: 0.875em; color: #6b7280;">초과 허용: ${overage}</div>
      </div>
    </div>
    <div style="height: 1em; background: #e5e7eb; border-radius: 9999px; overflow: hidden;">
      <div style="height: 100%; background: linear-gradient(to right, #a855f7, #7c3aed); width: ${percentRemaining}%; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>`;

  navigator.clipboard
    .writeText(html)
    .then(() => {
      showSuccessMessage("HTML이 복사되었습니다.");
    })
    .catch((err) => {
      console.error("복사 실패:", err);
      showError("복사에 실패했습니다.");
    });
}

// 성공 메시지 표시
function showSuccessMessage(message) {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg";
  toast.innerHTML = `
    <div class="flex items-center">
      <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-sm text-green-800">${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 모델 카드 생성
function createModelCard(model) {
  const card = document.createElement("div");
  card.className =
    "flex-shrink-0 w-80 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow";

  // 카테고리별 색상 및 아이콘
  const categoryStyles = {
    lightweight: { color: "blue", icon: "⚡", label: "경량" },
    versatile: { color: "purple", icon: "🎯", label: "범용" },
    powerful: { color: "red", icon: "🚀", label: "강력" },
  };

  const category = model.model_picker_category
    ? categoryStyles[model.model_picker_category]
    : { color: "gray", icon: "🤖", label: "기타" };

  const borderColor = `border-${category.color}-200`;
  const bgColor = `bg-${category.color}-50`;
  const textColor = `text-${category.color}-700`;
  const badgeBg = `bg-${category.color}-100`;
  const badgeText = `text-${category.color}-800`;

  card.innerHTML = `
    <div class="p-4 space-y-3">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">${category.icon}</span>
            <h4 class="font-bold text-gray-900 text-base">${model.name}</h4>
          </div>
          <code class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${
            model.id
          }</code>
        </div>
        ${
          model.model_picker_enabled
            ? `<span class="flex-shrink-0 text-xs ${badgeBg} ${badgeText} px-2 py-1 rounded-md font-medium">${category.label}</span>`
            : '<span class="flex-shrink-0 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">비활성</span>'
        }
      </div>

      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between py-1 border-b border-gray-100">
          <span class="text-gray-600">제공사</span>
          <span class="font-medium text-gray-900">${model.vendor}</span>
        </div>
        ${
          model.capabilities
            ? `
          <div class="flex items-center justify-between py-1 border-b border-gray-100">
            <span class="text-gray-600">타입</span>
            <span class="font-medium text-gray-900">${
              model.capabilities.type || "N/A"
            }</span>
          </div>
          ${
            model.capabilities.limits?.max_context_window_tokens
              ? `
            <div class="flex items-center justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">컨텍스트</span>
              <span class="font-medium text-gray-900">${(
                model.capabilities.limits.max_context_window_tokens / 1000
              ).toFixed(0)}K</span>
            </div>
            `
              : ""
          }
          ${
            model.capabilities.limits?.max_output_tokens
              ? `
            <div class="flex items-center justify-between py-1 border-b border-gray-100">
              <span class="text-gray-600">최대 출력</span>
              <span class="font-medium text-gray-900">${(
                model.capabilities.limits.max_output_tokens / 1000
              ).toFixed(0)}K</span>
            </div>
            `
              : ""
          }
          `
            : ""
        }
      </div>

      ${
        model.capabilities?.supports
          ? `
        <div class="flex flex-wrap gap-1 pt-2">
          ${
            model.capabilities.supports.vision
              ? '<span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">👁️ Vision</span>'
              : ""
          }
          ${
            model.capabilities.supports.streaming
              ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">📡 Streaming</span>'
              : ""
          }
          ${
            model.capabilities.supports.tool_calls
              ? '<span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">🛠️ Tools</span>'
              : ""
          }
          ${
            model.capabilities.supports.structured_outputs
              ? '<span class="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">📋 Structured</span>'
              : ""
          }
        </div>
        `
          : ""
      }
    </div>
  `;

  return card;
}

// 모델 목록 표시
export function displayModels(modelsData) {
  const modelsGrid = document.getElementById("models-grid");
  if (!modelsGrid || !modelsData?.data) return;

  modelsGrid.replaceChildren();

  // 모든 모델을 타입과 카테고리별로 정렬
  const sortedModels = modelsData.data.sort((a, b) => {
    // 1순위: chat 타입 우선
    const typeA = a.capabilities?.type === "chat" ? 0 : 1;
    const typeB = b.capabilities?.type === "chat" ? 0 : 1;
    if (typeA !== typeB) return typeA - typeB;

    // 2순위: model_picker_enabled 우선
    if (a.model_picker_enabled !== b.model_picker_enabled) {
      return a.model_picker_enabled ? -1 : 1;
    }

    // 3순위: 카테고리별 정렬
    const categoryOrder = { powerful: 0, versatile: 1, lightweight: 2 };
    const orderA = categoryOrder[a.model_picker_category] ?? 999;
    const orderB = categoryOrder[b.model_picker_category] ?? 999;
    return orderA - orderB;
  });

  if (sortedModels.length === 0) {
    modelsGrid.innerHTML =
      '<p class="text-sm text-gray-500 py-4">사용 가능한 모델이 없습니다.</p>';
    return;
  }

  sortedModels.forEach((model) => {
    const card = createModelCard(model);
    modelsGrid.appendChild(card);
  });
}

// 다중 계정 데이터 표시
export function displayMultipleAccountsData(accountDataArray) {
  const noDataMessage = document.getElementById("no-data-message");
  const dataContainer = document.getElementById("data-container");

  noDataMessage.classList.add("hidden");
  dataContainer.classList.remove("hidden");

  // 모든 계정의 데이터를 표시
  const premiumCard = document.getElementById("premium-interactions-card");

  // 1개 계정인 경우 단순화된 표시
  if (accountDataArray.length === 1) {
    premiumCard.innerHTML = generateSingleAccountPremiumCard(
      accountDataArray[0]
    );

    // 공유 버튼 이벤트 리스너 설정
    const shareButton = document.getElementById("share-premium-button");
    if (shareButton) {
      const premium =
        accountDataArray[0].data.quota_snapshots.premium_interactions;
      shareButton.onclick = () => copyPremiumCardHTML(premium);
    }
  } else {
    // 2개 이상인 경우 다중 계정 표시
    premiumCard.innerHTML = generateMultiAccountPremiumCard(accountDataArray);
  }

  // 기타 할당량 표시 (첫 번째 계정 기준)
  if (accountDataArray.length > 0) {
    const firstAccountData = accountDataArray[0].data;
    const otherQuotasContainer = document.getElementById("other-quotas");
    otherQuotasContainer.replaceChildren();

    if (firstAccountData.quota_snapshots) {
      Object.entries(firstAccountData.quota_snapshots)
        .filter(([key]) => key !== "premium_interactions")
        .forEach(([key, quota]) => {
          const quotaElement = createQuotaElement(quota);
          otherQuotasContainer.appendChild(quotaElement);
        });
    }

    // 날짜 정보 표시 (첫 번째 계정 기준)
    if (firstAccountData.assigned_date) {
      document.getElementById("assigned-date").textContent = formatDate(
        firstAccountData.assigned_date
      );
    }
    if (firstAccountData.quota_reset_date) {
      document.getElementById("reset-date").textContent = formatDate(
        firstAccountData.quota_reset_date,
        false
      );
    }

    // 계정 정보 표시 (첫 번째 계정 기준)
    if (firstAccountData.access_type_sku) {
      document.getElementById("account-type").textContent =
        firstAccountData.access_type_sku.replace("_", " ").toUpperCase();
    }
    if (firstAccountData.copilot_plan) {
      document.getElementById("plan-type").textContent =
        firstAccountData.copilot_plan.toUpperCase();
    } else if (firstAccountData._noPlan) {
      document.getElementById("plan-type").textContent = "플랜 없음";
    }

    const chatStatus = document.getElementById("chat-status");
    if (typeof firstAccountData.chat_enabled !== "undefined") {
      chatStatus.textContent = firstAccountData.chat_enabled
        ? "활성화"
        : "비활성화";
      chatStatus.className = `text-xs px-2 py-1 rounded-md ${
        firstAccountData.chat_enabled
          ? "bg-blue-100 text-blue-800"
          : "bg-red-100 text-red-800"
      }`;
    }

    const signupStatus = document.getElementById("signup-status");
    if (typeof firstAccountData.can_signup_for_limited !== "undefined") {
      signupStatus.textContent = firstAccountData.can_signup_for_limited
        ? "가능"
        : "불가능";
      signupStatus.className = `text-xs px-2 py-1 rounded-md ${
        firstAccountData.can_signup_for_limited
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800"
      }`;
    }

    // Analytics ID 표시 (첫 번째 계정)
    if (firstAccountData.analytics_tracking_id) {
      document.getElementById("analytics-id").textContent =
        firstAccountData.analytics_tracking_id;
    }
  }
}

// 단일 계정 Premium 카드 생성
function generateSingleAccountPremiumCard({ accountIndex, data }) {
  if (!data.quota_snapshots || !data.quota_snapshots.premium_interactions) {
    return `
      <div class="p-6">
        <div class="text-center py-8">
          <div class="text-yellow-600 text-lg font-semibold mb-2">⚠️ 플랜 없음</div>
          <p class="text-gray-600">이 계정에는 활성화된 Copilot 플랜이 없습니다.</p>
        </div>
      </div>
    `;
  }
  const premium = data.quota_snapshots.premium_interactions;

  const usage = premium.entitlement - premium.remaining;
  const percentRemaining = premium.percent_remaining.toFixed(1);

  return `
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-xl font-semibold leading-none tracking-tight flex items-center gap-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="text-purple-800">Premium Interactions</span>
            <span class="text-sm bg-purple-100 text-purple-700 border border-purple-300 px-2 py-1 rounded-md">핵심 할당량</span>
          </h3>
          <p class="text-base text-gray-600 mt-1">프리미엄 모델을 위한 할당량</p>
        </div>
        <button
          id="share-premium-button"
          class="ml-4 p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-md transition-colors"
          title="HTML 복사"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div id="premium-quota" class="text-3xl font-bold text-purple-800">${
            premium.remaining
          } / ${premium.entitlement}</div>
          <div id="premium-percent" class="text-lg text-purple-600 mt-1">${percentRemaining}% 남음</div>
        </div>
        <div class="text-right">
          <div id="premium-usage" class="text-lg font-semibold text-gray-700">사용량: ${usage}</div>
          <div id="premium-overage" class="text-sm text-gray-600 mt-1">초과 허용: ${
            premium.overage_permitted ? "예" : "아니오"
          }</div>
        </div>
      </div>
      <div class="progress-bar h-3">
        <div id="premium-progress" class="progress-fill" style="width: ${percentRemaining}%"></div>
      </div>
    </div>
  `;
}

// 다중 계정 Premium 카드 생성
function generateMultiAccountPremiumCard(accountDataArray) {
  let totalRemaining = 0;
  let totalEntitlement = 0;
  let accountsHtml = "";

  accountDataArray.forEach(({ accountIndex, data }) => {
    // 플랜이 없는 경우
    if (!data.quota_snapshots || !data.quota_snapshots.premium_interactions) {
      accountsHtml += `
        <div class="bg-white bg-opacity-70 rounded-lg p-4 border border-yellow-200 hover:border-yellow-300 transition-colors">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-semibold text-gray-900 text-lg">계정 #${accountIndex}</h4>
              <div class="flex gap-2 mt-1">
                <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">⚠️ 플랜 없음</span>
              </div>
            </div>
          </div>
          <div class="text-center py-4">
            <p class="text-gray-600 text-sm">이 계정에는 활성화된 Copilot 플랜이 없습니다.</p>
          </div>
        </div>
      `;
      return; // 이 계정은 total에 포함하지 않음
    }

    // 플랜이 있는 경우
    const premium = data.quota_snapshots.premium_interactions;
    totalRemaining += premium.remaining;
    totalEntitlement += premium.entitlement;

    const usage = premium.entitlement - premium.remaining;
    const percentRemaining = premium.percent_remaining.toFixed(1);
    const resetDate = formatDate(data.quota_reset_date, false);
    const planType = data.copilot_plan.toUpperCase();

    accountsHtml += `
      <div class="bg-white bg-opacity-70 rounded-lg p-4 border border-purple-200 hover:border-purple-300 transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h4 class="font-semibold text-purple-900 text-lg">계정 #${accountIndex}</h4>
            <div class="flex gap-2 mt-1">
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">${planType}</span>
              <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md">${percentRemaining}% 남음</span>
            </div>
          </div>
          <div class="text-right text-sm text-gray-600">
            <div class="font-medium text-purple-800">리셋: ${resetDate}</div>
          </div>
        </div>
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-2xl font-bold text-purple-800">${
              premium.remaining
            } <span class="text-lg text-gray-500">/ ${
      premium.entitlement
    }</span></div>
          </div>
          <div class="text-right text-sm">
            <div class="text-gray-600">사용: <span class="font-semibold text-purple-700">${usage}</span></div>
            <div class="text-gray-500 text-xs mt-1">초과: ${
              premium.overage_permitted ? "가능" : "불가"
            }</div>
          </div>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300" style="width: ${percentRemaining}%"></div>
        </div>
      </div>
    `;
  });

  const totalPercentRemaining =
    totalEntitlement > 0
      ? ((totalRemaining / totalEntitlement) * 100).toFixed(1)
      : 0;
  const totalUsage = totalEntitlement - totalRemaining;

  return `
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-xl font-semibold leading-none tracking-tight flex items-center gap-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="text-purple-800">Premium Interactions</span>
            <span class="text-sm bg-purple-100 text-purple-700 border border-purple-300 px-2 py-1 rounded-md">전체 ${accountDataArray.length}개 계정</span>
          </h3>
          <p class="text-base text-gray-600 mt-1">프리미엄 모델을 위한 할당량</p>
        </div>
      </div>
    </div>
    <div class="px-6 pb-6">
      <div class="mb-4 p-5 bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 rounded-lg border-2 border-purple-300 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="text-sm text-purple-700 font-medium mb-1">🎯 전체 합계</div>
            <div class="text-3xl font-bold text-purple-900">${totalRemaining} <span class="text-xl text-gray-600">/ ${totalEntitlement}</span></div>
            <div class="text-lg text-purple-700 mt-1 font-semibold">${totalPercentRemaining}% 남음</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-600">총 사용량</div>
            <div class="text-3xl font-bold text-purple-800">${totalUsage}</div>
          </div>
        </div>
        <div class="h-3 bg-white bg-opacity-60 rounded-full overflow-hidden shadow-inner">
          <div class="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 transition-all duration-500" style="width: ${totalPercentRemaining}%"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        ${accountsHtml}
      </div>
    </div>
  `;
}
