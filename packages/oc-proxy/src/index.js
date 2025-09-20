const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/proxy', async (req, res) => {
  try {
    const { url, method, headers, body, timeout } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const startTime = Date.now();

    const axiosConfig = {
      method: method || 'GET',
      url,
      headers: headers || {},
      timeout: timeout || 30000,
      validateStatus: () => true,
      maxRedirects: 5
    };

    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes((method || '').toUpperCase())) {
      if (typeof body === 'string') {
        try {
          JSON.parse(body);
          if (!axiosConfig.headers['content-type'] && !axiosConfig.headers['Content-Type']) {
            axiosConfig.headers['content-type'] = 'application/json';
          }
        } catch {
        }
        axiosConfig.data = body;
      } else if (body instanceof FormData || body.constructor.name === 'FormData') {
        axiosConfig.data = body;
      } else {
        // Object body, convert to JSON
        axiosConfig.data = JSON.stringify(body);
        if (!axiosConfig.headers['content-type'] && !axiosConfig.headers['Content-Type']) {
          axiosConfig.headers['content-type'] = 'application/json';
        }
      }
    }

    const response = await axios(axiosConfig);
    const endTime = Date.now();

    let responseSize = 0;
    try {
      if (typeof response.data === 'string') {
        responseSize = response.data.length;
      } else if (response.data) {
        responseSize = JSON.stringify(response.data).length;
      }
    } catch {
      responseSize = 0;
    }

    const responseData = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      duration: endTime - startTime,
      size: responseSize,
      url: response.config.url
    };
    res.json(responseData);
  } catch (error) {
    const endTime = Date.now();
    
    if (error.response) {
      let errorSize = 0;
      try {
        if (typeof error.response.data === 'string') {
          errorSize = error.response.data.length;
        } else if (error.response.data) {
          errorSize = JSON.stringify(error.response.data).length;
        }
      } catch {
        errorSize = 0;
      }

      res.json({
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        duration: endTime - startTime,
        size: errorSize,
        url: error.config?.url
      });
    } else {
      res.status(500).json({
        error: error.message || 'Request failed',
        // duration: endTime - startTime
      });
    }
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'OpenCollection Proxy is running' });
});

app.get('/', (req, res) => {
  res.json({
    name: '@opencollection/proxy',
    version: '1.0.0',
    description: 'CORS proxy server for OpenCollection requests',
    endpoints: {
      'POST /proxy': 'Forward HTTP requests and bypass CORS',
      'GET /health': 'Health check endpoint'
    }
  });
});

app.listen(PORT, () => {
  console.log(`OpenCollection Proxy running on http://localhost:${PORT}`);
}); 