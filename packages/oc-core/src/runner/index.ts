import { HttpRequest, OpenCollectionCollection, Environment } from '../types';
import { RequestExecutor } from './RequestExecutor';
import { ScriptRunner } from './ScriptRunner';
import { VariableInterpolator } from './VariableInterpolator';

export interface RunRequestOptions {
  item: HttpRequest;
  collection: OpenCollectionCollection;
  environment?: Environment;
  runtimeVariables?: Record<string, any>;
}

export interface RunRequestResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  data?: any;
  size?: number;
  duration?: number;
  url?: string;
  error?: string;
  isCancel?: boolean;
}

export class RequestRunner {
  private executor: RequestExecutor;
  private scriptRunner: ScriptRunner;
  private interpolator: VariableInterpolator;

  constructor(proxyUrl?: string) {
    this.executor = new RequestExecutor(proxyUrl);
    this.scriptRunner = new ScriptRunner();
    this.interpolator = new VariableInterpolator();
  }

  async runRequest(options: RunRequestOptions): Promise<RunRequestResponse> {
    const { item, collection, environment, runtimeVariables = {} } = options;
    
    try {
      const envVars = this.getEnvironmentVariables(environment);
      const globalVars = this.scriptRunner.getGlobalVariables();
      const allVars = { ...envVars, ...globalVars, ...runtimeVariables };
      
      const processedRequest = await this.preprocessRequest(item, collection, allVars);
      
      if (processedRequest.scripts?.preRequest) {
        await this.scriptRunner.runPreRequestScript(
          processedRequest.scripts.preRequest,
          processedRequest,
          allVars,
          collection
        );
      }
      
      const interpolatedRequest = this.interpolator.interpolateRequest(processedRequest, allVars);
      const response = await this.executor.executeRequest(interpolatedRequest);
      
      if (processedRequest.scripts?.postResponse) {
        await this.scriptRunner.runPostResponseScript(
          processedRequest.scripts.postResponse,
          interpolatedRequest,
          response,
          allVars,
          collection
        );
      }
      
      if (processedRequest.scripts?.tests) {
        await this.scriptRunner.runTests(
          processedRequest.scripts.tests,
          interpolatedRequest,
          response,
          allVars,
          collection
        );
      }
      
      return response;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private getEnvironmentVariables(environment?: Environment): Record<string, any> {
    if (!environment?.variables) return {};
    
    return environment.variables.reduce((vars, variable) => {
      if (variable.name && !variable.disabled) {
        vars[variable.name] = variable.value || variable.default || '';
      }
      return vars;
    }, {} as Record<string, any>);
  }

  private async preprocessRequest(
    item: HttpRequest, 
    collection: OpenCollectionCollection, 
    variables: Record<string, any>
  ): Promise<HttpRequest> {
    const processed = { ...item };
    
    return processed;
  }

  getGlobalVariables(): Record<string, any> {
    return this.scriptRunner.getGlobalVariables();
  }

  clearGlobalVariables(): void {
    this.scriptRunner.clearGlobalVariables();
  }
}

export const createRequestRunner = (proxyUrl?: string) => new RequestRunner(proxyUrl);

export const requestRunner = new RequestRunner();

export const getGlobalVariables = () => requestRunner.getGlobalVariables();
export const clearGlobalVariables = () => requestRunner.clearGlobalVariables(); 