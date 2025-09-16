import OpenCollectionPlayground from './core/OpenCollectionPlayground';
import './styles/App.css';

function App() {
  const theme = 'light';

  return (
    <div className="h-screen w-full">
      <OpenCollectionPlayground
        collection={{
          "name": "OpenCollection Demo API",
          "description": "Demo collection showcasing all schema features",
          "docs": "This collection demonstrates different request types, bodies, auth, variables, and assertions.",
          "environments": [
            {
              "name": "Development",
              "description": "Local development environment",
              "variables": [
                { "name": "baseUrl", "value": "http://localhost:3000" },
                { "name": "authToken", "value": "dev-token-123" }
              ]
            },
            {
              "name": "Production",
              "variables": [
                { "name": "baseUrl", "value": "https://api.example.com" },
                { "name": "authToken", "value": "prod-token-456" }
              ]
            }
          ],
          "base": {
            "headers": [
              { "name": "Content-Type", "value": "application/json" }
            ],
            "auth": {
              "type": "bearer",
              "token": "{{authToken}}"
            },
            "variables": [
              { "name": "globalVar", "value": "global-value" }
            ]
          },
          "items": [
            {
              "name": "Get Users",
              "type": "http",
              "url": "{{baseUrl}}/users",
              "method": "GET",
              "params": [
                { "name": "limit", "value": "10", "type": "query" },
                { "name": "offset", "value": "0", "type": "query" }
              ],
              "assertions": [
                { "expression": "response.status", "operator": "==", "value": "200" }
              ]
            },
            {
              "name": "Get User by ID",
              "type": "http",
              "url": "{{baseUrl}}/users/:id",
              "method": "GET",
              "params": [
                { "name": "id", "value": "123", "type": "path" }
              ],
              "headers": [
                { "name": "X-Custom-Header", "value": "CustomValue" }
              ]
            },
            {
              "name": "Create User",
              "type": "http",
              "url": "{{baseUrl}}/users",
              "method": "POST",
              "body": {
                "type": "json",
                "data": "{\"name\": \"Alice\", \"email\": \"alice@example.com\"}"
              },
              "assertions": [
                { "expression": "response.body.name", "operator": "==", "value": "Alice" }
              ]
            },
            {
              "name": "Update Profile",
              "type": "http",
              "url": "{{baseUrl}}/profile",
              "method": "PUT",
              "body": [
                { "name": "bio", "value": "Hello world!" },
                { "name": "twitter", "value": "@alice" }
              ]
            },
            {
              "name": "Upload Avatar",
              "type": "http",
              "url": "{{baseUrl}}/upload/avatar",
              "method": "POST",
              "body": [
                { "name": "avatar", "type": "file", "value": ["./images/avatar.png"] },
                { "name": "userId", "type": "text", "value": "123" }
              ]
            },
            {
              "name": "Delete User",
              "type": "http",
              "url": "{{baseUrl}}/users/123",
              "method": "DELETE",
              "auth": {
                "type": "apikey",
                "key": "X-API-Key",
                "value": "secret-key-999",
                "placement": "header"
              }
            },
            {
              "name": "Admin Dashboard",
              "type": "http",
              "url": "{{baseUrl}}/admin",
              "method": "GET",
              "auth": {
                "type": "basic",
                "username": "admin",
                "password": "password"
              }
            },
            {
              "name": "Upload Config File",
              "type": "http",
              "url": "{{baseUrl}}/config",
              "method": "POST",
              "body": [
                {
                  "filePath": "./config.json",
                  "contentType": "application/json",
                  "selected": true
                }
              ]
            },
            {
              "name": "Scripted Request",
              "type": "http",
              "url": "{{baseUrl}}/scripted",
              "method": "GET",
              "scripts": {
                "preRequest": "console.log('Running before request');",
                "postResponse": "console.log('Response received:', response.status);",
                "tests": "assert(response.status === 200);"
              }
            },
            {
              "name": "User Management",
              "type": "folder",
              "docs": "Folder for user-related requests",
              "variables": [
                { "name": "userId", "value": "321" }
              ],
              "headers": [
                { "name": "X-Folder-Header", "value": "FolderHeaderValue" }
              ],
              "auth": {
                "type": "digest",
                "username": "digestUser",
                "password": "digestPass"
              }
            },
            {
              "name": "Folder - Get User",
              "type": "http",
              "url": "{{baseUrl}}/users/{{userId}}",
              "method": "GET"
            },
            {
              "name": "Shared Script",
              "type": "script",
              "script": "module.exports = () => console.log('Shared script executed');"
            }
          ]
        }
        }
        theme={theme}
      />
    </div>
  );
}

export default App;
