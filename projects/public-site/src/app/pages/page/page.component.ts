import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  template: `
    <div [innerHTML]="pageData?.content"></div>
  `,
  standalone: true
})
export class PageComponent implements OnInit {
  pageData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log('[PAGE] Route data:', data);
      this.pageData = data['pageData'];
    });
  }
}
