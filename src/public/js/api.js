// api.js - GitHub Copilot API 호출

import { t } from "./i18n.js";

export async function fetchCopilotData(token) {
  if (!token.trim()) {
    throw new Error(t("api.enterToken"));
  }

  const response = await fetch("https://api.github.com/copilot_internal/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(t("api.invalidToken"));
    } else if (response.status === 403) {
      throw new Error(t("api.forbidden"));
    } else {
      throw new Error(
        t("api.failed", {
          status: response.status,
          statusText: response.statusText,
        }),
      );
    }
  }

  const data = await response.json();

  // 플랜이 없는 경우 플래그 추가 (에러를 던지지 않고 데이터 반환)
  if (!data.quota_snapshots || !data.quota_snapshots.premium_interactions) {
    data._noPlan = true; // 플랜 없음 플래그 추가
  }

  return data;
}

export async function fetchCopilotModels(token) {
  if (!token.trim()) {
    throw new Error(t("api.enterToken"));
  }

  const response = await fetch("/api/copilot/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(t("api.invalidToken"));
    } else if (response.status === 403) {
      throw new Error(t("api.forbidden"));
    } else {
      throw new Error(
        t("api.failed", {
          status: response.status,
          statusText: response.statusText,
        }),
      );
    }
  }

  return await response.json();
}
