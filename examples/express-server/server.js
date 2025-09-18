import express from 'express';
import { playgroundHandler, setupPlaygroundAssets } from '../../packages/oc-playground/dist/express.js';

const app = express();
const PORT = process.env.PORT || 3000;

setupPlaygroundAssets(app, express.static, {
  playgroundDistPath: '../../packages/oc-playground/dist-standalone'
});

const apiCollection = {
  name: "My Express API",
  description: "Example API documentation using OpenCollection playground with Express",
  docs: "This collection demonstrates different request types, bodies, auth, variables, and assertions for an Express-based API.",
  environments: [
    {
      name: "Development",
      description: "Local development environment",
      variables: [
        { name: "baseUrl", value: `http://localhost:${PORT}` },
        { name: "authToken", value: "dev-token-123" }
      ]
    },
    {
      name: "Production",
      variables: [
        { name: "baseUrl", value: "https://api.example.com" },
        { name: "authToken", value: "prod-token-456" }
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
    },
    variables: [
      { name: "globalVar", value: "global-value" }
    ]
  },
  items: [
    {
      name: "Get Users",
      type: "http",
      url: "{{baseUrl}}/api/users",
      method: "GET",
      docs: "Retrieve a list of all users",
      params: [
        { name: "limit", value: "10", type: "query" },
        { name: "offset", value: "0", type: "query" }
      ],
      assertions: [
        { expression: "response.status", operator: "==", value: "200" }
      ]
    },
    {
      name: "Get User by ID",
      type: "http",
      url: "{{baseUrl}}/api/users/:id",
      method: "GET",
      docs: "Get a specific user by their ID",
      params: [
        { name: "id", value: "123", type: "path" }
      ],
      headers: [
        { name: "X-Custom-Header", value: "CustomValue" }
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
          name: "Alice Johnson",
          email: "alice@example.com",
          role: "user"
        }, null, 2)
      },
      assertions: [
        { expression: "response.body.name", operator: "==", value: "Alice Johnson" },
        { expression: "response.status", operator: "==", value: "201" }
      ]
    },
    {
      name: "Update User",
      type: "http",
      url: "{{baseUrl}}/api/users/:id",
      method: "PUT",
      docs: "Update an existing user",
      params: [
        { name: "id", value: "123", type: "path" }
      ],
      body: [
        { name: "name", value: "Alice Smith" },
        { name: "email", value: "alice.smith@example.com" }
      ]
    },
    {
      name: "Delete User",
      type: "http",
      url: "{{baseUrl}}/api/users/:id",
      method: "DELETE",
      docs: "Delete a user by ID",
      params: [
        { name: "id", value: "123", type: "path" }
      ],
      auth: {
        type: "apikey",
        key: "X-API-Key",
        value: "secret-key-999",
        placement: "header"
      }
    },
    {
      name: "User Management",
      type: "folder",
      docs: "Folder containing advanced user management endpoints",
      variables: [
        { name: "adminUserId", value: "admin-123" }
      ],
      headers: [
        { name: "X-Admin-Header", value: "AdminHeaderValue" }
      ],
      auth: {
        type: "basic",
        username: "admin",
        password: "password"
      }
    },
    {
      name: "Get Admin Dashboard",
      type: "http",
      url: "{{baseUrl}}/api/admin/dashboard",
      method: "GET",
      docs: "Access the admin dashboard (requires admin auth)"
    }
  ]
};

app.get('/api-docs', playgroundHandler({
  collection: apiCollection,
  theme: 'light',
  title: 'My Express API Documentation'
}));

app.get('/simple-docs', playgroundHandler({
  name: "Simple API",
  description: "My awesome API documentation",
  items: [{
    type: "http",
    method: "GET",
    url: "https://api.example.com/users",
    docs: "Get all users"
  }],
  theme: 'dark'
}));

app.get('/api/users', (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  res.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ].slice(offset, offset + parseInt(limit)),
    total: 2,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id: parseInt(id),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  });
});

app.post('/api/users', express.json(), (req, res) => {
  const { name, email, role = 'user' } = req.body;
  res.status(201).json({
    id: Date.now(),
    name,
    email,
    role,
    createdAt: new Date().toISOString()
  });
});

app.put('/api/users/:id', express.json(), (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  res.json({
    id: parseInt(id),
    name,
    email,
    updatedAt: new Date().toISOString()
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.status(204).send();
});

app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    stats: {
      totalUsers: 42,
      activeUsers: 38,
      newUsersToday: 5
    },
    message: 'Admin dashboard data'
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>OpenCollection Express Example</h1>
    <p>Visit the API documentation:</p>
    <ul>
      <li><a href="/api-docs">Full API Documentation</a></li>
      <li><a href="/simple-docs">Simple API Documentation</a></li>
    </ul>
    <p>Try the API endpoints:</p>
    <ul>
      <li><a href="/api/users">GET /api/users</a></li>
      <li><a href="/api/users/123">GET /api/users/123</a></li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at:`);
  console.log(`   - http://localhost:${PORT}/api-docs`);
  console.log(`   - http://localhost:${PORT}/simple-docs`);
}); 