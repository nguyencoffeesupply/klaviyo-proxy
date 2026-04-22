const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/klaviyo/*', async (req, res) => {
  const apiKey = req.headers['x-klaviyo-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing x-klaviyo-key header' });
  }

  const klaviyoPath = req.params[0];
  const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const url = `https://a.klaviyo.com/api/${klaviyoPath}${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2024-02-15',
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Klaviyo proxy running on port ${PORT}`);
});
