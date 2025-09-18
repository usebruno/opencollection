import { HttpRequest, OpenCollectionCollection } from '../types';
import { RunRequestResponse } from './index';

interface ScriptContext {
  req: {
    url?: string;
    method?: string;
    headers: Record<string, string>;
    body: any;
    timeout: number;
    name: string;
    getUrl: () => string;
    setUrl: (url: string) => void;
    getMethod: () => string;
    setMethod: (method: string) => void;
    getName: () => string;
    getAuthMode: () => string;
    getHeaders: () => Record<string, string>;
    setHeaders: (headers: Record<string, string>) => void;
    getHeader: (name: string) => string;
    setHeader: (name: string, value: string) => void;
    getBody: () => any;
    setBody: (data: any) => void;
    getTimeout: () => number;
    setTimeout: (timeout: number) => void;
    setMaxRedirects: (maxRedirects: number) => void;
    disableParsingResponseJson: () => void;
    getExecutionMode: () => string;
  };
  res?: any;
  bru: {
    setVar: (key: string, value: string) => void;
    getVar: (key: string) => string | undefined;
    setEnvVar: (key: string, value: string) => void;
    getEnvVar: (key: string) => string | undefined;
  };
  test: (name: string, fn: () => void) => void;
  expect: (actual: any) => any;
  console: {
    log: (...args: any[]) => void;
  };
  __variables: Record<string, any>;
  __testResults: Array<{ name: string; passed: boolean; error?: string }>;
}

export class ScriptRunner {
  private createSandboxedContext(
    request: HttpRequest,
    response: RunRequestResponse | null,
    variables: Record<string, any>,
    collection: OpenCollectionCollection
  ): ScriptContext {
    const requestObj = {
      url: request.url,
      method: request.method,
      headers: this.headersToObject(request.headers),
      body: this.getRequestBody(request),
      timeout: 30000,
      name: request.name || '',
      
      getUrl: () => request.url || '',
      setUrl: (url: string) => { request.url = url; },
      getMethod: () => request.method || 'GET',
      setMethod: (method: string) => { request.method = method; },
      getName: () => request.name || '',
      getAuthMode: () => request.auth?.type || 'none',
      getHeaders: () => this.headersToObject(request.headers),
      setHeaders: (headers: Record<string, string>) => {
        request.headers = Object.entries(headers).map(([name, value]) => ({
          name,
          value,
          disabled: false
        }));
      },
      getHeader: (name: string) => {
        const header = request.headers?.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header?.value || '';
      },
      setHeader: (name: string, value: string) => {
        if (!request.headers) request.headers = [];
        const existingIndex = request.headers.findIndex(h => h.name.toLowerCase() === name.toLowerCase());
        if (existingIndex >= 0) {
          request.headers[existingIndex].value = value;
        } else {
          request.headers.push({ name, value, disabled: false });
        }
      },
      getBody: () => this.getRequestBody(request),
      setBody: (data: any) => {
        if (typeof data === 'string') {
          try {
            JSON.parse(data);
            request.body = { type: 'json', data };
          } catch {
            request.body = { type: 'text', data };
          }
        } else if (typeof data === 'object') {
          request.body = { type: 'json', data: JSON.stringify(data, null, 2) };
        }
      },
      getTimeout: () => 30000,
      setTimeout: (timeout: number) => {},
      setMaxRedirects: (maxRedirects: number) => {},
      disableParsingResponseJson: () => {},
      getExecutionMode: () => 'normal'
    };

    const context: ScriptContext = {
      req: requestObj,
      bru: {
        setVar: (key: string, value: string) => {
          context.__variables[key] = value;
          variables[key] = value;
        },
        getVar: (key: string) => {
          return context.__variables[key] || variables[key];
        },
        setEnvVar: (key: string, value: string) => {
          context.__variables[key] = value;
          variables[key] = value;
        },
        getEnvVar: (key: string) => {
          return context.__variables[key] || variables[key];
        }
      },
      test: (name: string, fn: () => void) => {
        try {
          fn();
          context.__testResults.push({ name, passed: true });
          console.log(`✓ ${name}`);
        } catch (error) {
          context.__testResults.push({ 
            name, 
            passed: false, 
            error: error instanceof Error ? error.message : String(error) 
          });
          console.log(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
        }
      },
      expect: (actual: any) => ({
        to: {
          equal: (expected: any) => {
            if (actual !== expected) {
              throw new Error(`Expected ${actual} to equal ${expected}`);
            }
          },
          be: {
            greaterThan: (expected: any) => {
              if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
              }
            },
            lessThan: (expected: any) => {
              if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
              }
            }
          },
          contain: (expected: any) => {
            if (typeof actual === 'string' && actual.indexOf(expected) === -1) {
              throw new Error(`Expected ${actual} to contain ${expected}`);
            }
          }
        }
      }),
      console: {
        log: (...args: any[]) => console.log('[Script]', ...args)
      },
      __variables: { ...variables },
      __testResults: []
    };

