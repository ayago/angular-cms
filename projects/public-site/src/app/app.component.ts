import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const PAGE_DATA_KEY = makeStateKey<any>('PAGE_DATA');

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  pageHtml = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState,
    @Optional() @Inject('PAGE_DATA') private pageData: any // available on the server
  ) {
    if (isPlatformServer(this.platformId)) {
      this.pageHtml = this.pageData.content;
      this.transferState.set(PAGE_DATA_KEY, this.pageData);
    }

    if (isPlatformBrowser(this.platformId)) {
      const data = this.transferState.get(PAGE_DATA_KEY, null as any);
      this.pageHtml = data?.content || '';
    }
  }
}
