// app.component.ts
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({ selector: 'app-root', template: `<main [innerHTML]="pageHtml"></main>` })
export class AppComponent {
  pageHtml = '';
  constructor(@Inject('PAGE_DATA') private pageData: any, @Inject(PLATFORM_ID) platformId: any) {
    if (isPlatformServer(platformId)) {
      this.pageHtml = this.pageData.content;
    }
  }
}