    if (response) {
      const responseObj = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers || {},
        body: response.data,
        responseTime: response.duration || 0,
        url: response.url || '',
        
        getStatus: () => response.status || 0,
        getStatusText: () => response.statusText || '',
        getHeader: (name: string) => {
          if (!response.headers) return '';
          const key = Object.keys(response.headers).find(k => k.toLowerCase() === name.toLowerCase());
          return key ? String(response.headers[key]) : '';
        },
        getHeaders: () => response.headers || {},
        getBody: () => response.data,
        setBody: (data: any) => { response.data = data; },
        getResponseTime: () => response.duration || 0,
        getUrl: () => response.url || '',
        getSize: () => response.size || 0
      };

      // Add function call capability like Bruno's res()
      const resFunction = (exprStr: string) => {
        try {
          if (exprStr.startsWith('.')) {
            const path = exprStr.substring(1);
            return this.getNestedProperty(response.data, path);
          }
          return response.data;
        } catch {
          return null;
        }
      };

      Object.assign(resFunction, responseObj);
      context.res = resFunction;
    }

    return context;
  }

  private headersToObject(headers?: any[]): Record<string, string> {
    if (!headers) return {};
    return headers.reduce((obj, header) => {
      if (!header.disabled && header.name && header.value) {
        obj[header.name] = header.value;
      }
      return obj;
    }, {});
  }

  private getRequestBody(request: HttpRequest): any {
    if (!request.body) return null;
    
    if ('type' in request.body && typeof request.body.data === 'string') {
      try {
        return request.body.type === 'json' ? JSON.parse(request.body.data) : request.body.data;
      } catch {
        return request.body.data;
      }
    }
    
    return request.body;
  }

  private executeScript(script: string, context: ScriptContext): void {
    const sanitizedScript = this.sanitizeScript(script);
    
    try {
      const func = new Function(
        'req', 'res', 'bru', 'test', 'expect', 'console', '__variables',
        sanitizedScript
      );
      
      func(
        context.req,
        context.res,
        context.bru,
        context.test,
        context.expect,
        context.console,
        context.__variables
      );
    } catch (error) {
      console.error('Script execution error:', error);
      throw error;
    }
  }

  private sanitizeScript(script: string): string {
    const dangerousPatterns = [
      /import\s+/g,
      /require\s*\(/g,
      /eval\s*\(/g,
      /Function\s*\(/g,
      /setTimeout\s*\(/g,
      /setInterval\s*\(/g,
      /fetch\s*\(/g,
      /XMLHttpRequest/g,
      /document\./g,
      /window\./g,
      /global\./g,
      /process\./g,
      /__proto__/g,
      /constructor/g
    ];

    let sanitized = script;
    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '/* blocked */');
    });

    return sanitized;
  }

  async runPreRequestScript(
    script: string,
    request: HttpRequest,
    variables: Record<string, any>,
    collection: OpenCollectionCollection
  ): Promise<void> {
    const context = this.createSandboxedContext(request, null, variables, collection);
    this.executeScript(script, context);
    Object.assign(variables, context.__variables);
  }

  async runPostResponseScript(
    script: string,
    request: HttpRequest,
    response: RunRequestResponse,
    variables: Record<string, any>,
    collection: OpenCollectionCollection
  ): Promise<void> {
    const context = this.createSandboxedContext(request, response, variables, collection);
    this.executeScript(script, context);
    Object.assign(variables, context.__variables);
  }

  async runTests(
    script: string,
    request: HttpRequest,
    response: RunRequestResponse,
    variables: Record<string, any>,
    collection: OpenCollectionCollection
  ): Promise<any> {
    const context = this.createSandboxedContext(request, response, variables, collection);
    this.executeScript(script, context);
    Object.assign(variables, context.__variables);
    return context.__testResults;
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
  }
} 