export const test = {
    "name": "bruno-testbench",
    
    "environments": [
    {
      "name": "Local",
      "description": null,
      "variables": [
        {
          "name": "host",
          "value": "http://localhost:8080",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "httpfaker",
          "value": "https://www.httpfaker.org",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "bearer_auth_token",
          "value": "your_secret_token",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "basic_auth_password",
          "value": "della",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "env.var1",
          "value": "envVar1",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "env-var2",
          "value": "envVar2",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "bark",
          "value": "{{process.env.PROC_ENV_VAR}}",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "foo",
          "value": "bar",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "testSetEnvVar",
          "value": "bruno-29653",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "echo-host",
          "value": "https://echo.usebruno.com",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "client_id",
          "value": "client_id_1",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "client_secret",
          "value": "client_secret_1",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "auth_url",
          "value": "http://localhost:8080/api/auth/oauth2/authorization_code/authorize",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "callback_url",
          "value": "http://localhost:8080/api/auth/oauth2/authorization_code/callback",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "access_token_url",
          "value": "http://localhost:8080/api/auth/oauth2/authorization_code/token",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "passwordCredentials_username",
          "value": "foo",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "passwordCredentials_password",
          "value": "bar",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_authorize_url",
          "value": "https://github.com/login/oauth/authorize",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_access_token_url",
          "value": "https://github.com/login/oauth/access_token",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "google_auth_url",
          "value": "https://accounts.google.com/o/oauth2/auth",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "google_access_token_url",
          "value": "https://accounts.google.com/o/oauth2/token",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "google_scope",
          "value": "https://www.googleapis.com/auth/userinfo.email",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_client_secret",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_client_id",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "google_client_id",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "google_client_secret",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_authorization_code",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "passwordCredentials_access_token",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "client_credentials_access_token",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "authorization_code_access_token",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "github_access_token",
          "value": "",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        }
      ]
    },
    {
      "name": "Prod",
      "description": null,
      "variables": [
        {
          "name": "host",
          "value": "https://testbench-sanity.usebruno.com",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "httpfaker",
          "value": "https://www.httpfaker.org",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "bearer_auth_token",
          "value": "your_secret_token",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "basic_auth_password",
          "value": "della",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "env.var1",
          "value": "envVar1",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "env-var2",
          "value": "envVar2",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "bark",
          "value": "{{process.env.PROC_ENV_VAR}}",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "foo",
          "value": "bar",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "testSetEnvVar",
          "value": "bruno-29653",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        },
        {
          "name": "echo-host",
          "value": "https://echo.usebruno.com",
          "description": null,
          "disabled": false,
          "transient": null,
          "default": null
        }
      ]
    }
  ],
    "items": [
      {
        "name": "ping",
        "type": "http",
        "url": "{{host}}/ping",
        "method": "GET",
        "params": [],
        "headers": [],
        "body": null,
        "auth": null,
        "scripts": {
          "preRequest": "bru.runner.stopExecution();"
        },
        "variables": [],
        "assertions": [],
        "docs": ""
      },
      {
        "type": "folder",
        "name": "graphql",
        "headers": [],
        "auth": null,
        "variables": [],
        "scripts": {},
        "docs": null,
        "items": [
          {
            "name": "spacex",
            "type": "graphql",
            "url": "https://spacex-production.up.railway.app/",
            "method": "POST",
            "headers": [],
            "params": [],
            "body": {
              "type": "json",
              "data": "{\n  \"company\": {\n    \"ceo\": \"Elon Musk\"\n  }\n}"
            },
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [
              {
                "expression": "res.status",
                "operator": "eq",
                "value": "200",
                "enabled": true,
                
              }
            ],
            "docs": ""
          }
        ]
      },
      {
        "type": "folder",
        "name": "echo",
        "headers": [],
        "auth": null,
        "variables": [],
        "scripts": {},
        "docs": null,
        "items": [
          {
            "name": "echo bom json",
            "type": "http",
            "url": "{{host}}/api/echo/bom-json-test",
            "method": "GET",
            "params": [],
            "headers": [],
            "body": null,
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [],
            "docs": ""
          },
          {
            "name": "echo form-url-encoded",
            "type": "http",
            "url": "{{echo-host}}",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": [
              {
                "name": "form-data-key",
                "value": "{{form-data-key}}",
                
                "enabled": true
              },
              {
                "name": "form-data-stringified-object",
                "value": "{{form-data-stringified-object}}",
                
                "enabled": true
              }
            ],
            "auth": null,
            "scripts": {
              "preRequest": "let obj = JSON.stringify({foo:123});\nbru.setVar('form-data-key', 'form-data-value');\nbru.setVar('form-data-stringified-object', obj);"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.body",
                "operator": "eq",
                "value": "form-data-key=form-data-value&form-data-stringified-object=%7B%22foo%22%3A123%7D",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo json",
            "type": "http",
            "url": "{{host}}/api/echo/json",
            "method": "POST",
            "params": [],
            "headers": [
              {
                "name": "foo",
                "value": "bar",
                
                "disabled": null
              }
            ],
            "body": {
              "type": "json",
              "data": "{\n  \"hello\": \"bruno\"\n}"
            },
            "auth": null,
            "scripts": {
              "preRequest": "bru.setVar(\"foo\", \"foo-world-2\");",
              "tests": "test(\"should return json\", function() {\n  const data = res.getBody();\n  expect(res.getBody()).to.eql({\n    \"hello\": \"bruno\"\n  });\n});  "
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.status",
                "operator": "eq",
                "value": "200",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo multipart via scripting",
            "type": "http",
            "url": "{{echo-host}}",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": null,
            "auth": null,
            "scripts": {
              "preRequest": "const FormData = require(\"form-data\");\nconst form = new FormData();\nform.append('form-data-key', 'form-data-value');\nreq.setBody(form);"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.body",
                "operator": "contains",
                "value": "form-data-value",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo multipart",
            "type": "http",
            "url": "{{echo-host}}",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": [
              {
                "name": "foo",
                "type": "text",
                "value": "{\"bar\":\"baz\"}",
                
                "enabled": true
              },
              {
                "name": "form-data-key",
                "type": "text",
                "value": "{{form-data-key}}",
                
                "enabled": true
              },
              {
                "name": "form-data-stringified-object",
                "type": "text",
                "value": "{{form-data-stringified-object}}",
                
                "enabled": true
              },
              {
                "name": "file",
                "type": "file",
                "value": [
                  "bruno.png"
                ],
                
                "enabled": true
              }
            ],
            "auth": null,
            "scripts": {
              "preRequest": "let obj = JSON.stringify({foo:123});\nbru.setVar('form-data-key', 'form-data-value');\nbru.setVar('form-data-stringified-object', obj);"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.body",
                "operator": "contains",
                "value": "form-data-value",
                "enabled": true,
                
              },
              {
                "expression": "res.body",
                "operator": "contains",
                "value": "{\"foo\":123}",
                "enabled": true,
                
              },
              {
                "expression": "res.body",
                "operator": "contains",
                "value": "Content-Type: application/json--test",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo numbers",
            "type": "http",
            "url": "{{echo-host}}",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "json",
              "data": "{\n  \"integer\": 123,\n  \"negativeInteger\": -99,\n  \"zero\": 0,\n  \"float\": 2.718,\n  \"negativeFloat\": -1.618,\n  \"largeDouble\": 12345.678901234567,\n  \"smallDouble\": 9.876e-12,\n  \"booleanTrue\": true,\n  \"booleanFalse\": false\n}"
            },
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [
              {
                "expression": "res.body.integer",
                "operator": "eq",
                "value": "123",
                "enabled": true,
                
              },
              {
                "expression": "res.body.integer",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.negativeInteger",
                "operator": "eq",
                "value": "-99",
                "enabled": true,
                
              },
              {
                "expression": "res.body.negativeInteger",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.zero",
                "operator": "eq",
                "value": "0",
                "enabled": true,
                
              },
              {
                "expression": "res.body.zero",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.float",
                "operator": "eq",
                "value": "2.718",
                "enabled": true,
                
              },
              {
                "expression": "res.body.float",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.negativeFloat",
                "operator": "eq",
                "value": "-1.618",
                "enabled": true,
                
              },
              {
                "expression": "res.body.negativeFloat",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.largeDouble",
                "operator": "eq",
                "value": "12345.678901234567",
                "enabled": true,
                
              },
              {
                "expression": "res.body.largeDouble",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.smallDouble",
                "operator": "eq",
                "value": "9.876e-12",
                "enabled": true,
                
              },
              {
                "expression": "res.body.smallDouble",
                "operator": "isNumber",
                "value": null,
                "enabled": true,
                
              },
              {
                "expression": "res.body.booleanTrue",
                "operator": "eq",
                "value": "true",
                "enabled": true,
                
              },
              {
                "expression": "res.body.booleanFalse",
                "operator": "eq",
                "value": "false",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo plaintext",
            "type": "http",
            "url": "{{host}}/api/echo/text",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "text",
              "data": "hello"
            },
            "auth": null,
            "scripts": {
              "tests": "test(\"should return plain text\", function() {\n  const data = res.getBody();\n  expect(res.getBody()).to.eql(\"hello\");\n});\n"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.status",
                "operator": "eq",
                "value": "200",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo xml parsed(self closing tags)",
            "type": "http",
            "url": "{{host}}/api/echo/xml-parsed",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "xml",
              "data": "<hello>\n  <world>bruno</world>\n  <world/>\n</hello>"
            },
            "auth": null,
            "scripts": {
              "tests": "test(\"should return parsed xml\", function() {\n  const data = res.getBody();\n  expect(res.getBody()).to.eql({\n    \"hello\": {\n      \"world\": [\n        \"bruno\",\n        \"\"\n      ]\n    }\n  });\n});\n"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.status",
                "operator": "eq",
                "value": "200",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo xml parsed",
            "type": "http",
            "url": "{{host}}/api/echo/xml-parsed",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "xml",
              "data": "<hello>\n  <world>bruno</world>\n</hello>"
            },
            "auth": null,
            "scripts": {
              "tests": "test(\"should return parsed xml\", function() {\n  const data = res.getBody();\n  expect(res.getBody()).to.eql({\n    \"hello\": {\n      \"world\": [\"bruno\"]\n    }\n  });\n});\n"
            },
            "variables": [],
            "assertions": [
              {
                "expression": "res.status",
                "operator": "eq",
                "value": "200",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "echo xml raw",
            "type": "http",
            "url": "{{host}}/api/echo/xml-raw",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "xml",
              "data": "<hello><world>bruno</world></hello>"
            },
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [],
            "docs": ""
          },
          {
            "name": "test echo any",
            "type": "http",
            "url": "{{httpfaker}}/api/echo/custom",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "json",
              "data": "{\n  \"headers\": { \"content-type\": \"text/plain\" },\n  \"content\": \"hello\"\n}"
            },
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [
              {
                "expression": "res.body",
                "operator": "eq",
                "value": "hello",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "name": "test echo-any json",
            "type": "http",
            "url": "{{httpfaker}}/api/echo/custom",
            "method": "POST",
            "params": [],
            "headers": [],
            "body": {
              "type": "json",
              "data": "{\n  \"type\": \"application/json\",\n  \"contentJSON\": {\"x\": 42}\n}"
            },
            "auth": null,
            "scripts": {},
            "variables": [],
            "assertions": [
              {
                "expression": "res.body.x",
                "operator": "eq",
                "value": "42",
                "enabled": true,
                
              }
            ],
            "docs": ""
          },
          {
            "type": "folder",
            "name": "multiline",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "echo binary",
                "type": "http",
                "url": "{{echo-host}}",
                "method": "POST",
                "params": [],
                "headers": [],
                "body": [
                  {
                    "filePath": "bruno.png",
                    "contentType": "image/png",
                    "selected": true
                  }
                ],
                "auth": null,
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              }
            ]
          }
        ]
      },
      {
        "type": "folder",
        "name": "auth",
        "headers": [],
        "auth": null,
        "variables": [],
        "scripts": {},
        "docs": null,
        "items": [
          {
            "type": "folder",
            "name": "inherit auth",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "inherit Bearer Auth 200",
                "type": "http",
                "url": "{{host}}/api/auth/bearer/protected",
                "method": "GET",
                "params": [],
                "headers": [],
                "body": null,
                "auth": null,
                "scripts": {
                  "postResponse": "bru.setEnvVar(\"foo\", \"bar\");"
                },
                "variables": [],
                "assertions": [
                  {
                    "expression": "res.status",
                    "operator": "eq",
                    "value": "200",
                    "enabled": true,
                    
                  },
                  {
                    "expression": "res.body.message",
                    "operator": "eq",
                    "value": "Authentication successful",
                    "enabled": true,
                    
                  }
                ],
                "docs": ""
              }
            ]
          },
          {
            "type": "folder",
            "name": "basic",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "type": "folder",
                "name": "via auth",
                "headers": [],
                "auth": null,
                "variables": [],
                "scripts": {},
                "docs": null,
                "items": [
                  {
                    "name": "Basic Auth 200",
                    "type": "http",
                    "url": "{{host}}/api/auth/basic/protected",
                    "method": "POST",
                    "params": [],
                    "headers": [],
                    "body": null,
                    "auth": {
                      "type": "basic",
                      "username": "bruno",
                      "password": "{{basic_auth_password}}"
                    },
                    "scripts": {},
                    "variables": [],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "200",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body.message",
                        "operator": "eq",
                        "value": "Authentication successful",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  },
                  {
                    "name": "Basic Auth 400",
                    "type": "http",
                    "url": "{{host}}/api/auth/basic/protected",
                    "method": "POST",
                    "params": [],
                    "headers": [],
                    "body": null,
                    "auth": null,
                    "scripts": {},
                    "variables": [],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "401",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body",
                        "operator": "eq",
                        "value": "Unauthorized",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  }
                ]
              },
              {
                "type": "folder",
                "name": "via script",
                "headers": [],
                "auth": null,
                "variables": [],
                "scripts": {},
                "docs": null,
                "items": [
                  {
                    "name": "Basic Auth 401",
                    "type": "http",
                    "url": "{{host}}/api/auth/basic/protected",
                    "method": "POST",
                    "params": [],
                    "headers": [],
                    "body": null,
                    "auth": null,
                    "scripts": {
                      "preRequest": "const username = \"bruno\";\nconst password = \"invalid\";\n\nconst authString = `${username}:${password}`;\nconst encodedAuthString = require('btoa')(authString);\n\nreq.setHeader(\"Authorization\", `Basic ${encodedAuthString}`);"
                    },
                    "variables": [],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "401",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body",
                        "operator": "eq",
                        "value": "Unauthorized",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  },
                  {
                    "name": "Basic Auth 200",
                    "type": "http",
                    "url": "{{host}}/api/auth/basic/protected",
                    "method": "POST",
                    "params": [],
                    "headers": [],
                    "body": null,
                    "auth": null,
                    "scripts": {
                      "preRequest": "const username = \"bruno\";\nconst password = \"della\";\n\nconst authString = `${username}:${password}`;\nconst encodedAuthString = require('btoa')(authString);\n\nreq.setHeader(\"Authorization\", `Basic ${encodedAuthString}`);"
                    },
                    "variables": [],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "200",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body.message",
                        "operator": "eq",
                        "value": "Authentication successful",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  }
                ]
              }
            ]
          },
          {
            "type": "folder",
            "name": "cookie",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "Check",
                "type": "http",
                "url": "{{host}}/api/auth/cookie/protected",
                "method": "GET",
                "params": [],
                "headers": [],
                "body": null,
                "auth": null,
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              },
              {
                "name": "Login",
                "type": "http",
                "url": "{{host}}/api/auth/cookie/login",
                "method": "POST",
                "params": [],
                "headers": [],
                "body": null,
                "auth": null,
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              }
            ]
          },
          {
            "type": "folder",
            "name": "bearer",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "type": "folder",
                "name": "via headers",
                "headers": [],
                "auth": null,
                "variables": [],
                "scripts": {},
                "docs": null,
                "items": [
                  {
                    "name": "Bearer Auth 200",
                    "type": "http",
                    "url": "{{host}}/api/auth/bearer/protected",
                    "method": "GET",
                    "params": [],
                    "headers": [
                      {
                        "name": "Authorization",
                        "value": "Bearer your_secret_token",
                        
                        "disabled": null
                      }
                    ],
                    "body": null,
                    "auth": null,
                    "scripts": {
                      "postResponse": "bru.setEnvVar(\"foo\", \"bar\");"
                    },
                    "variables": [
                      {
                        "name": "a-c",
                        "value": "foo",
                        
                        "disabled": false,
                        "transient": false
                      }
                    ],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "200",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body.message",
                        "operator": "eq",
                        "value": "Authentication successful",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  }
                ]
              },
              {
                "type": "folder",
                "name": "via auth",
                "headers": [],
                "auth": null,
                "variables": [],
                "scripts": {},
                "docs": null,
                "items": [
                  {
                    "name": "Bearer Auth 200",
                    "type": "http",
                    "url": "{{host}}/api/auth/bearer/protected",
                    "method": "GET",
                    "params": [],
                    "headers": [],
                    "body": null,
                    "auth": {
                      "type": "bearer",
                      "token": "{{bearer_token}}"
                    },
                    "scripts": {},
                    "variables": [],
                    "assertions": [
                      {
                        "expression": "res.status",
                        "operator": "eq",
                        "value": "200",
                        "enabled": true,
                        
                      },
                      {
                        "expression": "res.body.message",
                        "operator": "eq",
                        "value": "Authentication successful",
                        "enabled": true,
                        
                      }
                    ],
                    "docs": ""
                  }
                ]
              }
            ]
          },
          {
            "name": "oauth",
            "type": "folder",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "authorization code grant",
                "type": "http",
                "url": "https://accounts.google.com/o/oauth2/v2/auth",
                "method": "GET",
                "params": [
                  {
                    "name": "scope",
                    "value": "https://www.googleapis.com/auth/cloud-platform",
                    
                    "type": "query",
                    "enabled": true
                  },
                  {
                    "name": "access_type",
                    "value": "offline",
                    
                    "type": "query",
                    "enabled": true
                  },
                  {
                    "name": "include_granted_scopes",
                    "value": "true",
                    
                    "type": "query",
                    "enabled": true
                  },
                  {
                    "name": "response_type",
                    "value": "code",
                    
                    "type": "query",
                    "enabled": true
                  },
                  {
                    "name": "redirect_uri",
                    "value": "http://localhost:3000",
                    
                    "type": "query",
                    "enabled": true
                  },
                  {
                    "name": "client_id",
                    "value": "{{client_id}}",
                    
                    "type": "query",
                    "enabled": true
                  }
                ],
                "headers": [],
                "body": null,
                "auth": null,
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              },
              {
                "name": "get access token",
                "type": "http",
                "url": "https://oauth2.googleapis.com/token",
                "method": "POST",
                "params": [],
                "headers": [
                  {
                    "name": "Content-Type",
                    "value": "application/x-www-form-urlencoded",
                    
                    "disabled": null
                  }
                ],
                "body": [
                  {
                    "name": "code",
                    "value": "{{auth_code}}",
                    
                    "enabled": true
                  },
                  {
                    "name": "client_id",
                    "value": "{{client_id}}",
                    
                    "enabled": true
                  },
                  {
                    "name": "client_secret",
                    "value": "{{client_secret}}",
                    
                    "enabled": true
                  },
                  {
                    "name": "redirect_uri",
                    "value": "http://localhost:3000",
                    
                    "enabled": true
                  },
                  {
                    "name": "grant_type",
                    "value": "authorization_code",
                    
                    "enabled": true
                  }
                ],
                "auth": null,
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              }
            ]
          },
          {
            "type": "folder",
            "name": "api key",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "api key in headers",
                "type": "http",
                "url": "{{host}}/api/auth/api-key",
                "method": "GET",
                "params": [],
                "headers": [],
                "body": null,
                "auth": {
                  "type": "apikey",
                  "key": "x-api-key",
                  "value": "your_api_key_here",
                  "placement": "header"
                },
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              },
              {
                "name": "api key in query",
                "type": "http",
                "url": "{{host}}/api/auth/api-key",
                "method": "GET",
                "params": [],
                "headers": [],
                "body": null,
                "auth": {
                  "type": "apikey",
                  "key": "x-api-key",
                  "value": "your_api_key_here",
                  "placement": "query"
                },
                "scripts": {},
                "variables": [],
                "assertions": [],
                "docs": ""
              }
            ]
          },
          {
            "name": "digest",
            "type": "folder",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "digest auth 200",
                "type": "http",
                "url": "{{host}}/api/auth/digest/protected",
                "method": "POST",
                "params": [],
                "headers": [],
                "body": null,
                "auth": {
                  "type": "digest",
                  "username": "bruno",
                  "password": "della"
                },
                "scripts": {},
                "variables": [],
                "assertions": [
                  {
                    "expression": "res.status",
                    "operator": "eq",
                    "value": "200",
                    "enabled": true,
                    
                  },
                  {
                    "expression": "res.body.message",
                    "operator": "eq",
                    "value": "Authentication successful",
                    "enabled": true,
                    
                  }
                ],
                "docs": ""
              }
            ]
          },
          {
            "type": "folder",
            "name": "ntlm",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "ntlm auth 200",
                "type": "http",
                "url": "{{host}}/api/auth/ntlm/protected",
                "method": "POST",
                "params": [],
                "headers": [],
                "body": null,
                "auth": {
                  "type": "ntlm",
                  "username": "bruno",
                  "password": "della",
                  "domain": "acme"
                },
                "scripts": {},
                "variables": [],
                "assertions": [
                  {
                    "expression": "res.status",
                    "operator": "eq",
                    "value": "200",
                    "enabled": true,
                    
                  },
                  {
                    "expression": "res.body.message",
                    "operator": "eq",
                    "value": "Authentication successful",
                    "enabled": true,
                    
                  }
                ],
                "docs": ""
              }
            ]
          },
          {
            "type": "folder",
            "name": "awsv4",
            "headers": [],
            "auth": null,
            "variables": [],
            "scripts": {},
            "docs": null,
            "items": [
              {
                "name": "awsv4 auth 200",
                "type": "http",
                "url": "{{host}}/api/auth/awsv4/protected",
                "method": "GET",
                "params": [],
                "headers": [],
                "body": null,
                "auth": {
                  "type": "awsv4",
                  "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
                  "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
                  "sessionToken": null,
                  "service": "execute-api",
                  "region": "us-east-1",
                  "profileName": null
                },
                "scripts": {},
                "variables": [],
                "assertions": [
                  {
                    "expression": "res.status",
                    "operator": "eq",
                    "value": "200",
                    "enabled": true,
                    
                  },
                  {
                    "expression": "res.body.message",
                    "operator": "eq",
                    "value": "Authentication successful",
                    "enabled": true,
                    
                  }
                ],
                "docs": ""
              }
            ]
          }
        ]
      }
    ],
    "base": {
      "headers": [],
      "auth": null,
      "variables": [
        {
          "name": "host",
          "value": "http://localhost:3001",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "echo-host",
          "value": "http://localhost:3002",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "should-test-collection-scripts",
          "value": null,
          
          "disabled": null,
          "transient": true
        },
        {
          "name": "collection-var-set-by-collection-script",
          "value": null,
          
          "disabled": null,
          "transient": true
        },
        {
          "name": "httpfaker",
          "value": "http://localhost:3003",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "auth_code",
          "value": null,
          
          "disabled": null,
          "transient": true
        },
        {
          "name": "access_token",
          "value": null,
          
          "disabled": null,
          "transient": true
        },
        {
          "name": "refresh_token",
          "value": null,
          
          "disabled": null,
          "transient": true
        },
        {
          "name": "client_id",
          "value": "your_client_id_here",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "client_secret",
          "value": "your_client_secret_here",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "basic_auth_password",
          "value": "della",
          
          "disabled": null,
          "transient": null
        },
        {
          "name": "bearer_token",
          "value": "this-is-my-secret-token",
          
          "disabled": null,
          "transient": null
        }
      ],
      "scripts": {
        "preRequest": "const varName = 'collection-var-set-by-collection-script';\nbru.setVar(varName, `collection-var-value-set-by-collection-script`);",
        "postResponse": "const varName = bru.getVar(\"collection-var-set-by-collection-script\");\nconsole.log(varName);\n",
        "tests": "// check if collection scripts work\nconst shouldTestCollectionScripts = bru.getVar('should-test-collection-scripts');\nconst collectionVar = bru.getVar(\"collection-var-set-by-collection-script\");\nif (shouldTestCollectionScripts && collectionVar) {\n  test(\"collection level test - should get the var that was set by the collection script\", function() {\n    expect(collectionVar).to.equal(\"collection-var-value-set-by-collection-script\");\n  }); \n  bru.setVar('collection-var-set-by-collection-script', null); \n  bru.setVar('should-test-collection-scripts', null);\n}",
        "hooks": null
      }
    },
    "docs": "# bruno-testbench 🐶\n\nThis is a test collection that I am using to test various functionalities around bruno"
  } as any