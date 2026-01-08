require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static(__dirname));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/legacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'legacy.html'));
});

// GitHub OAuth Login Route
app.get('/login', (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = `http://localhost:${PORT}/callback`;
  const scope = 'copilot'; // Scope needed for Copilot usage if available, otherwise read:user might suffice generally, but for Copilot API specifically we need to check if a specific scope is required.
  // Actually, for the copilot_internal/user endpoint, it often just needs a valid GitHub user token.
  // 'read:user' is a safe default for identifying the user. 
  // Let's use 'read:user'. The Copilot API often works with standard user tokens that have Copilot enabled.

  if (!client_id) {
    return res.status(500).send('GITHUB_CLIENT_ID is not defined in .env');
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=read:user`;
  res.redirect(authUrl);
});

// GitHub OAuth Callback Route
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) {
    return res.status(400).send('No code returned from GitHub');
  }

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id,
        client_secret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = response.data.access_token;

    if (accessToken) {
      // Redirect back to home with the token in query param
      res.redirect(`/?token=${accessToken}`);
    } else {
      res.status(400).send('Failed to obtain access token');
    }
  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});