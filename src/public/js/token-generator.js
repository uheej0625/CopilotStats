// token-generator.js - GitHub OAuth Device Flow를 통한 토큰 생성

export const TokenGenerator = {
  // Step 1: Device Code 요청 (서버 프록시 경유)
  async getDeviceCode() {
    const response = await fetch("/api/github/device-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`디바이스 코드 요청 실패: ${response.status}`);
    }

    return await response.json();
  },

  // Step 2: Access Token 획득 (폴링) (서버 프록시 경유)
  async getAccessToken(deviceCode) {
    const response = await fetch("/api/github/access-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_code: deviceCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`액세스 토큰 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data.error === "authorization_pending") {
      throw new Error("PENDING");
    }

    if (data.error === "slow_down") {
      throw new Error("SLOW_DOWN");
    }

    if (data.error) {
      throw new Error(`토큰 요청 실패: ${data.error}`);
    }

    if (!data.access_token) {
      throw new Error("액세스 토큰을 찾을 수 없습니다");
    }

    return data.access_token;
  },

  // 자동 폴링으로 토큰 대기
  async pollForToken(deviceCode, interval = 5000, timeout = 300000) {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const token = await this.getAccessToken(deviceCode);
          resolve(token);
        } catch (error) {
          if (error.message === "PENDING") {
            // 아직 인증 대기 중
            if (Date.now() - startTime < timeout) {
              setTimeout(poll, interval);
            } else {
              reject(new Error("인증 시간이 초과되었습니다"));
            }
          } else if (error.message === "SLOW_DOWN") {
            // 너무 빠르게 요청함
            setTimeout(poll, interval + 5000);
          } else {
            reject(error);
          }
        }
      };

      poll();
    });
  },
};
