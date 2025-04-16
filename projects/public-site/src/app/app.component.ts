import { isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  pageHtml = '';
  constructor(@Inject('PAGE_DATA') private pageData: any, @Inject(PLATFORM_ID) platformId: any) {
    if (isPlatformServer(platformId)) {
      this.pageHtml = this.pageData.content;
    }
  }
}
