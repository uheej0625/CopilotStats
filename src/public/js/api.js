// api.js - GitHub Copilot API 호출

export async function fetchCopilotData(token) {
  if (!token.trim()) {
    throw new Error("토큰을 입력해주세요.");
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
      throw new Error("유효하지 않은 토큰입니다. 토큰을 확인해주세요.");
    } else if (response.status === 403) {
      throw new Error("접근 권한이 없습니다. Copilot 구독을 확인해주세요.");
    } else {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
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
    throw new Error("토큰을 입력해주세요.");
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
      throw new Error("유효하지 않은 토큰입니다. 토큰을 확인해주세요.");
    } else if (response.status === 403) {
      throw new Error("접근 권한이 없습니다. Copilot 구독을 확인해주세요.");
    } else {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }
  }

  return await response.json();
}
