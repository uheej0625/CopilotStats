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

  return await response.json();
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
