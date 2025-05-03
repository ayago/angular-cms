import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, makeStateKey, Optional, PLATFORM_ID, TransferState, OnInit } from '@angular/core';

const PAGE_DATA_KEY = makeStateKey<any>('PAGE_DATA');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  pageHtml = '';
  pageData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState,
    @Optional() @Inject('PAGE_DATA') private serverPageData: any
  ) {
    console.log('[APP] Constructor called');
    console.log('[APP] Platform:', isPlatformServer(this.platformId) ? 'SERVER' : 'BROWSER');
    console.log('[APP] Server page data:', serverPageData);
  }

  ngOnInit() {
    console.log('[APP] ngOnInit called');
    this.initializePageData();
  }

  private initializePageData() {
    if (isPlatformServer(this.platformId)) {
      console.log('[APP] Initializing page data on server side');

      if (this.serverPageData) {
        try {
          const data = this.serverPageData;
          // Server-side: Save to TransferState
          this.transferState.set(PAGE_DATA_KEY, data);
          console.log('[APP] Saved to TransferState:', {
            key: PAGE_DATA_KEY.toString(),
            data
          });

          this.pageData = data;
          this.pageHtml = data.content;
        } catch (error) {
          console.error('[APP] Error resolving server page data:', error);
        }
      } else {
        console.warn('[APP] No PAGE_DATA provided on server side');
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      console.log('[APP] Initializing page data on client side');

      // Client-side: Read from TransferState
      const data = this.transferState.get(PAGE_DATA_KEY, null);
      console.log('[APP] Retrieved from TransferState:', {
        key: PAGE_DATA_KEY.toString(),
        data
      });

      if (data) {
        this.pageData = data;
        this.pageHtml = data.content;
        console.log('[APP] Successfully loaded page data:', {
          slug: data.slug,
          hasContent: !!data.content,
          contentLength: data.content?.length
        });
      } else {
        console.warn('[APP] No PAGE_DATA found in TransferState');
        // Log the entire TransferState for debugging
        console.log('[APP] Full TransferState:', this.transferState);
      }
    }
  }
}
