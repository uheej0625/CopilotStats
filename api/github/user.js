module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await fetch("https://api.github.com/copilot_internal/user", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "User-Agent": "Copilot-Usage-Viewer",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: "Unauthorized" });
      } else if (response.status === 403) {
        return res.status(403).json({ error: "Forbidden" });
      }
      return res
        .status(response.status)
        .json({ error: response.statusText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
