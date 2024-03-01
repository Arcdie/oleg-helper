import { isEmpty } from 'lodash';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export class AxiosLib {
  static makeGetRequest = <T>(url: string, queryParams = {}, settings = {}) =>
    AxiosLib.makeRequest<T>('GET', url, { params: queryParams, ...settings });

  static makePostRequest = <T>(url: string, body = {}, settings = {}) =>
    AxiosLib.makeRequest<T>('POST', url, { data: body, ...settings });

  static makePutRequest = <T>(url: string, body = {}, settings = {}) =>
    AxiosLib.makeRequest<T>('PUT', url, { data: body, ...settings });

  static makeDeleteRequest = <T>(url: string, body = {}, settings = {}) =>
    AxiosLib.makeRequest<T>('DELETE', url, { data: body, ...settings });

  static getShortErrorResponse(error: unknown) {
    if (!axios.isAxiosError(error)) {
      return error;
    }

    const errorResponse: {
      message: string;
      url?: string;
      body?: any;
      headers?: AxiosRequestHeaders;
      response?: {
        code: number;
        text: string;
        data?: any;
      };
    } = {
      message: error.toString(),
    };

    if (error.config) {
      errorResponse.body = error.config.data;
      errorResponse.headers = error.config.headers;
      errorResponse.url = `${error.config.method?.toUpperCase()} ${
        error.config.url
      }`;
    }

    if (error.response) {
      errorResponse.response = {
        code: error.response.status,
        text: error.response.statusText,
        data: error.response.data,
      };
    }

    return errorResponse;
  }

  private static makeRequest = async <T>(
    method: string,
    url: string,
    settings: AxiosRequestConfig = {},
  ) => axios<T>({ method, url, ...settings });
}
