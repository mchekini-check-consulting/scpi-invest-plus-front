import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private returnUrl: string = '/scpi';

  setReturnUrl(url: string) {
    this.returnUrl = url;
  }

  getReturnUrl(): string {
    const url = this.returnUrl;
    this.returnUrl = '/scpi';
    return url;
  }
}
