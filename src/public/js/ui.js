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
    overageSpan.textContent = `초과 허용: ${quota.overage_permitted ? "예" : "아니오"
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
  if (data.quota_snapshots.premium_interactions) {
    const premium = data.quota_snapshots.premium_interactions;
    document.getElementById(
      "premium-quota"
    ).textContent = `${premium.remaining} / ${premium.entitlement}`;
    document.getElementById(
      "premium-percent"
    ).textContent = `${premium.percent_remaining.toFixed(1)}% 남음`;
    document.getElementById("premium-usage").textContent = `사용량: ${premium.entitlement - premium.remaining
      }`;
    document.getElementById("premium-overage").textContent = `초과 허용: ${premium.overage_permitted ? "예" : "아니오"
      }`;
    document.getElementById(
      "premium-progress"
    ).style.width = `${premium.percent_remaining}%`;
  }

  // 기타 할당량 표시
  const otherQuotasContainer = document.getElementById("other-quotas");
  otherQuotasContainer.replaceChildren();

  Object.entries(data.quota_snapshots)
    .filter(([key]) => key !== "premium_interactions")
    .forEach(([key, quota]) => {
      const quotaElement = createQuotaElement(quota);
      otherQuotasContainer.appendChild(quotaElement);
    });

  // 날짜 정보 표시
  document.getElementById("assigned-date").textContent = formatDate(
    data.assigned_date
  );
  document.getElementById("reset-date").textContent = formatDate(
    data.quota_reset_date,
    false
  );

  // 계정 정보 표시
  document.getElementById("account-type").textContent = data.access_type_sku
    .replace("_", " ")
    .toUpperCase();
  document.getElementById("plan-type").textContent =
    data.copilot_plan.toUpperCase();

  const chatStatus = document.getElementById("chat-status");
  chatStatus.textContent = data.chat_enabled ? "활성화" : "비활성화";
  chatStatus.className = `text-xs px-2 py-1 rounded-md ${data.chat_enabled ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
    }`;

  const signupStatus = document.getElementById("signup-status");
  signupStatus.textContent = data.can_signup_for_limited ? "가능" : "불가능";
  signupStatus.className = `text-xs px-2 py-1 rounded-md ${data.can_signup_for_limited
    ? "bg-blue-100 text-blue-800"
    : "bg-gray-100 text-gray-800"
    }`;

  // Analytics ID 표시
  document.getElementById("analytics-id").textContent =
    data.analytics_tracking_id;
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
