import React from 'react';
import { OpenCollectionPlayground } from '../../../packages/oc-playground/dist/oc-playground.es.js';
import '../../../packages/oc-playground/dist/playground.css';

const sampleCollection = {
  name: "Sample API Collection",
  description: "A comprehensive OpenCollection demonstration showcasing various API endpoints and configurations",
  items: [
    {
      type: "http",
      name: "Get Users",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/users",
      docs: "Retrieves a list of all users from the JSONPlaceholder API",
      headers: [
        {
          name: "Accept",
          value: "application/json"
        }
      ]
    },
    {
      type: "http", 
      name: "Create User",
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/users",
      docs: "Creates a new user in the system",
      headers: [
        {
          name: "Content-Type",
          value: "application/json"
        }
      ],
      body: {
        type: "json",
        data: JSON.stringify({
          name: "John Doe",
          email: "john@example.com"
        }, null, 2)
      }
    },
    {
      type: "http",
      name: "Get All Posts",
      method: "GET", 
      url: "https://jsonplaceholder.typicode.com/posts",
      docs: "Retrieves all blog posts"
    },
    {
      type: "http",
      name: "Get Post by ID",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      docs: "Retrieves a specific post by its ID"
    },
    {
      type: "script",
      script: "// Utility functions for API testing\nfunction generateRandomId() {\n    return Math.floor(Math.random() * 1000) + 1;\n}\n\nconsole.log('Utility functions loaded');"
    }
  ],
  environments: [
    {
      name: "Production",
      description: "Production environment configuration",
      variables: [
        {
          name: "baseUrl",
          value: "https://api.example.com"
        }
      ]
    },
    {
      name: "Development", 
      description: "Development environment for testing",
      variables: [
        {
          name: "baseUrl",
          value: "http://localhost:3000"
        }
      ]
    }
  ]
};

function App() {
  return (
    <OpenCollectionPlayground
      collection={sampleCollection}
      theme="dark"
      logo={
        <div style={{
          fontSize: '18px',
          marginRight: '10px'
        }}>
          🚀
        </div>
      }
    />
  );
}

export default App;