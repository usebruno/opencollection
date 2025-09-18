const express = require('express');
const { playgroundHandler, setupPlaygroundAssets } = require('../../packages/oc-playground/dist/express.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

setupPlaygroundAssets(app, express.static, {
  playgroundDistPath: '../../packages/oc-playground/dist-standalone'
});

const apiCollection = {
  name: "My Express API (CommonJS)",
  description: "Example API documentation using OpenCollection playground with Express and CommonJS",
  docs: "This collection demonstrates different request types, bodies, auth, variables, and assertions for an Express-based API using CommonJS imports.",
  environments: [
    {
      name: "Development",
      description: "Local development environment",
      variables: [
        { name: "baseUrl", value: `http://localhost:${PORT}` },
        { name: "authToken", value: "dev-token-123" }
      ]
    }
  ],
  base: {
    headers: [
      { name: "Content-Type", value: "application/json" }
    ],
    auth: {
      type: "bearer",
      token: "{{authToken}}"
    }
  },
  items: [
    {
      name: "Get Users",
      type: "http",
      url: "{{baseUrl}}/api/users",
      method: "GET",
      docs: "Retrieve a list of all users",
      params: [
        { name: "limit", value: "10", type: "query" }
      ],
      assertions: [
        { expression: "response.status", operator: "==", value: "200" }
      ]
    },
    {
      name: "Create User",
      type: "http",
      url: "{{baseUrl}}/api/users",
      method: "POST",
      docs: "Create a new user",
      body: {
        type: "json",
        data: JSON.stringify({
          name: "Bob Wilson",
          email: "bob@example.com"
        }, null, 2)
      }
    }
  ]
};

app.get('/api-docs', playgroundHandler({
  collection: apiCollection,
  theme: 'dark',
  title: 'My Express API Documentation (CommonJS)'
}));

app.get('/simple-docs', playgroundHandler({
  name: "Simple API (CommonJS)",
  description: "My awesome API documentation using CommonJS",
  items: [{
    type: "http",
    method: "GET",
    url: "https://api.example.com/users",
    docs: "Get all users"
  }]
}));

app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Bob Wilson', email: 'bob@example.com' },
      { id: 2, name: 'Carol Davis', email: 'carol@example.com' }
    ]
  });
});

app.post('/api/users', express.json(), (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>OpenCollection Express Example (CommonJS)</h1>
    <p>Visit the API documentation:</p>
    <ul>
      <li><a href="/api-docs">Full API Documentation</a></li>
      <li><a href="/simple-docs">Simple API Documentation</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 CommonJS Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at:`);
  console.log(`   - http://localhost:${PORT}/api-docs`);
  console.log(`   - http://localhost:${PORT}/simple-docs`);
}); 