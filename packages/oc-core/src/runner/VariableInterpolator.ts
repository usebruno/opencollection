import { HttpRequest } from '../types';

export class VariableInterpolator {
  interpolateRequest(request: HttpRequest, variables: Record<string, any>): HttpRequest {
    const interpolated = JSON.parse(JSON.stringify(request));
    
    if (interpolated.url) {
      interpolated.url = this.interpolateString(interpolated.url, variables);
    }
    
    if (interpolated.headers) {
      interpolated.headers = interpolated.headers.map((header: any) => ({
        ...header,
        name: this.interpolateString(header.name, variables),
        value: this.interpolateString(header.value, variables)
      }));
    }
    
    if (interpolated.params) {
      interpolated.params = interpolated.params.map((param: any) => ({
        ...param,
        name: this.interpolateString(param.name, variables),
        value: this.interpolateString(param.value, variables)
      }));
      
      interpolated.url = this.interpolateUrlParams(interpolated.url, interpolated.params, variables);
    }
    
    if (interpolated.body) {
      interpolated.body = this.interpolateBody(interpolated.body, variables);
    }
    
    if (interpolated.auth) {
      interpolated.auth = this.interpolateAuth(interpolated.auth, variables);
    }
    
    return interpolated;
  }

  private interpolateString(str: string, variables: Record<string, any>): string {
    if (!str) return str;
    
    return str.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const trimmedVarName = varName.trim();
      return variables[trimmedVarName] !== undefined ? String(variables[trimmedVarName]) : match;
    });
  }

  private interpolateUrlParams(url: string, params: any[], variables: Record<string, any>): string {
    if (!params || !url) return url;
    
    let interpolatedUrl = url;
    const urlObj = new URL(interpolatedUrl.startsWith('http') ? interpolatedUrl : `http://${interpolatedUrl}`);
    
    params.forEach(param => {
      if (param.enabled !== false && param.name) {
        const paramName = this.interpolateString(param.name, variables);
        const paramValue = this.interpolateString(param.value || '', variables);
        
        if (param.type === 'path') {
          interpolatedUrl = interpolatedUrl.replace(`:${paramName}`, paramValue);
        } else if (param.type === 'query') {
          urlObj.searchParams.set(paramName, paramValue);
        }
      }
    });
    
    return urlObj.toString();
  }

  private interpolateBody(body: any, variables: Record<string, any>): any {
    if (!body) return body;
    
    if ('type' in body && typeof body.data === 'string') {
      return {
        ...body,
        data: this.interpolateString(body.data, variables)
      };
    } else if (Array.isArray(body)) {
      return body.map(item => ({
        ...item,
        name: this.interpolateString(item.name, variables),
        value: this.interpolateString(item.value || '', variables)
      }));
    }
    
    return body;
  }

  private interpolateAuth(auth: any, variables: Record<string, any>): any {
    if (!auth) return auth;
    
    const interpolated = { ...auth };
    
    Object.keys(interpolated).forEach(key => {
      if (typeof interpolated[key] === 'string') {
        interpolated[key] = this.interpolateString(interpolated[key], variables);
      }
    });
    
    return interpolated;
  }
} 