import { Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    const observable: Observable<AxiosResponse<T>> = this.httpService.get<T>(url, { params });
    return firstValueFrom(observable);
  }

  async post<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    const observable: Observable<AxiosResponse<T>> = this.httpService.post<T>(url, data);
    return firstValueFrom(observable);
  }

  async put<T>(url: string, data: any): Promise<AxiosResponse<T>> {
    const observable: Observable<AxiosResponse<T>> = this.httpService.put<T>(url, data);
    return firstValueFrom(observable);
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    const observable: Observable<AxiosResponse<T>> = this.httpService.delete<T>(url);
    return firstValueFrom(observable);
  }
}
